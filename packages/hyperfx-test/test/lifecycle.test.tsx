import { describe, it, expect } from 'vitest';
import {
  onMount,
  onCleanup,
  createRoot,
  runWithContext,
  flushMounts,
} from 'hyperfx';
import { createEffect } from 'hyperfx';

describe('Lifecycle Hooks', () => {
  describe('onMount', () => {
    it('should register callback within owner context', () => {
      let mountCalled = false;

      createRoot(() => {
        onMount(() => {
          mountCalled = true;
        });
        expect(mountCalled).toBe(false);
        flushMounts();
        expect(mountCalled).toBe(true);
      });
    });

    it('should call mount cleanup on dispose', () => {
      let cleanupCalled = false;

      createRoot(() => {
        onMount(() => {
          return () => {
            cleanupCalled = true;
          };
        });
        flushMounts();
        expect(cleanupCalled).toBe(false);
      });

      expect(cleanupCalled).toBe(true);
    });

    it('should support multiple onMount calls', () => {
      let mount1Called = false;
      let mount2Called = false;

      createRoot(() => {
        onMount(() => {
          mount1Called = true;
        });
        onMount(() => {
          mount2Called = true;
        });
        flushMounts();

        expect(mount1Called).toBe(true);
        expect(mount2Called).toBe(true);
      });
    });

    it('should throw when called inside createEffect', () => {
      expect(() => {
        createRoot(() => {
          createEffect(() => {
            onMount(() => {});
          });
        });
      }).toThrow('onMount cannot be called inside createEffect');
    });

    it('should throw when called outside component context', () => {
      expect(() => {
        onMount(() => {});
      }).toThrow('onMount must be called within a component');
    });
  });

  describe('onCleanup', () => {
    it('should register cleanup callback', () => {
      let cleanupCalled = false;

      createRoot(() => {
        onCleanup(() => {
          cleanupCalled = true;
        });
        expect(cleanupCalled).toBe(false);
      });

      expect(cleanupCalled).toBe(true);
    });

    it('should call cleanup in LIFO order', () => {
      const order: string[] = [];

      createRoot(() => {
        onCleanup(() => order.push('first'));
        onCleanup(() => order.push('second'));
        onCleanup(() => order.push('third'));
      });

      expect(order).toEqual(['third', 'second', 'first']);
    });
  });

  describe('createRoot', () => {
    it('should create isolated lifecycle scope', () => {
      let cleanupCalled = false;
      let mountCalled = false;

      createRoot(() => {
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

      createRoot(() => {
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
      });
    });
  });

  describe('nested contexts', () => {
    it('should handle nested component contexts', () => {
      let parentCleanup = false;
      let childCleanup = false;
      let parentMount = false;
      let childMount = false;

      createRoot(() => {
        onMount(() => {
          parentMount = true;
        });
        onCleanup(() => {
          parentCleanup = true;
        });

        createRoot(() => {
          onMount(() => {
            childMount = true;
          });
          onCleanup(() => {
            childCleanup = true;
          });

          flushMounts();
          expect(parentMount).toBe(true);
          expect(childMount).toBe(true);
        });

        expect(childCleanup).toBe(true);
        expect(parentCleanup).toBe(false);
      });

      expect(parentCleanup).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should not prevent other cleanups from running on error', () => {
      let cleanup1 = false;
      let cleanup2 = false;
      let cleanup3 = false;

      createRoot(() => {
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
      });

      expect(cleanup3).toBe(true);
      expect(cleanup2).toBe(true);
      expect(cleanup1).toBe(true);
    });

    it('should pop context on error in runWithContext', () => {
      let cleanupCalled = false;

      expect(() => {
        createRoot(() => {
          runWithContext(() => {
            onCleanup(() => {
              cleanupCalled = true;
            });
            throw new Error('Test error');
          });
        });
      }).toThrow('Test error');

      expect(cleanupCalled).toBe(true);
    });
  });
});
