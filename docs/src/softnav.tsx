
export function SoftNav({
    href ,
    className,
    text
}: {
    href: string;
    className: string;
    text: string;
    key?: string | number;
}) {
    return <a
    href={href}
    class={className}
    onclick={
        (e: MouseEvent) => {
            e.preventDefault();
            window.history.pushState({}, '', href);
            window.dispatchEvent(new Event('popstate'));
    }}>
        {text}
    </a>
}