// ========================================
// ENHANCED EVENT TYPE DEFINITIONS
// ========================================

/**
 * Base event handler type with proper event typing
 */
export type EventHandler<E extends Event = Event> = (event: E) => void;

/**
 * Specific event handler types for better type safety
 */
export type ClipboardEventHandler = EventHandler<ClipboardEvent>;
export type CompositionEventHandler = EventHandler<CompositionEvent>;
export type DragEventHandler = EventHandler<DragEvent>;
export type FocusEventHandler = EventHandler<FocusEvent>;
export type FormEventHandler = EventHandler<Event>;
export type ChangeEventHandler = EventHandler<Event>;
export type InputEventHandler = EventHandler<InputEvent>;
export type InvalidEventHandler = EventHandler<Event>;
export type KeyboardEventHandler = EventHandler<KeyboardEvent>;
export type MouseEventHandler = EventHandler<MouseEvent>;
export type PointerEventHandler = EventHandler<PointerEvent>;
export type SelectEventHandler = EventHandler<Event>;
export type SubmitEventHandler = EventHandler<SubmitEvent>;
export type TouchEventHandler = EventHandler<TouchEvent>;
export type ScrollEventHandler = EventHandler<Event>;
export type WheelEventHandler = EventHandler<WheelEvent>;
export type AnimationEventHandler = EventHandler<AnimationEvent>;
export type TransitionEventHandler = EventHandler<TransitionEvent>;

// ========================================
// MEDIA ELEMENT EVENT HANDLERS
// ========================================

export type MediaEventHandler = EventHandler<Event>;
export type AudioEventHandler = MediaEventHandler;
export type VideoEventHandler = MediaEventHandler;

// Specific media events
export type LoadStartEventHandler = MediaEventHandler;
export type ProgressEventHandler = MediaEventHandler;
export type SuspendEventHandler = MediaEventHandler;
export type AbortEventHandler = MediaEventHandler;
export type MediaErrorEventHandler = MediaEventHandler;
export type EmptiedEventHandler = MediaEventHandler;
export type StalledEventHandler = MediaEventHandler;
export type LoadedMetadataEventHandler = MediaEventHandler;
export type LoadedDataEventHandler = MediaEventHandler;
export type CanPlayEventHandler = MediaEventHandler;
export type CanPlayThroughEventHandler = MediaEventHandler;
export type PlayingEventHandler = MediaEventHandler;
export type WaitingEventHandler = MediaEventHandler;
export type SeekingEventHandler = MediaEventHandler;
export type SeekedEventHandler = MediaEventHandler;
export type EndedEventHandler = MediaEventHandler;
export type DurationChangeEventHandler = MediaEventHandler;
export type TimeUpdateEventHandler = MediaEventHandler;
export type PlayEventHandler = MediaEventHandler;
export type PauseEventHandler = MediaEventHandler;
export type RateChangeEventHandler = MediaEventHandler;
export type ResizeEventHandler = MediaEventHandler;
export type VolumeChangeEventHandler = MediaEventHandler;

// ========================================
// IMAGE EVENT HANDLERS
// ========================================

export type ImageEventHandler = EventHandler<Event>;
export type LoadEventHandler = ImageEventHandler;
export type ErrorEventHandler = ImageEventHandler; // Reused from media

// ========================================
// FORM EVENT HANDLERS
// ========================================

export type FormEventHandlerDetailed = EventHandler<Event>;
export type ResetEventHandler = FormEventHandler;
export type SubmitEventHandlerDetailed = SubmitEventHandler;

// ========================================
// WINDOW & DOCUMENT EVENT HANDLERS
// ========================================

export type WindowEventHandler = EventHandler<Event>;
export type DocumentEventHandler = EventHandler<Event>;

// Specific window events
export type BeforeUnloadEventHandler = EventHandler<BeforeUnloadEvent>;
export type HashChangeEventHandler = EventHandler<HashChangeEvent>;
export type PopStateEventHandler = EventHandler<PopStateEvent>;
export type PageTransitionEventHandler = EventHandler<PageTransitionEvent>;
export type StorageEventHandler = EventHandler<StorageEvent>;
export type MessageEventHandler = EventHandler<MessageEvent>;
export type PromiseRejectionEventHandler = EventHandler<PromiseRejectionEvent>;

// ========================================
// UTILITY TYPES FOR EVENT HANDLERS
// ========================================

/**
 * Extract event type from event handler
 */
export type EventFromHandler<T> = T extends EventHandler<infer E> ? E : Event;

/**
 * Create a typed event handler map
 */
export type EventHandlerMap = {
  [K in keyof HTMLElementEventMap]?: EventHandler<HTMLElementEventMap[K]>;
};

/**
 * Generic event handler for any event type
 */
export type GenericEventHandler = EventHandler<any>;