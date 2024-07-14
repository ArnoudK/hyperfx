declare const defaults: {
    readonly morphStyle: "innerHTML" | "outerHTML";
    readonly deadIds: Set<string>;
    readonly head: {
        readonly block: boolean;
        readonly ignore: boolean;
        readonly style: "morph" | "append";
        readonly shouldPreserve: (elt: Element) => boolean;
        readonly shouldReAppend: (elt: Element) => boolean;
    };
};
type contextType = typeof defaults & {
    newContent: MorphEl;
    ignoreActive: boolean;
    ignoreActiveValue: boolean;
    target: MorphEl | null;
    config: contextType;
    idMap: Map<MorphEl, Set<string>>;
};
type MorphNode = Node & {
    generatedByIdiomorph?: boolean;
};
type MorphEl = Element & {
    generatedByIdiomorph?: boolean;
};
export declare function morph(oldNode: MorphNode | MorphEl, newContent: MorphNode | MorphEl | string | null, config?: Partial<contextType>): HTMLCollection | (MorphEl | undefined)[] | undefined;
export {};
//# sourceMappingURL=morphing.d.ts.map