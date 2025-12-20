
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createContext, useContext } from '../src/index';

describe('Context API', () => {

    it('provides default value when no provider is present', () => {
        const MyContext = createContext('default');
        const value = useContext(MyContext);
        expect(value).toBe('default');
    });

    it('provides value from provider to children', () => {
        const MyContext = createContext('default');
        let capturedValue: string | undefined;

        const Child = () => {
            capturedValue = useContext(MyContext);
            return 'child';
        };

        const App = () => MyContext.Provider({
            value: 'provided',
            children: () => Child()
        });

        // Execute
        App();

        expect(capturedValue).toBe('provided');
    });

    it('handles nested providers', () => {
        const MyContext = createContext('default');
        const values: string[] = [];

        const Child = (id: string) => {
            values.push(`${id}:${useContext(MyContext)}`);
            return 'child';
        };

        const App = () => MyContext.Provider({
            value: 'outer',
            children: () => [
                Child('outer-child'),
                MyContext.Provider({
                    value: 'inner',
                    children: () => Child('inner-child')
                })
            ]
        });

        App();

        expect(values).toContain('outer-child:outer');
        expect(values).toContain('inner-child:inner');
    });

    it('restores previous value after provider exits', () => {
        const MyContext = createContext('default');
        let afterValue: string | undefined;

        MyContext.Provider({
            value: 'provided',
            children: () => 'child'
        });

        afterValue = useContext(MyContext);
        expect(afterValue).toBe('default');
    });
});
