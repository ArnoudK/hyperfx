import { describe, it, expect, beforeEach } from 'vitest';
import {
  onMount,
  onCleanup,
  createRoot,
  runWithContext,
  pushLifecycleContext,
  popLifecycleContext,
  flushMounts,
} from 'hyperfx';
import { createEffect } from 'hyperfx';

describe('Lifecycle Hooks', () => {
  beforeEach(() => {
    // Clean up any leftover contexts - safely
    for (let i = 0; i < 10; i++) {
       popLifecycleContext();
    }
  });

  describe('onMount', () => {
    it('should throw when called outside component context', () => {
      expect(() => {
        onMount(() => {});
      }).toThrow('onMount must be called within a component');
    });

    it('should register callback within context', () => {
      let mountCalled = false;
      
      pushLifecycleContext();
      onMount(() => {
        mountCalled = true;
      });
      
      expect(mountCalled).toBe(false);
      
      flushMounts();
      
      expect(mountCalled).toBe(true);
      
      popLifecycleContext();
    });

    it('should call mount cleanup on unmount', () => {
      let cleanupCalled = false;
      
      pushLifecycleContext();
      onMount(() => {
        return () => {
          cleanupCalled = true;
        };
      });
      flushMounts();
      
      expect(cleanupCalled).toBe(false);
      
      popLifecycleContext();
      
      expect(cleanupCalled).toBe(true);
    });

    it('should support multiple onMount calls', () => {
      let mount1Called = false;
      let mount2Called = false;
      
      pushLifecycleContext();
      onMount(() => {
        mount1Called = true;
      });
      onMount(() => {
        mount2Called = true;
      });
      flushMounts();
      
      expect(mount1Called).toBe(true);
      expect(mount2Called).toBe(true);
      
      popLifecycleContext();
    });

    it('should throw when called inside createEffect', () => {
      pushLifecycleContext();
      
      expect(() => {
        createEffect(() => {
          onMount(() => {});
        });
      }).toThrow('onMount cannot be called inside createEffect');
      
      popLifecycleContext();
    });
  });

  describe('onCleanup', () => {
    it('should throw when called outside context', () => {
      expect(() => {
        onCleanup(() => {});
      }).toThrow('onCleanup must be called within a component or effect');
    });

    it('should register cleanup callback', () => {
      let cleanupCalled = false;
      
      pushLifecycleContext();
      onCleanup(() => {
        cleanupCalled = true;
      });
      
      expect(cleanupCalled).toBe(false);
      
      popLifecycleContext();
      
      expect(cleanupCalled).toBe(true);
    });

    it('should call cleanup in LIFO order', () => {
      const order: string[] = [];
      
      pushLifecycleContext();
      onCleanup(() => order.push('first'));
      onCleanup(() => order.push('second'));
      onCleanup(() => order.push('third'));
      
      popLifecycleContext();
      
      expect(order).toEqual(['third', 'second', 'first']);
    });
  });

  describe('createRoot', () => {
    it('should create isolated lifecycle scope', () => {
      let cleanupCalled = false;
      let mountCalled = false;
      
      const { dispose } = createRoot(() => {
        onMount(() => {
          mountCalled = true;
          return () => {
            cleanupCalled = true;
          };
        });
        
        expect(mountCalled).toBe(false);
        
        flushMounts();
        
        expect(mountCalled).toBe(true);
        expect(cleanupCalled).toBe(false);
      });
      
      expect(cleanupCalled).toBe(false);
      
      dispose();
      
      expect(cleanupCalled).toBe(true);
    });

    it('should return result and dispose function', () => {
      const { result, dispose } = createRoot(() => {
        return 42;
      });
      
      expect(result).toBe(42);
      expect(typeof dispose).toBe('function');
      
      dispose();
    });
  });

  describe('runWithContext', () => {
    it('should execute function within lifecycle context', () => {
      let mountCalled = false;
      
      const result = runWithContext(() => {
        onMount(() => {
          mountCalled = true;
        });
        return 'test-result';
      });
      
      expect(result).toBe('test-result');
      expect(mountCalled).toBe(false);
      
      flushMounts();
      
      expect(mountCalled).toBe(true);
      
      popLifecycleContext();
    });
  });

  describe('nested contexts', () => {
    it('should handle nested component contexts', () => {
      let parentCleanup = false;
      let childCleanup = false;
      let parentMount = false;
      let childMount = false;
      
      // Parent component
      pushLifecycleContext();
      onMount(() => {
        parentMount = true;
      });
      onCleanup(() => {
        parentCleanup = true;
      });
      
      // Child component
      pushLifecycleContext();
      onMount(() => {
        childMount = true;
      });
      onCleanup(() => {
        childCleanup = true;
      });
      
      flushMounts();
      
      expect(parentMount).toBe(true);
      expect(childMount).toBe(true);
      
      // Pop child
      popLifecycleContext();
      
      expect(childCleanup).toBe(true);
      expect(parentCleanup).toBe(false);
      
      // Pop parent
      popLifecycleContext();
      
      expect(parentCleanup).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should not prevent other cleanups from running on error', () => {
      let cleanup1 = false;
      let cleanup2 = false;
      let cleanup3 = false;
      
      pushLifecycleContext();
      onCleanup(() => {
        cleanup1 = true;
      });
      onCleanup(() => {
        throw new Error('Cleanup error');
      });
      onCleanup(() => {
        cleanup2 = true;
      });
      onCleanup(() => {
        cleanup3 = true;
      });
      
      // Should not throw, but should log error
      popLifecycleContext();
      
      // All cleanups should have been attempted
      expect(cleanup3).toBe(true);
      expect(cleanup2).toBe(true);
      expect(cleanup1).toBe(true);
    });

    it('should pop context on error in runWithContext', () => {
      let cleanupCalled = false;
      
      expect(() => {
        runWithContext(() => {
          onCleanup(() => {
            cleanupCalled = true;
          });
          throw new Error('Test error');
        });
      }).toThrow('Test error');
      
      // Cleanup should have been called
      expect(cleanupCalled).toBe(true);
    });
  });
});
