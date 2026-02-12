import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRoute } from "../src/router/createRoute";
import { createRouter } from "../src/router/createRouter";
import { createComputed, createSignal } from "hyperfx";

describe("Router Rendering - computed nesting", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.innerHTML = "";
  });

  it("does not recompute with stale values inside route view", async () => {
    let recomputed: number[] = [];

    const CounterRoute = createRoute("/counter", {
      view: () => {
        const [count, setCount] = createSignal(0);
        const [step, setStep] = createSignal(1);
        const isEven = createComputed(() => count() % 2 === 0);

        const evenOddText = createComputed(() => {
          const c = count();
          recomputed.push(c);
          if (c === 0) return "N/A";
          return isEven() ? "Even" : "Odd";
        });

        return (
          <div>
            <button type="button" class="inc" onclick={() => setCount(count() + step())}>
              inc
            </button>
            <button type="button" class="step" onclick={() => setStep(step() + 1)}>
              step
            </button>
            <span class="even-odd">{evenOddText}</span>
            <span class="step-value">{step()}</span>
          </div>
        );
      },
    });

    const router = createRouter([CounterRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/counter" />
      </div>
    );

    const appNode = App() as unknown as Node;
    if (appNode instanceof DocumentFragment) {
      container.appendChild(appNode);
    } else {
      container.appendChild(appNode);
    }

    let incButton: HTMLButtonElement | null = null;
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
      const scope = appNode instanceof DocumentFragment ? appNode : container;
      incButton = scope.querySelector(".inc") as HTMLButtonElement | null;
      if (incButton) break;
    }
    if (!incButton) {
      const fallback = container.querySelector("button") as HTMLButtonElement | null;
      if (fallback) {
        incButton = fallback;
      }
    }
    expect(incButton).not.toBeNull();
    if (!incButton) {
      expect(container.textContent).toContain("inc");
      return;
    }

    incButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    const evenOddText = container.querySelector(".even-odd");
    expect(evenOddText?.textContent).toBe("Odd");
    expect(recomputed).toEqual([0, 1]);

    let stepButton: HTMLButtonElement | null = null;
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 0));
      const scope = appNode instanceof DocumentFragment ? appNode : container;
      stepButton = scope.querySelector(".step") as HTMLButtonElement | null;
      if (stepButton) break;
    }
    expect(stepButton).not.toBeNull();
    if (!stepButton) return;

    stepButton.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(evenOddText?.textContent).toBe("Odd");
    expect(recomputed).toEqual([0, 1]);
  });
});
