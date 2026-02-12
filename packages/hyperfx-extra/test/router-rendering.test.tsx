/**
 * Router Rendering & Navigation Integration Tests
 *
 * These tests verify that the router actually renders route views,
 * handles navigation, and integrates properly with HyperFX reactivity.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRoute } from "../src/router/createRoute";
import { createRouter } from "../src/router/createRouter";

describe("Router Rendering", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should render a simple route view", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home Page</div>,
    });

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".home")).toBeTruthy();
    expect(container.textContent).toContain("Home Page");
  });

  it("should render route with parameters", () => {
    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User ID: {params.userId}</div>,
    });

    const router = createRouter([UserRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/user/123" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".user")).toBeTruthy();
    expect(container.textContent).toContain("User ID: 123");
  });

  it("should render multiple route parameters", () => {
    const PostRoute = createRoute("/blog/:category/:postId", {
      view: (params: { category: string; postId: string }) => (
        <div class="post">
          Category: {params.category}, Post: {params.postId}
        </div>
      ),
    });

    const router = createRouter([PostRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/blog/tech/42" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".post")).toBeTruthy();
    expect(container.textContent).toContain("Category: tech");
    expect(container.textContent).toContain("Post: 42");
  });

  it("should match first route when multiple routes could match", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/about" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".about")).toBeTruthy();
    expect(container.querySelector(".home")).toBeFalsy();
    expect(container.textContent).toContain("About");
  });

  it("should render notFound component for unmatched routes", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const NotFound = ({ path }: { path: string }) => (
      <div class="not-found">404: {path} not found</div>
    );

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/nonexistent" notFound={NotFound} />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".not-found")).toBeTruthy();
    expect(container.textContent).toContain("404: /nonexistent not found");
  });

  it("should return null for unmatched routes when no notFound handler", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/nonexistent" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // Should render nothing
    expect(container.textContent).toBe("");
    expect(container.children.length).toBe(1);
  });
});

describe("Router Navigation", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should navigate programmatically between routes", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home Page</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About Page</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);
    const RouterComponent = router.Router;

    // Use Router as a component function directly
    const App = () => (
      <div>
        <RouterComponent initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // Initially on home
    expect(container.querySelector(".home")).toBeTruthy();
    expect(container.textContent).toContain("Home Page");

    // Navigate to about
    router.navigate("/about");

    // Should now show about page
    expect(container.querySelector(".about")).toBeTruthy();
    expect(container.querySelector(".home")).toBeFalsy();
    expect(container.textContent).toContain("About Page");
  });

  it("should navigate with route parameters", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId}</div>,
    });

    const router = createRouter([HomeRoute, UserRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // Navigate to user page
    router.navigate("/user/alice");

    expect(container.querySelector(".user")).toBeTruthy();
    expect(container.textContent).toContain("User: alice");

    // Navigate to different user
    router.navigate("/user/bob");

    expect(container.textContent).toContain("User: bob");
    expect(container.textContent).not.toContain("User: alice");
  });

  it("should navigate back to home from parameterized route", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId}</div>,
    });

    const router = createRouter([HomeRoute, UserRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/user/alice" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.textContent).toContain("User: alice");

    // Navigate back to home
    router.navigate("/");

    expect(container.querySelector(".home")).toBeTruthy();
    expect(container.querySelector(".user")).toBeFalsy();
    expect(container.textContent).toContain("Home");
  });

  it("should handle navigation to non-existent routes", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const NotFound = ({ path }: { path: string }) => <div class="not-found">404: {path}</div>;

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" notFound={NotFound} />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.textContent).toContain("Home");

    // Navigate to non-existent route
    router.navigate("/nowhere");

    expect(container.querySelector(".not-found")).toBeTruthy();
    expect(container.textContent).toContain("404: /nowhere");
  });

  it("should update on hfx:navigate events", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const NotFound = ({ path }: { path: string }) => <div class="not-found">404: {path}</div>;

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" notFound={NotFound} />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.textContent).toContain("Home");

    window.history.pushState({}, "", "/nowhere");
    window.dispatchEvent(new CustomEvent("hfx:navigate"));

    expect(container.querySelector(".not-found")).toBeTruthy();
    expect(container.textContent).toContain("404: /nowhere");
  });
});

describe("Link Component", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should render Link component with correct href", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);

    const App = () => (
      <div>
        <router.Link to={AboutRoute}>Go to About</router.Link>
        <router.Router initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.href).toContain("/about");
    expect(link?.textContent).toBe("Go to About");
  });

  it("should render Link with route parameters", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId}</div>,
    });

    const router = createRouter([HomeRoute, UserRoute]);

    const App = () => (
      <div>
        <router.Link to={UserRoute} params={{ userId: "123" }}>
          View User 123
        </router.Link>
        <router.Router initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.href).toContain("/user/123");
  });

  it("should render Link with search parameters", () => {
    const SearchRoute = createRoute("/search", {
      view: () => <div class="search">Search Results</div>,
    });

    const router = createRouter([SearchRoute]);

    const App = () => (
      <div>
        <router.Link to={SearchRoute} search={{ q: "test", page: "1" }}>
          Search Test
        </router.Link>
        <router.Router initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    const link = container.querySelector("a");
    expect(link).toBeTruthy();
    expect(link?.href).toContain("/search");
    expect(link?.href).toContain("q=test");
    expect(link?.href).toContain("page=1");
  });

  it("should navigate when Link is clicked", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);

    const App = () => (
      <div>
        <router.Link to={AboutRoute} class="about-link">
          Go to About
        </router.Link>
        <router.Router initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // Initially on home
    expect(container.querySelector(".home")).toBeTruthy();

    // Click the link
    const link = container.querySelector(".about-link") as HTMLAnchorElement;
    expect(link).toBeTruthy();
    link.click();

    // Should navigate to about
    expect(container.querySelector(".about")).toBeTruthy();
    expect(container.querySelector(".home")).toBeFalsy();
  });

  it("should navigate to parameterized route when Link is clicked", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId}</div>,
    });

    const router = createRouter([HomeRoute, UserRoute]);

    const App = () => (
      <div>
        <router.Link to={UserRoute} params={{ userId: "alice" }} class="user-link">
          View Alice
        </router.Link>
        <router.Router initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".home")).toBeTruthy();

    // Click the link
    const link = container.querySelector(".user-link") as HTMLAnchorElement;
    link.click();

    expect(container.querySelector(".user")).toBeTruthy();
    expect(container.textContent).toContain("User: alice");
  });
});

describe("Router Reactive Integration", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should expose reactive currentPath signal", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(router.currentPath()).toBe("/");

    router.navigate("/about");

    expect(router.currentPath()).toBe("/about");
  });

  it("should expose reactive currentMatch signal", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId}</div>,
    });

    const router = createRouter([HomeRoute, UserRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/user/alice" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    const match = router.currentMatch();
    expect(match).toBeTruthy();
    expect(match?.route).toBe(UserRoute);
    expect(match?.params.userId).toBe("alice");

    router.navigate("/user/bob");

    const newMatch = router.currentMatch();
    expect(newMatch?.params.userId).toBe("bob");
  });

  it("should call onRouteChange callback when navigating", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const AboutRoute = createRoute("/about", {
      view: () => <div class="about">About</div>,
    });

    const router = createRouter([HomeRoute, AboutRoute]);
    const RouterComponent = router.Router;

    const routeChanges: Array<string | null> = [];

    const App = () => (
      <div>
        <RouterComponent
          initialPath="/"
          onRouteChange={(match) => {
            routeChanges.push(match?.route.path ?? null);
          }}
        />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // Initial route should trigger callback
    expect(routeChanges.length).toBeGreaterThan(0);
    expect(routeChanges[routeChanges.length - 1]).toBe("/");

    router.navigate("/about");

    expect(routeChanges[routeChanges.length - 1]).toBe("/about");
  });
});

describe("Router Edge Cases", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should handle root route correctly", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".home")).toBeTruthy();
  });

  it("should not match root route for non-root paths", () => {
    const HomeRoute = createRoute("/", {
      view: () => <div class="home">Home</div>,
    });

    const NotFound = ({ path }: { path: string }) => <div class="not-found">Not Found: {path}</div>;

    const router = createRouter([HomeRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/about" notFound={NotFound} />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.querySelector(".not-found")).toBeTruthy();
    expect(container.querySelector(".home")).toBeFalsy();
  });

  it("should handle optional parameters", () => {
    const DocRoute = createRoute("/docs/:section?", {
      view: (params: { section?: string }) => (
        <div class="docs">Section: {params.section || "index"}</div>
      ),
    });

    // Test with parameter
    const router1 = createRouter([DocRoute]);
    const RouterComponent1 = router1.Router;

    const App1 = () => (
      <div class="test1">
        <RouterComponent1 initialPath="/docs/getting-started" />
      </div>
    );
    container.appendChild(App1() as unknown as Node);
    expect(container.textContent).toContain("Section: getting-started");

    // Test without parameter - use a new router instance
    container.innerHTML = "";
    const router2 = createRouter([DocRoute]);
    const RouterComponent2 = router2.Router;

    const App2 = () => (
      <div class="test2">
        <RouterComponent2 initialPath="/docs" />
      </div>
    );
    container.appendChild(App2() as unknown as Node);
    expect(container.textContent).toContain("Section: index");
  });

  it("should handle catch-all routes", () => {
    const DocsRoute = createRoute("/docs/...[slug]", {
      view: (params: { slug: string }) => <div class="docs">Docs: {params.slug}</div>,
    });

    const router = createRouter([DocsRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/docs/api/reference/methods" />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    expect(container.textContent).toContain("Docs: api/reference/methods");
  });

  it("should handle empty path segments correctly", () => {
    const UserRoute = createRoute("/user/:userId", {
      view: (params: { userId: string }) => <div class="user">User: {params.userId || "none"}</div>,
    });

    const NotFound = (props: { path: string }) => <div class="not-found">Not Found: {props.path}</div>;

    const router = createRouter([UserRoute]);
    const RouterComponent = router.Router;

    const App = () => (
      <div>
        <RouterComponent initialPath="/user/" notFound={NotFound} />
      </div>
    );

    container.appendChild(App() as unknown as Node);

    // /user/ with trailing slash but no ID should NOT match (required param)
    // It should show the NotFound component instead
    expect(container.querySelector(".not-found")).toBeTruthy();
    expect(container.querySelector(".user")).toBeFalsy();
  });
});
