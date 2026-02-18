const fs = require("fs");
const path = require("path");
const pug = require("pug");

const ROOT = path.resolve(__dirname, ".."); // если build лежит в src/js, ROOT = src
const tplPath = path.join(ROOT, "pug", "pages", "calculator.pug");
const outPath = path.join(path.resolve(ROOT, ".."), "dist", "calculator.html"); // dist рядом с src

const html = pug.renderFile(tplPath, {
  pretty: true,
  title: "Калькулятор ромба",
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");

console.log("OK: dist/calculator.html generated");
