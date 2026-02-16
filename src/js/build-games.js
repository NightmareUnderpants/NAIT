const fs = require("fs");
const path = require("path");
const pug = require("pug");

const ROOT = path.resolve(__dirname, "..", "..");

const dataPath = path.join(ROOT, "src", "pug", "data", "games.js");
const tplPath  = path.join(ROOT, "src", "pug", "pages", "games.pug");
const outPath  = path.join(ROOT, "dist", "games.html");

// подключаем JS-словарь
const games = require(dataPath);

// пока выводим ВСЕ игры на одной странице
const html = pug.renderFile(tplPath, {
  pretty: true,
  games
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, "utf8");

console.log("OK: dist/item.html generated");
