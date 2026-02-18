const fs = require("fs");
const path = require("path");
const pug = require("pug");

const ROOT = path.resolve(__dirname, "..", "..");

const dataPath = path.join(ROOT, "src", "pug", "data", "table.json");
const tplPath  = path.join(ROOT, "src", "pug", "pages", "tables.pug");

const outPath  = path.join(ROOT, "dist", "tables.html");

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const html = pug.renderFile(tplPath, {
  pretty: true,
  data,
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");

console.log("OK: dist/tables.html generated");
