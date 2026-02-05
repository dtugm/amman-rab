const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const INPUT_PATH = path.join(process.cwd(), "RAB new.csv");
const OUTPUT_PATH = path.join(process.cwd(), "src/data/rab.json");

function parseRAB() {
  console.log("Reading RAB from:", INPUT_PATH);
  const workbook = XLSX.readFile(INPUT_PATH);

  // Log all sheets
  console.log("Sheets found:", workbook.SheetNames);

  // We assume the data is in the first sheet for now, or the one named 'edit style' if specific
  // The user mentioned "all data", let's make sure we aren't missing other sheets if they are relevant.
  // Converting ALL sheets into one big list might be wrong if they are just lookup tables.
  // For RABS, usually it's one main sheet. Let's stick to index 0 but handle totals.
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  console.log(`Total raw rows: ${rawData.length}`);

  const rootItems = [];
  const stack = [];

  // Skip header (Row 0)
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    // Don't skip empty rows aggressively? valid items might have empty cols.
    // But usually totally empty row is useless.
    if (!row || row.length === 0) continue;

    let col0 = (row[1] || "").toString().trim();
    let col1 = (row[2] || "").toString().trim();

    // Values
    // 3: Qty, 4: Hours, 5: Days, 6: Months
    // 7: Volume, 8: Unit, 9: Price, 10: Total
    const qty = row[3];
    const hours = row[4];
    const days = row[5];
    const months = row[6];
    const vol = row[7];
    const unit = row[8];

    // Helper to parse "Rp1,700,000" -> 1700000
    const parseCurrency = (val) => {
      if (typeof val === "number") return val;
      if (!val) return 0;
      return parseInt(val.toString().replace(/[^0-9-]/g, ""), 10) || 0;
    };

    const price = parseCurrency(row[9]);
    const total = parseCurrency(row[10]);

    let numbering = "";
    let description = "";
    let level = -1;

    // Detection Logic
    if (col0) {
      if (/^[A-Z]\)/.test(col0)) {
        // A)
        level = 0;
        numbering = col0.split(")")[0] + ")";
        description = col0.substring(numbering.length).trim() || col1;
      } else if (/^[IVX]+\./.test(col0)) {
        // I.
        level = 1;
        numbering = col0;
        description = col1 || col0.replace(/^[IVX]+\./, "").trim();
      } else if (/^[A-Z][\.\)]?$/.test(col0) || /^[A-Z][\.\)]\s/.test(col0)) {
        // A. or A or A)
        level = 2;
        numbering = col0;
        description = col1;
      } else if (/^\d+$/.test(col0) || /^\d+\./.test(col0)) {
        // 1 or 1.
        level = 3;
        numbering = col0;
        description = col1;
      }
    } else {
      // Col0 empty, check Col1
      if (/^[a-z]\./.test(col1)) {
        // a.
        level = 4;
        numbering = col1.split(/\s+/)[0];
        description = col1.substring(numbering.length).trim();
      }
    }

    if (level === -1 && description === "") {
      // Fallback logic
      if (col1) {
        // EXCLUDE SUMMARY ROWS explicitly
        if (/^Total/i.test(col1)) {
          continue;
        }

        if (price || total) {
          level = 4; // Treat as leaf
          description = col1;
        } else if (description === "" && numbering === "") {
          continue;
        }
      } else {
        continue;
      }
    }

    // Double check description for Total
    if (/^Total\s/i.test(description) || /^Total$/i.test(description)) {
      continue;
    }

    const item = {
      id: `row-${i}`,
      numbering,
      description: description || "No Description",
      qty: qty,
      hours: hours,
      days: days,
      months: months,
      volume: vol,
      unit: unit,
      unitPrice: price,
      totalPrice: total || 0, // Ensure numeric for calculation
      children: [],
    };

    if (level === 0) {
      rootItems.push(item);
      stack[0] = item;
      stack.length = 1;
    } else {
      // Robust parent finding: look up the stack
      // If stack[level-1] doesn't exist, try stack[level-2] etc.
      // But for strict hierarchy, it should exist.
      let parent = null;
      for (let l = level - 1; l >= 0; l--) {
        if (stack[l]) {
          parent = stack[l];
          break;
        }
      }

      if (parent) {
        parent.children.push(item);
        stack[level] = item;
        stack.length = level + 1;
      } else {
        // No parent found, treat as root?
        rootItems.push(item);
        stack[level] = item;
      }
    }
  }

  // Recursive Total Calculation
  function calculateTotals(node) {
    if (node.children && node.children.length > 0) {
      let sum = 0;
      node.children.forEach((child) => {
        sum += calculateTotals(child);
      });
      // If node has its own price (unlikely for group, but possible), add it?
      // Usually group price IS sum of children.
      // Only override if node doesn't have explicit total from Excel?
      // Excel might have calculated it. BUT user says "make sure it is collapsable... add total for each phase".
      // If Excel had it, it would show. It likely didn't have it in the cells we read.
      // So we overwrite.
      node.totalPrice = sum;
      return sum;
    } else {
      return typeof node.totalPrice === "number" ? node.totalPrice : 0;
    }
  }

  rootItems.forEach((root) => calculateTotals(root));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(rootItems, null, 2));
  console.log(
    `Converted ${rootItems.length} root items. Saved to ${OUTPUT_PATH}`,
  );
}

parseRAB();
