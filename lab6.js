"use strict";

// зашифрованное сообщение
const CIPHER = "СТУА_НЬЧТ_ВЕТЬО__ЕГРОСВЛИТЬ_ОРЯТЖИЗНИ_ХОТЬО_ЧТМ_О_ИПЕШЬ_Е_ПРОЕНЯ";

const KEYS = [
  // KEY 1
  [
    [2, 1], [2, 5], [2, 7],
    [4, 4], [4, 5], [4, 6], [4, 7],
    [5, 4],
    [6, 4], [6, 5], [6, 6],
    [7, 1], [7, 2], [7, 4], [7, 6], [7, 7],
  ],

  // KEY 2
  [
    [0, 0], [0, 4], [0, 5],
    [1, 0], [1, 5],
    [2, 4], [2, 7],
    [3, 1], [3, 4],
    [4, 0], [4, 2],
    [5, 1], [5, 5],
    [6, 1], [6, 4],
    [7, 6],
  ],

  // KEY 3
  [
    [0, 4],
    [1, 1], [1, 7],
    [2, 7],
    [3, 1], [3, 2], [3, 3], [3, 5],
    [4, 0],
    [5, 2], [5, 7],
    [6, 2], [6, 4], [6, 5], [6, 7],
    [7, 7],
  ],

  // KEY 4
  [
    [0, 1], [0, 3], [0, 5], [0, 6],
    [1, 5], [1, 6],
    [2, 2],
    [3, 2],
    [4, 1], [4, 2], [4, 4], [4, 7],
    [6, 3], [6, 5],
    [7, 5], [7, 7],
  ],

  // KEY 5
  [
    [0, 2], [0, 3], [0, 4],
    [1, 1],
    [2, 6],
    [3, 4], [3, 5],
    [4, 1], [4, 5],
    [5, 5],
    [6, 0], [6, 2], [6, 3], [6, 7],
    [7, 0], [7, 2],
  ],

  // KEY 6
  [
    [0, 1], [0, 2], [0, 5],
    [1, 0], [1, 1], [1, 2],
    [2, 2],
    [3, 4], [3, 7],
    [4, 1], [4, 5], [4, 7],
    [5, 4], [5, 6],
    [6, 3],
    [7, 7],
  ],
];


////// перевод в систему блоков 8х8

function padTo64(block) {
    if (block.length > 64)
        return block.slice(0, 64);

    if (block.length < 64)
        return block + "_".repeat(64 - block.length);

    return block;
}

function chunk64(str) {
    const blocks = [];

    for (let i = 0; i < str.length; i += 64)
        blocks.push(padTo64(str.slice(i, i + 64)));

    if (blocks.length === 0)
        blocks.push("_".repeat(64));

    return blocks;
}


////// поворот элементов

function rotCW([r, c]) {
    return [c, 7 - r];
}

function rotateCoords(coords, timesCW) {
    // копируем элементы
    let out = coords.map(([r, c]) => [r, c]);

    // поворачиваем каждый элемент 
    for (let t = 0; t < timesCW; t++) out = out.map(rotCW);

    return out;
}


// перевод координат в индексы
function idxFromRC(r, c) {
    return r * 8 + c;
}

// поворот и расшифровка блока
function decryptBlock(cipher64, keyCoords) {
    const out = [];

    for (let k = 0; k < 4; k++) {
        const holes = rotateCoords(keyCoords, k);

        holes
        .slice()                                         // копируем массив
        .sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]))  // сортируем строки и столбы
        .forEach(([r, c]) => {
            out.push(cipher64[idxFromRC(r, c)]);
        });
    }

    return out.join("");
}

function decrypt(cipher) {
    // разбиваем зашифрованное сообщение на блоки по 64 символа
    const blocks = chunk64(cipher);
    const variants = [];

    // подбираем ключ к сообщению
    for (let i = 0; i < KEYS.length; i++) {
        const keyCoords = KEYS[i];
        const text = blocks.map((b) => decryptBlock(b, keyCoords)).join("");
        variants.push(text);
    }

    return variants;
}

// --- run
const variants = decrypt(CIPHER);

for (const v of variants) {
    console.log(v);
}
