
const SAFI_TRANSLATIONS = {
    uz: {
        name: "O‘zbekcha",
        code: "UZ"
    },
    ru: {
        name: "Русский",
        code: "RU"
    }
};

function setSafiLanguage(lang) {
    if (!SAFI_TRANSLATIONS[lang]) return;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-uz][data-ru]").forEach(element => {
        element.textContent = element.getAttribute(`data-${lang}`);
    });
    const languageBtn = document.getElementById("languageBtn");
    if (languageBtn) {
        languageBtn.innerHTML = `${SAFI_TRANSLATIONS[lang].code} <span>⌄</span>`;
    }
    try {
        localStorage.setItem("safiLanguage", lang);
    } catch (error) {
        console.warn("Til sozlamasini saqlab bo‘lmadi:", error);
    }
}
