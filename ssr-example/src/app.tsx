import { JSX, Route, Router } from "hyperfx";
import { getAllRoutePaths, routes } from "./routes/config";

export function App(props: {pathname: string}): JSX.Element {
    return   (
          <div id="app">
            <Router initialPath={props.pathname}>
              {() => (
                <>
                  {getAllRoutePaths().map(path => (
                    <Route
                      path={path}
                      component={routes[path]?.component}
                      exact={path === '/'}
                    />
                  ))}
                </>
              )}
            </Router>
          </div>
    );   
}