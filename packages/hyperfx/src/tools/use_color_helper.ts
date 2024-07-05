export const defaultThemes = [
  "system",
  "light",
  "dark",
  "sepia",
  "dark-sepia",
] as const;

export function UseColorHelper(
  defaultTheme: string = "system",
  listenSystemTheme: boolean,
  themes: readonly string[] = defaultThemes,
) {}

const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");

function setSystemTheme(e: MediaQueryListEvent | MediaQueryList) {
  if (e.matches) {
    // Dark
    console.log("Dark mode");
  } else {
    // Light
    console.log("Light mode");
  }
}

setSystemTheme(colorSchemeQueryList);
colorSchemeQueryList.addEventListener("change", setSystemTheme);
