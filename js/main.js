
document.addEventListener("DOMContentLoaded", () => {
    // TIL ALMASHTIRISH
    const languageBtn = document.getElementById("languageBtn");
    let currentLanguage = "uz";
    try {
        currentLanguage = localStorage.getItem("safiLanguage") || "uz";
    } catch (error) {
        console.warn("Til sozlamasini o‘qib bo‘lmadi:", error);
    }
    setSafiLanguage(currentLanguage);
    languageBtn?.addEventListener("click", () => {
        const newLanguage = document.documentElement.lang === "uz" ? "ru" : "uz";
        setSafiLanguage(newLanguage);
    });

    // MOBIL MENYU
    const menuToggle = document.getElementById("menuToggle");
    const navigation = document.getElementById("navigation");

    function closeMenu() {
        navigation?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (
            navigation?.classList.contains("open") &&
            !navigation.contains(event.target) &&
            !menuToggle?.contains(event.target)
        ) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });
});
function setSafiLanguage(lang) {
    if (!SAFI_TRANSLATIONS[lang]) return;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-uz][data-ru]").forEach(element => {
        const translatedText = element.getAttribute(`data-${lang}`);
        const arrow = element.querySelector(":scope > span");
        if (arrow) {
            const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) textNode.nodeValue = translatedText + " ";
            else element.insertBefore(document.createTextNode(translatedText + " "), arrow);
        } else {
            element.textContent = translatedText;
        }
    });
    const languageBtn = document.getElementById("languageBtn");
    if (languageBtn) languageBtn.innerHTML = `${SAFI_TRANSLATIONS[lang].code} <span>⌄</span>`;
    try {
        localStorage.setItem("safiLanguage", lang);
    } catch (error) {
        console.warn("Til sozlamasini saqlab bo‘lmadi:", error);
    }
}
