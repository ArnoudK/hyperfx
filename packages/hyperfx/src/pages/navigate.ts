/**
 * Navigate to a url by pushing it and popstate this allows for soft navigation using HyperFX
 * The URL must be registered in the PageRegister!!!
 */
export function navigateTo(href: string) {
  history.pushState({}, "", href);
  window.dispatchEvent(new Event("popstate"));
}
