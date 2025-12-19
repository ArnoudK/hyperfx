// Global type definitions for the HyperFX SSR Example

declare global {
    interface Window {
        __hyperfx_client_navigated__?: boolean;
    }

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            VITE_APP_TITLE?: string;
            VITE_API_URL?: string;
        }
    }
}

// HyperFX specific types (matching new API)
export interface HydrationMarker {
    index: number;
    nodeId: string;
    tag: string;
    props: Record<string, any>;
    hasReactiveProps: boolean;
    hasEventHandlers: boolean;
}

export interface HydrationData {
    markers: HydrationMarker[];
    version: string;
}

// Route types
export interface RouteComponent {
    (): JSX.Element;
}

export interface Route {
    path: string;
    component: RouteComponent;
    title?: string;
    meta?: Record<string, any>;
}

// Error handling types
export interface SSRError {
    message: string;
    stack?: string;
    code?: string | number;
    context?: {
        pathname: string;
        userAgent?: string;
        timestamp: Date;
    };
}

// Asset types
export interface AssetManifest {
    stylesheets: string[];
    scripts: string[];
    preloads: string[];
}

// Event handler types
export type EventHandler<T extends Event = Event> = (event: T) => void;
export type ClickHandler = EventHandler<MouseEvent>;
export type ChangeHandler = EventHandler<Event>;
export type SubmitHandler = EventHandler<SubmitEvent>;

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type NonEmptyArray<T> = [T, ...T[]];

// Export empty object to make this a module
export {};
