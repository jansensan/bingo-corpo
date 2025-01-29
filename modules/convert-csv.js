const fs = require('fs');

const UTF8 = 'utf-8';
const NL = '\n'; // new line
const CR = '\r'; // carriage return

const CSV_PATH = 'data/data.csv';
const FR_COL = 0;
const EN_COL = 1;
const DESIGN_COL = 2;
const MARKETING_COL = 3;
const TECH_COL = 4;
const CORPO_COL = 5;


// auto init
readCSV();


// methods definitions
function readCSV() {
  fs.readFile(
    CSV_PATH,
    UTF8,
    (error, data) => {
      if (error) {
        console.log(`Error loading "${ CSV_PATH }": ${ error }`);
      } else {
        parseCSV(data);
      };
    }
  );
}

function parseCSV(data) {
  const fr = {
    corpo: [],
    marketing: [],
    design: [],
    tech: [],
  };
  const en = {
    corpo: [],
    marketing: [],
    design: [],
    tech: [],
  };

  const lines = data.split(NL);
  let index = 0;
  lines.forEach(l => {
    const line = l.replace(CR, '');
    const array = line.split(',');

    if (index > 0) {
      // design
      if (isTrue(array[DESIGN_COL])) {
        fr.design.push(array[FR_COL]);
        en.design.push(array[EN_COL]);
      }

      // marketing
      if (isTrue(array[MARKETING_COL])) {
        fr.marketing.push(array[FR_COL]);
        en.marketing.push(array[EN_COL]);
      }

      // tech
      if (isTrue(array[TECH_COL])) {
        fr.tech.push(array[FR_COL]);
        en.tech.push(array[EN_COL]);
      }

      // corpo
      if (isTrue(array[CORPO_COL])) {
        fr.corpo.push(array[FR_COL]);
        en.corpo.push(array[EN_COL]);
      }
    }

    index++;
  });

  const parsed = { fr, en };

  writeDataFile(parsed);
}

function writeDataFile(data) {
  const jsonData = JSON.stringify(data, null, 2);

  const jsDataPath = 'public/scripts/bingo-data.js';
  const jsData = `const BINGO_DATA = ${ jsonData };`;

  fs.writeFile(
    jsDataPath,
    jsData,
    UTF8,
    (error) => {
      if (error) {
        console.log(`Error saving "${ jsDataPath }": ${ error }`);
      } else {
        console.log('data saved');
      };
    }
  );
}

function isTrue(value) {
  if (!value) {
    return false;
  }

  const typeValue = typeof value;
  if (typeValue === 'string' || typeValue === 'boolean') {
    return value.toLowerCase() === 'true';
  } else {
    return false;
  }
}
