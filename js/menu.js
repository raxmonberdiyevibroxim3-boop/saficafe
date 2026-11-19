
// ================= MENYU ELEMENTLARI =================
const menuGrid=document.querySelector(".menu-grid");
const menuFilters=document.querySelectorAll(".menu-filter");

const categoryNames={
    burger:"BURGERLAR",
    pizza:"PITSALAR",
    salad:"SALATLAR",
    drink:"ICHIMLIKLAR"
};

// ================= KARTOCHKALARNI CHIQARISH =================
function renderMenu(){
    if(!menuGrid) return;

    const products=window.SAFI_MENU.getAll();

    // Eski statik kartochkalarni tozalash
    menuGrid.replaceChildren();

    products.forEach(item=>{
        const card=document.createElement("article");
        card.className="menu-card";
        card.dataset.category=item.category;

        // Rasm qismi
        const imageBox=document.createElement("div");
        imageBox.className="menu-card-image";

        const image=document.createElement("img");
        image.src=item.image;
        image.alt=item.name;
        image.loading="lazy";

        imageBox.appendChild(image);

        if(item.badge){
            const badge=document.createElement("span");
            badge.className="menu-badge";
            badge.textContent=item.badge;
            imageBox.appendChild(badge);
        }

        // Taom ma'lumotlari
        const info=document.createElement("div");
        info.className="menu-card-info";

        const category=document.createElement("span");
        category.className="food-category";
        category.textContent=categoryNames[item.category]||item.category;

        const title=document.createElement("h3");
        title.textContent=item.name;

        const description=document.createElement("p");
        description.textContent=item.description||"Safi Café menyusidagi mazali taom.";

        // Narx
        const bottom=document.createElement("div");
        bottom.className="menu-card-bottom";

        const price=document.createElement("strong");
        price.append(document.createTextNode(
            Number(item.price).toLocaleString("uz-UZ")+" "
        ));

        const currency=document.createElement("small");
        currency.textContent="so‘m";
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

// ================= FILTRLASH =================
function applyMenuFilter(){
    const activeFilter=document.querySelector(".menu-filter.active");
    const filter=activeFilter?activeFilter.dataset.filter:"all";

    document.querySelectorAll(".menu-card").forEach(card=>{
        const category=card.dataset.category;

        card.classList.toggle(
            "hidden",
            filter!=="all"&&category!==filter
        );
    });
}

menuFilters.forEach(button=>{
    button.addEventListener("click",()=>{
        menuFilters.forEach(item=>item.classList.remove("active"));
        button.classList.add("active");
        applyMenuFilter();
    });
});

// ================= MA'LUMOTLAR YANGILANISHI =================
window.addEventListener("storage",event=>{
    if(event.key==="safiCafeAdminMenu"){
        renderMenu();
    }
});

window.addEventListener("safi-menu-updated",renderMenu);

// ================= ISHGA TUSHIRISH =================
renderMenu();
