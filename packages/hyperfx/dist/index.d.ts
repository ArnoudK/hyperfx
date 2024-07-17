import { RenderToBody, Div, t } from "./elem/elem";
import { P, Span, A, Abbr, B, Bdi, Bdo, Cite, I } from "./elem/text";
import { H1, H2, H3, H4, H5, H6 } from "./elem/headings";
import { Hr, Br } from "./elem/style";
import { Img } from "./elem/img";
import { Input, Label } from "./elem/input";
import { Title, MetaDescription } from "./elem/head";
import { Table, TableBody, TableData, TableFoot, TableHead, TableHeader, TableRow, Tbody, Td, Tfoot, Th, Thead, Tr, TableCaption } from "./elem/table";
import { Article, Address, Aside, Button, Nav, Main, Footer } from "./elem/semantic";
import { Component, RootComponent, PageComponent } from "./reactive/component";
import { WithEventListener } from "./reactive/event";
import { navigateTo } from "./pages/navigate";
import { RouteRegister, GetParamValue, GetQueryValue, GetQueryValues } from "./pages/register";
import { fetcher } from "./fetcher";
declare global {
    interface HTMLElement {
        /** Add an event listener and return the Element */
        WithEvent$HFX<K extends keyof HTMLElementEventMap>(eventtype: K, listener: (ev: HTMLElementEventMap[keyof HTMLElementEventMap]) => void): this;
    }
    interface Object {
        With$HFX<T extends Object>(this: T, run: (obj: T) => void): T;
    }
}
export { A, Abbr, Address, Article, Aside, B, Bdi, Bdo, Button, Br, Cite, Div, Footer, H1, H2, H3, H4, H5, H6, Hr, I, Img, Input, Label, Main, Nav, P, t, Span, Table, TableBody, TableData, TableFoot, TableHead, TableHeader, TableRow, Tbody, Td, Tfoot, Th, Thead, Tr, TableCaption, RenderToBody, Title, MetaDescription, WithEventListener, Component, RootComponent, PageComponent, navigateTo, RouteRegister, GetParamValue, GetQueryValue, GetQueryValues, fetcher, };
//# sourceMappingURL=index.d.ts.map