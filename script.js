let categoriesData = [];
let menuData = [];
let currentLanguage = "en";
let currentMainIndex = 0;
let currentSubIndex = 0;

const slider = document.getElementById("categorySlider");
const contentWrapper = document.getElementById("contentWrapper");
const subCategoryBar = document.getElementById("subCategoryBar");
const subButtons = document.getElementById("sub");
const container = document.getElementById("menuContainer");

const btnEn = document.getElementById("btn-en");
const btnAr = document.getElementById("btn-ar");

/* ================= Fetch Data ================= */
Promise.all([
  fetch('categories.json').then(res => res.json()),
  fetch('menu.json').then(res => res.json())
]).then(([categories, menu]) => {
  categoriesData = categories;
  menuData = menu;

  createMainCategories();
  createSubCategories();
  renderItems();
});

/* ================= Language Switch ================= */
btnEn.onclick = () => {
  if (currentLanguage === "en") return;
  currentLanguage = "en";

  slider.dir = "ltr";
  container.dir = "ltr";
  contentWrapper.dir = "ltr";
  
  btnEn.classList.add("active");
  btnAr.classList.remove("active");
  refreshUI();
};

btnAr.onclick = () => {
  if (currentLanguage === "ar") return;
  currentLanguage = "ar";

  slider.dir = "rtl";
  container.dir = "rtl";
  contentWrapper.dir = "rtl";

  // subCategoryBar.dir='rtl';
  // document.getElementsByClassName("sub").dir="rtl"
  btnAr.classList.add("active");
  btnEn.classList.remove("active");
  refreshUI();
};

function refreshUI() {
  createMainCategories();
  createSubCategories();
  renderItems();
}

/* ================= Main Categories ================= */
function createMainCategories() {
  slider.innerHTML = "";

  categoriesData.forEach((cat, index) => {
    const btn = document.createElement("button");
    btn.textContent = currentLanguage === "ar"
      ? cat.arabic_main_category
      : cat.main_category;

    if (index === currentMainIndex) btn.classList.add("active");

    btn.onclick = () => switchMainCategory(index);

    slider.appendChild(btn);
  });
}

function switchMainCategory(index) {
  if (index === currentMainIndex) return;
  currentMainIndex = index;
  currentSubIndex = 0;
  createMainCategories();
  createSubCategories();
  renderItems();
}

/* ================= Sub Categories ================= */
function createSubCategories() {
  subCategoryBar.innerHTML = "";

  const mainCat = categoriesData[currentMainIndex];

  mainCat.sub_categories.forEach((sub, index) => {
    const btn = document.createElement("button");
    btn.id = "sub"

    btn.textContent = currentLanguage === "ar"
      ? sub.arabic_name
      : sub.name;

    if (index === currentSubIndex) btn.classList.add("active");

    btn.onclick = () => switchSubCategory(index);

    subCategoryBar.appendChild(btn);
  });
}

function switchSubCategory(index) {
  if (index === currentSubIndex) return;
  currentSubIndex = index;
  createSubCategories();
  renderItems();
}

/* ================= Render Items ================= */
function renderItems() {
  container.innerHTML = "";

  const mainCat = categoriesData[currentMainIndex].main_category;
  const subCat = categoriesData[currentMainIndex]
    .sub_categories[currentSubIndex].name;

  const categoryData = menuData.find(m =>
    m.main_category === mainCat &&
    m.sub_category === subCat
  );

  const items = categoryData?.items || [];

  items.forEach(item => {
    const name = currentLanguage === "ar"
      ? item.arabic_name
      : item.name;

    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <div class="menu-info">
        <img src="images/${mainCat}/${subCat}/${item.image}.jpg" loading="lazy">
        <div class="itemName">${name}</div>
        <div class="itemPrice">${item.price}</div>
      </div>
    `;

    container.appendChild(div);
  });
}