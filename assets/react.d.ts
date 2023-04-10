/// This is a React fake declaration that allows you to use JSX syntax in TypeScript with the TSB
/// system without actually being connected to the React ecosystem. When using the jsx flag,
/// TypeScript depends on the React module. In addition, the JSX core elements need to be
/// declared in the JSX.IntrinsicElements interface. For more information, please refer to
/// https://www.typescriptlang.org/docs/handbook/jsx.html.
///
/// It is important to note that this file does not rely on any external React libraries or modules,
/// and it is not developed by the React team. It is simply a standalone file that defines a fake
/// React System.
///
/// Most of the code is copied but modified from the following sources:
/// -------------------------------------------------------------------------------------
/// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts
///     Type definitions for React 18.0
///     Project: http://facebook.github.io/react/
///     Definitions by: Asana <https://asana.com>
///                     AssureSign <http://www.assuresign.com>
///                     Microsoft <https://microsoft.com>
///                     John Reilly <https://github.com/johnnyreilly>
///                     Benoit Benezech <https://github.com/bbenezech>
///                     Patricio Zavolinsky <https://github.com/pzavolinsky>
///                     Eric Anderson <https://github.com/ericanderson>
///                     Dovydas Navickas <https://github.com/DovydasNavickas>
///                     Josh Rutherford <https://github.com/theruther4d>
///                     Guilherme Hübner <https://github.com/guilhermehubner>
///                     Ferdy Budhidharma <https://github.com/ferdaber>
///                     Johann Rakotoharisoa <https://github.com/jrakotoharisoa>
///                     Olivier Pascal <https://github.com/pascaloliv>
///                     Martin Hochel <https://github.com/hotell>
///                     Frank Li <https://github.com/franklixuefei>
///                     Jessica Franco <https://github.com/Jessidhia>
///                     Saransh Kataria <https://github.com/saranshkataria>
///                     Kanitkorn Sujautra <https://github.com/lukyth>
///                     Sebastian Silbermann <https://github.com/eps1lon>
///                     Kyle Scully <https://github.com/zieka>
///                     Cong Zhang <https://github.com/dancerphil>
///                     Dimitri Mitropoulos <https://github.com/dimitropoulos>
///                     JongChan Choi <https://github.com/disjukr>
///                     Victor Magalhães <https://github.com/vhfmag>
///                     Dale Tan <https://github.com/hellatan>
///                     Priyanshu Rav <https://github.com/priyanshurav>
///                     Dmitry Semigradsky <https://github.com/Semigradsky>
///     Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
///     TypeScript Version: 2.8
///
/// -------------------------------------------------------------------------------------
/// https://github.com/frenic/csstype/blob/master/index.d.ts
///
/// -------------------------------------------------------------------------------------
/// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/prop-types/index.d.ts
///     Type definitions for prop-types 15.7
///     Project: https://github.com/reactjs/prop-types, https://facebook.github.io/react
///     Definitions by: DovydasNavickas <https://github.com/DovydasNavickas>
///                     Ferdy Budhidharma <https://github.com/ferdaber>
///                     Sebastian Silbermann <https://github.com/eps1lon>
///     Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
///     TypeScript Version: 2.8
///
/// -------------------------------------------------------------------------------------
/// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/prop-types/index.d.ts


type NativeAnimationEvent = AnimationEvent;
type NativeClipboardEvent = ClipboardEvent;
type NativeCompositionEvent = CompositionEvent;
type NativeDragEvent = DragEvent;
type NativeFocusEvent = FocusEvent;
type NativeKeyboardEvent = KeyboardEvent;
type NativeMouseEvent = MouseEvent;
type NativeTouchEvent = TouchEvent;
type NativePointerEvent = PointerEvent;
type NativeTransitionEvent = TransitionEvent;
type NativeUIEvent = UIEvent;
type NativeWheelEvent = WheelEvent;
type Booleanish = boolean | 'true' | 'false';

export declare namespace React {


    type ElementType<P = any> =
        {
            [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
        }[keyof JSX.IntrinsicElements] |
        ComponentType<P>;
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;

    type JSXElementConstructor<P> =
        | ((props: P) => ReactElement<any, any> | null)
        | (new (props: P) => Component<any, any>);

    interface RefObject<T> {
        readonly current: T | null;
    }


    type RefCallback<T> = { bivarianceHack(instance: T | null): void }["bivarianceHack"];
    type Ref<T> = RefCallback<T> | RefObject<T> | null;
    type LegacyRef<T> = string | Ref<T>;
    type ComponentState = any;

    type Key = string | number;

    interface Attributes {
        key?: Key | null | undefined;
    }

    interface RefAttributes<T> extends Attributes {
        ref?: Ref<T> | undefined;
    }

    interface ClassAttributes<T> extends Attributes {
        ref?: LegacyRef<T> | undefined;
    }

    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
        type: T;
        props: P;
        key: Key | null;
    }

    interface DOMElement<P extends HTMLAttributes<T> | SVGAttributes<T>, T extends Element> extends ReactElement<P, string> {
        ref: LegacyRef<T>;
    }

    interface DetailedReactHTMLElement<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMElement<P, T> {
        type: keyof ReactHTML;
    }


    interface ReactSVGElement extends DOMElement<SVGAttributes<SVGElement>, SVGElement> {
        type: keyof ReactSVG;
    }

    interface ReactPortal extends ReactElement {
        key: Key | null;
        children: ReactNode;
    }


    type DOMFactory<P extends DOMAttributes<T>, T extends Element> =
        (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]) => DOMElement<P, T>;

    interface DetailedHTMLFactory<P extends HTMLAttributes<T>, T extends HTMLElement> extends DOMFactory<P, T> {
        (props?: ClassAttributes<T> & P | null, ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    }

    interface SVGFactory extends DOMFactory<SVGAttributes<SVGElement>, SVGElement> {
        (props?: ClassAttributes<SVGElement> & SVGAttributes<SVGElement> | null, ...children: ReactNode[]): ReactSVGElement;
    }

    type ReactFragment = Iterable<ReactNode>;
    type ReactNode = ReactElement | string | number | ReactFragment | ReactPortal | boolean | null | undefined;


    interface ProviderProps<T> {
        value: T;
        children?: ReactNode | undefined;
    }

    interface ConsumerProps<T> {
        children: (value: T) => ReactNode;
    }


    interface ExoticComponent<P = {}> {
        /**
         * **NOTE**: Exotic components are not callable.
         */
        (props: P): (ReactElement | null);

        readonly $$typeof: symbol;
    }

    interface ProviderExoticComponent<P> extends ExoticComponent<P> {
        propTypes?: WeakValidationMap<P> | undefined;
    }


    type Provider<T> = ProviderExoticComponent<ProviderProps<T>>;
    type Consumer<T> = ExoticComponent<ConsumerProps<T>>;

    interface Context<T> {
        Provider: Provider<T>;
        Consumer: Consumer<T>;
        displayName?: string | undefined;
    }

    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
    }

    class Component<P, S> {
        static contextType?: Context<any> | undefined;

        constructor(props: Readonly<P> | P);
        constructor(props: P, context: any);
    }

    interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactElement<any, any> | null;

        propTypes?: WeakValidationMap<P> | undefined;
        contextTypes?: ValidationMap<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
        new(props: P, context?: any): Component<P, S>;

        propTypes?: WeakValidationMap<P> | undefined;
        contextType?: Context<any> | undefined;
        contextTypes?: ValidationMap<any> | undefined;
        childContextTypes?: ValidationMap<any> | undefined;
        defaultProps?: Partial<P> | undefined;
        displayName?: string | undefined;
    }

    interface ComponentLifecycle<P, S, SS = any> extends NewLifecycle<P, S, SS>, DeprecatedLifecycle<P, S> {
        componentDidMount?(): void;

        /**
         * Called to determine whether the change in props and state should trigger a re-render.
         *
         * `Component` always returns true.
         * `PureComponent` implements a shallow comparison on props and state and returns true if any
         * props or states have changed.
         *
         * If false is returned, `Component#render`, `componentWillUpdate`
         * and `componentDidUpdate` will not be called.
         */
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;

        /**
         * Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
         * cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.
         */
        componentWillUnmount?(): void;

        /**
         * Catches exceptions generated in descendant components. Unhandled exceptions will cause
         * the entire component tree to unmount.
         */
        componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
    }


    interface StaticLifecycle<P, S> {
        getDerivedStateFromProps?: GetDerivedStateFromProps<P, S> | undefined;
        getDerivedStateFromError?: GetDerivedStateFromError<P, S> | undefined;
    }

    type GetDerivedStateFromProps<P, S> =
    /**
     * Returns an update to a component's state based on its new props and old state.
     *
     * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
     */
        (nextProps: Readonly<P>, prevState: S) => Partial<S> | null;

    type GetDerivedStateFromError<P, S> =
    /**
     * This lifecycle is invoked after an error has been thrown by a descendant component.
     * It receives the error that was thrown as a parameter and should return a value to update state.
     *
     * Note: its presence prevents any of the deprecated lifecycle methods from being invoked
     */
        (error: any) => Partial<S> | null;


    interface NewLifecycle<P, S, SS> {
        /**
         * Runs before React applies the result of `render` to the document, and
         * returns an object to be given to componentDidUpdate. Useful for saving
         * things such as scroll position before `render` causes changes to it.
         *
         * Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
         * lifecycle events from running.
         */
        getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): SS | null;

        /**
         * Called immediately after updating occurs. Not called for the initial render.
         *
         * The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.
         */
        componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void;
    }

    interface DeprecatedLifecycle<P, S> {
        /**
         * Called immediately before mounting occurs, and before `Component#render`.
         * Avoid introducing any side-effects or subscriptions in this method.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use componentDidMount or the constructor instead; will stop working in React 17
         * @see https:
         * @see https:
         */
        componentWillMount?(): void;

        /**
         * Called immediately before mounting occurs, and before `Component#render`.
         * Avoid introducing any side-effects or subscriptions in this method.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use componentDidMount or the constructor instead
         * @see https:
         * @see https:
         */
        UNSAFE_componentWillMount?(): void;

        /**
         * Called when the component may be receiving new props.
         * React may call this even if props have not changed, so be sure to compare new and existing
         * props if you only want to handle changes.
         *
         * Calling `Component#setState` generally does not trigger this method.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use static getDerivedStateFromProps instead; will stop working in React 17
         * @see https:
         * @see https:
         */
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;

        /**
         * Called when the component may be receiving new props.
         * React may call this even if props have not changed, so be sure to compare new and existing
         * props if you only want to handle changes.
         *
         * Calling `Component#setState` generally does not trigger this method.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use static getDerivedStateFromProps instead
         * @see https:
         * @see https:
         */
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;

        /**
         * Called immediately before rendering when new props or state is received. Not called for the initial render.
         *
         * Note: You cannot call `Component#setState` here.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17
         * @see https:
         * @see https:
         */
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;

        /**
         * Called immediately before rendering when new props or state is received. Not called for the initial render.
         *
         * Note: You cannot call `Component#setState` here.
         *
         * This method will not stop working in React 17.
         *
         * Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
         * prevents this from being invoked.
         *
         * @deprecated 16.3, use getSnapshotBeforeUpdate instead
         * @see https:
         * @see https:
         */
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
    }

    type PropsWithoutRef<P> =


        P extends any ? ('ref' extends keyof P ? Omit<P, 'ref'> : P) : P;

    type PropsWithRef<P> =

        'ref' extends keyof P
            ? P extends { ref?: infer R | undefined }
                ? string extends R
                    ? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
                    : P
                : P
            : P;

    type ComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
        T extends JSXElementConstructor<infer P>
            ? P
            : T extends keyof JSX.IntrinsicElements
                ? JSX.IntrinsicElements[T]
                : {};
    type ComponentPropsWithRef<T extends ElementType> =
        T extends (new (props: infer P) => Component<any, any>)
            ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
            : PropsWithRef<ComponentProps<T>>;

    type LazyExoticComponent<T extends ComponentType<any>> = ExoticComponent<ComponentPropsWithRef<T>> & {
        readonly _result: T;
    };

    function lazy<T extends ComponentType<any>>(
        factory: () => Promise<{ default: T }>
    ): LazyExoticComponent<T>;


    interface BaseSyntheticEvent<E = object, C = any, T = any> {
        nativeEvent: E;
        currentTarget: C;
        target: T;
        bubbles: boolean;
        cancelable: boolean;
        defaultPrevented: boolean;
        eventPhase: number;
        isTrusted: boolean;

        preventDefault(): void;

        isDefaultPrevented(): boolean;

        stopPropagation(): void;

        isPropagationStopped(): boolean;

        persist(): void;

        timeStamp: number;
        type: string;
    }

    interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {
    }

    interface ClipboardEvent<T = Element> extends SyntheticEvent<T, NativeClipboardEvent> {
        clipboardData: DataTransfer;
    }

    interface CompositionEvent<T = Element> extends SyntheticEvent<T, NativeCompositionEvent> {
        data: string;
    }

    interface DragEvent<T = Element> extends MouseEvent<T, NativeDragEvent> {
        dataTransfer: DataTransfer;
    }

    interface PointerEvent<T = Element> extends MouseEvent<T, NativePointerEvent> {
        pointerId: number;
        pressure: number;
        tangentialPressure: number;
        tiltX: number;
        tiltY: number;
        twist: number;
        width: number;
        height: number;
        pointerType: 'mouse' | 'pen' | 'touch';
        isPrimary: boolean;
    }

    interface FocusEvent<Target = Element, RelatedTarget = Element> extends SyntheticEvent<Target, NativeFocusEvent> {
        relatedTarget: (EventTarget & RelatedTarget) | null;
        target: EventTarget & Target;
    }

    interface FormEvent<T = Element> extends SyntheticEvent<T> {
    }

    interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
        target: EventTarget & T;
    }

    export type ModifierKey =
        "Alt"
        | "AltGraph"
        | "CapsLock"
        | "Control"
        | "Fn"
        | "FnLock"
        | "Hyper"
        | "Meta"
        | "NumLock"
        | "ScrollLock"
        | "Shift"
        | "Super"
        | "Symbol"
        | "SymbolLock";

    interface KeyboardEvent<T = Element> extends UIEvent<T, NativeKeyboardEvent> {
        altKey: boolean;

        charCode: number;
        ctrlKey: boolean;
        code: string;

        /**
         * See [DOM Level 3 Events spec](https:
         */
        getModifierState(key: ModifierKey): boolean;

        /**
         * See the [DOM Level 3 Events spec](https:
         */
        key: string;

        keyCode: number;
        locale: string;
        location: number;
        metaKey: boolean;
        repeat: boolean;
        shiftKey: boolean;

        which: number;
    }

    interface MouseEvent<T = Element, E = NativeMouseEvent> extends UIEvent<T, E> {
        altKey: boolean;
        button: number;
        buttons: number;
        clientX: number;
        clientY: number;
        ctrlKey: boolean;

        /**
         * See [DOM Level 3 Events spec](https:
         */
        getModifierState(key: ModifierKey): boolean;

        metaKey: boolean;
        movementX: number;
        movementY: number;
        pageX: number;
        pageY: number;
        relatedTarget: EventTarget | null;
        screenX: number;
        screenY: number;
        shiftKey: boolean;
    }

    interface TouchEvent<T = Element> extends UIEvent<T, NativeTouchEvent> {
        altKey: boolean;
        changedTouches: TouchList;
        ctrlKey: boolean;

        /**
         * See [DOM Level 3 Events spec](https:
         */
        getModifierState(key: ModifierKey): boolean;

        metaKey: boolean;
        shiftKey: boolean;
        targetTouches: TouchList;
        touches: TouchList;
    }

    interface UIEvent<T = Element, E = NativeUIEvent> extends SyntheticEvent<T, E> {
        detail: number;
        view: AbstractView;
    }

    interface WheelEvent<T = Element> extends MouseEvent<T, NativeWheelEvent> {
        deltaMode: number;
        deltaX: number;
        deltaY: number;
        deltaZ: number;
    }

    interface AnimationEvent<T = Element> extends SyntheticEvent<T, NativeAnimationEvent> {
        animationName: string;
        elapsedTime: number;
        pseudoElement: string;
    }

    interface TransitionEvent<T = Element> extends SyntheticEvent<T, NativeTransitionEvent> {
        elapsedTime: number;
        propertyName: string;
        pseudoElement: string;
    }


    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];

    type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;

    type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
    type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
    type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
    type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
    type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
    type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
    type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
    type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;
    type UIEventHandler<T = Element> = EventHandler<UIEvent<T>>;
    type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
    type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
    type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;

    type DetailedHTMLProps<E extends HTMLAttributes<T>, T> = ClassAttributes<T> & E;

    interface SVGProps<T> extends SVGAttributes<T>, ClassAttributes<T> {
    }

    interface DOMAttributes<T> {
        children?: ReactNode | undefined;
        dangerouslySetInnerHTML?: {
            __html: string;
        } | undefined;


        onCopy?: ClipboardEventHandler<T> | undefined;
        onCopyCapture?: ClipboardEventHandler<T> | undefined;
        onCut?: ClipboardEventHandler<T> | undefined;
        onCutCapture?: ClipboardEventHandler<T> | undefined;
        onPaste?: ClipboardEventHandler<T> | undefined;
        onPasteCapture?: ClipboardEventHandler<T> | undefined;


        onCompositionEnd?: CompositionEventHandler<T> | undefined;
        onCompositionEndCapture?: CompositionEventHandler<T> | undefined;
        onCompositionStart?: CompositionEventHandler<T> | undefined;
        onCompositionStartCapture?: CompositionEventHandler<T> | undefined;
        onCompositionUpdate?: CompositionEventHandler<T> | undefined;
        onCompositionUpdateCapture?: CompositionEventHandler<T> | undefined;


        onFocus?: FocusEventHandler<T> | undefined;
        onFocusCapture?: FocusEventHandler<T> | undefined;
        onBlur?: FocusEventHandler<T> | undefined;
        onBlurCapture?: FocusEventHandler<T> | undefined;


        onChange?: FormEventHandler<T> | undefined;
        onChangeCapture?: FormEventHandler<T> | undefined;
        onBeforeInput?: FormEventHandler<T> | undefined;
        onBeforeInputCapture?: FormEventHandler<T> | undefined;
        onInput?: FormEventHandler<T> | undefined;
        onInputCapture?: FormEventHandler<T> | undefined;
        onReset?: FormEventHandler<T> | undefined;
        onResetCapture?: FormEventHandler<T> | undefined;
        onSubmit?: FormEventHandler<T> | undefined;
        onSubmitCapture?: FormEventHandler<T> | undefined;
        onInvalid?: FormEventHandler<T> | undefined;
        onInvalidCapture?: FormEventHandler<T> | undefined;


        onLoad?: ReactEventHandler<T> | undefined;
        onLoadCapture?: ReactEventHandler<T> | undefined;
        onError?: ReactEventHandler<T> | undefined;
        onErrorCapture?: ReactEventHandler<T> | undefined;


        onKeyDown?: KeyboardEventHandler<T> | undefined;
        onKeyDownCapture?: KeyboardEventHandler<T> | undefined;

        onKeyPress?: KeyboardEventHandler<T> | undefined;

        onKeyPressCapture?: KeyboardEventHandler<T> | undefined;
        onKeyUp?: KeyboardEventHandler<T> | undefined;
        onKeyUpCapture?: KeyboardEventHandler<T> | undefined;


        onAbort?: ReactEventHandler<T> | undefined;
        onAbortCapture?: ReactEventHandler<T> | undefined;
        onCanPlay?: ReactEventHandler<T> | undefined;
        onCanPlayCapture?: ReactEventHandler<T> | undefined;
        onCanPlayThrough?: ReactEventHandler<T> | undefined;
        onCanPlayThroughCapture?: ReactEventHandler<T> | undefined;
        onDurationChange?: ReactEventHandler<T> | undefined;
        onDurationChangeCapture?: ReactEventHandler<T> | undefined;
        onEmptied?: ReactEventHandler<T> | undefined;
        onEmptiedCapture?: ReactEventHandler<T> | undefined;
        onEncrypted?: ReactEventHandler<T> | undefined;
        onEncryptedCapture?: ReactEventHandler<T> | undefined;
        onEnded?: ReactEventHandler<T> | undefined;
        onEndedCapture?: ReactEventHandler<T> | undefined;
        onLoadedData?: ReactEventHandler<T> | undefined;
        onLoadedDataCapture?: ReactEventHandler<T> | undefined;
        onLoadedMetadata?: ReactEventHandler<T> | undefined;
        onLoadedMetadataCapture?: ReactEventHandler<T> | undefined;
        onLoadStart?: ReactEventHandler<T> | undefined;
        onLoadStartCapture?: ReactEventHandler<T> | undefined;
        onPause?: ReactEventHandler<T> | undefined;
        onPauseCapture?: ReactEventHandler<T> | undefined;
        onPlay?: ReactEventHandler<T> | undefined;
        onPlayCapture?: ReactEventHandler<T> | undefined;
        onPlaying?: ReactEventHandler<T> | undefined;
        onPlayingCapture?: ReactEventHandler<T> | undefined;
        onProgress?: ReactEventHandler<T> | undefined;
        onProgressCapture?: ReactEventHandler<T> | undefined;
        onRateChange?: ReactEventHandler<T> | undefined;
        onRateChangeCapture?: ReactEventHandler<T> | undefined;
        onResize?: ReactEventHandler<T> | undefined;
        onResizeCapture?: ReactEventHandler<T> | undefined;
        onSeeked?: ReactEventHandler<T> | undefined;
        onSeekedCapture?: ReactEventHandler<T> | undefined;
        onSeeking?: ReactEventHandler<T> | undefined;
        onSeekingCapture?: ReactEventHandler<T> | undefined;
        onStalled?: ReactEventHandler<T> | undefined;
        onStalledCapture?: ReactEventHandler<T> | undefined;
        onSuspend?: ReactEventHandler<T> | undefined;
        onSuspendCapture?: ReactEventHandler<T> | undefined;
        onTimeUpdate?: ReactEventHandler<T> | undefined;
        onTimeUpdateCapture?: ReactEventHandler<T> | undefined;
        onVolumeChange?: ReactEventHandler<T> | undefined;
        onVolumeChangeCapture?: ReactEventHandler<T> | undefined;
        onWaiting?: ReactEventHandler<T> | undefined;
        onWaitingCapture?: ReactEventHandler<T> | undefined;


        onAuxClick?: MouseEventHandler<T> | undefined;
        onAuxClickCapture?: MouseEventHandler<T> | undefined;
        onClick?: MouseEventHandler<T> | undefined;
        onClickCapture?: MouseEventHandler<T> | undefined;
        onContextMenu?: MouseEventHandler<T> | undefined;
        onContextMenuCapture?: MouseEventHandler<T> | undefined;
        onDoubleClick?: MouseEventHandler<T> | undefined;
        onDoubleClickCapture?: MouseEventHandler<T> | undefined;
        onDrag?: DragEventHandler<T> | undefined;
        onDragCapture?: DragEventHandler<T> | undefined;
        onDragEnd?: DragEventHandler<T> | undefined;
        onDragEndCapture?: DragEventHandler<T> | undefined;
        onDragEnter?: DragEventHandler<T> | undefined;
        onDragEnterCapture?: DragEventHandler<T> | undefined;
        onDragExit?: DragEventHandler<T> | undefined;
        onDragExitCapture?: DragEventHandler<T> | undefined;
        onDragLeave?: DragEventHandler<T> | undefined;
        onDragLeaveCapture?: DragEventHandler<T> | undefined;
        onDragOver?: DragEventHandler<T> | undefined;
        onDragOverCapture?: DragEventHandler<T> | undefined;
        onDragStart?: DragEventHandler<T> | undefined;
        onDragStartCapture?: DragEventHandler<T> | undefined;
        onDrop?: DragEventHandler<T> | undefined;
        onDropCapture?: DragEventHandler<T> | undefined;
        onMouseDown?: MouseEventHandler<T> | undefined;
        onMouseDownCapture?: MouseEventHandler<T> | undefined;
        onMouseEnter?: MouseEventHandler<T> | undefined;
        onMouseLeave?: MouseEventHandler<T> | undefined;
        onMouseMove?: MouseEventHandler<T> | undefined;
        onMouseMoveCapture?: MouseEventHandler<T> | undefined;
        onMouseOut?: MouseEventHandler<T> | undefined;
        onMouseOutCapture?: MouseEventHandler<T> | undefined;
        onMouseOver?: MouseEventHandler<T> | undefined;
        onMouseOverCapture?: MouseEventHandler<T> | undefined;
        onMouseUp?: MouseEventHandler<T> | undefined;
        onMouseUpCapture?: MouseEventHandler<T> | undefined;


        onSelect?: ReactEventHandler<T> | undefined;
        onSelectCapture?: ReactEventHandler<T> | undefined;


        onTouchCancel?: TouchEventHandler<T> | undefined;
        onTouchCancelCapture?: TouchEventHandler<T> | undefined;
        onTouchEnd?: TouchEventHandler<T> | undefined;
        onTouchEndCapture?: TouchEventHandler<T> | undefined;
        onTouchMove?: TouchEventHandler<T> | undefined;
        onTouchMoveCapture?: TouchEventHandler<T> | undefined;
        onTouchStart?: TouchEventHandler<T> | undefined;
        onTouchStartCapture?: TouchEventHandler<T> | undefined;


        onPointerDown?: PointerEventHandler<T> | undefined;
        onPointerDownCapture?: PointerEventHandler<T> | undefined;
        onPointerMove?: PointerEventHandler<T> | undefined;
        onPointerMoveCapture?: PointerEventHandler<T> | undefined;
        onPointerUp?: PointerEventHandler<T> | undefined;
        onPointerUpCapture?: PointerEventHandler<T> | undefined;
        onPointerCancel?: PointerEventHandler<T> | undefined;
        onPointerCancelCapture?: PointerEventHandler<T> | undefined;
        onPointerEnter?: PointerEventHandler<T> | undefined;
        onPointerEnterCapture?: PointerEventHandler<T> | undefined;
        onPointerLeave?: PointerEventHandler<T> | undefined;
        onPointerLeaveCapture?: PointerEventHandler<T> | undefined;
        onPointerOver?: PointerEventHandler<T> | undefined;
        onPointerOverCapture?: PointerEventHandler<T> | undefined;
        onPointerOut?: PointerEventHandler<T> | undefined;
        onPointerOutCapture?: PointerEventHandler<T> | undefined;
        onGotPointerCapture?: PointerEventHandler<T> | undefined;
        onGotPointerCaptureCapture?: PointerEventHandler<T> | undefined;
        onLostPointerCapture?: PointerEventHandler<T> | undefined;
        onLostPointerCaptureCapture?: PointerEventHandler<T> | undefined;


        onScroll?: UIEventHandler<T> | undefined;
        onScrollCapture?: UIEventHandler<T> | undefined;


        onWheel?: WheelEventHandler<T> | undefined;
        onWheelCapture?: WheelEventHandler<T> | undefined;


        onAnimationStart?: AnimationEventHandler<T> | undefined;
        onAnimationStartCapture?: AnimationEventHandler<T> | undefined;
        onAnimationEnd?: AnimationEventHandler<T> | undefined;
        onAnimationEndCapture?: AnimationEventHandler<T> | undefined;
        onAnimationIteration?: AnimationEventHandler<T> | undefined;
        onAnimationIterationCapture?: AnimationEventHandler<T> | undefined;


        onTransitionEnd?: TransitionEventHandler<T> | undefined;
        onTransitionEndCapture?: TransitionEventHandler<T> | undefined;
    }

    export interface CSSProperties {

    }


    interface AriaAttributes {

        'aria-activedescendant'?: string | undefined;
        'aria-atomic'?: Booleanish | undefined;
        'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both' | undefined;
        'aria-busy'?: Booleanish | undefined;
        'aria-checked'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        'aria-colcount'?: number | undefined;
        'aria-colindex'?: number | undefined;
        'aria-colspan'?: number | undefined;
        'aria-controls'?: string | undefined;
        'aria-current'?: boolean | 'false' | 'true' | 'page' | 'step' | 'location' | 'date' | 'time' | undefined;
        'aria-describedby'?: string | undefined;
        'aria-details'?: string | undefined;
        'aria-disabled'?: Booleanish | undefined;
        'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup' | undefined;
        'aria-errormessage'?: string | undefined;
        'aria-expanded'?: Booleanish | undefined;
        'aria-flowto'?: string | undefined;
        'aria-grabbed'?: Booleanish | undefined;
        'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined;
        'aria-hidden'?: Booleanish | undefined;
        'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
        'aria-keyshortcuts'?: string | undefined;
        'aria-label'?: string | undefined;
        'aria-labelledby'?: string | undefined;
        'aria-level'?: number | undefined;
        'aria-live'?: 'off' | 'assertive' | 'polite' | undefined;
        'aria-modal'?: Booleanish | undefined;
        'aria-multiline'?: Booleanish | undefined;
        'aria-multiselectable'?: Booleanish | undefined;
        'aria-orientation'?: 'horizontal' | 'vertical' | undefined;
        'aria-owns'?: string | undefined;
        'aria-placeholder'?: string | undefined;
        'aria-posinset'?: number | undefined;
        'aria-pressed'?: boolean | 'false' | 'mixed' | 'true' | undefined;
        'aria-readonly'?: Booleanish | undefined;
        'aria-relevant'?: 'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals' | undefined;
        'aria-required'?: Booleanish | undefined;
        'aria-roledescription'?: string | undefined;
        'aria-rowcount'?: number | undefined;
        'aria-rowindex'?: number | undefined;
        'aria-rowspan'?: number | undefined;
        'aria-selected'?: Booleanish | undefined;
        'aria-setsize'?: number | undefined;
        'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
        'aria-valuemax'?: number | undefined;
        'aria-valuemin'?: number | undefined;
        'aria-valuenow'?: number | undefined;
        'aria-valuetext'?: string | undefined;
    }

    type AriaRole =
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
        | 'treeitem'
        | (string & {});

    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {

        defaultChecked?: boolean | undefined;
        defaultValue?: string | number | ReadonlyArray<string> | undefined;
        suppressContentEditableWarning?: boolean | undefined;
        suppressHydrationWarning?: boolean | undefined;


        accessKey?: string | undefined;
        className?: string | undefined;
        contentEditable?: Booleanish | "inherit" | undefined;
        contextMenu?: string | undefined;
        dir?: string | undefined;
        draggable?: Booleanish | undefined;
        hidden?: boolean | undefined;
        id?: string | undefined;
        lang?: string | undefined;
        nonce?: string | undefined;
        placeholder?: string | undefined;
        slot?: string | undefined;
        spellCheck?: Booleanish | undefined;
        style?: CSSProperties | undefined;
        tabIndex?: number | undefined;
        title?: string | undefined;
        translate?: 'yes' | 'no' | undefined;

        radioGroup?: string | undefined;

        role?: AriaRole | undefined;

        about?: string | undefined;
        datatype?: string | undefined;
        inlist?: any;
        prefix?: string | undefined;
        property?: string | undefined;
        resource?: string | undefined;
        typeof?: string | undefined;
        vocab?: string | undefined;

        autoCapitalize?: string | undefined;
        autoCorrect?: string | undefined;
        autoSave?: string | undefined;
        color?: string | undefined;
        itemProp?: string | undefined;
        itemScope?: boolean | undefined;
        itemType?: string | undefined;
        itemID?: string | undefined;
        itemRef?: string | undefined;
        results?: number | undefined;
        security?: string | undefined;
        unselectable?: 'on' | 'off' | undefined;

        inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | undefined;
        is?: string | undefined;
    }

    // TODO interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
    //
    //     accept?: string | undefined;
    //     acceptCharset?: string | undefined;
    //     action?: string | undefined;
    //     allowFullScreen?: boolean | undefined;
    //     allowTransparency?: boolean | undefined;
    //     alt?: string | undefined;
    //     as?: string | undefined;
    //     async?: boolean | undefined;
    //     autoComplete?: string | undefined;
    //     autoFocus?: boolean | undefined;
    //     autoPlay?: boolean | undefined;
    //     capture?: boolean | 'user' | 'environment' | undefined;
    //     cellPadding?: number | string | undefined;
    //     cellSpacing?: number | string | undefined;
    //     charSet?: string | undefined;
    //     challenge?: string | undefined;
    //     checked?: boolean | undefined;
    //     cite?: string | undefined;
    //     classID?: string | undefined;
    //     cols?: number | undefined;
    //     colSpan?: number | undefined;
    //     content?: string | undefined;
    //     controls?: boolean | undefined;
    //     coords?: string | undefined;
    //     crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
    //     data?: string | undefined;
    //     dateTime?: string | undefined;
    //     default?: boolean | undefined;
    //     defer?: boolean | undefined;
    //     disabled?: boolean | undefined;
    //     download?: any;
    //     encType?: string | undefined;
    //     form?: string | undefined;
    //     formAction?: string | undefined;
    //     formEncType?: string | undefined;
    //     formMethod?: string | undefined;
    //     formNoValidate?: boolean | undefined;
    //     formTarget?: string | undefined;
    //     frameBorder?: number | string | undefined;
    //     headers?: string | undefined;
    //     height?: number | string | undefined;
    //     high?: number | undefined;
    //     href?: string | undefined;
    //     hrefLang?: string | undefined;
    //     htmlFor?: string | undefined;
    //     httpEquiv?: string | undefined;
    //     integrity?: string | undefined;
    //     keyParams?: string | undefined;
    //     keyType?: string | undefined;
    //     kind?: string | undefined;
    //     label?: string | undefined;
    //     list?: string | undefined;
    //     loop?: boolean | undefined;
    //     low?: number | undefined;
    //     manifest?: string | undefined;
    //     marginHeight?: number | undefined;
    //     marginWidth?: number | undefined;
    //     max?: number | string | undefined;
    //     maxLength?: number | undefined;
    //     media?: string | undefined;
    //     mediaGroup?: string | undefined;
    //     method?: string | undefined;
    //     min?: number | string | undefined;
    //     minLength?: number | undefined;
    //     multiple?: boolean | undefined;
    //     muted?: boolean | undefined;
    //     name?: string | undefined;
    //     noValidate?: boolean | undefined;
    //     open?: boolean | undefined;
    //     optimum?: number | undefined;
    //     pattern?: string | undefined;
    //     placeholder?: string | undefined;
    //     playsInline?: boolean | undefined;
    //     poster?: string | undefined;
    //     preload?: string | undefined;
    //     readOnly?: boolean | undefined;
    //     rel?: string | undefined;
    //     required?: boolean | undefined;
    //     reversed?: boolean | undefined;
    //     rows?: number | undefined;
    //     rowSpan?: number | undefined;
    //     sandbox?: string | undefined;
    //     scope?: string | undefined;
    //     scoped?: boolean | undefined;
    //     scrolling?: string | undefined;
    //     seamless?: boolean | undefined;
    //     selected?: boolean | undefined;
    //     shape?: string | undefined;
    //     size?: number | undefined;
    //     sizes?: string | undefined;
    //     span?: number | undefined;
    //     src?: string | undefined;
    //     srcDoc?: string | undefined;
    //     srcLang?: string | undefined;
    //     srcSet?: string | undefined;
    //     start?: number | undefined;
    //     step?: number | string | undefined;
    //     summary?: string | undefined;
    //     target?: string | undefined;
    //     type?: string | undefined;
    //     useMap?: string | undefined;
    //     value?: string | ReadonlyArray<string> | number | undefined;
    //     width?: number | string | undefined;
    //     wmode?: string | undefined;
    //     wrap?: string | undefined;
    // }

    type HTMLAttributeReferrerPolicy =
        | ''
        | 'no-referrer'
        | 'no-referrer-when-downgrade'
        | 'origin'
        | 'origin-when-cross-origin'
        | 'same-origin'
        | 'strict-origin'
        | 'strict-origin-when-cross-origin'
        | 'unsafe-url';

    type HTMLAttributeAnchorTarget =
        | '_self'
        | '_blank'
        | '_parent'
        | '_top'
        | (string & {});

    interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
        download?: any;
        href?: string | undefined;
        hrefLang?: string | undefined;
        media?: string | undefined;
        ping?: string | undefined;
        rel?: string | undefined;
        target?: HTMLAttributeAnchorTarget | undefined;
        type?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
    }

    interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    }

    interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | undefined;
        coords?: string | undefined;
        download?: any;
        href?: string | undefined;
        hrefLang?: string | undefined;
        media?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        rel?: string | undefined;
        shape?: string | undefined;
        target?: string | undefined;
    }

    interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
        href?: string | undefined;
        target?: string | undefined;
    }

    interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
    }

    interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        name?: string | undefined;
        type?: 'submit' | 'reset' | 'button' | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        width?: number | string | undefined;
    }

    interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | undefined;
        width?: number | string | undefined;
    }

    interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        span?: number | undefined;
    }

    interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
        open?: boolean | undefined;
        onToggle?: ReactEventHandler<T> | undefined;
    }

    interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
    }

    interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
        onCancel?: ReactEventHandler<T> | undefined;
        onClose?: ReactEventHandler<T> | undefined;
        open?: boolean | undefined;
    }

    interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        src?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        form?: string | undefined;
        name?: string | undefined;
    }

    interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
        acceptCharset?: string | undefined;
        action?: string | undefined;
        autoComplete?: string | undefined;
        encType?: string | undefined;
        method?: string | undefined;
        name?: string | undefined;
        noValidate?: boolean | undefined;
        target?: string | undefined;
        rel?: string | undefined;
    }

    interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
        manifest?: string | undefined;
    }

    interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
        allow?: string | undefined;
        allowFullScreen?: boolean | undefined;
        allowTransparency?: boolean | undefined;

        frameBorder?: number | string | undefined;
        height?: number | string | undefined;
        loading?: "eager" | "lazy" | undefined;

        marginHeight?: number | undefined;

        marginWidth?: number | undefined;
        name?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sandbox?: string | undefined;

        scrolling?: string | undefined;
        seamless?: boolean | undefined;
        src?: string | undefined;
        srcDoc?: string | undefined;
        width?: number | string | undefined;
    }

    interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
        alt?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        decoding?: "async" | "auto" | "sync" | undefined;
        height?: number | string | undefined;
        loading?: "eager" | "lazy" | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
    }

    interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
        dateTime?: string | undefined;
    }

    type HTMLInputTypeAttribute =
        | 'button'
        | 'checkbox'
        | 'color'
        | 'date'
        | 'datetime-local'
        | 'email'
        | 'file'
        | 'hidden'
        | 'image'
        | 'month'
        | 'number'
        | 'password'
        | 'radio'
        | 'range'
        | 'reset'
        | 'search'
        | 'submit'
        | 'tel'
        | 'text'
        | 'time'
        | 'url'
        | 'week'
        | (string & {});

    interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
        accept?: string | undefined;
        alt?: string | undefined;
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        capture?: boolean | 'user' | 'environment' | undefined;
        checked?: boolean | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        disabled?: boolean | undefined;
        enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send' | undefined;
        form?: string | undefined;
        formAction?: string | undefined;
        formEncType?: string | undefined;
        formMethod?: string | undefined;
        formNoValidate?: boolean | undefined;
        formTarget?: string | undefined;
        height?: number | string | undefined;
        list?: string | undefined;
        max?: number | string | undefined;
        maxLength?: number | undefined;
        min?: number | string | undefined;
        minLength?: number | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        pattern?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        src?: string | undefined;
        step?: number | string | undefined;
        type?: HTMLInputTypeAttribute | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        width?: number | string | undefined;

        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
        autoFocus?: boolean | undefined;
        challenge?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        keyType?: string | undefined;
        keyParams?: string | undefined;
        name?: string | undefined;
    }

    interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        htmlFor?: string | undefined;
    }

    interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
        as?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        href?: string | undefined;
        hrefLang?: string | undefined;
        integrity?: string | undefined;
        media?: string | undefined;
        imageSrcSet?: string | undefined;
        imageSizes?: string | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        rel?: string | undefined;
        sizes?: string | undefined;
        type?: string | undefined;
        charSet?: string | undefined;
    }

    interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
    }

    interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
        type?: string | undefined;
    }

    interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoPlay?: boolean | undefined;
        controls?: boolean | undefined;
        controlsList?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        loop?: boolean | undefined;
        mediaGroup?: string | undefined;
        muted?: boolean | undefined;
        playsInline?: boolean | undefined;
        preload?: string | undefined;
        src?: string | undefined;
    }

    interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
        charSet?: string | undefined;
        content?: string | undefined;
        httpEquiv?: string | undefined;
        name?: string | undefined;
        media?: string | undefined;
    }

    interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        high?: number | undefined;
        low?: number | undefined;
        max?: number | string | undefined;
        min?: number | string | undefined;
        optimum?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
        cite?: string | undefined;
    }

    interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
        classID?: string | undefined;
        data?: string | undefined;
        form?: string | undefined;
        height?: number | string | undefined;
        name?: string | undefined;
        type?: string | undefined;
        useMap?: string | undefined;
        width?: number | string | undefined;
        wmode?: string | undefined;
    }

    interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
        reversed?: boolean | undefined;
        start?: number | undefined;
        type?: '1' | 'a' | 'A' | 'i' | 'I' | undefined;
    }

    interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
    }

    interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
        disabled?: boolean | undefined;
        label?: string | undefined;
        selected?: boolean | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
        form?: string | undefined;
        htmlFor?: string | undefined;
        name?: string | undefined;
    }

    interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
        max?: number | string | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
    }

    interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
        name?: string | undefined;
    }

    interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
        async?: boolean | undefined;

        charSet?: string | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;
        defer?: boolean | undefined;
        integrity?: string | undefined;
        noModule?: boolean | undefined;
        referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
        src?: string | undefined;
        type?: string | undefined;
    }

    interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        multiple?: boolean | undefined;
        name?: string | undefined;
        required?: boolean | undefined;
        size?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
        height?: number | string | undefined;
        media?: string | undefined;
        sizes?: string | undefined;
        src?: string | undefined;
        srcSet?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;
    }

    interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
        media?: string | undefined;
        scoped?: boolean | undefined;
        type?: string | undefined;
    }

    interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | undefined;
        bgcolor?: string | undefined;
        border?: number | undefined;
        cellPadding?: number | string | undefined;
        cellSpacing?: number | string | undefined;
        frame?: boolean | undefined;
        rules?: "none" | "groups" | "rows" | "columns" | "all" | undefined;
        summary?: string | undefined;
        width?: number | string | undefined;
    }

    interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
        autoComplete?: string | undefined;
        autoFocus?: boolean | undefined;
        cols?: number | undefined;
        dirName?: string | undefined;
        disabled?: boolean | undefined;
        form?: string | undefined;
        maxLength?: number | undefined;
        minLength?: number | undefined;
        name?: string | undefined;
        placeholder?: string | undefined;
        readOnly?: boolean | undefined;
        required?: boolean | undefined;
        rows?: number | undefined;
        value?: string | ReadonlyArray<string> | number | undefined;
        wrap?: string | undefined;

        onChange?: ChangeEventHandler<T> | undefined;
    }

    interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
        height?: number | string | undefined;
        width?: number | string | undefined;
        valign?: "top" | "middle" | "bottom" | "baseline" | undefined;
    }

    interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
        align?: "left" | "center" | "right" | "justify" | "char" | undefined;
        colSpan?: number | undefined;
        headers?: string | undefined;
        rowSpan?: number | undefined;
        scope?: string | undefined;
        abbr?: string | undefined;
    }

    interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
        dateTime?: string | undefined;
    }

    interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
        default?: boolean | undefined;
        kind?: string | undefined;
        label?: string | undefined;
        src?: string | undefined;
        srcLang?: string | undefined;
    }

    interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
        height?: number | string | undefined;
        playsInline?: boolean | undefined;
        poster?: string | undefined;
        width?: number | string | undefined;
        disablePictureInPicture?: boolean | undefined;
        disableRemotePlayback?: boolean | undefined;
    }


    interface SVGAttributes<T> extends AriaAttributes, DOMAttributes<T> {


        className?: string | undefined;
        color?: string | undefined;
        height?: number | string | undefined;
        id?: string | undefined;
        lang?: string | undefined;
        max?: number | string | undefined;
        media?: string | undefined;
        method?: string | undefined;
        min?: number | string | undefined;
        name?: string | undefined;
        style?: CSSProperties | undefined;
        target?: string | undefined;
        type?: string | undefined;
        width?: number | string | undefined;


        role?: AriaRole | undefined;
        tabIndex?: number | undefined;
        crossOrigin?: "anonymous" | "use-credentials" | "" | undefined;


        accentHeight?: number | string | undefined;
        accumulate?: "none" | "sum" | undefined;
        additive?: "replace" | "sum" | undefined;
        alignmentBaseline?: "auto" | "baseline" | "before-edge" | "text-before-edge" | "middle" | "central" | "after-edge" |
            "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical" | "inherit" | undefined;
        allowReorder?: "no" | "yes" | undefined;
        alphabetic?: number | string | undefined;
        amplitude?: number | string | undefined;
        arabicForm?: "initial" | "medial" | "terminal" | "isolated" | undefined;
        ascent?: number | string | undefined;
        attributeName?: string | undefined;
        attributeType?: string | undefined;
        autoReverse?: Booleanish | undefined;
        azimuth?: number | string | undefined;
        baseFrequency?: number | string | undefined;
        baselineShift?: number | string | undefined;
        baseProfile?: number | string | undefined;
        bbox?: number | string | undefined;
        begin?: number | string | undefined;
        bias?: number | string | undefined;
        by?: number | string | undefined;
        calcMode?: number | string | undefined;
        capHeight?: number | string | undefined;
        clip?: number | string | undefined;
        clipPath?: string | undefined;
        clipPathUnits?: number | string | undefined;
        clipRule?: number | string | undefined;
        colorInterpolation?: number | string | undefined;
        colorInterpolationFilters?: "auto" | "sRGB" | "linearRGB" | "inherit" | undefined;
        colorProfile?: number | string | undefined;
        colorRendering?: number | string | undefined;
        contentScriptType?: number | string | undefined;
        contentStyleType?: number | string | undefined;
        cursor?: number | string | undefined;
        cx?: number | string | undefined;
        cy?: number | string | undefined;
        d?: string | undefined;
        decelerate?: number | string | undefined;
        descent?: number | string | undefined;
        diffuseConstant?: number | string | undefined;
        direction?: number | string | undefined;
        display?: number | string | undefined;
        divisor?: number | string | undefined;
        dominantBaseline?: number | string | undefined;
        dur?: number | string | undefined;
        dx?: number | string | undefined;
        dy?: number | string | undefined;
        edgeMode?: number | string | undefined;
        elevation?: number | string | undefined;
        enableBackground?: number | string | undefined;
        end?: number | string | undefined;
        exponent?: number | string | undefined;
        externalResourcesRequired?: Booleanish | undefined;
        fill?: string | undefined;
        fillOpacity?: number | string | undefined;
        fillRule?: "nonzero" | "evenodd" | "inherit" | undefined;
        filter?: string | undefined;
        filterRes?: number | string | undefined;
        filterUnits?: number | string | undefined;
        floodColor?: number | string | undefined;
        floodOpacity?: number | string | undefined;
        focusable?: Booleanish | "auto" | undefined;
        fontFamily?: string | undefined;
        fontSize?: number | string | undefined;
        fontSizeAdjust?: number | string | undefined;
        fontStretch?: number | string | undefined;
        fontStyle?: number | string | undefined;
        fontVariant?: number | string | undefined;
        fontWeight?: number | string | undefined;
        format?: number | string | undefined;
        fr?: number | string | undefined;
        from?: number | string | undefined;
        fx?: number | string | undefined;
        fy?: number | string | undefined;
        g1?: number | string | undefined;
        g2?: number | string | undefined;
        glyphName?: number | string | undefined;
        glyphOrientationHorizontal?: number | string | undefined;
        glyphOrientationVertical?: number | string | undefined;
        glyphRef?: number | string | undefined;
        gradientTransform?: string | undefined;
        gradientUnits?: string | undefined;
        hanging?: number | string | undefined;
        horizAdvX?: number | string | undefined;
        horizOriginX?: number | string | undefined;
        href?: string | undefined;
        ideographic?: number | string | undefined;
        imageRendering?: number | string | undefined;
        in2?: number | string | undefined;
        in?: string | undefined;
        intercept?: number | string | undefined;
        k1?: number | string | undefined;
        k2?: number | string | undefined;
        k3?: number | string | undefined;
        k4?: number | string | undefined;
        k?: number | string | undefined;
        kernelMatrix?: number | string | undefined;
        kernelUnitLength?: number | string | undefined;
        kerning?: number | string | undefined;
        keyPoints?: number | string | undefined;
        keySplines?: number | string | undefined;
        keyTimes?: number | string | undefined;
        lengthAdjust?: number | string | undefined;
        letterSpacing?: number | string | undefined;
        lightingColor?: number | string | undefined;
        limitingConeAngle?: number | string | undefined;
        local?: number | string | undefined;
        markerEnd?: string | undefined;
        markerHeight?: number | string | undefined;
        markerMid?: string | undefined;
        markerStart?: string | undefined;
        markerUnits?: number | string | undefined;
        markerWidth?: number | string | undefined;
        mask?: string | undefined;
        maskContentUnits?: number | string | undefined;
        maskUnits?: number | string | undefined;
        mathematical?: number | string | undefined;
        mode?: number | string | undefined;
        numOctaves?: number | string | undefined;
        offset?: number | string | undefined;
        opacity?: number | string | undefined;
        operator?: number | string | undefined;
        order?: number | string | undefined;
        orient?: number | string | undefined;
        orientation?: number | string | undefined;
        origin?: number | string | undefined;
        overflow?: number | string | undefined;
        overlinePosition?: number | string | undefined;
        overlineThickness?: number | string | undefined;
        paintOrder?: number | string | undefined;
        panose1?: number | string | undefined;
        path?: string | undefined;
        pathLength?: number | string | undefined;
        patternContentUnits?: string | undefined;
        patternTransform?: number | string | undefined;
        patternUnits?: string | undefined;
        pointerEvents?: number | string | undefined;
        points?: string | undefined;
        pointsAtX?: number | string | undefined;
        pointsAtY?: number | string | undefined;
        pointsAtZ?: number | string | undefined;
        preserveAlpha?: Booleanish | undefined;
        preserveAspectRatio?: string | undefined;
        primitiveUnits?: number | string | undefined;
        r?: number | string | undefined;
        radius?: number | string | undefined;
        refX?: number | string | undefined;
        refY?: number | string | undefined;
        renderingIntent?: number | string | undefined;
        repeatCount?: number | string | undefined;
        repeatDur?: number | string | undefined;
        requiredExtensions?: number | string | undefined;
        requiredFeatures?: number | string | undefined;
        restart?: number | string | undefined;
        result?: string | undefined;
        rotate?: number | string | undefined;
        rx?: number | string | undefined;
        ry?: number | string | undefined;
        scale?: number | string | undefined;
        seed?: number | string | undefined;
        shapeRendering?: number | string | undefined;
        slope?: number | string | undefined;
        spacing?: number | string | undefined;
        specularConstant?: number | string | undefined;
        specularExponent?: number | string | undefined;
        speed?: number | string | undefined;
        spreadMethod?: string | undefined;
        startOffset?: number | string | undefined;
        stdDeviation?: number | string | undefined;
        stemh?: number | string | undefined;
        stemv?: number | string | undefined;
        stitchTiles?: number | string | undefined;
        stopColor?: string | undefined;
        stopOpacity?: number | string | undefined;
        strikethroughPosition?: number | string | undefined;
        strikethroughThickness?: number | string | undefined;
        string?: number | string | undefined;
        stroke?: string | undefined;
        strokeDasharray?: string | number | undefined;
        strokeDashoffset?: string | number | undefined;
        strokeLinecap?: "butt" | "round" | "square" | "inherit" | undefined;
        strokeLinejoin?: "miter" | "round" | "bevel" | "inherit" | undefined;
        strokeMiterlimit?: number | string | undefined;
        strokeOpacity?: number | string | undefined;
        strokeWidth?: number | string | undefined;
        surfaceScale?: number | string | undefined;
        systemLanguage?: number | string | undefined;
        tableValues?: number | string | undefined;
        targetX?: number | string | undefined;
        targetY?: number | string | undefined;
        textAnchor?: string | undefined;
        textDecoration?: number | string | undefined;
        textLength?: number | string | undefined;
        textRendering?: number | string | undefined;
        to?: number | string | undefined;
        transform?: string | undefined;
        u1?: number | string | undefined;
        u2?: number | string | undefined;
        underlinePosition?: number | string | undefined;
        underlineThickness?: number | string | undefined;
        unicode?: number | string | undefined;
        unicodeBidi?: number | string | undefined;
        unicodeRange?: number | string | undefined;
        unitsPerEm?: number | string | undefined;
        vAlphabetic?: number | string | undefined;
        values?: string | undefined;
        vectorEffect?: number | string | undefined;
        version?: string | undefined;
        vertAdvY?: number | string | undefined;
        vertOriginX?: number | string | undefined;
        vertOriginY?: number | string | undefined;
        vHanging?: number | string | undefined;
        vIdeographic?: number | string | undefined;
        viewBox?: string | undefined;
        viewTarget?: number | string | undefined;
        visibility?: number | string | undefined;
        vMathematical?: number | string | undefined;
        widths?: number | string | undefined;
        wordSpacing?: number | string | undefined;
        writingMode?: number | string | undefined;
        x1?: number | string | undefined;
        x2?: number | string | undefined;
        x?: number | string | undefined;
        xChannelSelector?: string | undefined;
        xHeight?: number | string | undefined;
        xlinkActuate?: string | undefined;
        xlinkArcrole?: string | undefined;
        xlinkHref?: string | undefined;
        xlinkRole?: string | undefined;
        xlinkShow?: string | undefined;
        xlinkTitle?: string | undefined;
        xlinkType?: string | undefined;
        xmlBase?: string | undefined;
        xmlLang?: string | undefined;
        xmlns?: string | undefined;
        xmlnsXlink?: string | undefined;
        xmlSpace?: string | undefined;
        y1?: number | string | undefined;
        y2?: number | string | undefined;
        y?: number | string | undefined;
        yChannelSelector?: string | undefined;
        z?: number | string | undefined;
        zoomAndPan?: string | undefined;
    }

    interface ReactHTML {
        a: DetailedHTMLFactory<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
        abbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        address: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        area: DetailedHTMLFactory<AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
        article: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        audio: DetailedHTMLFactory<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
        b: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        base: DetailedHTMLFactory<BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
        bdi: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        bdo: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        big: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        blockquote: DetailedHTMLFactory<BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        body: DetailedHTMLFactory<HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
        br: DetailedHTMLFactory<HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
        button: DetailedHTMLFactory<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        canvas: DetailedHTMLFactory<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        caption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        center: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        cite: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        code: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        col: DetailedHTMLFactory<ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        colgroup: DetailedHTMLFactory<ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        data: DetailedHTMLFactory<DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
        datalist: DetailedHTMLFactory<HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
        dd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        del: DetailedHTMLFactory<DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
        details: DetailedHTMLFactory<DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
        dfn: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        dialog: DetailedHTMLFactory<DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
        div: DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        dl: DetailedHTMLFactory<HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
        dt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        em: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        embed: DetailedHTMLFactory<EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
        fieldset: DetailedHTMLFactory<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
        figcaption: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        figure: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        form: DetailedHTMLFactory<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
        h1: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h3: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h4: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h5: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h6: DetailedHTMLFactory<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        head: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLHeadElement>;
        header: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hgroup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        hr: DetailedHTMLFactory<HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
        html: DetailedHTMLFactory<HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
        i: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        iframe: DetailedHTMLFactory<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
        img: DetailedHTMLFactory<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
        input: DetailedHTMLFactory<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        ins: DetailedHTMLFactory<InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
        kbd: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        keygen: DetailedHTMLFactory<KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
        label: DetailedHTMLFactory<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
        legend: DetailedHTMLFactory<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
        li: DetailedHTMLFactory<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        link: DetailedHTMLFactory<LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
        main: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        map: DetailedHTMLFactory<MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
        mark: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        menu: DetailedHTMLFactory<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
        menuitem: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        meta: DetailedHTMLFactory<MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
        meter: DetailedHTMLFactory<MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
        nav: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        noscript: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        object: DetailedHTMLFactory<ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
        ol: DetailedHTMLFactory<OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
        optgroup: DetailedHTMLFactory<OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
        option: DetailedHTMLFactory<OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
        output: DetailedHTMLFactory<OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
        p: DetailedHTMLFactory<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
        param: DetailedHTMLFactory<ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
        picture: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        pre: DetailedHTMLFactory<HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
        progress: DetailedHTMLFactory<ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
        q: DetailedHTMLFactory<QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        rp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        rt: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ruby: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        s: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        samp: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        slot: DetailedHTMLFactory<SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
        script: DetailedHTMLFactory<ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
        section: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        select: DetailedHTMLFactory<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        small: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        source: DetailedHTMLFactory<SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
        span: DetailedHTMLFactory<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
        strong: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        style: DetailedHTMLFactory<StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
        sub: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        summary: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        sup: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        table: DetailedHTMLFactory<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
        template: DetailedHTMLFactory<HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
        tbody: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        td: DetailedHTMLFactory<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
        textarea: DetailedHTMLFactory<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
        tfoot: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        th: DetailedHTMLFactory<ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        thead: DetailedHTMLFactory<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        time: DetailedHTMLFactory<TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
        title: DetailedHTMLFactory<HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
        tr: DetailedHTMLFactory<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
        track: DetailedHTMLFactory<TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
        u: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        ul: DetailedHTMLFactory<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        "var": DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
        video: DetailedHTMLFactory<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
        wbr: DetailedHTMLFactory<HTMLAttributes<HTMLElement>, HTMLElement>;
    }

    interface ReactSVG {
        animate: SVGFactory;
        circle: SVGFactory;
        clipPath: SVGFactory;
        defs: SVGFactory;
        desc: SVGFactory;
        ellipse: SVGFactory;
        feBlend: SVGFactory;
        feColorMatrix: SVGFactory;
        feComponentTransfer: SVGFactory;
        feComposite: SVGFactory;
        feConvolveMatrix: SVGFactory;
        feDiffuseLighting: SVGFactory;
        feDisplacementMap: SVGFactory;
        feDistantLight: SVGFactory;
        feDropShadow: SVGFactory;
        feFlood: SVGFactory;
        feFuncA: SVGFactory;
        feFuncB: SVGFactory;
        feFuncG: SVGFactory;
        feFuncR: SVGFactory;
        feGaussianBlur: SVGFactory;
        feImage: SVGFactory;
        feMerge: SVGFactory;
        feMergeNode: SVGFactory;
        feMorphology: SVGFactory;
        feOffset: SVGFactory;
        fePointLight: SVGFactory;
        feSpecularLighting: SVGFactory;
        feSpotLight: SVGFactory;
        feTile: SVGFactory;
        feTurbulence: SVGFactory;
        filter: SVGFactory;
        foreignObject: SVGFactory;
        g: SVGFactory;
        image: SVGFactory;
        line: SVGFactory;
        linearGradient: SVGFactory;
        marker: SVGFactory;
        mask: SVGFactory;
        metadata: SVGFactory;
        path: SVGFactory;
        pattern: SVGFactory;
        polygon: SVGFactory;
        polyline: SVGFactory;
        radialGradient: SVGFactory;
        rect: SVGFactory;
        stop: SVGFactory;
        svg: SVGFactory;
        switch: SVGFactory;
        symbol: SVGFactory;
        text: SVGFactory;
        textPath: SVGFactory;
        tspan: SVGFactory;
        use: SVGFactory;
        view: SVGFactory;
    }

    const nominalTypeHack: unique symbol;

    interface Validator<T> {
        (props: {
            [key: string]: any
        }, propName: string, componentName: string, location: string, propFullName: string): Error | null;

        [nominalTypeHack]?: {
            type: T;
        } | undefined;
    }

    export type ValidationMap<T> = { [K in keyof T]?: Validator<T[K]> };

    type WeakValidationMap<T> = {
        [K in keyof T]?: null extends T[K]
            ? Validator<T[K] | null | undefined>
            : undefined extends T[K]
                ? Validator<T[K] | null | undefined>
                : Validator<T[K]>
    };

    interface AbstractView {
        styleMedia: StyleMedia;
        document: Document;
    }

    interface Touch {
        identifier: number;
        target: EventTarget;
        screenX: number;
        screenY: number;
        clientX: number;
        clientY: number;
        pageX: number;
        pageY: number;
    }

    interface TouchList {
        [index: number]: Touch;

        length: number;

        item(index: number): Touch;

        identifiedTouch(identifier: number): Touch;
    }


    interface ErrorInfo {
        componentStack: string;
    }
}

export declare namespace JSX {
    interface IntrinsicElements {

        a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
        abbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        address: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        area: React.DetailedHTMLProps<React.AreaHTMLAttributes<HTMLAreaElement>, HTMLAreaElement>;
        article: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        aside: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        audio: React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>;
        b: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        base: React.DetailedHTMLProps<React.BaseHTMLAttributes<HTMLBaseElement>, HTMLBaseElement>;
        bdi: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        bdo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        big: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        blockquote: React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        body: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBodyElement>, HTMLBodyElement>;
        br: React.DetailedHTMLProps<React.HTMLAttributes<HTMLBRElement>, HTMLBRElement>;
        button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
        canvas: React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
        caption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        center: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        cite: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        code: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        col: React.DetailedHTMLProps<React.ColHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        colgroup: React.DetailedHTMLProps<React.ColgroupHTMLAttributes<HTMLTableColElement>, HTMLTableColElement>;
        data: React.DetailedHTMLProps<React.DataHTMLAttributes<HTMLDataElement>, HTMLDataElement>;
        datalist: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDataListElement>, HTMLDataListElement>;
        dd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        del: React.DetailedHTMLProps<React.DelHTMLAttributes<HTMLModElement>, HTMLModElement>;
        details: React.DetailedHTMLProps<React.DetailsHTMLAttributes<HTMLDetailsElement>, HTMLDetailsElement>;
        dfn: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        dialog: React.DetailedHTMLProps<React.DialogHTMLAttributes<HTMLDialogElement>, HTMLDialogElement>;
        div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
        dl: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDListElement>, HTMLDListElement>;
        dt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        em: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        embed: React.DetailedHTMLProps<React.EmbedHTMLAttributes<HTMLEmbedElement>, HTMLEmbedElement>;
        fieldset: React.DetailedHTMLProps<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement>;
        figcaption: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        figure: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        footer: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
        h1: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h3: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h4: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h5: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        h6: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
        head: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadElement>, HTMLHeadElement>;
        header: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        hgroup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        hr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHRElement>, HTMLHRElement>;
        html: React.DetailedHTMLProps<React.HtmlHTMLAttributes<HTMLHtmlElement>, HTMLHtmlElement>;
        i: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        iframe: React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement>;
        img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
        input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
        ins: React.DetailedHTMLProps<React.InsHTMLAttributes<HTMLModElement>, HTMLModElement>;
        kbd: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        keygen: React.DetailedHTMLProps<React.KeygenHTMLAttributes<HTMLElement>, HTMLElement>;
        label: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
        legend: React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;
        li: React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>;
        link: React.DetailedHTMLProps<React.LinkHTMLAttributes<HTMLLinkElement>, HTMLLinkElement>;
        main: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        map: React.DetailedHTMLProps<React.MapHTMLAttributes<HTMLMapElement>, HTMLMapElement>;
        mark: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        menu: React.DetailedHTMLProps<React.MenuHTMLAttributes<HTMLElement>, HTMLElement>;
        menuitem: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        meta: React.DetailedHTMLProps<React.MetaHTMLAttributes<HTMLMetaElement>, HTMLMetaElement>;
        meter: React.DetailedHTMLProps<React.MeterHTMLAttributes<HTMLMeterElement>, HTMLMeterElement>;
        nav: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        noindex: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        noscript: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        object: React.DetailedHTMLProps<React.ObjectHTMLAttributes<HTMLObjectElement>, HTMLObjectElement>;
        ol: React.DetailedHTMLProps<React.OlHTMLAttributes<HTMLOListElement>, HTMLOListElement>;
        optgroup: React.DetailedHTMLProps<React.OptgroupHTMLAttributes<HTMLOptGroupElement>, HTMLOptGroupElement>;
        option: React.DetailedHTMLProps<React.OptionHTMLAttributes<HTMLOptionElement>, HTMLOptionElement>;
        output: React.DetailedHTMLProps<React.OutputHTMLAttributes<HTMLOutputElement>, HTMLOutputElement>;
        p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
        param: React.DetailedHTMLProps<React.ParamHTMLAttributes<HTMLParamElement>, HTMLParamElement>;
        picture: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        pre: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>;
        progress: React.DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement>;
        q: React.DetailedHTMLProps<React.QuoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
        rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        s: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        samp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        slot: React.DetailedHTMLProps<React.SlotHTMLAttributes<HTMLSlotElement>, HTMLSlotElement>;
        script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement>;
        section: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
        small: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        source: React.DetailedHTMLProps<React.SourceHTMLAttributes<HTMLSourceElement>, HTMLSourceElement>;
        span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
        strong: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        style: React.DetailedHTMLProps<React.StyleHTMLAttributes<HTMLStyleElement>, HTMLStyleElement>;
        sub: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        summary: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        sup: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        table: React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
        template: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTemplateElement>, HTMLTemplateElement>;
        tbody: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        td: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
        textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
        tfoot: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        th: React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>;
        thead: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
        time: React.DetailedHTMLProps<React.TimeHTMLAttributes<HTMLTimeElement>, HTMLTimeElement>;
        title: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTitleElement>, HTMLTitleElement>;
        tr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
        track: React.DetailedHTMLProps<React.TrackHTMLAttributes<HTMLTrackElement>, HTMLTrackElement>;
        u: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        ul: React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        "var": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        video: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
        wbr: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

        svg: React.SVGProps<SVGSVGElement>;
        animate: React.SVGProps<SVGElement>;
        animateMotion: React.SVGProps<SVGElement>;
        animateTransform: React.SVGProps<SVGElement>;
        circle: React.SVGProps<SVGCircleElement>;
        clipPath: React.SVGProps<SVGClipPathElement>;
        defs: React.SVGProps<SVGDefsElement>;
        desc: React.SVGProps<SVGDescElement>;
        ellipse: React.SVGProps<SVGEllipseElement>;
        feBlend: React.SVGProps<SVGFEBlendElement>;
        feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
        feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement>;
        feComposite: React.SVGProps<SVGFECompositeElement>;
        feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement>;
        feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement>;
        feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement>;
        feDistantLight: React.SVGProps<SVGFEDistantLightElement>;
        feDropShadow: React.SVGProps<SVGFEDropShadowElement>;
        feFlood: React.SVGProps<SVGFEFloodElement>;
        feFuncA: React.SVGProps<SVGFEFuncAElement>;
        feFuncB: React.SVGProps<SVGFEFuncBElement>;
        feFuncG: React.SVGProps<SVGFEFuncGElement>;
        feFuncR: React.SVGProps<SVGFEFuncRElement>;
        feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
        feImage: React.SVGProps<SVGFEImageElement>;
        feMerge: React.SVGProps<SVGFEMergeElement>;
        feMergeNode: React.SVGProps<SVGFEMergeNodeElement>;
        feMorphology: React.SVGProps<SVGFEMorphologyElement>;
        feOffset: React.SVGProps<SVGFEOffsetElement>;
        fePointLight: React.SVGProps<SVGFEPointLightElement>;
        feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement>;
        feSpotLight: React.SVGProps<SVGFESpotLightElement>;
        feTile: React.SVGProps<SVGFETileElement>;
        feTurbulence: React.SVGProps<SVGFETurbulenceElement>;
        filter: React.SVGProps<SVGFilterElement>;
        foreignObject: React.SVGProps<SVGForeignObjectElement>;
        g: React.SVGProps<SVGGElement>;
        image: React.SVGProps<SVGImageElement>;
        line: React.SVGProps<SVGLineElement>;
        linearGradient: React.SVGProps<SVGLinearGradientElement>;
        marker: React.SVGProps<SVGMarkerElement>;
        mask: React.SVGProps<SVGMaskElement>;
        metadata: React.SVGProps<SVGMetadataElement>;
        mpath: React.SVGProps<SVGElement>;
        path: React.SVGProps<SVGPathElement>;
        pattern: React.SVGProps<SVGPatternElement>;
        polygon: React.SVGProps<SVGPolygonElement>;
        polyline: React.SVGProps<SVGPolylineElement>;
        radialGradient: React.SVGProps<SVGRadialGradientElement>;
        rect: React.SVGProps<SVGRectElement>;
        stop: React.SVGProps<SVGStopElement>;
        switch: React.SVGProps<SVGSwitchElement>;
        symbol: React.SVGProps<SVGSymbolElement>;
        text: React.SVGProps<SVGTextElement>;
        textPath: React.SVGProps<SVGTextPathElement>;
        tspan: React.SVGProps<SVGTSpanElement>;
        use: React.SVGProps<SVGUseElement>;
        view: React.SVGProps<SVGViewElement>;
    }
}
