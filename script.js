// ==============================
// Global Variables
// ==============================
let menuData = [];        // Holds items from output.json
let categoriesData = [];  // Holds category info from categories.json
let currentLanguage = "en";
let currentCategoryIndex = 0;

// Cache DOM elements
const slider = document.getElementById("categorySlider");
const container = document.getElementById("menuContainer");

// ==============================
// Language Button Helpers
// ==============================
function englishBtnActive() {
  document.getElementById("btn-en").classList.add("active");
  document.getElementById("btn-ar").classList.remove("active");
}

function arabicBtnActive() {
  document.getElementById("btn-ar").classList.add("active");
  document.getElementById("btn-en").classList.remove("active");
}

// Initialize language
englishBtnActive();

// ==============================
// Fetch Categories and Menu Items
// ==============================
Promise.all([
  fetch('categories.json').then(res => res.json()),
  fetch('menu.json').then(res => res.json())
])
.then(([categories, menu]) => {
  categoriesData = categories.sort((a,b)=> a.order - b.order); // ensure correct order
  menuData = menu;
  createCategories();
  renderItems(currentCategoryIndex);
})
.catch(err => console.error("Error loading JSON files:", err));

// ==============================
// Language Switch Buttons
// ==============================
document.getElementById("btn-en").addEventListener("click", () => {
  if (currentLanguage === "en") return;

  currentLanguage = "en";
  englishBtnActive();
  slider.dir = "ltr";
  container.dir = "ltr";

  createCategories();
  renderItems(currentCategoryIndex);
});

document.getElementById("btn-ar").addEventListener("click", () => {
  if (currentLanguage === "ar") return;

  currentLanguage = "ar";
  arabicBtnActive();
  slider.dir = "rtl";
  container.dir = "rtl";

  createCategories();
  renderItems(currentCategoryIndex);
});

// ==============================
// Create Category Buttons
// ==============================
function createCategories() {
  slider.innerHTML = "";

  categoriesData.forEach((cat, index) => {
    const btn = document.createElement("button");

    // Display English or Arabic name based on language
    btn.innerText = currentLanguage === "ar" ? cat.arabic_category : cat.category;

    // Highlight active category
    if (index === currentCategoryIndex) btn.classList.add("active");

    btn.onclick = () => {
      currentCategoryIndex = index;

      // Remove active class from all buttons
      document.querySelectorAll(".category-slider button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      renderItems(index);
    };

    slider.appendChild(btn);
  });
}

// ==============================
// Render Items for Selected Category
// ==============================
function renderItems(index) {
  container.innerHTML = "";

  const cat = categoriesData[index]; // category info
  const categoryItems = menuData.find(c => c.category === cat.category)?.items || [];

  categoryItems.forEach(item => {
    const itemName = currentLanguage === "ar" ? item.arabic_name : item.name;
    const itemDesc = currentLanguage === "ar" ? item.arabic_description : item.description;

    const div = document.createElement("div");
    div.className = "menu-item";


       div.innerHTML = `
      <img src="images/${cat.category}_files/${item.image}.jpg" loading="lazy">
      <div class="menu-info">
        <a class="itemName">${itemName}</a> 
        <a class="itemPrice">${item.price}</a>
      </div>
    `;

    // div.innerHTML = `
    //   <img src="images/${cat.category}_files/${item.image}.jpg" loading="lazy">
    //   <div class="menu-info">
    //     <h3>${itemName}</h3>
    //     <p>${itemDesc}</p>
    //     <span class="itemPrice">${item.price}</span>
    //   </div>
    // `;

    container.appendChild(div);
  });
}