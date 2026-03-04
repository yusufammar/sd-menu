// ==============================
// Global Variables
// ==============================
let menuData = [];        // Holds items from menu.json
let categoriesData = [];  // Holds categories from categories.json
let currentLanguage = "en";
let currentCategoryIndex = 0;

// Cache DOM elements
const slider = document.getElementById("categorySlider");
const container = document.getElementById("menuContainer");
const categoryDomCache = {}; // store containers per category

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
// Fetch Data
// ==============================
Promise.all([
  fetch('categories.json').then(res => res.json()),
  fetch('menu.json').then(res => res.json())
])
.then(([categories, menu]) => {
  categoriesData = categories.sort((a,b)=> a.order - b.order);
  menuData = menu;
  createCategories();
  renderAllCategories();
  preloadImages();
})
.catch(err => console.error("Error loading JSON files:", err));

// ==============================
// Language Switch
// ==============================
document.getElementById("btn-en").addEventListener("click", () => {
  if(currentLanguage === "en") return;
  currentLanguage = "en";
  englishBtnActive();
  slider.dir = "ltr";
  container.dir = "ltr";
  updateLanguage();
});

document.getElementById("btn-ar").addEventListener("click", () => {
  if(currentLanguage === "ar") return;
  currentLanguage = "ar";
  arabicBtnActive();
  slider.dir = "rtl";
  container.dir = "rtl";
  updateLanguage();
});

// ==============================
// Category Buttons
// ==============================
function createCategories() {
  slider.innerHTML = "";

  categoriesData.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.innerText = currentLanguage === "ar" ? cat.arabic_category : cat.category;

    if(index === currentCategoryIndex) btn.classList.add("active");

    btn.onclick = () => switchCategory(index);

    slider.appendChild(btn);
  });
}

// ==============================
// Render Category Containers
// ==============================
function renderAllCategories() {
  categoriesData.forEach((cat, index) => {
    const catContainer = document.createElement("div");
    catContainer.className = "category-content";
    catContainer.dataset.category = cat.category;
    catContainer.style.display = index === currentCategoryIndex ? "block" : "none";

    const items = menuData.find(m => m.category === cat.category)?.items || [];
    items.forEach(item => {
      const itemName = currentLanguage === "ar" ? item.arabic_name : item.name;
      const div = document.createElement("div");
      div.className = "menu-item";

      div.innerHTML = `
        <div class="menu-info">
          <img src="images/${cat.category}_files/${item.image}.jpg"
               alt="${itemName}" 
               decoding="async" fetchpriority="low">
          <a class="itemName">${itemName}</a>
          <a class="itemPrice">${item.price}</a>
        </div>
      `;

      catContainer.appendChild(div);
    });

    container.appendChild(catContainer);
    categoryDomCache[cat.category] = catContainer;
  });
}

// ==============================
// Switch Category
// ==============================
function switchCategory(index) {
  if(index === currentCategoryIndex) return;

  const prevCat = categoriesData[currentCategoryIndex].category;
  const nextCat = categoriesData[index].category;

  categoryDomCache[prevCat].style.display = "none";
  categoryDomCache[nextCat].style.display = "block";

  document.querySelectorAll(".category-slider button").forEach(b => b.classList.remove("active"));
  slider.children[index].classList.add("active");

  currentCategoryIndex = index;
}

// ==============================
// Update Language in All Containers
// ==============================
function updateLanguage() {
  categoriesData.forEach(cat => {
    const catContainer = categoryDomCache[cat.category];
    const items = menuData.find(m => m.category === cat.category)?.items || [];
    const children = catContainer.querySelectorAll(".menu-item");

    children.forEach((child, i) => {
      const itemName = currentLanguage === "ar" ? items[i].arabic_name : items[i].name;
      const price = items[i].price;
      child.querySelector(".itemName").textContent = itemName;
      child.querySelector(".itemPrice").textContent = price;
    });
  });

  // update category buttons
  createCategories();
}

// ==============================
// Preload Images
// ==============================
function preloadImages() {
  categoriesData.forEach(cat => {
    const items = menuData.find(m => m.category === cat.category)?.items || [];
    items.forEach(item => {
      const img = new Image();
      img.src = `images/${cat.category}_files/${item.image}.jpg`;
      img.decoding = "async";
    });
  });
}