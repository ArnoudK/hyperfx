import type { ReactiveString, ReactiveBoolean, ReactiveValue } from './base';

import type { EventHandler } from './events';

// ========================================
// GLOBAL ATTRIBUTES - VALID ON ALL HTML ELEMENTS
// ========================================

export interface GlobalHTMLAttributes {
  // Core attributes
  id?: ReactiveString;
  class?: ReactiveString;
  style?: ReactiveValue<string | Partial<CSSStyleDeclaration>>;
  title?: ReactiveString;
  lang?: ReactiveString;
  dir?: ReactiveString;
  contenteditable?: ReactiveBoolean | ReactiveString;
  draggable?: ReactiveBoolean | ReactiveString;
  hidden?: ReactiveBoolean;
  inert?: ReactiveBoolean;
  spellcheck?: ReactiveBoolean | ReactiveString;
  tabindex?: ReactiveValue<string | number>;
  translate?: ReactiveString;

  // Content attributes (for text manipulation)
  innerHTML?: ReactiveString;
  textContent?: ReactiveString;

  // ARIA attributes with enhanced typing
  role?: ARIARole;
  'aria-activedescendant'?: ReactiveString;
  'aria-atomic'?: ReactiveBoolean | ReactiveString;
  'aria-autocomplete'?: ARIAAutocomplete;
  'aria-busy'?: ReactiveBoolean | ReactiveString;
  'aria-checked'?: ReactiveBoolean | ReactiveString | 'mixed';
  'aria-colcount'?: ReactiveValue<string | number>;
  'aria-colindex'?: ReactiveValue<string | number>;
  'aria-colspan'?: ReactiveValue<string | number>;
  'aria-controls'?: ReactiveString;
  'aria-current'?: ARIACurrent;
  'aria-describedby'?: ReactiveString;
  'aria-details'?: ReactiveString;
  'aria-disabled'?: ReactiveBoolean | ReactiveString;
  'aria-errormessage'?: ReactiveString;
  'aria-expanded'?: ReactiveBoolean | ReactiveString;
  'aria-flowto'?: ReactiveString;
  'aria-grabbed'?: ReactiveBoolean | ReactiveString;
  'aria-haspopup'?: ReactiveBoolean | ReactiveString | ARIAPopupType;
  'aria-hidden'?: ReactiveBoolean | ReactiveString;
  'aria-invalid'?: ReactiveBoolean | ReactiveString | 'grammar' | 'spelling';
  'aria-keyshortcuts'?: ReactiveString;
  'aria-label'?: ReactiveString;
  'aria-labelledby'?: ReactiveString;
  'aria-level'?: ReactiveValue<string | number>;
  'aria-live'?: ARIALiveRegion;
  'aria-modal'?: ReactiveBoolean | ReactiveString;
  'aria-multiline'?: ReactiveBoolean | ReactiveString;
  'aria-multiselectable'?: ReactiveBoolean | ReactiveString;
  'aria-orientation'?: 'horizontal' | 'vertical' | ReactiveString;
  'aria-owns'?: ReactiveString;
  'aria-placeholder'?: ReactiveString;
  'aria-posinset'?: ReactiveValue<string | number>;
  'aria-pressed'?: ReactiveBoolean | ReactiveString | 'mixed';
  'aria-readonly'?: ReactiveBoolean | ReactiveString;
  'aria-relevant'?: ARIARelevant;
  'aria-required'?: ReactiveBoolean | ReactiveString;
  'aria-roledescription'?: ReactiveString;
  'aria-rowcount'?: ReactiveValue<string | number>;
  'aria-rowindex'?: ReactiveValue<string | number>;
  'aria-rowspan'?: ReactiveValue<string | number>;
  'aria-selected'?: ReactiveBoolean | ReactiveString;
  'aria-setsize'?: ReactiveValue<string | number>;
  'aria-sort'?: ARIASort;
  'aria-valuemax'?: ReactiveValue<string | number>;
  'aria-valuemin'?: ReactiveValue<string | number>;
  'aria-valuenow'?: ReactiveValue<string | number>;
  'aria-valuetext'?: ReactiveString;

  // Data attributes
  'data-*'?: ReactiveString;

  // Event handlers with enhanced typing
  onclick?: EventHandler<MouseEvent>;
  oninput?: EventHandler<InputEvent>;
  onchange?: EventHandler<Event>;
  onsubmit?: EventHandler<SubmitEvent>;
  onfocus?: EventHandler<FocusEvent>;
  onblur?: EventHandler<FocusEvent>;
  onkeydown?: EventHandler<KeyboardEvent>;
  onkeyup?: EventHandler<KeyboardEvent>;
  onkeypress?: EventHandler<KeyboardEvent>;
  onmouseenter?: EventHandler<MouseEvent>;
  onmouseleave?: EventHandler<MouseEvent>;
  onmousemove?: EventHandler<MouseEvent>;
  onmousedown?: EventHandler<MouseEvent>;
  onmouseup?: EventHandler<MouseEvent>;
  ontouchstart?: EventHandler<TouchEvent>;
  ontouchend?: EventHandler<TouchEvent>;
  ontouchmove?: EventHandler<TouchEvent>;
  onscroll?: EventHandler<Event>;
  onresize?: EventHandler<Event>;
  onload?: EventHandler<Event>;
  onerror?: EventHandler<Event>;
}

// ========================================
// ARIA TYPE DEFINITIONS
// ========================================

export type ARIARole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'meter'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem';

export type ARIAAutocomplete = 'none' | 'inline' | 'list' | 'both';
export type ARIACurrent = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
export type ARIAPopupType = 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
export type ARIALiveRegion = 'off' | 'assertive' | 'polite';
export type ARIARelevant = 'additions' | 'removals' | 'text' | 'all';
export type ARIASort = 'none' | 'ascending' | 'descending' | 'other';

// ========================================
// ENHANCED EVENT TYPES
// ========================================

