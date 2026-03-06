// ==============================
// Global Variables
// ==============================
let menuData = [];
let categoriesData = [];

let currentLanguage = "en";
let currentCategoryIndex = 0;
let currentSubIndex = 0;

// DOM
const slider = document.getElementById("categorySlider");
const subBar = document.getElementById("subCategoryBar");
const container = document.getElementById("menuContainer");
const contentWrapper = document.getElementById("contentWrapper");
const subButtons = document.getElementById("sub");


// DOM caches
const categoryDomCache = {};
const subCategoryDomCache = {};

// ==============================
// Language Buttons
// ==============================
function englishBtnActive() {
  document.getElementById("btn-en").classList.add("active");
  document.getElementById("btn-ar").classList.remove("active");
}

function arabicBtnActive() {
  document.getElementById("btn-ar").classList.add("active");
  document.getElementById("btn-en").classList.remove("active");
}

englishBtnActive();

// ==============================
// Fetch Data
// ==============================
Promise.all([
  fetch("categories.json").then(r => r.json()),
  fetch("menu.json").then(r => r.json())
])
.then(([categories, menu]) => {

  categoriesData = categories.sort((a,b)=>a.order-b.order);
  menuData = menu;

  createCategories();
  renderAllCategories();
  preloadImages();

})
.catch(err => console.error(err));


// ==============================
// Language Switch
// ==============================
document.getElementById("btn-en").onclick = () => {

  if(currentLanguage === "en") return;

  currentLanguage = "en";
  englishBtnActive();

  slider.dir = "ltr";
  subBar.dir = "ltr";
  container.dir = "ltr";
  contentWrapper.dir = "ltr";

  updateLanguage();
}

document.getElementById("btn-ar").onclick = () => {

  if(currentLanguage === "ar") return;

  currentLanguage = "ar";
  arabicBtnActive();

  slider.dir = "rtl";
  subBar.dir = "rtl";
  container.dir = "rtl";
  contentWrapper.dir = "rtl";

  updateLanguage();
}


// ==============================
// Create Top Categories
// ==============================
function createCategories(){

  slider.innerHTML = "";

  categoriesData.forEach((cat,index)=>{

    const btn = document.createElement("button");

    btn.innerText = currentLanguage==="ar"
      ? cat.arabic_category
      : cat.category;

    if(index===currentCategoryIndex)
      btn.classList.add("active");

    btn.onclick = ()=>switchCategory(index);

    slider.appendChild(btn);

  });

  createSubCategories();
}


// ==============================
// Create SubCategories
// ==============================
function createSubCategories(){

  const cat = categoriesData[currentCategoryIndex];

  subBar.innerHTML="";

  cat.sub_categories.forEach((sub,i)=>{

    const btn = document.createElement("button");

    btn.innerText = currentLanguage==="ar"
      ? sub.arabic_name
      : sub.name;

    if(i===currentSubIndex)
      btn.classList.add("active");

    btn.onclick = ()=>switchSubCategory(i);

    subBar.appendChild(btn);

  });

}


// ==============================
// Render All Containers
// ==============================
function renderAllCategories(){

  categoriesData.forEach(cat=>{

    cat.sub_categories.forEach(sub=>{

      const key = cat.category+"_"+sub.name;

      const catContainer = document.createElement("div");

      catContainer.className = "category-content";

      catContainer.dataset.key = key;

      catContainer.style.display="none";
      // catContainer.style.gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))";

      const items = menuData.find(m =>
        m.category === cat.category &&
        m.sub_category === sub.name
      )?.items || [];


      items.forEach(item=>{
        console.log(cat)

        const itemName = currentLanguage==="ar"
          ? item.arabic_name
          : item.name;

        const div = document.createElement("div");

        div.className="menu-item";

        div.innerHTML=`

        <div class="menu-info">

          <img
          src="images/${sub.name}_files/${item.image}.jpg"
          alt="${itemName}"
          decoding="async"
          fetchpriority="low">

          <a class="itemName">${itemName}</a>

          <a class="itemPrice">${item.price}</a>

        </div>

        `;

        catContainer.appendChild(div);

      });

      container.appendChild(catContainer);

      subCategoryDomCache[key]=catContainer;

    });

  });

  showInitial();

}


// ==============================
// Show first category/sub
// ==============================
function showInitial(){

  const cat = categoriesData[currentCategoryIndex];
  const sub = cat.sub_categories[currentSubIndex];

  const key = cat.category+"_"+sub.name;

  subCategoryDomCache[key].style.display="grid";

}


// ==============================
// Switch Category
// ==============================
function switchCategory(index){

  if(index===currentCategoryIndex) return;

  hideCurrent();

  currentCategoryIndex=index;
  currentSubIndex=0;

  document.querySelectorAll(".category-slider button")
  .forEach(b=>b.classList.remove("active"));

  slider.children[index].classList.add("active");

  createSubCategories();

  showCurrent();

}


// ==============================
// Switch SubCategory
// ==============================
function switchSubCategory(index){

  if(index===currentSubIndex) return;

  hideCurrent();

  currentSubIndex=index;

  document.querySelectorAll("#subCategoryBar button")
  .forEach(b=>b.classList.remove("active"));

  subBar.children[index].classList.add("active");

  showCurrent();

}


// ==============================
// Helpers
// ==============================
function hideCurrent(){

  const cat = categoriesData[currentCategoryIndex];
  const sub = cat.sub_categories[currentSubIndex];

  const key = cat.category+"_"+sub.name;

  subCategoryDomCache[key].style.display="none";

}

function showCurrent(){

  const cat = categoriesData[currentCategoryIndex];
  const sub = cat.sub_categories[currentSubIndex];

  const key = cat.category+"_"+sub.name;

  subCategoryDomCache[key].style.display="grid";

}


// ==============================
// Update Language
// ==============================
function updateLanguage(){

  categoriesData.forEach(cat=>{

    cat.sub_categories.forEach(sub=>{

      const key = cat.category+"_"+sub.name;

      const container = subCategoryDomCache[key];

      const items = menuData.find(m =>
        m.category===cat.category &&
        m.sub_category===sub.name
      )?.items || [];

      const children = container.querySelectorAll(".menu-item");

      children.forEach((child,i)=>{

        child.querySelector(".itemName").textContent =
          currentLanguage==="ar"
          ? items[i].arabic_name
          : items[i].name;

        child.querySelector(".itemPrice").textContent =
          items[i].price;

      });

    });

  });

  createCategories();

}


// ==============================
// Preload Images
// ==============================
function preloadImages(){

  menuData.forEach(group=>{

    group.items.forEach(item=>{

      const img = new Image();

      img.src = `images/${group.sub_category}_files/${item.image}.jpg`;

      img.decoding="async";

    });

  });

}