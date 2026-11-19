
// ================= SAFI CAFE UMUMIY MENYUSI =================
(function(){
    const STORAGE_KEY="safiCafeAdminMenu";
    const INIT_KEY="safiCafeMenuInitialized";

    const defaultMenu=[
        {
            id:"safi-default-1",
            name:"Classic Burger",
            price:45000,
            category:"burger",
            description:"Yumshoq bulochka, mazali go‘sht va yangi sabzavotlar.",
            image:"https://images.unsplash.com/photo-1568901346375-23c9450c58bd?auto=format&fit=crop&w=700&q=85",
            badge:"MASHHUR"
        },
        {
            id:"safi-default-2",
            name:"Cheese Burger",
            price:50000,
            category:"burger",
            description:"Mayin pishloq, shirali go‘sht va maxsus sous.",
            image:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=700&q=85"
        },
        {
            id:"safi-default-3",
            name:"Italian Pizza",
            price:75000,
            category:"pizza",
            description:"Pishloq, pomidor va maxsus sous bilan tayyorlangan.",
            image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=85",
            badge:"TAVSIYA"
        },
        {
            id:"safi-default-4",
            name:"Pepperoni Pizza",
            price:85000,
            category:"pizza",
            description:"Qarsildoq xamir, pishloq va pepperoni bo‘laklari.",
            image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=700&q=85"
        },
        {
            id:"safi-default-5",
            name:"Fresh Salad",
            price:35000,
            category:"salad",
            description:"Yangi sabzavotlar va yengil maxsus sous.",
            image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=85"
        },
        {
            id:"safi-default-6",
            name:"Vegetable Salad",
            price:30000,
            category:"salad",
            description:"Yangi ko‘katlar va foydali sabzavotlar.",
            image:"https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=85"
        },
        {
            id:"safi-default-7",
            name:"Fresh Juice",
            price:20000,
            category:"drink",
            description:"Tabiiy mevalardan tayyorlangan yangi sharbat.",
            image:"https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85"
        },
        {
            id:"safi-default-8",
            name:"Special Coffee",
            price:25000,
            category:"drink",
            description:"Yoqimli hid va boy ta’mga ega qahva.",
            image:"https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=85"
        }
    ];

    function readMenu(){
        try{
            const data=JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(data)?data:[];
        }catch(error){
            return [];
        }
    }

    // Birinchi ishga tushirishda eski taomlarni ham saqlab qolish
    if(localStorage.getItem(INIT_KEY)!=="true"){
        const existing=readMenu();
        const existingIds=new Set(existing.map(item=>String(item.id)));

        const missing=defaultMenu.filter(item=>!existingIds.has(String(item.id)));

        const combined=[...defaultMenu.filter(item=>!existingIds.has(String(item.id))),...existing];

        // Mavjud eski taomlar takrorlanmaydi
        localStorage.setItem(STORAGE_KEY,JSON.stringify(combined));
        localStorage.setItem(INIT_KEY,"true");
    }

    window.SAFI_MENU={
        getAll:readMenu,
        save:function(items){
            localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
            window.dispatchEvent(new Event("safi-menu-updated"));
        }
    };
})();
