export const defaultThemes = [
  "system",
  "light",
  "dark",
  "sepia",
  "dark-sepia",
] as const;

type standardTheme = "system" | "light" | "dark";

type defaultTheme = (typeof defaultThemes)[number];

export function UseColorHelper(
  defaultTheme: string = "system",
  listenSystemTheme: boolean,
  themes: readonly string[] = defaultThemes,
) {
  if (defaultTheme === "system") {
  }
}

function setTheme(theme: defaultTheme) {
  const htmlroot = document.body.parentElement!;
  const classes = htmlroot.className;
}

function getSystemTheme(
  e: MediaQueryListEvent | MediaQueryList,
): standardTheme {
  if (e.matches) {
    // Dark
    return "dark";
  }
  return "light";
}

function setSystemTheme(e: MediaQueryListEvent | MediaQueryList) {
  const t = getSystemTheme(e);
  setTheme(t);
}

function useSystemTheme() {
  const colorSchemeQueryList = window.matchMedia(
    "(prefers-color-scheme: dark)",
  );
  colorSchemeQueryList.addEventListener("change", setSystemTheme);
}
