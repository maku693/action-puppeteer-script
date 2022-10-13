const core = require("@actions/core");
const puppeteer = require("puppeteer");

async function main() {
  const script = core.getInput("script", { required: true });

  const browser = await puppeteer.launch();

  const args = { browser };

  try {
    const result = callAsyncFunction(args, script);
    core.setOutput(JSON.stringify(result));
  } catch (error) {
    core.setFailed(error.message);
  }
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
