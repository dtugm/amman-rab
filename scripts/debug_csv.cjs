const XLSX = require("xlsx");
const path = require("path");

const INPUT_PATH = path.join(process.cwd(), "RAB new.csv");
console.log("Reading:", INPUT_PATH);

const workbook = XLSX.readFile(INPUT_PATH);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log("Looping first 20 rows:");
for (let i = 0; i < 20; i++) {
  console.log(`Row ${i}:`, JSON.stringify(rawData[i]));
}
