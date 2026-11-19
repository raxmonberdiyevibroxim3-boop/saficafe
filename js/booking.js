
// ================= STOL BAND QILISH =================
const bookingForm=document.getElementById("bookingForm");
const bookingStatus=document.getElementById("bookingStatus");
const bookingDate=document.getElementById("bookingDate");

if(bookingForm){
    const today=new Date();
    const year=today.getFullYear();
    const month=String(today.getMonth()+1).padStart(2,"0");
    const day=String(today.getDate()).padStart(2,"0");
    bookingDate.min=`${year}-${month}-${day}`;

    bookingForm.addEventListener("submit",function(event){
        event.preventDefault();

        const name=document.getElementById("bookingName").value.trim();
        const phone=document.getElementById("bookingPhone").value.trim();
        const guests=Number(document.getElementById("bookingGuests").value);
        const date=bookingDate.value;
        const time=document.getElementById("bookingTime").value;

        if(!name||!phone||!guests||!date||!time){
            bookingStatus.textContent="Iltimos, barcha kerakli maydonlarni to‘ldiring.";
            return;
        }

        const selectedDate=new Date(date+"T00:00:00");
        const currentDate=new Date();
        currentDate.setHours(0,0,0,0);

        if(selectedDate<currentDate){
            bookingStatus.textContent="O‘tgan sanani tanlash mumkin emas.";
            return;
        }

        // Oldingi bronlarni olish
        let reservations=[];

        try{
            reservations=JSON.parse(localStorage.getItem("safiCafeAdminReservations"))||[];
            if(!Array.isArray(reservations)) reservations=[];
        }catch(error){
            reservations=[];
        }

        // Yangi bronni saqlash
        const newReservation={
            id:Date.now(),
            name:name,
            phone:phone,
            guests:guests,
            date:date,
            time:time,
            status:"Yangi",
            createdAt:new Date().toLocaleString()
        };

        reservations.push(newReservation);

        localStorage.setItem(
            "safiCafeAdminReservations",
            JSON.stringify(reservations)
        );

        bookingStatus.textContent=`Rahmat, ${name}! ${date} kuni soat ${time} uchun ${guests} kishilik bron so‘rovingiz qabul qilindi. Tez orada siz bilan bog‘lanamiz.`;

        bookingForm.reset();
        bookingDate.min=`${year}-${month}-${day}`;
    });
}
