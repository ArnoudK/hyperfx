# Components

Just blocks that hold state.

```ts
import {
  Div,
  P,
  Pre,
  RootComponent,
  RouteRegister,
  Span,
  Title,
  navigateTo,
  t,
} from "hyperfx";

// TODO set parent / children for efficient state management / make hooks/refs
// on a page you can pass the PageComponent as parent
const root = RootComponent();

// creates a component
const myComp = Component(
  root, // the parent
  { a: "" }, //state
  (data, comp) => {
    // render data=state comp = this comp
    return Div({ class: "p-2" }, [
      P({ class: "text-2xl text-red-500" }, [
        Span({ class: "font-semibold" }, "Text: "),
        t(data.a),
      ]),
      Label({ for: "live_type" }, [t("live update ")]),
      P({}, [
        t("This is basic text with a "),
        Span({ style: "font-weight: bold;" }, "bold"),
        t(" text in the middle."),
      ]),
      Input({
        class: "border-2 rounded-xl p-2 ",
        name: "live_type",
        id: "live_type_input",
        type: "text",
        value: data.a,
      }).WithEvent$HFX("input", (e) => {
        // bind a event on the Input you can chain them
        //@ts-expect-error (.value is not implented/documented by the MDN types reference) or typescript bugs and doesn't map it to InputEvent?
        const nval = e.target!.value;
        // we update and rerender this comp with new state
        // this goes smoothly inside the Input because we use a
        // semi smart morphing algorithm
        comp.Update({ a: nval });
      }),
    ]);
  }
);
```

## Should you use them?

Instead of using components everywhere more often than not you can just use functions, since Tag functions return HTMLElements.
So you can just create a function and pass state into the function and return your HTMLElement with the children you need, or spread them using the ... operator if you need to return a [].

Example:

```ts
function json_representation(prev: Element) {
  return Div(
    {
      id: "my_id",
      class: "bg-black/20 p-2 border-2 border-gray-500 rounded-md",
    },
    [
      Output({ name: "json_output", for: my_other_id }, [
        Pre({ class: "overflow-x-scroll" }, [
          t(JSON.stringify(elementToHFXObject(prev), null, "  ")),
        ]),
      ]),
    ]
  );
}
```
