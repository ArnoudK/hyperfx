import type { GlobalAttr } from "./attr";
import { createS } from "./elem";

export const Br = (attributes: GlobalAttr) => createS("br", attributes);

export const Hr = (attributes: GlobalAttr) => createS("hr", attributes);
