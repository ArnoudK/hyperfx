import { JSX } from "hyperfx";
import { createRouter } from "hyperfx-extra";
import { AboutRoute } from "./routes/about";
import { HomeRoute } from "./routes/homepage";
import { ProductsRoute } from "./routes/products";


export const router =createRouter([
  AboutRoute,
  HomeRoute,
  ProductsRoute
],
)

const Router = router.Router;

export const Link =router.Link

export function App(props: {pathname: string}): JSX.Element {
    return   (
          <div id="app">
            <Router initialPath={props.pathname}/>
          </div>
    );   
}