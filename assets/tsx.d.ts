type JSXElements = JSXElement | JSXText | JSXFragment
type JSXElementList = JSXElements[]

declare class JSXElement {
    public tag: string;
    public attr: { [p: string]: any };
    public children: JSXElementList;

    constructor(tag: string, attr: { [p: string]: any }, children: JSXElementList);
}

declare class JSXFragment {
    public children: JSXElementList;

    constructor(children: JSXElementList);
}

declare class JSXText {
    public text: string;

    constructor(text: string);
}

declare class JSX {
    public static createElement(tag: string, attr: { [Name in string]: any }, ...children: JSXElementList): JSXElement;

    public static createText(text: string): JSXText;

    public static createFragment(...children: JSXElementList): JSXFragment;
}
