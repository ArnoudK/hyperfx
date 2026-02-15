import { createComputed, JSXChild, JSXChildPrimitive, JSXElement } from "hyperfx";





const baseClasses = "inline-flex center font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors" as const;

const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
} as const;

const sizeClasses = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-4 py-3 text-lg",
} as const;


export function Button(
    props: {
        variant?: keyof typeof variantClasses;
        size?: keyof typeof sizeClasses;
        disabled?: boolean;
        onclick?: (event: MouseEvent) => void;
        type: "button" | "submit" | "reset";
        children: JSXElement | JSXChildPrimitive | JSXChild;
    }
) {

    const classes = createComputed(() => {
        return [
        baseClasses,
        variantClasses[props.variant || "primary"],
        sizeClasses[props.size || "medium"],
        props.disabled ? "opacity-50 cursor-not-allowed" : "",
    ].join(" ");
    });
    return (
        <button
            class={classes()}
            disabled={props.disabled}
            onclick={props.onclick}
            type={props.type}
        >
            {props.children}
        </button>
    );
}

