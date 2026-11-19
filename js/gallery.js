
const galleryItems=document.querySelectorAll(".gallery-item");
const galleryFilters=document.querySelectorAll(".gallery-filter");
const galleryModal=document.getElementById("galleryModal");
const modalImage=document.getElementById("modalImage");
const modalClose=document.getElementById("modalClose");

galleryFilters.forEach(button=>{
button.addEventListener("click",()=>{
galleryFilters.forEach(item=>item.classList.remove("active"));
button.classList.add("active");
const filter=button.dataset.filter;
galleryItems.forEach(item=>{
item.classList.toggle("hidden",filter!=="all"&&item.dataset.category!==filter);
});
});
});

document.querySelectorAll(".gallery-open").forEach(button=>{
button.addEventListener("click",()=>{
const image=button.parentElement.querySelector("img");
modalImage.src=image.src;
modalImage.alt=image.alt;
galleryModal.classList.add("show");
});
});

function closeGalleryModal(){
galleryModal.classList.remove("show");
modalImage.src="";
}

modalClose.addEventListener("click",closeGalleryModal);
galleryModal.addEventListener("click",event=>{
if(event.target===galleryModal)closeGalleryModal();
});
document.addEventListener("keydown",event=>{
if(event.key==="Escape")closeGalleryModal();
});
