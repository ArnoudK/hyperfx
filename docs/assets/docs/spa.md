# Routing & SPA

HyperFX provides a declarative, component-based routing system that allows you to build Single Page Applications (SPAs) with ease.

## Core Components


### `<Router>`

The `<Router>` component is the root of your routing system. It manages the current path and provides routing context to its children.

### `<Route>`

The `<Route>` component renders its content only when the current path matches its `path` prop.

```tsx
import { Router, Route } from "hyperfx";

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      {/* Catch-all route */}
      <Route path="*" component={NotFoundPage} />
    </Router>
  );
}
```


### `<Link>`

The `<Link>` component provides a declarative way to navigate between routes. It prevents full page reloads and updates the URL.

```tsx
<nav>
  <Link to="/">Home</Link>
  <Link to="/about" activeClass="font-bold">About</Link>
</nav>
```

---

## Routing Hooks


### `usePath()`

Returns a reactive signal containing the current URL path.

```tsx
import { usePath } from "hyperfx";

function PathDisplay() {
  const path = usePath();
  return <p>Current path is: {path}</p>;
}
```


### `useNavigate()`

Returns a function that can be used to programmatically navigate.

```tsx
import { useNavigate } from "hyperfx";

function LogoutButton() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## Query Parameters & Params


### `getQueryValue(key)`

Returns the value of a query parameter from the current URL.

```tsx
import { getQueryValue } from "hyperfx";

function Docs() {
  const doc = getQueryValue("doc") || "home";
  // ...
}
```


### `getParam(key)` (In progress)

Used for extracting parameters from dynamic routes (e.g., `/user/:id`). Note: Full dynamic route support is currently being refined.

---

## Manual Navigation

If you need to navigate outside of a component, you can use the `navigateTo` function:

```tsx
import { navigateTo } from "hyperfx";

function checkAuth() {
  if (!isLoggedIn) {
    navigateTo("/login");
  }
}
```
