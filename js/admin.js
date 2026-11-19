
// ================= NAVIGATSIYA =================
const navButtons=document.querySelectorAll(".nav-btn");
const pages=document.querySelectorAll(".page");
const headerTitle=document.querySelector(".admin-header h1");

const pageTitles={
    dashboard:"Dashboard",
    menu:"Menyu boshqaruvi",
    orders:"Buyurtmalar",
    reservations:"Stol band qilish",
    customers:"Mijozlar",
    settings:"Sozlamalar"
};

navButtons.forEach(button=>{
    button.addEventListener("click",()=>{
        const pageName=button.dataset.page;
        navButtons.forEach(btn=>btn.classList.remove("active"));
        pages.forEach(page=>page.classList.remove("active"));
        button.classList.add("active");
        document.getElementById(pageName).classList.add("active");
        headerTitle.textContent=pageTitles[pageName];
    });
});

// ================= MA'LUMOTLAR =================
function getData(key){
    try{
        const data=JSON.parse(localStorage.getItem(key))||[];
        return Array.isArray(data)?data:[];
    }catch(error){
        return [];
    }
}

let menu=window.SAFI_MENU.getAll();
let orders=getData("safiCafeAdminOrders");
let reservations=getData("safiCafeAdminReservations");
let customers=getData("safiCafeAdminCustomers");
function saveMenu(){
    window.SAFI_MENU.save(menu);
}

// ================= YORDAMCHI FUNKSIYALAR =================
function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,char=>({
        "&":"&amp;",
        "<":"&lt;",
        ">":"&gt;",
        '"':"&quot;",
        "'":"&#039;"
    })[char]);
}

const categoryNames={
    burger:"BURGERLAR",
    pizza:"PITSALAR",
    salad:"SALATLAR",
    drink:"ICHIMLIKLAR"
};

// ================= STATISTIKA =================
function updateStats(){
    document.getElementById("totalMenu").textContent=menu.length;
    document.getElementById("totalOrders").textContent=orders.length;
    document.getElementById("totalReservations").textContent=reservations.length;
    document.getElementById("totalCustomers").textContent=customers.length;
}

// ================= MENYU RO'YXATI =================
function renderMenu(){
    const menuList=document.getElementById("menuList");

    if(menu.length===0){
        menuList.innerHTML=`
            <div class="empty-state">
                Hozircha menyuga taom qo'shilmagan.
            </div>
        `;
        updateStats();
        return;
    }

    menuList.innerHTML=`
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Rasm</th>
                        <th>Taom nomi</th>
                        <th>Kategoriya</th>
                        <th>Narxi</th>
                        <th>Amallar</th>
                    </tr>
                </thead>
                <tbody>
                    ${menu.map((item,index)=>`
                        <tr>
                            <td>${index+1}</td>
                            <td>
                                ${item.image?`<img class="menu-thumb" src="${escapeHTML(item.image)}" alt="">`:"Rasm yo‘q"}
                            </td>
                            <td>${escapeHTML(item.name)}</td>
                            <td>${escapeHTML(categoryNames[item.category]||item.category)}</td>
                            <td>${Number(item.price).toLocaleString("uz-UZ")} so'm</td>
                            <td>
                                <button class="table-action" data-action="edit" data-id="${item.id}">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button class="table-action delete" data-action="delete" data-id="${item.id}">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    updateStats();
}

// ================= TAOM FORMASI =================
const addProductBtn=document.getElementById("addProductBtn");
const productForm=document.getElementById("productForm");
const productPreview=document.getElementById("productPreview");
const productImage=document.getElementById("productImage");

let editingProductId=null;

addProductBtn.addEventListener("click",()=>{
    editingProductId=null;
    productForm.reset();
    productPreview.hidden=true;
    productImage.required=true;
    document.getElementById("productFormTitle").textContent="Yangi taom qo‘shish";
    productForm.hidden=false;
    productForm.scrollIntoView({behavior:"smooth",block:"center"});
});

// Rasmni ko'rish
productImage.addEventListener("change",()=>{
    const file=productImage.files[0];

    if(file){
        if(!file.type.startsWith("image/")){
            alert("Faqat rasm faylini tanlang!");
            productImage.value="";
            productPreview.hidden=true;
            return;
        }

        productPreview.src=URL.createObjectURL(file);
        productPreview.hidden=false;
    }
});

// Rasm hajmini kichraytirish
function compressImage(file){
    return new Promise((resolve,reject)=>{
        const reader=new FileReader();

        reader.onerror=()=>reject(new Error("Rasmni o'qib bo'lmadi."));

        reader.onload=()=>{
            const image=new Image();

            image.onerror=()=>reject(new Error("Rasmni ochib bo'lmadi."));

            image.onload=()=>{
                const maxSize=900;
                const scale=Math.min(1,maxSize/Math.max(image.width,image.height));

                const canvas=document.createElement("canvas");
                canvas.width=Math.round(image.width*scale);
                canvas.height=Math.round(image.height*scale);

                const context=canvas.getContext("2d");
                context.fillStyle="#ffffff";
                context.fillRect(0,0,canvas.width,canvas.height);
                context.drawImage(image,0,0,canvas.width,canvas.height);

                resolve(canvas.toDataURL("image/jpeg",0.8));
            };

            image.src=reader.result;
        };

        reader.readAsDataURL(file);
    });
}

// ================= TAOMNI SAQLASH =================
productForm.addEventListener("submit",async event=>{
    event.preventDefault();

    const name=document.getElementById("productName").value.trim();
    const price=Number(document.getElementById("productPrice").value);
    const category=document.getElementById("productCategory").value;
    const file=productImage.files[0];

    if(!name||price<=0||!category){
        alert("Barcha maydonlarni to'ldiring!");
        return;
    }

    if(editingProductId===null&&!file){
        alert("Taom rasmini tanlang!");
        return;
    }

    if(file&&!file.type.startsWith("image/")){
        alert("Faqat rasm faylini tanlang!");
        return;
    }

    if(file&&file.size>8*1024*1024){
        alert("Rasm hajmi 8 MB dan kichik bo'lishi kerak!");
        return;
    }

    try{
        let image=null;

        if(file){
            image=await compressImage(file);
        }

        const oldItem=menu.find(item=>String(item.id)===String(editingProductId));

        if(editingProductId!==null){
            if(!oldItem) return;

            oldItem.name=name;
            oldItem.price=price;
            oldItem.category=category;

            if(image){
                oldItem.image=image;
            }

            alert("Taom muvaffaqiyatli yangilandi!");
        }else{
            menu.push({
                id:Date.now(),
                name:name,
                price:price,
                category:category,
                image:image
            });

            alert("Yangi taom menyuga qo'shildi!");
        }

        saveMenu();
        renderMenu();

        productForm.reset();
        productPreview.hidden=true;
        productForm.hidden=true;
        productImage.required=true;
        editingProductId=null;
        document.getElementById("productFormTitle").textContent="Yangi taom qo‘shish";

    }catch(error){
        alert("Xatolik: "+error.message);
    }
});

// ================= FORMADAN CHIQISH =================
document.getElementById("cancelProductBtn").addEventListener("click",()=>{
    productForm.reset();
    productForm.hidden=true;
    productPreview.hidden=true;
    productImage.required=true;
    editingProductId=null;
});

// ================= TAOMNI TAHRIRLASH VA O'CHIRISH =================
document.getElementById("menuList").addEventListener("click",event=>{
    const button=event.target.closest("[data-action]");

    if(!button) return;

const id=button.dataset.id;
const action=button.dataset.action;
const item=menu.find(product=>String(product.id)===String(id));

    if(!item) return;

    if(action==="delete"){
        if(confirm(item.name+" taomini o'chirmoqchimisiz?")){
            menu=menu.filter(product=>String(product.id)!==String(id));
            saveMenu();
            renderMenu();
        }
    }

    if(action==="edit"){
        editingProductId=id;

        document.getElementById("productName").value=item.name;
        document.getElementById("productPrice").value=item.price;
        document.getElementById("productCategory").value=item.category;

        productImage.value="";
        productImage.required=false;

        if(item.image){
            productPreview.src=item.image;
            productPreview.hidden=false;
        }else{
            productPreview.hidden=true;
        }

        document.getElementById("productFormTitle").textContent="Taomni tahrirlash";

        productForm.hidden=false;
        productForm.scrollIntoView({behavior:"smooth",block:"center"});
    }
});

// ================= BUYURTMALAR =================
document.getElementById("ordersList").innerHTML=`
    <div class="empty-state">
        Buyurtmalar tizimi keyingi bosqichda ulanadi.
    </div>
`;

// ================= STOL BAND QILISH =================
function renderReservations(){
    const reservationsList=document.getElementById("reservationsList");

    if(reservations.length===0){
        reservationsList.innerHTML=`
            <div class="empty-state">
                Hozircha stol band qilish so'rovlari yo'q.
            </div>
        `;
        updateStats();
        return;
    }

    reservationsList.innerHTML=`
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mijoz</th>
                        <th>Telefon</th>
                        <th>Mehmonlar</th>
                        <th>Sana</th>
                        <th>Vaqt</th>
                        <th>Holati</th>
                        <th>Amal</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map((item,index)=>`
                        <tr>
                            <td>${index+1}</td>
                            <td>${escapeHTML(item.name)}</td>
                            <td>${escapeHTML(item.phone)}</td>
                            <td>${Number(item.guests)}</td>
                            <td>${escapeHTML(item.date)}</td>
                            <td>${escapeHTML(item.time)}</td>
                            <td>
                                <select class="status-select" data-reservation-status data-id="${item.id}">
                                    <option value="Yangi" ${item.status==="Yangi"?"selected":""}>Yangi</option>
                                    <option value="Tasdiqlandi" ${item.status==="Tasdiqlandi"?"selected":""}>Tasdiqlandi</option>
                                    <option value="Bekor qilindi" ${item.status==="Bekor qilindi"?"selected":""}>Bekor qilindi</option>
                                    <option value="Yakunlandi" ${item.status==="Yakunlandi"?"selected":""}>Yakunlandi</option>
                                </select>
                            </td>
                            <td>
                                <button class="table-action delete" data-delete-reservation="${item.id}">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    updateStats();
}

document.getElementById("reservationsList").addEventListener("change",event=>{
    const select=event.target.closest("[data-reservation-status]");

    if(!select) return;

    const item=reservations.find(item=>String(item.id)===select.dataset.id);

    if(!item) return;

    item.status=select.value;

    localStorage.setItem("safiCafeAdminReservations",JSON.stringify(reservations));
    renderReservations();
});

document.getElementById("reservationsList").addEventListener("click",event=>{
    const button=event.target.closest("[data-delete-reservation]");

    if(!button) return;

    const id=button.dataset.deleteReservation;

    if(confirm("Ushbu bronni o'chirmoqchimisiz?")){
        reservations=reservations.filter(item=>String(item.id)!==id);
        localStorage.setItem("safiCafeAdminReservations",JSON.stringify(reservations));
        renderReservations();
    }
});

// ================= MIJOZLAR =================
document.getElementById("customersList").innerHTML=`
    <div class="empty-state">
        Mijozlar tizimi keyingi bosqichda ulanadi.
    </div>
`;

// ================= ISHGA TUSHIRISH =================
renderMenu();
renderReservations();
updateStats();
