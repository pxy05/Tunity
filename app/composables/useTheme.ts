export type ThemeMode = "transparent" | "dark" | "light";

export const useTheme = () => {
  const theme = ref<ThemeMode>("transparent");

  // Apply theme to document
  const applyTheme = (newTheme: ThemeMode) => {
    if (!process.client) return;

    const body = document.body;
    body.classList.remove("theme-transparent", "theme-dark", "theme-light");
    body.classList.add(`theme-${newTheme}`);

    // Store in localStorage
    localStorage.setItem("tunity-theme", newTheme);
  };

  // Cycle through themes
  const cycleTheme = () => {
    const themes: ThemeMode[] = ["transparent", "dark", "light"];
    const currentIndex = themes.indexOf(theme.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    theme.value = themes[nextIndex];
    applyTheme(theme.value);
  };

  // Initialize theme on mount
  onMounted(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("tunity-theme") as ThemeMode;
    if (savedTheme && ["transparent", "dark", "light"].includes(savedTheme)) {
      theme.value = savedTheme;
    }
    // Apply the theme (default or saved)
    applyTheme(theme.value);
  });

  // Watch for theme changes and apply
  watch(theme, (newTheme) => {
    if (process.client) {
      applyTheme(newTheme);
    }
  });

  return {
    theme: readonly(theme),
    cycleTheme,
    setTheme: (newTheme: ThemeMode) => {
      theme.value = newTheme;
      applyTheme(newTheme);
    },
  };
};

