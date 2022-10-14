import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const revisionFilePath = path.resolve(
  __dirname,
  "../node_modules/puppeteer-core/lib/esm/puppeteer/revisions.js"
);

const revisonFileContents = fs.readFileSync(revisionFilePath, "utf-8");
const chromiumRevision = revisonFileContents.match(/chromium: '(\d*)'/)[1];

fs.writeFileSync(
  path.resolve(__dirname, "../src/chromium-revision.js"),
  `module.exports.CHROMIUM_REVISION = "${chromiumRevision}";\n`
);
