/**
 * Runtime DOM helpers for compiled HyperFX code
 * 
 * These functions are used by the compiler output to efficiently
 * create and update DOM elements.
 * 
 * This file re-exports all runtime DOM functionality from modular sub-files.
 */

// Types
export type { Insertable, InsertableValue, InsertResult } from './insert';

// Core functionality
export { 
  insert, 
  markerSlot,
  insertExpression
} from './insert';

export { 
  createComponent, 
  unwrapComponent 
} from './component';

export { 
  template 
} from './template';

export { 
  spread, 
  assign, 
  bindProp, 
  setProp 
} from './spread';

export { 
  delegate, 
  undelegate, 
  undelegateAll 
} from './events';

export { 
  effect, 
  effectOn, 
  show, 
  mapArray, 
  mapArrayKeyed, 
  forLoop 
} from './control-flow';

export { 
  unwrapProps, 
  findMarker 
} from './utils';

// Cache (exported for advanced use cases)
export { LRUCache } from './cache';
