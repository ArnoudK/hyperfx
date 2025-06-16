# Type-Safe Attribute System Documentation

## Overview

The hyperfx library now features a comprehensive type-safe attribute system that provides:

- **Compile-time validation** of HTML attributes
- **Required attributes** for elements that need them (e.g., `src` and `alt` for images)
- **ARIA attributes** for accessibility
- **Proper boolean and numeric attribute handling**
- **Element-specific attribute types** with intelligent defaults

## Key Features

### 1. Required Base Types with Partial Application

All attribute interfaces define required properties in their base types, then use `Partial<>` when applied to elements. This ensures:

- Complete type definitions for all possible attributes
- Optional usage in practice (developer convenience)
- Better IDE autocomplete and documentation

```typescript
// Base type - all properties required
export interface InputAttributes {
  type: "text" | "email" | "password" | /* ... */;
  name: string;
  value: string | number;
  placeholder: string;
  // ... all other input attributes
}

// Applied type - all properties optional for convenience
export type InputElementAttributes = GlobalAttr & Partial<EventHandlers> & Partial<InputAttributes>;
```

### 2. Strict Attribute Types for Critical Elements

Some elements require certain attributes for proper functionality or accessibility:

```typescript
// Images require src and alt for accessibility
export type StrictImageAttributes = GlobalAttr & Partial<MediaAttributes> & {
  src: string;  // Required
  alt: string;  // Required for accessibility
};

// Links require href
export type StrictLinkAttributes = GlobalAttr & Partial<LinkAttributes> & {
  href: string; // Required
};
```

### 3. Comprehensive ARIA Support

Full ARIA attribute support for accessibility:

```typescript
export interface AriaAttributes {
  'aria-label': string;
  'aria-labelledby': string;
  'aria-describedby': string;
  'aria-expanded': "true" | "false";
  'aria-hidden': "true" | "false";
  'aria-live': "polite" | "assertive" | "off";
  // ... 20+ more ARIA attributes
}
```

### 4. Element-Specific Attribute Types

Each HTML element has its own optimized attribute type:

```typescript
export type AttributesForElement<T extends keyof HTMLElementTagNameMap> = 
  T extends 'input' ? InputElementAttributes :
  T extends 'form' ? FormElementAttributes :
  T extends 'a' ? LinkElementAttributes :
  T extends 'img' ? StrictImageAttributes :
  T extends 'button' ? ButtonElementAttributes :
  // ... mappings for all HTML elements
  ElementAttributes;
```

## Usage Examples

### Basic Element Creation

```typescript
import { Input, Form, Label, Button, Img, A } from 'hyperfx';

// Type-safe input with validation
const emailInput = Input({
  type: 'email',                    // ✅ Valid input type
  placeholder: 'your@email.com',    // ✅ String attribute
  required: true,                   // ✅ Boolean attribute
  maxlength: 100,                   // ✅ Numeric attribute
  'aria-label': 'Email address'     // ✅ ARIA attribute
});

// Image with required attributes
const logo = Img({
  src: '/logo.png',                 // ✅ Required
  alt: 'Company Logo',              // ✅ Required for accessibility
  width: 200,                       // ✅ Optional
  loading: 'lazy'                   // ✅ Modern loading attribute
});

// Link with required href
const navLink = A({
  href: '/about',                   // ✅ Required
  'aria-current': 'page'            // ✅ ARIA attribute
}, [t('About Us')]);
```

### Form Elements

```typescript
const contactForm = Form({
  action: '/submit',                // ✅ Form action
  method: 'post',                   // ✅ HTTP method
  enctype: 'multipart/form-data'    // ✅ Encoding type
}, [
  Label({
    htmlFor: 'name'                 // ✅ Associates with input
  }, [t('Your Name:')]),
  
  Input({
    id: 'name',                     // ✅ Matches label
    type: 'text',                   // ✅ Input type
    name: 'name',                   // ✅ Form field name
    required: true,                 // ✅ Validation
    'aria-describedby': 'name-help' // ✅ Accessibility
  }),
  
  Button({
    type: 'submit',                 // ✅ Button type
    'aria-label': 'Submit form'     // ✅ Accessibility
  }, [t('Submit')])
]);
```

### Accessibility-First Approach

```typescript
const accessibleButton = Button({
  type: 'button',
  'aria-label': 'Close dialog',     // ✅ Screen reader text
  'aria-expanded': 'false',         // ✅ State information
  role: 'button'                    // ✅ Semantic role
}, [t('×')]);

const navigation = Nav({
  role: 'navigation',               // ✅ Landmark role
  'aria-label': 'Main navigation'   // ✅ Navigation label
}, [
  A({ href: '/', 'aria-current': 'page' }, [t('Home')]),
  A({ href: '/about' }, [t('About')]),
  A({ href: '/contact' }, [t('Contact')])
]);
```

## TypeScript Validation

The system prevents common mistakes at compile time:

```typescript
// ❌ These would cause TypeScript compilation errors:

// Missing required attributes
const invalidImage = Img({
  width: 200  // ❌ Missing required src and alt
});

// Missing required href
const invalidLink = A({
  target: '_blank'  // ❌ Missing required href
});

// Invalid attribute values
const invalidInput = Input({
  type: 'invalid-type'  // ❌ Not a valid input type
});

// Invalid ARIA values
const invalidButton = Button({
  'aria-expanded': 'maybe'  // ❌ Must be "true" or "false"
});
```

## Element Coverage

The type-safe attribute system covers:

### Form Elements
- `Input` - All input types with proper validation
- `Form` - Form submission and validation
- `Label` - Form field labeling
- `TextArea` - Multi-line text input
- `Select` - Dropdown selection
- `Option` - Select options
- `Button` - Form buttons and interactions

### Media Elements
- `Img` - Images with required alt text
- `Video` - Video elements (planned)
- `Audio` - Audio elements (planned)

### Semantic Elements
- `Article`, `Section`, `Nav`, `Header`, `Footer`
- `Main`, `Aside`, `Address`
- `H1`, `H2`, `H3`, `H4`, `H5`, `H6`

### Text Elements
- `P`, `Span`, `A` (links)
- `Strong`, `Em`, `Code`, `Pre`
- `Blockquote`, `Q`, `Cite`

### Table Elements
- `Table`, `Thead`, `Tbody`, `Tfoot`
- `Tr`, `Td`, `Th`
- `Caption`, `Colgroup`, `Col`

### Layout Elements
- `Div` - Generic container
- `Br`, `Hr` - Line breaks and rules

## Benefits

1. **Fewer Runtime Errors** - Catch attribute mistakes at compile time
2. **Better Accessibility** - ARIA attributes are discoverable and type-safe
3. **Enhanced Developer Experience** - Full autocomplete for all HTML attributes
4. **Documentation** - Type definitions serve as inline documentation
5. **Consistency** - Standardized attribute handling across all elements
6. **Future-Proof** - Easy to extend with new HTML attributes and elements

## Implementation Details

- **File Structure**: All types defined in `src/elem/attr.ts`
- **Element Functions**: Individual files for logical groupings (input.ts, text.ts, etc.)
- **Backwards Compatibility**: Existing code continues to work
- **Bundle Size**: Type information is compile-time only, zero runtime overhead
- **Performance**: Pure compile-time type checking with no runtime validation overhead

The type-safe attribute system represents a significant step forward in making hyperfx both more powerful and more reliable for building modern web applications.
