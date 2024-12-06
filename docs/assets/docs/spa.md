# spa

single page application

## spa status

far from done...
most important: routes are not registered so page refresh will result in a: not found on this page :|

## Behavior

The A function from hyperfx will haijack all hrefs that go to your current website if a pageregister is active.

## Current usage

```ts
import {
  RouteRegister,
  PageComponent,
  RootComponent,
  t,
  Article,
  P,
} from "hyperfx";

// page_space is een element in which the page renders are dumped
RouteRegister(page_space)
  // builder pattern call to add pages
  .registerRoute(
    "/", // route name
    PageComponent(
      // component that holds the page logic / render
      root_comp, // parent (you can import rootcomp from hyperfx)
      null, // state, you can use null if you don't need it
      (state, my_comp) => {
        // render, you can get the state and the current component as parameters (typesafe)
        // in this case state will always be null
        return Article({}, [P({}, [t("My article")])]);
      },

      (_state, _my_comp) => {
        // additional logic to use that only loads on page load, but not on rerenders.
      }
    )
  )
  .enable(); // start using the registered routs
```
