const XLSX = require("xlsx");
const fs = require("fs");

/* -----------------------
   Load Excel Files
----------------------- */

const categoriesWorkbook = XLSX.readFile("categories.xlsx");
const subcategoriesWorkbook = XLSX.readFile("subcategories.xlsx");

const categoriesSheet = categoriesWorkbook.Sheets[categoriesWorkbook.SheetNames[0]];
const subcategoriesSheet = subcategoriesWorkbook.Sheets[subcategoriesWorkbook.SheetNames[0]];

const categoriesRows = XLSX.utils.sheet_to_json(categoriesSheet);
const subcategoriesRows = XLSX.utils.sheet_to_json(subcategoriesSheet);

/* -----------------------
   Build Categories Map
----------------------- */

const categoriesMap = {};

// Create base categories
categoriesRows.forEach(row => {
  const categoryName = row["Category"];

  categoriesMap[categoryName] = {
    order: row["Order"],
    category: categoryName,
    arabic_category: row["Arabic_Category"],
    sub_categories: []
  };
});

// Attach subcategories
subcategoriesRows.forEach(row => {
  const categoryName = row["Category"];

  if (categoriesMap[categoryName]) {
    categoriesMap[categoryName].sub_categories.push({
      name: row["Subcategory"],
      arabic_name: row["Arabic_Subcategory"]
    });
  }
});

/* -----------------------
   Convert to Sorted Array
----------------------- */

const result = Object.values(categoriesMap)
  .sort((a, b) => a.order - b.order)
  .map(({ order, ...rest }) => rest); // remove order field

/* -----------------------
   Save JSON
----------------------- */

fs.writeFileSync(
  "categories.json",
  JSON.stringify(result, null, 2),
  "utf8"
);

console.log("✅ categories.json created successfully");