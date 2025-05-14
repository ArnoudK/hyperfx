export const defaultThemes = [
    "system",
    "light",
    "dark",
    "sepia",
    "dark-sepia",
];
export function UseColorHelper(defaultTheme = "system", listenSystemTheme, themes = defaultThemes) {
    if (defaultTheme === "system") {
    }
}
function setTheme(theme) {
    const htmlroot = document.body.parentElement;
    const classes = htmlroot.className;
}
function getSystemTheme(e) {
    if (e.matches) {
        // Dark
        return "dark";
    }
    return "light";
}
function setSystemTheme(e) {
    const t = getSystemTheme(e);
    setTheme(t);
}
function useSystemTheme() {
    const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    colorSchemeQueryList.addEventListener("change", setSystemTheme);
}
//# sourceMappingURL=use_color_helper.js.map