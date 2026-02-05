const XLSX = require("xlsx");
const path = require("path");

// Adjust path as needed
const filePath = path.join(process.cwd(), "../RAB.xlsx");

try {
  console.log("Reading file from:", filePath);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const updateSheet = workbook.Sheets[sheetName];

  // Convert to JSON with array of arrays to inspect structure
  const data = XLSX.utils.sheet_to_json(updateSheet, { header: 1 });

  console.log("Sheet Name:", sheetName);
  console.log("First 10 rows:");
  data.slice(0, 10).forEach((row, i) => {
    console.log(`Row ${i}:`, row);
  });
} catch (err) {
  console.error("Error reading file:", err);
}
