const fs = require("fs");
const path = require("path");

const revisionFilePath = path.resolve(
  __dirname,
  "../node_modules/puppeteer-core/lib/esm/puppeteer/revisions.js"
);

const revisonFileContents = fs.readFileSync(revisionFilePath, "utf-8");
const chromiumRevision = revisonFileContents.match(/chromium: '(\d*)'/)[1];

fs.writeFileSync(
  path.resolve(__dirname, "../chromium-revision.js"),
  `module.exports.CHROMIUM_REVISION = "${chromiumRevision}";\n`
);
