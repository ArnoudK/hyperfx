import { createSignal, Show } from "hyperfx";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Show when expression", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = "";
  });

  it("updates when={count() === 0} without arrow", () => {
    const [count, setCount] = createSignal(0);

    const element = (
      <Show when={count() === 0} fallback={<p class="count">{count()}</p>}>
        {() => <p class="zero">Zero</p>}
      </Show>
    );

    container.appendChild(element as Node);

    expect(container.querySelector(".zero")).toBeTruthy();
    expect(container.querySelector(".count")).toBeFalsy();

    setCount(1);

    expect(container.querySelector(".zero")).toBeFalsy();
    expect(container.querySelector(".count")).toBeTruthy();
    expect(container.textContent).toContain("1");

    setCount(0);

    expect(container.querySelector(".zero")).toBeTruthy();
    expect(container.querySelector(".count")).toBeFalsy();
  });
});
