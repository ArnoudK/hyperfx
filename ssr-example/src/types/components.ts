// Component-specific type definitions

import { JSX } from 'hyperfx/jsx/jsx-runtime';



// Product related types
export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    tags?: string[];
    imageUrl?: string;
    inStock?: boolean;
}

export interface CartItem extends Product {
    quantity?: number;
    addedAt?: Date;
}

// Feature list types
export interface Feature {
    id?: string;
    name: string;
    description?: string;
    enabled?: boolean;
}

// Navigation types
export interface NavItem {
    href: string;
    label: string;
    icon?: string;
    external?: boolean;
    active?: boolean;
}

// Component prop types
export interface TopNavProps {
    items?: NavItem[];
    className?: string;
}

export interface CounterProps {
    initialValue?: number;
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number) => void;
}

export interface ProductCardProps {
    product: Product;
    onAddToCart?: (product: Product) => void;
    onRemoveFromCart?: (productId: number) => void;
    isInCart?: boolean;
    disabled?: boolean;
}

export interface FeatureListProps {
    features: Feature[];
    onAdd?: (feature: Feature) => void;
    onRemove?: (featureId: string) => void;
    onUpdate?: (feature: Feature) => void;
    editable?: boolean;
}

// State management types
export interface AppState {
    cart: CartItem[];
    features: Feature[];
    currentRoute: string;
    isLoading: boolean;
    error?: string;
}

export interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
    isEmpty: boolean;
}

// Action types
export interface CartActions {
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

export interface FeatureActions {
    addFeature: (feature: Feature) => void;
    removeFeature: (featureId: string) => void;
    updateFeature: (feature: Feature) => void;
    resetFeatures: () => void;
}

// Event types
export interface ProductEvent {
    type: 'add' | 'remove' | 'update';
    product: Product;
    timestamp: Date;
}

export interface FeatureEvent {
    type: 'add' | 'remove' | 'update' | 'reset';
    feature?: Feature;
    features?: Feature[];
    timestamp: Date;
}

// Form types
export interface FormData {
    [key: string]: string | number | boolean | null;
}

export interface FormErrors {
    [key: string]: string[];
}

export interface FormState<T extends FormData = FormData> {
    data: T;
    errors: FormErrors;
    isSubmitting: boolean;
    isValid: boolean;
    isDirty: boolean;
}

// API types
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    status: number;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string | number;
    details?: Record<string, any>;
}


export type ClassNameProp = string | string[] | Record<string, boolean> | null | undefined;

export type StyleProp = Record<string, string | number> | string | null | undefined;

// Generic component props
export interface BaseComponentProps {
    className?: ClassNameProp;
    style?: StyleProp;
    id?: string;
    'data-testid'?: string;
    children?: JSX.Element;
}
