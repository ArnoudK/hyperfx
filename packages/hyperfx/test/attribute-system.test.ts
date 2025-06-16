
/**
 * Test suite for the type-safe attribute system
 * These tests validate that our attribute types work correctly at runtime
 * and provide the expected type safety
 */

import {
    Input,
    Form,
    Label,
    Button,
    Img,
    A,
    TextArea,
    Select,
    Option,
    H1,
    P,
    Div,
    t,
    booleanAttrs
} from '../src/index';

// Test helper to check if element was created correctly
function expectElement(element: Element, tagName: string, attributes?: Record<string, any>) {
    if (element.tagName.toLowerCase() !== tagName.toLowerCase()) {
        throw new Error(`Expected ${tagName}, got ${element.tagName}`);
    }

    if (attributes) {
        for (const [key, value] of Object.entries(attributes)) {

            const actualValue = element.getAttribute(key);

            if (booleanAttrs.has(key)) {
                // For boolean attributes, check if they are present
                if (!element.hasAttribute(key)) {
                    throw new Error(`Expected ${key} to be present, but it is not`);
                }
            } else if (actualValue !== String(value)) {
                throw new Error(`Expected ${key}="${value}", got "${actualValue}"`);
            }
        }
    }
}

// Test basic element creation
export function testBasicElements() {
    console.log('Testing basic element creation...');

    // Test Input element
    const input = Input({
        type: 'email',
        placeholder: 'Enter email',
        required: true,
        'aria-label': 'Email address'
    });
    expectElement(input, 'input', {
        type: 'email',
        placeholder: 'Enter email',
        required: 'true',
        'aria-label': 'Email address'
    });

    // Test Button element
    const button = Button({
        type: 'submit',
        disabled: false,
        'aria-expanded': 'false'
    }, [t('Submit')]);
    expectElement(button, 'button', {
        type: 'submit',
        'aria-expanded': 'false'
    });

    console.log('✅ Basic elements test passed');
}

// Test strict attribute requirements
export function testStrictAttributes() {
    console.log('Testing strict attribute requirements...');

    // Test image with required src and alt
    const img = Img({
        src: '/test.jpg',
        alt: 'Test image',
        width: 200,
        loading: 'lazy'
    });
    expectElement(img, 'img', {
        src: '/test.jpg',
        alt: 'Test image',
        width: '200',
        loading: 'lazy'
    });

    // Test link with required href
    const link = A({
        href: '/test',
        target: '_blank',
        'aria-current': 'page'
    }, [t('Test Link')]);
    expectElement(link, 'a', {
        href: '/test',
        target: '_blank',
        'aria-current': 'page'
    });

    console.log('✅ Strict attributes test passed');
}

// Test form elements
export function testFormElements() {
    console.log('Testing form elements...');

    // Test form
    const form = Form({
        action: '/submit',
        method: 'post',
        enctype: 'multipart/form-data'
    }, [
        Label({
            'for': 'username'
        }, [t('Username:')]),

        Input({
            id: 'username',
            type: 'text',
            name: 'username',
            required: true
        }),

        TextArea({
            name: 'message',
            rows: 5,
            cols: 40,
            placeholder: 'Your message...'
        }),

        Select({
            name: 'category',
            required: true
        }, [
            Option({
                value: 'general',
                selected: true
            }, [t('General')]),

            Option({
                value: 'support'
            }, [t('Support')])
        ])
    ]);

    expectElement(form, 'form', {
        action: '/submit',
        method: 'post',
        enctype: 'multipart/form-data'
    });

    // Check nested elements
    const label = form.querySelector('label');
    if (!label) throw new Error('Label not found');
    expectElement(label, 'label', { for: 'username' });

    const input = form.querySelector('input');
    if (!input) throw new Error('Input not found');
    expectElement(input, 'input', {
        id: 'username',
        type: 'text',
        name: 'username',
        required: 'true'
    });

    console.log('✅ Form elements test passed');
}

// Test ARIA attributes
export function testAriaAttributes() {
    console.log('Testing ARIA attributes...');

    const accessibleButton = Button({
        type: 'button',
        'aria-label': 'Close dialog',
        'aria-expanded': 'false',
        'aria-haspopup': 'dialog',
        role: 'button'
    }, [t('×')]);

    expectElement(accessibleButton, 'button', {
        type: 'button',
        'aria-label': 'Close dialog',
        'aria-expanded': 'false',
        'aria-haspopup': 'dialog',
        role: 'button'
    });

    console.log('✅ ARIA attributes test passed');
}

// Test semantic elements
export function testSemanticElements() {
    console.log('Testing semantic elements...');

    const heading = H1({
        id: 'main-title',
        class: 'title',
        'aria-level': '1'
    }, [t('Main Title')]);

    expectElement(heading, 'h1', {
        id: 'main-title',
        class: 'title',
        'aria-level': '1'
    });

    const paragraph = P({
        class: 'content',
        'data-test': 'paragraph'
    }, [t('This is a paragraph.')]);

    expectElement(paragraph, 'p', {
        class: 'content',
        'data-test': 'paragraph'
    });

    console.log('✅ Semantic elements test passed');
}

// Test boolean attributes
export function testBooleanAttributes() {
    console.log('Testing boolean attributes...');

    // Test various boolean attribute formats
    const input1 = Input({
        type: 'checkbox',
        checked: true,
        disabled: false,
        readonly: true
    });

    // Boolean true should set the attribute
    if (!input1.hasAttribute('checked')) {
        throw new Error('Expected checked attribute to be set');
    }

    // Boolean false should not set the attribute (for most boolean attrs)
    if (input1.hasAttribute('disabled')) {
        throw new Error('Expected disabled attribute to not be set when false');
    }

    // Boolean true should set readonly
    if (!input1.hasAttribute('readonly')) {
        throw new Error('Expected readonly attribute to be set');
    }

    console.log('✅ Boolean attributes test passed');
}

// Test numeric attributes
export function testNumericAttributes() {
    console.log('Testing numeric attributes...');

    const input = Input({
        type: 'number',
        min: 0,
        max: 100,
        step: 5,
        tabindex: 1
    });

    expectElement(input, 'input', {
        type: 'number',
        min: '0',
        max: '100',
        step: '5',
        tabindex: '1'
    });

    console.log('✅ Numeric attributes test passed');
}

// Test data attributes
export function testDataAttributes() {
    console.log('Testing data attributes...');

    const div = Div({
        'data-test-id': 'my-component',
        'data-value': 42,
        'data-active': true,
        class: 'component'
    }, [t('Content')]);

    expectElement(div, 'div', {
        'data-test-id': 'my-component',
        'data-value': '42',
        'data-active': 'true',
        class: 'component'
    });

    console.log('✅ Data attributes test passed');
}

// Main test runner
export function runAttributeSystemTests() {
    console.log('🧪 Running type-safe attribute system tests...\n');

    try {
        testBasicElements();
        testStrictAttributes();
        testFormElements();
        testAriaAttributes();
        testSemanticElements();
        testBooleanAttributes();
        testNumericAttributes();
        testDataAttributes();

        console.log('\n✅ All attribute system tests passed!');
        console.log('🎉 Type-safe attribute system is working correctly');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
        throw error;
    }
}

// Export for use in other test files
export {
    expectElement
};
