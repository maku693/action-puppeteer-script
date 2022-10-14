const fs = require("fs/promises");
const path = require("path");
const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const puppeteer = require("puppeteer-core");
const { CHROMIUM_REVISION } = require("./chromium-revision");

async function main() {
  const script = core.getInput("script", { required: true });

  const chromiumPath = await findOrDownloadChromium();

  core.info("Launching browser");
  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
  });

  try {
    core.info("Script running");
    const result = JSON.stringify(await callAsyncFunction({ browser }, script));
    core.debug(`result: ${result}`);
    core.setOutput("result", result);
    core.info("Script finished!");
  } catch (error) {
    core.error("Error during running script");
    core.setFailed(error.message);
  }

  await browser.close();
  core.info("Browser closed");
}

async function findOrDownloadChromium() {
  core.info(`Target Chromium revision: ${CHROMIUM_REVISION}`);

  // Download and create cache if cache is not found
  const cacheVersion = `0.0.${CHROMIUM_REVISION}`;
  let cachedPath = tc.find("chromium", cacheVersion);
  if (cachedPath) {
    core.info("Using cached Chromium");
  } else {
    core.info(`Chromium cache not found; Downloading`);
    const downloadPath = path.resolve(__dirname, "tmp");
    const browserFetcher = new puppeteer.BrowserFetcher({
      path: downloadPath,
    });
    const revisionInfo = await browserFetcher.download(
      CHROMIUM_REVISION,
      (x, y) => {
        core.debug(`Download progress: ${x}/${y}`);
      }
    );
    core.info("Download finished!");

    core.debug("Revision info: ", revisionInfo);

    // Create symlink to launch the executable easily
    await fs.symlink(
      revisionInfo.executablePath,
      path.join(revisionInfo.folderPath, "chromium")
    );

    cachedPath = await tc.cacheDir(
      revisionInfo.folderPath,
      "chromium",
      cacheVersion
    );
  }

  core.debug(`Cached path: ${cachedPath}`);

  return path.join(cachedPath, "chromium");
}

const AsyncFunction = (async () => {}).constructor;

async function callAsyncFunction(args, source) {
  const fn = new AsyncFunction(...Object.keys(args), source);
  return fn(...Object.values(args));
}

function handleError(error) {
  console.error(error);
  core.setFailed(error);
}

main().catch(handleError);
process.on("unhandledRejection", handleError);
