
const contactForm=document.getElementById("contactForm");
const contactStatus=document.getElementById("contactMessageStatus");

contactForm.addEventListener("submit",function(event){
event.preventDefault();
const name=document.getElementById("contactName").value.trim();
const phone=document.getElementById("contactPhone").value.trim();
const email=document.getElementById("contactEmail").value.trim();
const message=document.getElementById("contactMessage").value.trim();

if(!name||!phone||!email||!message){
contactStatus.textContent="Iltimos, barcha maydonlarni to‘ldiring.";
return;
}

contactStatus.textContent="Xabaringiz qabul qilindi! Tez orada siz bilan bog‘lanamiz.";
contactForm.reset();
});
