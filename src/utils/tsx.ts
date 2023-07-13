import {
    ClassDeclarationStructure,
    JsxChild,
    JsxElement, JsxExpression,
    JsxOpeningElement,
    JsxSelfClosingElement,
    JsxText,
    Scope,
    StructureKind,
    SyntaxKind
} from "ts-morph";
import {ModuleItem} from "../core/types";

const HTML_STANDARD_ELEMENTS: string[] = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noindex",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "slot",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "template",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    "svg",
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tspan",
    "use",
    "view"
]

export function build_JSX(): ClassDeclarationStructure[] {
    return [
        {
            kind: StructureKind.Class,
            name: "JSXElement",
            properties: [
                {
                    kind: StructureKind.Property,
                    scope: Scope.Public,
                    type: "string",
                    name: "tag"
                },
                {
                    kind: StructureKind.Property,
                    scope: Scope.Public,
                    type: "{ [p: string]: any }",
                    name: "attr"
                },
                {
                    kind: StructureKind.Property,
                    scope: Scope.Public,
                    type: "JSXElementList",
                    name: "children"
                }
            ],
            ctors: [
                {
                    kind: StructureKind.Constructor,
                    scope: Scope.Public,
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            type: "string",
                            name: "tag"
                        },
                        {
                            kind: StructureKind.Parameter,
                            type: "{ [p: string]: any }",
                            name: "attr"
                        },
                        {
                            kind: StructureKind.Parameter,
                            type: "JSXElementList",
                            name: "children"
                        }
                    ],
                    statements: writer => {
                        writer.writeLine("this.tag = tag;");
                        writer.writeLine("this.attr = attr;");
                        writer.writeLine("this.children = children;");
                    }
                }
            ]
        },
        {
            kind: StructureKind.Class,
            name: "JSXFragment",
            properties: [
                {
                    kind: StructureKind.Property,
                    scope: Scope.Public,
                    type: "JSXElementList",
                    name: "children"
                }
            ],
            ctors: [
                {
                    kind: StructureKind.Constructor,
                    scope: Scope.Public,
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            type: "JSXElement",
                            name: "children"
                        }
                    ],
                    statements: writer => {
                        writer.writeLine("this.children = children;");
                    }
                }
            ]
        },
        {
            kind: StructureKind.Class,
            name: "JSXText",
            properties: [
                {
                    kind: StructureKind.Property,
                    scope: Scope.Public,
                    type: "string",
                    name: "text"
                }
            ],
            ctors: [
                {
                    kind: StructureKind.Constructor,
                    scope: Scope.Public,
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            type: "string",
                            name: "text"
                        }
                    ],
                    statements: writer => {
                        writer.writeLine("    this.text = text;");
                    }
                }
            ]
        },
        {
            kind: StructureKind.Class,
            name: "JSX",
            methods: [
                {
                    kind: StructureKind.Method,
                    scope: Scope.Public,
                    isStatic: true,
                    name: "createFragment",
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            name: "children",
                            type: "JSXElementList|JSXElementList[]",
                            isRestParameter: true
                        }
                    ],
                    returnType: "JSXFragment",
                    statements: writer => {
                        writer.writeLine("const c: JSXElement[] = [];");
                        writer.writeLine("for (let i: number = 0; i < children.length; i++) {");
                        writer.writeLine("    c.push(Array.isArray(children[i]) ? ...children[i] : children[i]);");
                        writer.writeLine("}")
                        writer.writeLine("return new JSXFragment(c);");
                    }
                },
                {
                    kind: StructureKind.Method,
                    scope: Scope.Public,
                    isStatic: true,
                    name: "createElement",
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            name: "tagName",
                            type: "string"
                        },
                        {
                            kind: StructureKind.Parameter,
                            name: "attributes",
                            type: "{ [key in string]: any }"
                        },
                        {
                            kind: StructureKind.Parameter,
                            name: "children",
                            type: "JSXElementList|JSXElementList[]",
                            isRestParameter: true
                        }
                    ],
                    returnType: "JSXElement",
                    statements: writer => {
                        writer.writeLine("const c: JSXElement[] = [];");
                        writer.writeLine("for (let i: number = 0; i < children.length; i++) {");
                        writer.writeLine("    c.push(Array.isArray(children[i]) ? ...children[i] : children[i]);");
                        writer.writeLine("}")
                        writer.writeLine("return new JSXElement(tag, attr, c);");
                    }
                },
                {
                    kind: StructureKind.Method,
                    scope: Scope.Public,
                    isStatic: true,
                    name: "createText",
                    parameters: [
                        {
                            kind: StructureKind.Parameter,
                            name: "text",
                            type: "string"
                        },
                    ],
                    returnType: "JSXElement",
                    statements: writer => {
                        writer.writeLine("return new JSXText(text);");
                    }
                }
            ]
        }
    ];
}

function tsx_translate_loop(child: JsxChild): string | null {
    if (child.getKind() == SyntaxKind.JsxElement) {
        child = child as JsxElement;

        return tsx_translate_element(child.getOpeningElement(), child.getJsxChildren());
    } else if (child.getKind() == SyntaxKind.JsxSelfClosingElement) {
        child = child as JsxSelfClosingElement;

        return tsx_translate_element(child, []);
    } else if (child.getKind() == SyntaxKind.JsxText) {
        child = child as JsxText;
        let text: string = child.getText();
        text = text.replace(/\n/g, " ").replace(/\r/g, " ").replace(/\s+/g, " ").trimStart().trimEnd();

        if (text == "") {
            return null;
        }

        return `JSX.createText("${text}")`;
    } else if (child.getKind() == SyntaxKind.JsxExpression) {
        child = child as JsxExpression;
        let text: string = child.getText();
        return text.substring(1, text.length - 1);
    }

    return null;
}

function tsx_translate_element(openingElement: JsxOpeningElement | JsxSelfClosingElement, jsxChildren: JsxChild[]): string {
    const tagName: string = openingElement.getChildren()[1].getText();
    const attributes: string = openingElement.getAttributes().map((attr) => {
        const name: string = attr.getChildren()[0].getText();
        let value: string = attr.getChildren()[2]?.getText() || "true";

        if (value.startsWith("{") && value.endsWith("}")) {
            value = value.substring(1, value.length - 1);
        }

        return `${name}: ${value}`
    }).join(", ");

    const children: string = jsxChildren.map(child => tsx_translate_loop(child)).filter(x => x != null).join(", ");

    if (!HTML_STANDARD_ELEMENTS.includes(tagName)) {
        return `${tagName}({${attributes}}, [${children}])`;
    }

    return `JSX.createElement("${tagName}", {${attributes}}, ${children})`;
}

export function tsx_translate(module: ModuleItem): void {
    module.module.getDescendantsOfKind(SyntaxKind.JsxFragment).forEach(element => {
        if (element.wasForgotten()) {
            return;
        }

        const children: string = element.getJsxChildren().map(child => tsx_translate_loop(child)).filter(x => x != null).join(", ");

        element.replaceWithText(`JSX.createFragment(${children})`);
    });

    module.module.getDescendantsOfKind(SyntaxKind.JsxElement).forEach(element => {
        if (element.wasForgotten()) {
            return;
        }
        const replacement: string = tsx_translate_element(element.getOpeningElement(), element.getJsxChildren());
        element.replaceWithText(replacement);
    });

    module.module.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).forEach(element => {
        if (element.wasForgotten()) {
            return;
        }
        const replacement: string = tsx_translate_element(element, []);
        element.replaceWithText(replacement);
    });
}
