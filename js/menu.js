
// ================= MENYU ELEMENTLARI =================
const menuGrid=document.querySelector(".menu-grid");
const menuFilters=document.querySelectorAll(".menu-filter");

const categoryNames={
    burger:"BURGERLAR",
    pizza:"PITSALAR",
    salad:"SALATLAR",
    drink:"ICHIMLIKLAR"
};

// ================= ADMIN TAOMLARINI OLISH =================
function getAdminMenu(){
    try{
        const data=JSON.parse(localStorage.getItem("safiCafeAdminMenu"))||[];
        return Array.isArray(data)?data:[];
    }catch(error){
        return [];
    }
}

// ================= YANGI TAOM KARTOCHKALARI =================
function renderAdminMenu(){
    if(!menuGrid) return;

    // Oldingi admin kartochkalarini olib tashlash
    menuGrid.querySelectorAll(".admin-added-card").forEach(card=>{
        card.remove();
    });

    const products=getAdminMenu();

    products.forEach(item=>{
        const card=document.createElement("article");
        card.className="menu-card admin-added-card";
        card.dataset.category=item.category;

        // Rasm
        const imageBox=document.createElement("div");
        imageBox.className="menu-card-image";

        if(item.image){
            const image=document.createElement("img");
            image.src=item.image;
            image.alt=item.name;
            image.loading="lazy";
            imageBox.appendChild(image);
        }else{
            imageBox.textContent="SAFI CAFÉ";
        }

        // Karta ma'lumotlari
        const info=document.createElement("div");
        info.className="menu-card-info";

        const category=document.createElement("span");
        category.className="food-category";
        category.textContent=categoryNames[item.category]||item.category;

        const title=document.createElement("h3");
        title.textContent=item.name;

        const description=document.createElement("p");
        description.textContent="Safi Café menyusidagi yangi taom.";

        // Narx va buyurtma
        const bottom=document.createElement("div");
        bottom.className="menu-card-bottom";

        const price=document.createElement("strong");
        price.textContent=Number(item.price).toLocaleString("uz-UZ")+" ";

        const currency=document.createElement("small");
        currency.textContent="so'm";
        price.appendChild(currency);

        const orderLink=document.createElement("a");
        orderLink.href="booking.html";
        orderLink.setAttribute("aria-label","Buyurtma berish");
        orderLink.textContent="+";

        bottom.append(price,orderLink);
        info.append(category,title,description,bottom);
        card.append(imageBox,info);

        menuGrid.appendChild(card);
    });

    applyMenuFilter();
}

// ================= KATEGORIYA FILTRLARI =================
function applyMenuFilter(){
    const activeFilter=document.querySelector(".menu-filter.active");
    const filter=activeFilter?activeFilter.dataset.filter:"all";

    document.querySelectorAll(".menu-card").forEach(card=>{
        const category=card.dataset.category;

        if(filter==="all"||category===filter){
            card.classList.remove("hidden");
        }else{
            card.classList.add("hidden");
        }
    });
}

menuFilters.forEach(button=>{
    button.addEventListener("click",()=>{
        menuFilters.forEach(item=>item.classList.remove("active"));
        button.classList.add("active");
        applyMenuFilter();
    });
});

// ================= SAYTGA YUKLASH =================
renderAdminMenu();

// Admin panel boshqa oynada taom qo'shsa,
// menyu avtomatik yangilanadi.
window.addEventListener("storage",event=>{
    if(event.key==="safiCafeAdminMenu"){
        renderAdminMenu();
    }
});
