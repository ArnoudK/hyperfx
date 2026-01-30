export const defaultThemes = [
  "system",
  "light",
  "dark",
  "sepia",
  "dark-sepia",
] as const;



export function UseColorHelper(
  defaultTheme: string = "system",
  _listenSystemTheme: boolean,
  _themes: readonly string[] = defaultThemes,
) {
  if (defaultTheme === "system") {
  }
}