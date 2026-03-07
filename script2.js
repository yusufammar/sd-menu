// const params = new URLSearchParams(window.location.search);
// let foodname = params.get("foodname");
// let image = params.get("imgage");
// let subcategory = params.get("subcategory");

let item = JSON.parse(localStorage.getItem("foodData"));
let subcategory = localStorage.getItem("foodSubcategory");


// console.log(foodname); // John
console.log(subcategory);  // 25
console.log(item)


// ==============================
// Language Buttons
// ==============================
let currentLanguage = "en";


function englishBtnActive() {
    document.getElementById("btn-en").classList.add("active");
    document.getElementById("btn-ar").classList.remove("active");


    // document.getElementById("ar").style.display = "none"
    // document.getElementById("en").style.display = "block"

}

function arabicBtnActive() {
    document.getElementById("btn-ar").classList.add("active");
    document.getElementById("btn-en").classList.remove("active");


    // document.getElementById("en").style.display = "none"
    // document.getElementById("ar").style.display = "block"
}

// ==============================
// Language Switch
// ==============================
let mainContent = document.getElementById("mainContent");


document.getElementById("btn-en").onclick = () => {

    if (currentLanguage === "en") return;

    currentLanguage = "en";
    englishBtnActive();

    mainContent.dir = "ltr";
    //   slider.dir = "ltr";
    //   subBar.dir = "ltr";
    //   container.dir = "ltr";
    //   contentWrapper.dir = "ltr";

    updateLanguage();
}

document.getElementById("btn-ar").onclick = () => {

    if (currentLanguage === "ar") return;

    currentLanguage = "ar";
    arabicBtnActive();


    mainContent.dir = "rtl";
    //   slider.dir = "rtl";
    //   subBar.dir = "rtl";
    //   container.dir = "rtl";
    //   contentWrapper.dir = "rtl";

    updateLanguage();
}

//----------------------------------------------------------------------


const div = document.createElement("div");
div.className = "card-box"
div.innerHTML = `
             <div class="menu-info" >
              <img

                src="images/${subcategory}_files/${item.image}.jpg"
                alt="${item.name}"
                decoding="async"
                fetchpriority="low">

             <a class="itemName">${item.name}</a>

                
               <div class="info-box">
                    
                    <a class="itemPrice">${item.price} </a>
                    <a class="itemKcal">${item.kcal} kcal</a>
            
             </div>
                
              </div>
              
          `;

mainContent.appendChild(div);


const div2 = document.createElement("div2");
div2.className = "card-box"
div2.innerHTML = `
             <div class="menu-info" >
                  <a class="itemDescription">${item.description}</a>                     
             </div>
                
              </div>
              
          `;

mainContent.appendChild(div2);


//----------------------
englishBtnActive();


function updateLanguage() {
    if (currentLanguage === "ar") {
        document.querySelector(".itemName").textContent = item.arabic_name;
        document.querySelector(".itemDescription").textContent = item.arabic_description;
       
    } else {
     document.querySelector(".itemName").textContent = item.name;
        document.querySelector(".itemDescription").textContent = item.description;
    }
}