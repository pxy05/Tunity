export default defineNuxtPlugin(() => {
  // Apply theme immediately on client-side load to prevent flash
  if (process.client) {
    const savedTheme = localStorage.getItem("tunity-theme");
    const validThemes = ["transparent", "dark", "light"];
    const theme = validThemes.includes(savedTheme || "") ? savedTheme : "transparent";
    
    document.body.classList.remove("theme-transparent", "theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
  }
});

