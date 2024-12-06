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

### hack to work around not reloading :)

Just put everything in the query params :)
We use an hopefully 'old' version of the docs.

```ts
.registerRoute(
    "/hyperfx",
    PageComponent(
      root_comp,
      null,
      () => { // at render get query value 'doc' or fallback to main
        const doc = GetQueryValue("doc") || "main";
        const md_doc = docsMD.find((a) => a.route_name == doc);

        if (md_doc) {
          const doc_element = Div({ class: "flex flex-auto " }, [
            SideNavComp.currentRender,
            Article({
              class: "p-4 flex flex-col overflow-auto mx-auto",
            }).With$HFX((e) => {
              e.innerHTML = parse(md_doc.data) as string;
            }),
          ]);

          const code_blocks = doc_element.querySelectorAll("pre code");

          for (const code_block of code_blocks) {
            hljs.highlightElement(code_block as HTMLElement);
          }
          Title(`${md_doc.title} | HyperFX`);
          MetaDescription(`HyperFX docs about ${md_doc.title}.`);

          return doc_element;
        } else if (doc == "main") {
          Title("HyperFX docs");
          MetaDescription("Learn HyperFX todo and 'Read The Friendly Manual'!");

          return Div({}, [
            Article({ class: "p-4 mx-auto" }, []).With$HFX((a) => {
              a.innerHTML = hello_text;
            }),
          ]);
        } else Title(`Doc '${doc}' not found :( | HyperFX`);
        MetaDescription(`This docs for '${doc}' does not exist!`);

        return Div({ class: "text-xl p-4" }, [
          P({}, [t(`The docs for '${doc}' could not be found : (`)]),
          Br({}),
          A({ href: "/hyperfx", class: "underline text-blue-400" }, [
            t("Go back"),
          ]),
        ]);
      },
      () => {} // we rerender on route changes so we don't need additional load logic
    )
  )
```
