(() => { // webpackBootstrap
var __webpack_modules__ = ({
"./node_modules/astravel/dist/module/astravel.js": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  attachComments: function() { return /* reexport safe */ _attachComments_js__WEBPACK_IMPORTED_MODULE_1__.attachComments; },
  defaultTraveler: function() { return /* reexport safe */ _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler; },
  makeTraveler: function() { return makeTraveler; }
});
/* harmony import */var _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultTraveler.js */ "./node_modules/astravel/dist/module/defaultTraveler.js");
/* harmony import */var _attachComments_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attachComments.js */ "./node_modules/astravel/dist/module/attachComments.js");


function makeTraveler(properties) {
  return _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler.makeChild(properties);
}

//# sourceMappingURL=astravel.js.map

}),
"./node_modules/astravel/dist/module/attachComments.js": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  attachComments: function() { return attachComments; }
});
/* harmony import */var _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./defaultTraveler.js */ "./node_modules/astravel/dist/module/defaultTraveler.js");


function attachCommentsToNode(traveler, state, parent, children, findHeadingComments) {
  let {
    index
  } = state;
  const {
    comments
  } = state;
  let comment = comments[index];
  let boundComments, trailingComments;

  if (comment == null) {
    return;
  }

  if (children == null || children.length === 0) {
    boundComments = parent.comments != null ? parent.comments : [];

    while (comment != null && comment.end <= parent.end) {
      boundComments.push(comment);
      comment = comments[++index];
    }

    state.index = index;

    if (boundComments.length !== 0 && parent.comments == null) {
      parent.comments = boundComments;
    }

    return;
  }

  if (findHeadingComments) {
    boundComments = parent.comments != null ? parent.comments : [];
    const {
      start
    } = children[0];

    while (comment != null && (comment.type[0] === 'B' || comment.type[0] === 'M') && comment.end <= start) {
      boundComments.push(comment);
      comment = comments[++index];
    }

    if (boundComments.length !== 0 && parent.comments == null) parent.comments = boundComments;
  }

  for (let i = 0, {
    length
  } = children; comment != null && i < length; i++) {
    const child = children[i];
    boundComments = [];

    while (comment != null && comment.end <= child.start) {
      boundComments.push(comment);
      comment = comments[++index];
    }

    if (comment != null && comment.loc != null && (comment.type[0] === 'L' || comment.type[0] === 'S')) {
      if (comment.loc.start.line === child.loc.end.line) {
        boundComments.push(comment);
        comment = comments[++index];
      }
    }

    if (boundComments.length !== 0) {
      child.comments = boundComments;
    }

    state.index = index;
    traveler[child.type](child, state);
    index = state.index;
    comment = comments[index];
  }

  trailingComments = [];

  while (comment != null && comment.end <= parent.end) {
    trailingComments.push(comment);
    comment = comments[++index];
  }

  if (trailingComments.length !== 0) {
    parent.trailingComments = trailingComments;
  }

  state.index = index;
}

function Block(node, state) {
  attachCommentsToNode(this, state, node, node.body, true);
}

let traveler = _defaultTraveler_js__WEBPACK_IMPORTED_MODULE_0__.defaultTraveler.makeChild({
  Program: Block,
  BlockStatement: Block,
  ClassBody: Block,

  ObjectExpression(node, state) {
    attachCommentsToNode(this, state, node, node.properties, true);
  },

  ArrayExpression(node, state) {
    attachCommentsToNode(this, state, node, node.elements, true);
  },

  SwitchStatement(node, state) {
    attachCommentsToNode(this, state, node, node.cases, false);
  },

  SwitchCase(node, state) {
    attachCommentsToNode(this, state, node, node.consequent, false);
  }

});
function attachComments(node, comments) {
  traveler[node.type](node, {
    comments,
    index: 0
  });
  return node;
}
//# sourceMappingURL=attachComments.js.map

}),
"./node_modules/astravel/dist/module/defaultTraveler.js": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  defaultTraveler: function() { return defaultTraveler; }
});
let ForInStatement, FunctionDeclaration, RestElement, BinaryExpression, ArrayExpression, Block, MethodDefinition;
const ignore = Function.prototype;

class Found {
  constructor(node, state) {
    this.node = node;
    this.state = state;
  }

}

const defaultTraveler = {
  go(node, state) {
    if (this[node.type]) {
      this[node.type](node, state);
    }
  },

  find(predicate, node, state) {
    const finder = Object.create(this);

    finder.go = function (node, state) {
      if (predicate(node, state)) {
        throw new Found(node, state);
      }

      this[node.type](node, state);
    };

    try {
      finder.go(node, state);
    } catch (error) {
      if (error instanceof Found) {
        return error;
      } else {
        throw error;
      }
    }
  },

  makeChild(properties = {}) {
    const traveler = Object.create(this);
    traveler.super = this;

    for (let key in properties) {
      traveler[key] = properties[key];
    }

    return traveler;
  },

  Program: Block = function (node, state) {
    const {
      body
    } = node;

    if (body != null) {
      const {
        length
      } = body;

      for (let i = 0; i < length; i++) {
        this.go(body[i], state);
      }
    }
  },
  BlockStatement: Block,
  StaticBlock: Block,
  EmptyStatement: ignore,

  ExpressionStatement(node, state) {
    this.go(node.expression, state);
  },

  IfStatement(node, state) {
    this.go(node.test, state);
    this.go(node.consequent, state);

    if (node.alternate != null) {
      this.go(node.alternate, state);
    }
  },

  LabeledStatement(node, state) {
    this.go(node.label, state);
    this.go(node.body, state);
  },

  BreakStatement(node, state) {
    if (node.label) {
      this.go(node.label, state);
    }
  },

  ContinueStatement(node, state) {
    if (node.label) {
      this.go(node.label, state);
    }
  },

  WithStatement(node, state) {
    this.go(node.object, state);
    this.go(node.body, state);
  },

  SwitchStatement(node, state) {
    this.go(node.discriminant, state);
    const {
      cases
    } = node,
          {
      length
    } = cases;

    for (let i = 0; i < length; i++) {
      this.go(cases[i], state);
    }
  },

  SwitchCase(node, state) {
    if (node.test != null) {
      this.go(node.test, state);
    }

    const statements = node.consequent,
          {
      length
    } = statements;

    for (let i = 0; i < length; i++) {
      this.go(statements[i], state);
    }
  },

  ReturnStatement(node, state) {
    if (node.argument) {
      this.go(node.argument, state);
    }
  },

  ThrowStatement(node, state) {
    this.go(node.argument, state);
  },

  TryStatement(node, state) {
    this.go(node.block, state);

    if (node.handler != null) {
      this.go(node.handler, state);
    }

    if (node.finalizer != null) {
      this.go(node.finalizer, state);
    }
  },

  CatchClause(node, state) {
    if (node.param != null) {
      this.go(node.param, state);
    }

    this.go(node.body, state);
  },

  WhileStatement(node, state) {
    this.go(node.test, state);
    this.go(node.body, state);
  },

  DoWhileStatement(node, state) {
    this.go(node.body, state);
    this.go(node.test, state);
  },

  ForStatement(node, state) {
    if (node.init != null) {
      this.go(node.init, state);
    }

    if (node.test != null) {
      this.go(node.test, state);
    }

    if (node.update != null) {
      this.go(node.update, state);
    }

    this.go(node.body, state);
  },

  ForInStatement: ForInStatement = function (node, state) {
    this.go(node.left, state);
    this.go(node.right, state);
    this.go(node.body, state);
  },
  DebuggerStatement: ignore,
  FunctionDeclaration: FunctionDeclaration = function (node, state) {
    if (node.id != null) {
      this.go(node.id, state);
    }

    const {
      params
    } = node;

    if (params != null) {
      for (let i = 0, {
        length
      } = params; i < length; i++) {
        this.go(params[i], state);
      }
    }

    this.go(node.body, state);
  },

  VariableDeclaration(node, state) {
    const {
      declarations
    } = node,
          {
      length
    } = declarations;

    for (let i = 0; i < length; i++) {
      this.go(declarations[i], state);
    }
  },

  VariableDeclarator(node, state) {
    this.go(node.id, state);

    if (node.init != null) {
      this.go(node.init, state);
    }
  },

  ArrowFunctionExpression(node, state) {
    const {
      params
    } = node;

    if (params != null) {
      for (let i = 0, {
        length
      } = params; i < length; i++) {
        this.go(params[i], state);
      }
    }

    this.go(node.body, state);
  },

  ThisExpression: ignore,
  ArrayExpression: ArrayExpression = function (node, state) {
    const {
      elements
    } = node,
          {
      length
    } = elements;

    for (let i = 0; i < length; i++) {
      let element = elements[i];

      if (element != null) {
        this.go(elements[i], state);
      }
    }
  },

  ObjectExpression(node, state) {
    const {
      properties
    } = node,
          {
      length
    } = properties;

    for (let i = 0; i < length; i++) {
      this.go(properties[i], state);
    }
  },

  Property(node, state) {
    this.go(node.key, state);

    if (node.value != null) {
      this.go(node.value, state);
    }
  },

  FunctionExpression: FunctionDeclaration,

  SequenceExpression(node, state) {
    const {
      expressions
    } = node,
          {
      length
    } = expressions;

    for (let i = 0; i < length; i++) {
      this.go(expressions[i], state);
    }
  },

  UnaryExpression(node, state) {
    this.go(node.argument, state);
  },

  UpdateExpression(node, state) {
    this.go(node.argument, state);
  },

  AssignmentExpression(node, state) {
    this.go(node.left, state);
    this.go(node.right, state);
  },

  BinaryExpression: BinaryExpression = function (node, state) {
    this.go(node.left, state);
    this.go(node.right, state);
  },
  LogicalExpression: BinaryExpression,

  ConditionalExpression(node, state) {
    this.go(node.test, state);
    this.go(node.consequent, state);
    this.go(node.alternate, state);
  },

  NewExpression(node, state) {
    this.CallExpression(node, state);
  },

  CallExpression(node, state) {
    this.go(node.callee, state);
    const args = node['arguments'],
          {
      length
    } = args;

    for (let i = 0; i < length; i++) {
      this.go(args[i], state);
    }
  },

  MemberExpression(node, state) {
    this.go(node.object, state);
    this.go(node.property, state);
  },

  Identifier: ignore,
  PrivateIdentifier: ignore,
  Literal: ignore,
  ForOfStatement: ForInStatement,

  ClassDeclaration(node, state) {
    if (node.id) {
      this.go(node.id, state);
    }

    if (node.superClass) {
      this.go(node.superClass, state);
    }

    this.go(node.body, state);
  },

  ClassBody: Block,

  ImportDeclaration(node, state) {
    const {
      specifiers
    } = node,
          {
      length
    } = specifiers;

    for (let i = 0; i < length; i++) {
      this.go(specifiers[i], state);
    }

    this.go(node.source, state);
  },

  ImportNamespaceSpecifier(node, state) {
    this.go(node.local, state);
  },

  ImportDefaultSpecifier(node, state) {
    this.go(node.local, state);
  },

  ImportSpecifier(node, state) {
    this.go(node.imported, state);
    this.go(node.local, state);
  },

  ExportDefaultDeclaration(node, state) {
    this.go(node.declaration, state);
  },

  ExportNamedDeclaration(node, state) {
    if (node.declaration) {
      this.go(node.declaration, state);
    }

    const {
      specifiers
    } = node,
          {
      length
    } = specifiers;

    for (let i = 0; i < length; i++) {
      this.go(specifiers[i], state);
    }

    if (node.source) {
      this.go(node.source, state);
    }
  },

  ExportSpecifier(node, state) {
    this.go(node.local, state);
    this.go(node.exported, state);
  },

  ExportAllDeclaration(node, state) {
    this.go(node.source, state);
  },

  MethodDefinition: MethodDefinition = function (node, state) {
    this.go(node.key, state);
    this.go(node.value, state);
  },
  PropertyDefinition: MethodDefinition,

  ClassExpression(node, state) {
    this.ClassDeclaration(node, state);
  },

  Super: ignore,
  RestElement: RestElement = function (node, state) {
    this.go(node.argument, state);
  },
  SpreadElement: RestElement,

  YieldExpression(node, state) {
    if (node.argument) {
      this.go(node.argument, state);
    }
  },

  TaggedTemplateExpression(node, state) {
    this.go(node.tag, state);
    this.go(node.quasi, state);
  },

  TemplateLiteral(node, state) {
    const {
      quasis,
      expressions
    } = node;

    for (let i = 0, {
      length
    } = expressions; i < length; i++) {
      this.go(expressions[i], state);
    }

    for (let i = 0, {
      length
    } = quasis; i < length; i++) {
      this.go(quasis[i], state);
    }
  },

  TemplateElement: ignore,

  ObjectPattern(node, state) {
    const {
      properties
    } = node,
          {
      length
    } = properties;

    for (let i = 0; i < length; i++) {
      this.go(properties[i], state);
    }
  },

  ArrayPattern: ArrayExpression,

  AssignmentPattern(node, state) {
    this.go(node.left, state);
    this.go(node.right, state);
  },

  MetaProperty(node, state) {
    this.go(node.meta, state);
    this.go(node.property, state);
  },

  AwaitExpression(node, state) {
    this.go(node.argument, state);
  }

};
//# sourceMappingURL=defaultTraveler.js.map

}),
"./src/client/beacon.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");

navigator.sendBeacon = new Proxy(navigator.sendBeacon, {
    apply: function apply(target, thisArg, argArray) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        return Reflect.apply(target, thisArg, argArray);
    }
});


}),
"./src/client/css.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");

var cssProperties = [
    "background",
    "background-image",
    "mask",
    "mask-image",
    "list-style",
    "list-style-image",
    "border-image",
    "border-image-source",
    "cursor"
];
// const jsProperties = ["background", "backgroundImage", "mask", "maskImage", "listStyle", "listStyleImage", "borderImage", "borderImageSource", "cursor"];
CSSStyleDeclaration.prototype.setProperty = new Proxy(CSSStyleDeclaration.prototype.setProperty, {
    apply: function apply(target, thisArg, argArray) {
        if (cssProperties.includes(argArray[0])) argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteCss)(argArray[1]);
        return Reflect.apply(target, thisArg, argArray);
    }
});


}),
"./src/client/element.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/rewriters/url */ "./src/shared/rewriters/url.ts");
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}


var attrObject = {
    nonce: [
        HTMLElement
    ],
    integrity: [
        HTMLScriptElement,
        HTMLLinkElement
    ],
    csp: [
        HTMLIFrameElement
    ],
    src: [
        HTMLImageElement,
        HTMLMediaElement,
        HTMLIFrameElement,
        HTMLEmbedElement,
        HTMLScriptElement
    ],
    href: [
        HTMLAnchorElement,
        HTMLLinkElement
    ],
    data: [
        HTMLObjectElement
    ],
    action: [
        HTMLFormElement
    ],
    formaction: [
        HTMLButtonElement,
        HTMLInputElement
    ],
    srcdoc: [
        HTMLIFrameElement
    ],
    srcset: [
        HTMLImageElement,
        HTMLSourceElement
    ],
    imagesrcset: [
        HTMLLinkElement
    ]
};
var attrs = Object.keys(attrObject);
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
try {
    var _loop = function() {
        var attr = _step.value;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var element = _step1.value;
                var descriptor = Object.getOwnPropertyDescriptor(element.prototype, attr);
                Object.defineProperty(element.prototype, attr, {
                    get: function get() {
                        if (/src|href|data|action|formaction/.test(attr)) {
                            return (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(descriptor.get.call(this));
                        }
                        if (this.__origattrs[attr]) {
                            return this.__origattrs[attr];
                        }
                        return descriptor.get.call(this);
                    },
                    set: function set(value) {
                        this.__origattrs[attr] = value;
                        if (/nonce|integrity|csp/.test(attr)) {
                            return;
                        } else if (/src|href|data|action|formaction/.test(attr)) {
                            value = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(value);
                        } else if (attr === "srcdoc") {
                            value = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteHtml)(value);
                        } else if (/(image)?srcset/.test(attr)) {
                            value = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteSrcset)(value);
                        }
                        descriptor.set.call(this, value);
                    }
                });
            };
            for(var _iterator = attrObject[attr][Symbol.iterator](), _step1; !(_iteratorNormalCompletion = (_step1 = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };
    for(var _iterator = attrs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally{
    try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
        }
    } finally{
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
Element.prototype.__origattrs = {};
Element.prototype.getAttribute = new Proxy(Element.prototype.getAttribute, {
    apply: function apply(target, thisArg, argArray) {
        if (attrs.includes(argArray[0]) && thisArg.__origattrs[argArray[0]]) {
            return thisArg.__origattrs[argArray[0]];
        }
        return Reflect.apply(target, thisArg, argArray);
    }
});
Element.prototype.setAttribute = new Proxy(Element.prototype.setAttribute, {
    apply: function apply(target, thisArg, argArray) {
        if (attrs.includes(argArray[0])) {
            thisArg.__origattrs[argArray[0]] = argArray[1];
            if (/nonce|integrity|csp/.test(argArray[0])) {
                return;
            } else if (/src|href|data|action|formaction/.test(argArray[0])) {
                argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.encodeUrl)(argArray[1]);
            } else if (argArray[0] === "srcdoc") {
                argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteHtml)(argArray[1]);
            } else if (/(image)?srcset/.test(argArray[0])) {
                argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteSrcset)(argArray[1]);
            } else if (argArray[1] === "style") {
                argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteCss)(argArray[1]);
            }
        }
        return Reflect.apply(target, thisArg, argArray);
    }
});
var innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
Object.defineProperty(Element.prototype, "innerHTML", {
    set: function set(value) {
        if (_instanceof(this, HTMLScriptElement)) {
            value = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteJs)(value);
        } else if (_instanceof(this, HTMLStyleElement)) {
            value = (0,_shared__WEBPACK_IMPORTED_MODULE_1__.rewriteCss)(value);
        }
        return innerHTML.set.call(this, value);
    }
});


}),
"./src/client/event.ts": (function () {
// idk what shit has to be done on here but it has to be done
// i'm going to temporarily disable rewriting if a MemberExpression detects addEventListener
// window.addEventListener = new Proxy(window.addEventListener, {
//     apply (target, thisArg, argArray) {
//         //
//         return Reflect.apply(target, thisArg, argArray);
//     }
// })


}),
"./src/client/history.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");

window.history.pushState = new Proxy(window.history.pushState, {
    apply: function apply(target, thisArg, argArray) {
        argArray[3] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(argArray[3]);
        return Reflect.apply(target, thisArg, argArray);
    }
});
window.history.replaceState = new Proxy(window.history.replaceState, {
    apply: function apply(target, thisArg, argArray) {
        argArray[3] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(argArray[3]);
        return Reflect.apply(target, thisArg, argArray);
    }
});


}),
"./src/client/index.ts": (function (module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.a(module, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _scope_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scope.ts */ "./src/client/scope.ts");
/* harmony import */var _window_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./window.ts */ "./src/client/window.ts");
/* harmony import */var _event_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./event.ts */ "./src/client/event.ts");
/* harmony import */var _event_ts__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_event_ts__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */var _native_eval_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./native/eval.ts */ "./src/client/native/eval.ts");
/* harmony import */var _location_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./location.ts */ "./src/client/location.ts");
/* harmony import */var _trustedTypes_ts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./trustedTypes.ts */ "./src/client/trustedTypes.ts");
/* harmony import */var _trustedTypes_ts__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_trustedTypes_ts__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */var _requests_fetch_ts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./requests/fetch.ts */ "./src/client/requests/fetch.ts");
/* harmony import */var _requests_xmlhttprequest_ts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./requests/xmlhttprequest.ts */ "./src/client/requests/xmlhttprequest.ts");
/* harmony import */var _requests_websocket_ts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./requests/websocket.ts */ "./src/client/requests/websocket.ts");
/* harmony import */var _element_ts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./element.ts */ "./src/client/element.ts");
/* harmony import */var _storage_ts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./storage.ts */ "./src/client/storage.ts");
/* harmony import */var _css_ts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./css.ts */ "./src/client/css.ts");
/* harmony import */var _history_ts__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./history.ts */ "./src/client/history.ts");
/* harmony import */var _worker_ts__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./worker.ts */ "./src/client/worker.ts");
/* harmony import */var _url_ts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./url.ts */ "./src/client/url.ts");
/* harmony import */var _beacon_ts__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./beacon.ts */ "./src/client/beacon.ts");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_storage_ts__WEBPACK_IMPORTED_MODULE_10__]);
_storage_ts__WEBPACK_IMPORTED_MODULE_10__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
















__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

}),
"./src/client/location.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  locationProxy: function() { return locationProxy; }
});
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");
// @ts-nocheck

function createLocation() {
    var loc = new URL((0,_shared__WEBPACK_IMPORTED_MODULE_0__.decodeUrl)(location.href));
    loc.assign = function(url) {
        return location.assign((0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(url));
    };
    loc.reload = function() {
        return location.reload();
    };
    loc.replace = function(url) {
        return location.replace((0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(url));
    };
    loc.toString = function() {
        return loc.href;
    };
    return loc;
}
var locationProxy = new Proxy(window.location, {
    get: function get(target, prop) {
        var loc = createLocation();
        return loc[prop];
    },
    set: function set(obj, prop, value) {
        var loc = createLocation();
        if (prop === "href") {
            location.href = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(value);
        } else {
            loc[prop] = value;
        }
        return true;
    }
});


}),
"./src/client/native/eval.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared */ "./src/client/shared.ts");
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}

var FunctionProxy = new Proxy(Function, {
    construct: function construct(target, argArray) {
        if (argArray.length === 1) {
            return Reflect.construct(target, (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(argArray[0]));
        } else {
            return Reflect.construct(target, (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(argArray[argArray.length - 1]));
        }
    },
    apply: function apply(target, thisArg, argArray) {
        if (argArray.length === 1) {
            return Reflect.apply(target, undefined, [
                (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(argArray[0])
            ]);
        } else {
            return Reflect.apply(target, undefined, _to_consumable_array(argArray.map(function(x, index) {
                return index === argArray.length - 1;
            })).concat([
                (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(argArray[argArray.length - 1])
            ]));
        }
    }
});
delete window.Function;
window.Function = FunctionProxy;
window.eval = new Proxy(window.eval, {
    apply: function apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
            (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteJs)(argArray[0])
        ]);
    }
});


}),
"./src/client/requests/fetch.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared */ "./src/client/shared.ts");
// ts throws an error if you dont do window.fetch

window.fetch = new Proxy(window.fetch, {
    apply: function apply(target, thisArg, argArray) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        return Reflect.apply(target, thisArg, argArray);
    }
});
Headers = new Proxy(Headers, {
    construct: function construct(target, argArray, newTarget) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteHeaders)(argArray[0]);
        return Reflect.construct(target, argArray, newTarget);
    }
});
Request = new Proxy(Request, {
    construct: function construct(target, argArray, newTarget) {
        if (typeof argArray[0] === "string") argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        return Reflect.construct(target, argArray, newTarget);
    }
});
Response.redirect = new Proxy(Response.redirect, {
    apply: function apply(target, thisArg, argArray) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        return Reflect.apply(target, thisArg, argArray);
    }
});


}),
"./src/client/requests/websocket.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared */ "./src/client/shared.ts");

var client = new _shared__WEBPACK_IMPORTED_MODULE_0__.BareClient();
WebSocket = new Proxy(WebSocket, {
    construct: function construct(target, args) {
        return client.createWebSocket(args[0], args[1], target, {
            "User-Agent": navigator.userAgent
        }, ArrayBuffer.prototype);
    }
});


}),
"./src/client/requests/xmlhttprequest.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared */ "./src/client/shared.ts");

XMLHttpRequest.prototype.open = new Proxy(XMLHttpRequest.prototype.open, {
    apply: function apply(target, thisArg, argArray) {
        if (argArray[1]) argArray[1] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[1]);
        return Reflect.apply(target, thisArg, argArray);
    }
});
XMLHttpRequest.prototype.setRequestHeader = new Proxy(XMLHttpRequest.prototype.setRequestHeader, {
    apply: function apply(target, thisArg, argArray) {
        var headerObject = Object.fromEntries([
            argArray
        ]);
        headerObject = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.rewriteHeaders)(headerObject);
        argArray = Object.entries(headerObject)[0];
        return Reflect.apply(target, thisArg, argArray);
    }
});


}),
"./src/client/scope.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./location */ "./src/client/location.ts");
/* harmony import */var _window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./window */ "./src/client/window.ts");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}


function scope(identifier) {
    if (_instanceof(identifier, Window)) {
        return _window__WEBPACK_IMPORTED_MODULE_1__.windowProxy;
    } else if (_instanceof(identifier, Location)) {
        return _location__WEBPACK_IMPORTED_MODULE_0__.locationProxy;
    }
    return identifier;
}
// shorthand because this can get out of hand reall quickly
window.$s = scope;


}),
"./src/client/shared.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  BareClient: function() { return BareClient; },
  decodeUrl: function() { return decodeUrl; },
  encodeUrl: function() { return encodeUrl; },
  isScramjetFile: function() { return isScramjetFile; },
  rewriteCss: function() { return rewriteCss; },
  rewriteHeaders: function() { return rewriteHeaders; },
  rewriteHtml: function() { return rewriteHtml; },
  rewriteJs: function() { return rewriteJs; },
  rewriteSrcset: function() { return rewriteSrcset; },
  rewriteWorkers: function() { return rewriteWorkers; }
});
var _self_$scramjet_shared = self.$scramjet.shared, _self_$scramjet_shared_util = _self_$scramjet_shared.util, _self_$scramjet_shared_url = _self_$scramjet_shared.url, _self_$scramjet_shared_rewrite = _self_$scramjet_shared.rewrite;
var isScramjetFile = _self_$scramjet_shared_util.isScramjetFile, BareClient = _self_$scramjet_shared_util.BareClient, encodeUrl = _self_$scramjet_shared_url.encodeUrl, decodeUrl = _self_$scramjet_shared_url.decodeUrl, rewriteCss = _self_$scramjet_shared_rewrite.rewriteCss, rewriteHtml = _self_$scramjet_shared_rewrite.rewriteHtml, rewriteSrcset = _self_$scramjet_shared_rewrite.rewriteSrcset, rewriteJs = _self_$scramjet_shared_rewrite.rewriteJs, rewriteHeaders = _self_$scramjet_shared_rewrite.rewriteHeaders, rewriteWorkers = _self_$scramjet_shared_rewrite.rewriteWorkers;


}),
"./src/client/storage.ts": (function (module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.a(module, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _webreflection_idb_map_sync__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @webreflection/idb-map/sync */ "./node_modules/@webreflection/idb-map/sync.js");
/* harmony import */var _location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./location */ "./src/client/location.ts");


var store = new _webreflection_idb_map_sync__WEBPACK_IMPORTED_MODULE_0__["default"](_location__WEBPACK_IMPORTED_MODULE_1__.locationProxy.host, {
    prefix: "Storage",
    durability: "relaxed"
});
await store.sync();
function storageProxy(scope) {
    return new Proxy(scope, {
        get: function get(target, prop) {
            switch(prop){
                case "getItem":
                    return function(key) {
                        return store.get(key);
                    };
                case "setItem":
                    return function(key, value) {
                        store.set(key, value);
                        store.sync();
                    };
                case "removeItem":
                    return function(key) {
                        store.delete(key);
                        store.sync();
                    };
                case "clear":
                    return function() {
                        store.clear();
                        store.sync();
                    };
                case "key":
                    return function(index) {
                        store.keys()[index];
                    };
                case "length":
                    return store.size;
                default:
                    return store.get(prop);
            }
        },
        //@ts-ignore
        set: function set(target, prop, value) {
            store.set(prop, value);
            store.sync();
        },
        defineProperty: function defineProperty(target, property, attributes) {
            store.set(property, attributes.value);
            return true;
        }
    });
}
var localStorageProxy = storageProxy(window.localStorage);
var sessionStorageProxy = storageProxy(window.sessionStorage);
delete window.localStorage;
delete window.sessionStorage;
window.localStorage = localStorageProxy;
window.sessionStorage = sessionStorageProxy;

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

}),
"./src/client/trustedTypes.ts": (function () {
// import { rewriteHtml, rewriteJs, encodeUrl } from "./shared";
// trustedTypes.createPolicy = new Proxy(trustedTypes.createPolicy, {
// 	apply(target, thisArg, argArray) {
// 		if (argArray[1].createHTML) {
// 			argArray[1].createHTML = new Proxy(argArray[1].createHTML, {
// 				apply(target1, thisArg1, argArray1) {
// 					return rewriteHtml(target1(...argArray1));
// 				},
// 			});
// 		}
//
// 		if (argArray[1].createScript) {
// 			argArray[1].createScript = new Proxy(argArray[1].createScript, {
// 				apply(target1, thisArg1, argArray1) {
// 					return rewriteJs(target1(...argArray1));
// 				},
// 			});
// 		}
//
// 		if (argArray[1].createScriptURL) {
// 			argArray[1].createScriptURL = new Proxy(argArray[1].createScriptURL, {
// 				apply(target1, thisArg1, argArray1) {
// 					return encodeUrl(target1(...argArray1));
// 				},
// 			});
// 		}
//
// 		return Reflect.apply(target, thisArg, argArray);
// 	},
// });
//@ts-nocheck
delete window.TrustedHTML;
delete window.TrustedScript;
delete window.TrustedScriptURL;
delete window.TrustedTypePolicy;
delete window.TrustedTypePolicyFactory;
delete window.trustedTypes;


}),
"./src/client/url.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  URL: function() { return URL; }
});
/* harmony import */var _shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/rewriters/url */ "./src/shared/rewriters/url.ts");

var URL = globalThis.URL;
if (globalThis.window) {
    window.URL = new Proxy(URL, {
        construct: function construct(target, argArray, newTarget) {
            if (typeof argArray[0] === "string") argArray[0] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
            if (typeof argArray[1] === "string") argArray[1] = (0,_shared_rewriters_url__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[1]);
            return Reflect.construct(target, argArray, newTarget);
        }
    });
}


}),
"./src/client/window.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  windowProxy: function() { return windowProxy; }
});
/* harmony import */var _location__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./location */ "./src/client/location.ts");

var windowProxy = new Proxy(window, {
    get: function get(target, prop) {
        var propIsString = typeof prop === "string";
        if (propIsString && prop === "location") {
            return _location__WEBPACK_IMPORTED_MODULE_0__.locationProxy;
        } else if (propIsString && [
            "window",
            "top",
            "parent",
            "self",
            "globalThis"
        ].includes(prop)) {
            return windowProxy;
        } else if (propIsString && prop === "$scramjet") {
            return;
        } else if (propIsString && prop === "addEventListener") {
            console.log("addEventListener getteetetetetet");
            return new Proxy(window.addEventListener, {
                apply: function apply(target1, thisArg, argArray) {
                    window.addEventListener(argArray[0], argArray[1]);
                }
            });
        }
        var value = Reflect.get(target, prop);
        if (typeof value === "function") {
            return value.bind(target);
        }
        return value;
    },
    set: function set(target, prop, newValue) {
        // ensures that no apis are overwritten
        if (typeof prop === "string" && [
            "window",
            "top",
            "parent",
            "self",
            "globalThis",
            "location"
        ].includes(prop)) {
            return false;
        }
        return Reflect.set(target, prop, newValue);
    }
});


}),
"./src/client/worker.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */var _shared__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared */ "./src/client/shared.ts");

Worker = new Proxy(Worker, {
    construct: function construct(target, argArray) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        // target is a reference to the object that you are proxying
        // Reflect.construct is just a wrapper for calling target
        // you could do new target(...argArray) and it would work the same effectively
        return Reflect.construct(target, argArray);
    }
});
Worklet.prototype.addModule = new Proxy(Worklet.prototype.addModule, {
    apply: function apply(target, thisArg, argArray) {
        argArray[0] = (0,_shared__WEBPACK_IMPORTED_MODULE_0__.encodeUrl)(argArray[0]);
        return Reflect.apply(target, thisArg, argArray);
    }
}); // broken
 // window.importScripts = new Proxy(window.importScripts, {
 //     apply(target, thisArg, argArray) {
 //         for (const i in argArray) {
 //             argArray[i] = encodeUrl(argArray[i]);
 //         }
 //         return Reflect.apply(target, thisArg, argArray);
 //     },
 // });


}),
"./src/shared/rewriters/js.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  rewriteJs: function() { return rewriteJs; }
});
/* harmony import */var meriyah__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! meriyah */ "./node_modules/meriyah/dist/meriyah.esm.mjs");
/* harmony import */var astring__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! astring */ "./node_modules/astring/dist/astring.mjs");
/* harmony import */var astravel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! astravel */ "./node_modules/astravel/dist/module/astravel.js");
/* harmony import */var _url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./url */ "./src/shared/rewriters/url.ts");




// i am a cat. i like to be petted. i like to be fed. i like to be
// js rewiter is NOT finished
// location
// window
// self
// globalThis
// this
// top
// parent
function rewriteJs(js, origin) {
    try {
        var ast = (0,meriyah__WEBPACK_IMPORTED_MODULE_0__.parseModule)(js, {
            module: true,
            webcompat: true
        });
        var identifierList = [
            "window",
            "self",
            "globalThis",
            "this",
            "parent",
            "top",
            "location"
        ];
        var customTraveler = (0,astravel__WEBPACK_IMPORTED_MODULE_2__.makeTraveler)({
            ImportDeclaration: function(node) {
                node.source.value = (0,_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(node.source.value, origin);
            },
            ImportExpression: function(node) {
                if (node.source.type === "Literal") {
                    node.source.value = (0,_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(node.source.value, origin);
                } else if (node.source.type === "Identifier") {
                    // this is for things that import something like
                    // const moduleName = "name";
                    // await import(moduleName);
                    node.source.name = "__wrapImport(".concat(node.source.name, ")");
                }
            },
            ExportAllDeclaration: function(node) {
                node.source.value = (0,_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(node.source.value, origin);
            },
            ExportNamedDeclaration: function(node) {
                // strings are Literals in ESTree syntax but these will always be strings
                if (node.source) node.source.value = (0,_url__WEBPACK_IMPORTED_MODULE_3__.encodeUrl)(node.source.value, origin);
            },
            MemberExpression: function(node) {
                if (node.object.type === "Identifier" && identifierList.includes(node.object.name)) {
                    node.object.name = "globalThis.$s(".concat(node.object.name, ")");
                }
            },
            AssignmentExpression: function(node) {
                if (node.left.type === "Identifier" && identifierList.includes(node.left.name)) {
                    node.left.name = "globalThis.$s(".concat(node.left.name, ")");
                }
                if (node.right.type === "Identifier" && identifierList.includes(node.right.name)) {
                    node.right.name = "globalThis.$s(".concat(node.right.name, ")");
                }
            },
            VariableDeclarator: function(node) {
                if (node.init && node.init.type === "Identifier" && identifierList.includes(node.init.name)) {
                    node.init.name = "globalThis.$s(".concat(node.init.name, ")");
                }
            }
        });
        customTraveler.go(ast);
        return (0,astring__WEBPACK_IMPORTED_MODULE_1__.generate)(ast);
    } catch (e) {
        console.error(e);
        console.log(js);
        return js;
    }
}


}),
"./src/shared/rewriters/url.ts": (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  decodeUrl: function() { return decodeUrl; },
  encodeUrl: function() { return encodeUrl; }
});
/* harmony import */var _client_url__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../client/url */ "./src/client/url.ts");
/* harmony import */var _js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js */ "./src/shared/rewriters/js.ts");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}


function canParseUrl(url, origin) {
    try {
        new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(url, origin);
        return true;
    } catch (e) {
        return false;
    }
}
// something is broken with this but i didn't debug it
function encodeUrl(url, origin) {
    if (_instanceof(url, _client_url__WEBPACK_IMPORTED_MODULE_0__.URL)) {
        return url.toString();
    }
    if (!origin) {
        origin = new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(self.$scramjet.config.codec.decode(location.href.slice((location.origin + self.$scramjet.config.prefix).length)));
    }
    // is this the correct behavior?
    if (!url) url = origin.href;
    if (url.startsWith("javascript:")) {
        return "javascript:" + (0,_js__WEBPACK_IMPORTED_MODULE_1__.rewriteJs)(url.slice("javascript:".length));
    } else if (/^(#|mailto|about|data)/.test(url)) {
        return url;
    } else if (canParseUrl(url, origin)) {
        return location.origin + self.$scramjet.config.prefix + self.$scramjet.config.codec.encode(new _client_url__WEBPACK_IMPORTED_MODULE_0__.URL(url, origin).href);
    }
}
// something is also broken with this but i didn't debug it
function decodeUrl(url) {
    if (_instanceof(url, _client_url__WEBPACK_IMPORTED_MODULE_0__.URL)) {
        return url.toString();
    }
    if (/^(#|about|data|mailto|javascript)/.test(url)) {
        return url;
    } else if (canParseUrl(url)) {
        return self.$scramjet.config.codec.decode(url.slice((location.origin + self.$scramjet.config.prefix).length));
    } else {
        return url;
    }
}


}),
"./node_modules/@webreflection/idb-map/index.js": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return IDBMap; }
});
const { assign } = Object;

const STORAGE = 'entries';
const READONLY = 'readonly';
const READWRITE = 'readwrite';

/**
 * @typedef {Object} IDBMapOptions
 * @prop {'strict' | 'relaxed' | 'default'} [durability]
 * @prop {string} [prefix]
 */

/** @typedef {[IDBValidKey, unknown]} IDBMapEntry */

/** @type {IDBMapOptions} */
const defaultOptions = { durability: 'default', prefix: 'IDBMap' };

/**
 * @template T
 * @param {{ target: IDBRequest<T> }} event
 * @returns {T}
 */
const result = ({ target: { result } }) => result;

class IDBMap extends EventTarget {
  // Privates
  /** @type {Promise<IDBDatabase>} */ #db;
  /** @type {IDBMapOptions} */ #options;
  /** @type {string} */ #prefix;

  /**
   * @template T
   * @param {(store: IDBObjectStore) => IDBRequest<T>} what
   * @param {'readonly' | 'readwrite'} how
   * @returns {Promise<T>}
   */
  async #transaction(what, how) {
    const db = await this.#db;
    const t = db.transaction(STORAGE, how, this.#options);
    return new Promise((onsuccess, onerror) => assign(
      what(t.objectStore(STORAGE)),
      {
        onsuccess,
        onerror,
      }
    ));
  }

  /**
   * @param {string} name
   * @param {IDBMapOptions} options
   */
  constructor(
    name,
    {
      durability = defaultOptions.durability,
      prefix = defaultOptions.prefix,
    } = defaultOptions
  ) {
    super();
    this.#prefix = prefix;
    this.#options = { durability };
    this.#db = new Promise((resolve, reject) => {
      assign(
        indexedDB.open(`${this.#prefix}/${name}`),
        {
          onupgradeneeded({ target: { result, transaction } }) {
            if (!result.objectStoreNames.length)
              result.createObjectStore(STORAGE);
            transaction.oncomplete = () => resolve(result);
          },
          onsuccess(event) {
            resolve(result(event));
          },
          onerror(event) {
            reject(event);
            this.dispatchEvent(event);
          },
        },
      );
    }).then(result => {
      const boundDispatch = this.dispatchEvent.bind(this);
      for (const key in result) {
        if (key.startsWith('on'))
          result[key] = boundDispatch;
      }
      return result;
    });
  }

  // EventTarget Forwards
  /**
   * @param {Event} event
   * @returns 
   */
  dispatchEvent(event) {
    const { type, message, isTrusted } = event;
    return super.dispatchEvent(
      // avoid re-dispatching of the same event
      isTrusted ?
        assign(new Event(type), { message }) :
        event
    );
  }

  // IDBDatabase Forwards
  async close() {
    (await this.#db).close();
  }

  // Map async API
  get size() {
    return this.#transaction(
      store => store.count(),
      READONLY,
    ).then(result);
  }

  async clear() {
    await this.#transaction(
      store => store.clear(),
      READWRITE,
    );
  }

  /**
   * @param {IDBValidKey} key
   */
  async delete(key) {
    await this.#transaction(
      store => store.delete(key),
      READWRITE,
    );
  }

  /**
   * @returns {Promise<IDBMapEntry[]>}
   */
  async entries() {
    const keys = await this.keys();
    return Promise.all(keys.map(key => this.get(key).then(value => [key, value])));
  }

  /**
   * @param {(unknown, IDBValidKey, IDBMap) => void} callback
   * @param {unknown} [context]
   */
  async forEach(callback, context = this) {
    for (const [key, value] of await this.entries())
      await callback.call(context, value, key, this);
  }

  /**
   * @param {IDBValidKey} key
   * @returns {Promise<unknown | undefined>}
   */
  async get(key) {
    const value = await this.#transaction(
      store => store.get(key),
      READONLY,
    ).then(result);
    return value;
  }

  /**
   * @param {IDBValidKey} key
   */
  async has(key) {
    const k = await this.#transaction(
      store => store.getKey(key),
      READONLY,
    ).then(result);
    return k !== void 0;
  }

  async keys() {
    const keys = await this.#transaction(
      store => store.getAllKeys(),
      READONLY,
    ).then(result);
    return keys;
  }

  /**
   * @param {IDBValidKey} key
   * @param {unknown} value
   */
  async set(key, value) {
    await this.#transaction(
      store => store.put(value, key),
      READWRITE,
    );
    return this;
  }

  async values() {
    const keys = await this.keys();
    return Promise.all(keys.map(key => this.get(key)));
  }

  get [Symbol.toStringTag]() {
    return this.#prefix;
  }
}


}),
"./node_modules/@webreflection/idb-map/sync.js": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return IDBMapSync; }
});
/* harmony import */var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/@webreflection/idb-map/index.js");


class IDBMapSync extends Map {
  #map;
  #queue;
  constructor(...args) {
    super();
    this.#map = new _index_js__WEBPACK_IMPORTED_MODULE_0__["default"](...args);
    this.#queue = this.#map.entries().then(entries => {
      for (const [key, value] of entries)
        super.set(key, value);
    });
  }
  async sync() {
    await this.#queue;
  }
  clear() {
    this.#queue = this.#queue.then(() => this.#map.clear());
    return super.clear();
  }
  delete(key) {
    this.#queue = this.#queue.then(() => this.#map.delete(key));
    return super.delete(key);
  }
  set(key, value) {
    this.#queue = this.#queue.then(() => this.#map.set(key, value));
    return super.set(key, value);
  }
}


}),
"./node_modules/astring/dist/astring.mjs": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  EXPRESSIONS_PRECEDENCE: function() { return EXPRESSIONS_PRECEDENCE; },
  GENERATOR: function() { return GENERATOR; },
  NEEDS_PARENTHESES: function() { return NEEDS_PARENTHESES; },
  baseGenerator: function() { return baseGenerator; },
  generate: function() { return generate; }
});
// Astring is a tiny and fast JavaScript code generator from an ESTree-compliant AST.
//
// Astring was written by David Bonnet and released under an MIT license.
//
// The Git repository for Astring is available at:
// https://github.com/davidbonnet/astring.git
//
// Please use the GitHub bug tracker to report issues:
// https://github.com/davidbonnet/astring/issues

const { stringify } = JSON

/* c8 ignore if */
if (!String.prototype.repeat) {
  /* c8 ignore next */
  throw new Error(
    'String.prototype.repeat is undefined, see https://github.com/davidbonnet/astring#installation',
  )
}

/* c8 ignore if */
if (!String.prototype.endsWith) {
  /* c8 ignore next */
  throw new Error(
    'String.prototype.endsWith is undefined, see https://github.com/davidbonnet/astring#installation',
  )
}

const OPERATOR_PRECEDENCE = {
  '||': 2,
  '??': 3,
  '&&': 4,
  '|': 5,
  '^': 6,
  '&': 7,
  '==': 8,
  '!=': 8,
  '===': 8,
  '!==': 8,
  '<': 9,
  '>': 9,
  '<=': 9,
  '>=': 9,
  in: 9,
  instanceof: 9,
  '<<': 10,
  '>>': 10,
  '>>>': 10,
  '+': 11,
  '-': 11,
  '*': 12,
  '%': 12,
  '/': 12,
  '**': 13,
}

// Enables parenthesis regardless of precedence
const NEEDS_PARENTHESES = 17

const EXPRESSIONS_PRECEDENCE = {
  // Definitions
  ArrayExpression: 20,
  TaggedTemplateExpression: 20,
  ThisExpression: 20,
  Identifier: 20,
  PrivateIdentifier: 20,
  Literal: 18,
  TemplateLiteral: 20,
  Super: 20,
  SequenceExpression: 20,
  // Operations
  MemberExpression: 19,
  ChainExpression: 19,
  CallExpression: 19,
  NewExpression: 19,
  // Other definitions
  ArrowFunctionExpression: NEEDS_PARENTHESES,
  ClassExpression: NEEDS_PARENTHESES,
  FunctionExpression: NEEDS_PARENTHESES,
  ObjectExpression: NEEDS_PARENTHESES,
  // Other operations
  UpdateExpression: 16,
  UnaryExpression: 15,
  AwaitExpression: 15,
  BinaryExpression: 14,
  LogicalExpression: 13,
  ConditionalExpression: 4,
  AssignmentExpression: 3,
  YieldExpression: 2,
  RestElement: 1,
}

function formatSequence(state, nodes) {
  /*
  Writes into `state` a sequence of `nodes`.
  */
  const { generator } = state
  state.write('(')
  if (nodes != null && nodes.length > 0) {
    generator[nodes[0].type](nodes[0], state)
    const { length } = nodes
    for (let i = 1; i < length; i++) {
      const param = nodes[i]
      state.write(', ')
      generator[param.type](param, state)
    }
  }
  state.write(')')
}

function expressionNeedsParenthesis(state, node, parentNode, isRightHand) {
  const nodePrecedence = state.expressionsPrecedence[node.type]
  if (nodePrecedence === NEEDS_PARENTHESES) {
    return true
  }
  const parentNodePrecedence = state.expressionsPrecedence[parentNode.type]
  if (nodePrecedence !== parentNodePrecedence) {
    // Different node types
    return (
      (!isRightHand &&
        nodePrecedence === 15 &&
        parentNodePrecedence === 14 &&
        parentNode.operator === '**') ||
      nodePrecedence < parentNodePrecedence
    )
  }
  if (nodePrecedence !== 13 && nodePrecedence !== 14) {
    // Not a `LogicalExpression` or `BinaryExpression`
    return false
  }
  if (node.operator === '**' && parentNode.operator === '**') {
    // Exponentiation operator has right-to-left associativity
    return !isRightHand
  }
  if (
    nodePrecedence === 13 &&
    parentNodePrecedence === 13 &&
    (node.operator === '??' || parentNode.operator === '??')
  ) {
    // Nullish coalescing and boolean operators cannot be combined
    return true
  }
  if (isRightHand) {
    // Parenthesis are used if both operators have the same precedence
    return (
      OPERATOR_PRECEDENCE[node.operator] <=
      OPERATOR_PRECEDENCE[parentNode.operator]
    )
  }
  return (
    OPERATOR_PRECEDENCE[node.operator] <
    OPERATOR_PRECEDENCE[parentNode.operator]
  )
}

function formatExpression(state, node, parentNode, isRightHand) {
  /*
  Writes into `state` the provided `node`, adding parenthesis around if the provided `parentNode` needs it. If `node` is a right-hand argument, the provided `isRightHand` parameter should be `true`.
  */
  const { generator } = state
  if (expressionNeedsParenthesis(state, node, parentNode, isRightHand)) {
    state.write('(')
    generator[node.type](node, state)
    state.write(')')
  } else {
    generator[node.type](node, state)
  }
}

function reindent(state, text, indent, lineEnd) {
  /*
  Writes into `state` the `text` string reindented with the provided `indent`.
  */
  const lines = text.split('\n')
  const end = lines.length - 1
  state.write(lines[0].trim())
  if (end > 0) {
    state.write(lineEnd)
    for (let i = 1; i < end; i++) {
      state.write(indent + lines[i].trim() + lineEnd)
    }
    state.write(indent + lines[end].trim())
  }
}

function formatComments(state, comments, indent, lineEnd) {
  /*
  Writes into `state` the provided list of `comments`, with the given `indent` and `lineEnd` strings.
  Line comments will end with `"\n"` regardless of the value of `lineEnd`.
  Expects to start on a new unindented line.
  */
  const { length } = comments
  for (let i = 0; i < length; i++) {
    const comment = comments[i]
    state.write(indent)
    if (comment.type[0] === 'L') {
      // Line comment
      state.write('// ' + comment.value.trim() + '\n', comment)
    } else {
      // Block comment
      state.write('/*')
      reindent(state, comment.value, indent, lineEnd)
      state.write('*/' + lineEnd)
    }
  }
}

function hasCallExpression(node) {
  /*
  Returns `true` if the provided `node` contains a call expression and `false` otherwise.
  */
  let currentNode = node
  while (currentNode != null) {
    const { type } = currentNode
    if (type[0] === 'C' && type[1] === 'a') {
      // Is CallExpression
      return true
    } else if (type[0] === 'M' && type[1] === 'e' && type[2] === 'm') {
      // Is MemberExpression
      currentNode = currentNode.object
    } else {
      return false
    }
  }
}

function formatVariableDeclaration(state, node) {
  /*
  Writes into `state` a variable declaration.
  */
  const { generator } = state
  const { declarations } = node
  state.write(node.kind + ' ')
  const { length } = declarations
  if (length > 0) {
    generator.VariableDeclarator(declarations[0], state)
    for (let i = 1; i < length; i++) {
      state.write(', ')
      generator.VariableDeclarator(declarations[i], state)
    }
  }
}

let ForInStatement,
  FunctionDeclaration,
  RestElement,
  BinaryExpression,
  ArrayExpression,
  BlockStatement

const GENERATOR = {
  /*
  Default generator.
  */
  Program(node, state) {
    const indent = state.indent.repeat(state.indentLevel)
    const { lineEnd, writeComments } = state
    if (writeComments && node.comments != null) {
      formatComments(state, node.comments, indent, lineEnd)
    }
    const statements = node.body
    const { length } = statements
    for (let i = 0; i < length; i++) {
      const statement = statements[i]
      if (writeComments && statement.comments != null) {
        formatComments(state, statement.comments, indent, lineEnd)
      }
      state.write(indent)
      this[statement.type](statement, state)
      state.write(lineEnd)
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, indent, lineEnd)
    }
  },
  BlockStatement: (BlockStatement = function (node, state) {
    const indent = state.indent.repeat(state.indentLevel++)
    const { lineEnd, writeComments } = state
    const statementIndent = indent + state.indent
    state.write('{')
    const statements = node.body
    if (statements != null && statements.length > 0) {
      state.write(lineEnd)
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, statementIndent, lineEnd)
      }
      const { length } = statements
      for (let i = 0; i < length; i++) {
        const statement = statements[i]
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd)
        }
        state.write(statementIndent)
        this[statement.type](statement, state)
        state.write(lineEnd)
      }
      state.write(indent)
    } else {
      if (writeComments && node.comments != null) {
        state.write(lineEnd)
        formatComments(state, node.comments, statementIndent, lineEnd)
        state.write(indent)
      }
    }
    if (writeComments && node.trailingComments != null) {
      formatComments(state, node.trailingComments, statementIndent, lineEnd)
    }
    state.write('}')
    state.indentLevel--
  }),
  ClassBody: BlockStatement,
  StaticBlock(node, state) {
    state.write('static ')
    this.BlockStatement(node, state)
  },
  EmptyStatement(node, state) {
    state.write(';')
  },
  ExpressionStatement(node, state) {
    const precedence = state.expressionsPrecedence[node.expression.type]
    if (
      precedence === NEEDS_PARENTHESES ||
      (precedence === 3 && node.expression.left.type[0] === 'O')
    ) {
      // Should always have parentheses or is an AssignmentExpression to an ObjectPattern
      state.write('(')
      this[node.expression.type](node.expression, state)
      state.write(')')
    } else {
      this[node.expression.type](node.expression, state)
    }
    state.write(';')
  },
  IfStatement(node, state) {
    state.write('if (')
    this[node.test.type](node.test, state)
    state.write(') ')
    this[node.consequent.type](node.consequent, state)
    if (node.alternate != null) {
      state.write(' else ')
      this[node.alternate.type](node.alternate, state)
    }
  },
  LabeledStatement(node, state) {
    this[node.label.type](node.label, state)
    state.write(': ')
    this[node.body.type](node.body, state)
  },
  BreakStatement(node, state) {
    state.write('break')
    if (node.label != null) {
      state.write(' ')
      this[node.label.type](node.label, state)
    }
    state.write(';')
  },
  ContinueStatement(node, state) {
    state.write('continue')
    if (node.label != null) {
      state.write(' ')
      this[node.label.type](node.label, state)
    }
    state.write(';')
  },
  WithStatement(node, state) {
    state.write('with (')
    this[node.object.type](node.object, state)
    state.write(') ')
    this[node.body.type](node.body, state)
  },
  SwitchStatement(node, state) {
    const indent = state.indent.repeat(state.indentLevel++)
    const { lineEnd, writeComments } = state
    state.indentLevel++
    const caseIndent = indent + state.indent
    const statementIndent = caseIndent + state.indent
    state.write('switch (')
    this[node.discriminant.type](node.discriminant, state)
    state.write(') {' + lineEnd)
    const { cases: occurences } = node
    const { length: occurencesCount } = occurences
    for (let i = 0; i < occurencesCount; i++) {
      const occurence = occurences[i]
      if (writeComments && occurence.comments != null) {
        formatComments(state, occurence.comments, caseIndent, lineEnd)
      }
      if (occurence.test) {
        state.write(caseIndent + 'case ')
        this[occurence.test.type](occurence.test, state)
        state.write(':' + lineEnd)
      } else {
        state.write(caseIndent + 'default:' + lineEnd)
      }
      const { consequent } = occurence
      const { length: consequentCount } = consequent
      for (let i = 0; i < consequentCount; i++) {
        const statement = consequent[i]
        if (writeComments && statement.comments != null) {
          formatComments(state, statement.comments, statementIndent, lineEnd)
        }
        state.write(statementIndent)
        this[statement.type](statement, state)
        state.write(lineEnd)
      }
    }
    state.indentLevel -= 2
    state.write(indent + '}')
  },
  ReturnStatement(node, state) {
    state.write('return')
    if (node.argument) {
      state.write(' ')
      this[node.argument.type](node.argument, state)
    }
    state.write(';')
  },
  ThrowStatement(node, state) {
    state.write('throw ')
    this[node.argument.type](node.argument, state)
    state.write(';')
  },
  TryStatement(node, state) {
    state.write('try ')
    this[node.block.type](node.block, state)
    if (node.handler) {
      const { handler } = node
      if (handler.param == null) {
        state.write(' catch ')
      } else {
        state.write(' catch (')
        this[handler.param.type](handler.param, state)
        state.write(') ')
      }
      this[handler.body.type](handler.body, state)
    }
    if (node.finalizer) {
      state.write(' finally ')
      this[node.finalizer.type](node.finalizer, state)
    }
  },
  WhileStatement(node, state) {
    state.write('while (')
    this[node.test.type](node.test, state)
    state.write(') ')
    this[node.body.type](node.body, state)
  },
  DoWhileStatement(node, state) {
    state.write('do ')
    this[node.body.type](node.body, state)
    state.write(' while (')
    this[node.test.type](node.test, state)
    state.write(');')
  },
  ForStatement(node, state) {
    state.write('for (')
    if (node.init != null) {
      const { init } = node
      if (init.type[0] === 'V') {
        formatVariableDeclaration(state, init)
      } else {
        this[init.type](init, state)
      }
    }
    state.write('; ')
    if (node.test) {
      this[node.test.type](node.test, state)
    }
    state.write('; ')
    if (node.update) {
      this[node.update.type](node.update, state)
    }
    state.write(') ')
    this[node.body.type](node.body, state)
  },
  ForInStatement: (ForInStatement = function (node, state) {
    state.write(`for ${node.await ? 'await ' : ''}(`)
    const { left } = node
    if (left.type[0] === 'V') {
      formatVariableDeclaration(state, left)
    } else {
      this[left.type](left, state)
    }
    // Identifying whether node.type is `ForInStatement` or `ForOfStatement`
    state.write(node.type[3] === 'I' ? ' in ' : ' of ')
    this[node.right.type](node.right, state)
    state.write(') ')
    this[node.body.type](node.body, state)
  }),
  ForOfStatement: ForInStatement,
  DebuggerStatement(node, state) {
    state.write('debugger;', node)
  },
  FunctionDeclaration: (FunctionDeclaration = function (node, state) {
    state.write(
      (node.async ? 'async ' : '') +
        (node.generator ? 'function* ' : 'function ') +
        (node.id ? node.id.name : ''),
      node,
    )
    formatSequence(state, node.params)
    state.write(' ')
    this[node.body.type](node.body, state)
  }),
  FunctionExpression: FunctionDeclaration,
  VariableDeclaration(node, state) {
    formatVariableDeclaration(state, node)
    state.write(';')
  },
  VariableDeclarator(node, state) {
    this[node.id.type](node.id, state)
    if (node.init != null) {
      state.write(' = ')
      this[node.init.type](node.init, state)
    }
  },
  ClassDeclaration(node, state) {
    state.write('class ' + (node.id ? `${node.id.name} ` : ''), node)
    if (node.superClass) {
      state.write('extends ')
      const { superClass } = node
      const { type } = superClass
      const precedence = state.expressionsPrecedence[type]
      if (
        (type[0] !== 'C' || type[1] !== 'l' || type[5] !== 'E') &&
        (precedence === NEEDS_PARENTHESES ||
          precedence < state.expressionsPrecedence.ClassExpression)
      ) {
        // Not a ClassExpression that needs parentheses
        state.write('(')
        this[node.superClass.type](superClass, state)
        state.write(')')
      } else {
        this[superClass.type](superClass, state)
      }
      state.write(' ')
    }
    this.ClassBody(node.body, state)
  },
  ImportDeclaration(node, state) {
    state.write('import ')
    const { specifiers } = node
    const { length } = specifiers
    // TODO: Once babili is fixed, put this after condition
    // https://github.com/babel/babili/issues/430
    let i = 0
    if (length > 0) {
      for (; i < length; ) {
        if (i > 0) {
          state.write(', ')
        }
        const specifier = specifiers[i]
        const type = specifier.type[6]
        if (type === 'D') {
          // ImportDefaultSpecifier
          state.write(specifier.local.name, specifier)
          i++
        } else if (type === 'N') {
          // ImportNamespaceSpecifier
          state.write('* as ' + specifier.local.name, specifier)
          i++
        } else {
          // ImportSpecifier
          break
        }
      }
      if (i < length) {
        state.write('{')
        for (;;) {
          const specifier = specifiers[i]
          const { name } = specifier.imported
          state.write(name, specifier)
          if (name !== specifier.local.name) {
            state.write(' as ' + specifier.local.name)
          }
          if (++i < length) {
            state.write(', ')
          } else {
            break
          }
        }
        state.write('}')
      }
      state.write(' from ')
    }
    this.Literal(node.source, state)
    state.write(';')
  },
  ImportExpression(node, state) {
    state.write('import(')
    this[node.source.type](node.source, state)
    state.write(')')
  },
  ExportDefaultDeclaration(node, state) {
    state.write('export default ')
    this[node.declaration.type](node.declaration, state)
    if (
      state.expressionsPrecedence[node.declaration.type] != null &&
      node.declaration.type[0] !== 'F'
    ) {
      // All expression nodes except `FunctionExpression`
      state.write(';')
    }
  },
  ExportNamedDeclaration(node, state) {
    state.write('export ')
    if (node.declaration) {
      this[node.declaration.type](node.declaration, state)
    } else {
      state.write('{')
      const { specifiers } = node,
        { length } = specifiers
      if (length > 0) {
        for (let i = 0; ; ) {
          const specifier = specifiers[i]
          const { name } = specifier.local
          state.write(name, specifier)
          if (name !== specifier.exported.name) {
            state.write(' as ' + specifier.exported.name)
          }
          if (++i < length) {
            state.write(', ')
          } else {
            break
          }
        }
      }
      state.write('}')
      if (node.source) {
        state.write(' from ')
        this.Literal(node.source, state)
      }
      state.write(';')
    }
  },
  ExportAllDeclaration(node, state) {
    if (node.exported != null) {
      state.write('export * as ' + node.exported.name + ' from ')
    } else {
      state.write('export * from ')
    }
    this.Literal(node.source, state)
    state.write(';')
  },
  MethodDefinition(node, state) {
    if (node.static) {
      state.write('static ')
    }
    const kind = node.kind[0]
    if (kind === 'g' || kind === 's') {
      // Getter or setter
      state.write(node.kind + ' ')
    }
    if (node.value.async) {
      state.write('async ')
    }
    if (node.value.generator) {
      state.write('*')
    }
    if (node.computed) {
      state.write('[')
      this[node.key.type](node.key, state)
      state.write(']')
    } else {
      this[node.key.type](node.key, state)
    }
    formatSequence(state, node.value.params)
    state.write(' ')
    this[node.value.body.type](node.value.body, state)
  },
  ClassExpression(node, state) {
    this.ClassDeclaration(node, state)
  },
  ArrowFunctionExpression(node, state) {
    state.write(node.async ? 'async ' : '', node)
    const { params } = node
    if (params != null) {
      // Omit parenthesis if only one named parameter
      if (params.length === 1 && params[0].type[0] === 'I') {
        // If params[0].type[0] starts with 'I', it can't be `ImportDeclaration` nor `IfStatement` and thus is `Identifier`
        state.write(params[0].name, params[0])
      } else {
        formatSequence(state, node.params)
      }
    }
    state.write(' => ')
    if (node.body.type[0] === 'O') {
      // Body is an object expression
      state.write('(')
      this.ObjectExpression(node.body, state)
      state.write(')')
    } else {
      this[node.body.type](node.body, state)
    }
  },
  ThisExpression(node, state) {
    state.write('this', node)
  },
  Super(node, state) {
    state.write('super', node)
  },
  RestElement: (RestElement = function (node, state) {
    state.write('...')
    this[node.argument.type](node.argument, state)
  }),
  SpreadElement: RestElement,
  YieldExpression(node, state) {
    state.write(node.delegate ? 'yield*' : 'yield')
    if (node.argument) {
      state.write(' ')
      this[node.argument.type](node.argument, state)
    }
  },
  AwaitExpression(node, state) {
    state.write('await ', node)
    formatExpression(state, node.argument, node)
  },
  TemplateLiteral(node, state) {
    const { quasis, expressions } = node
    state.write('`')
    const { length } = expressions
    for (let i = 0; i < length; i++) {
      const expression = expressions[i]
      const quasi = quasis[i]
      state.write(quasi.value.raw, quasi)
      state.write('${')
      this[expression.type](expression, state)
      state.write('}')
    }
    const quasi = quasis[quasis.length - 1]
    state.write(quasi.value.raw, quasi)
    state.write('`')
  },
  TemplateElement(node, state) {
    state.write(node.value.raw, node)
  },
  TaggedTemplateExpression(node, state) {
    formatExpression(state, node.tag, node)
    this[node.quasi.type](node.quasi, state)
  },
  ArrayExpression: (ArrayExpression = function (node, state) {
    state.write('[')
    if (node.elements.length > 0) {
      const { elements } = node,
        { length } = elements
      for (let i = 0; ; ) {
        const element = elements[i]
        if (element != null) {
          this[element.type](element, state)
        }
        if (++i < length) {
          state.write(', ')
        } else {
          if (element == null) {
            state.write(', ')
          }
          break
        }
      }
    }
    state.write(']')
  }),
  ArrayPattern: ArrayExpression,
  ObjectExpression(node, state) {
    const indent = state.indent.repeat(state.indentLevel++)
    const { lineEnd, writeComments } = state
    const propertyIndent = indent + state.indent
    state.write('{')
    if (node.properties.length > 0) {
      state.write(lineEnd)
      if (writeComments && node.comments != null) {
        formatComments(state, node.comments, propertyIndent, lineEnd)
      }
      const comma = ',' + lineEnd
      const { properties } = node,
        { length } = properties
      for (let i = 0; ; ) {
        const property = properties[i]
        if (writeComments && property.comments != null) {
          formatComments(state, property.comments, propertyIndent, lineEnd)
        }
        state.write(propertyIndent)
        this[property.type](property, state)
        if (++i < length) {
          state.write(comma)
        } else {
          break
        }
      }
      state.write(lineEnd)
      if (writeComments && node.trailingComments != null) {
        formatComments(state, node.trailingComments, propertyIndent, lineEnd)
      }
      state.write(indent + '}')
    } else if (writeComments) {
      if (node.comments != null) {
        state.write(lineEnd)
        formatComments(state, node.comments, propertyIndent, lineEnd)
        if (node.trailingComments != null) {
          formatComments(state, node.trailingComments, propertyIndent, lineEnd)
        }
        state.write(indent + '}')
      } else if (node.trailingComments != null) {
        state.write(lineEnd)
        formatComments(state, node.trailingComments, propertyIndent, lineEnd)
        state.write(indent + '}')
      } else {
        state.write('}')
      }
    } else {
      state.write('}')
    }
    state.indentLevel--
  },
  Property(node, state) {
    if (node.method || node.kind[0] !== 'i') {
      // Either a method or of kind `set` or `get` (not `init`)
      this.MethodDefinition(node, state)
    } else {
      if (!node.shorthand) {
        if (node.computed) {
          state.write('[')
          this[node.key.type](node.key, state)
          state.write(']')
        } else {
          this[node.key.type](node.key, state)
        }
        state.write(': ')
      }
      this[node.value.type](node.value, state)
    }
  },
  PropertyDefinition(node, state) {
    if (node.static) {
      state.write('static ')
    }
    if (node.computed) {
      state.write('[')
    }
    this[node.key.type](node.key, state)
    if (node.computed) {
      state.write(']')
    }
    if (node.value == null) {
      if (node.key.type[0] !== 'F') {
        state.write(';')
      }
      return
    }
    state.write(' = ')
    this[node.value.type](node.value, state)
    state.write(';')
  },
  ObjectPattern(node, state) {
    state.write('{')
    if (node.properties.length > 0) {
      const { properties } = node,
        { length } = properties
      for (let i = 0; ; ) {
        this[properties[i].type](properties[i], state)
        if (++i < length) {
          state.write(', ')
        } else {
          break
        }
      }
    }
    state.write('}')
  },
  SequenceExpression(node, state) {
    formatSequence(state, node.expressions)
  },
  UnaryExpression(node, state) {
    if (node.prefix) {
      const {
        operator,
        argument,
        argument: { type },
      } = node
      state.write(operator)
      const needsParentheses = expressionNeedsParenthesis(state, argument, node)
      if (
        !needsParentheses &&
        (operator.length > 1 ||
          (type[0] === 'U' &&
            (type[1] === 'n' || type[1] === 'p') &&
            argument.prefix &&
            argument.operator[0] === operator &&
            (operator === '+' || operator === '-')))
      ) {
        // Large operator or argument is UnaryExpression or UpdateExpression node
        state.write(' ')
      }
      if (needsParentheses) {
        state.write(operator.length > 1 ? ' (' : '(')
        this[type](argument, state)
        state.write(')')
      } else {
        this[type](argument, state)
      }
    } else {
      // FIXME: This case never occurs
      this[node.argument.type](node.argument, state)
      state.write(node.operator)
    }
  },
  UpdateExpression(node, state) {
    // Always applied to identifiers or members, no parenthesis check needed
    if (node.prefix) {
      state.write(node.operator)
      this[node.argument.type](node.argument, state)
    } else {
      this[node.argument.type](node.argument, state)
      state.write(node.operator)
    }
  },
  AssignmentExpression(node, state) {
    this[node.left.type](node.left, state)
    state.write(' ' + node.operator + ' ')
    this[node.right.type](node.right, state)
  },
  AssignmentPattern(node, state) {
    this[node.left.type](node.left, state)
    state.write(' = ')
    this[node.right.type](node.right, state)
  },
  BinaryExpression: (BinaryExpression = function (node, state) {
    const isIn = node.operator === 'in'
    if (isIn) {
      // Avoids confusion in `for` loops initializers
      state.write('(')
    }
    formatExpression(state, node.left, node, false)
    state.write(' ' + node.operator + ' ')
    formatExpression(state, node.right, node, true)
    if (isIn) {
      state.write(')')
    }
  }),
  LogicalExpression: BinaryExpression,
  ConditionalExpression(node, state) {
    const { test } = node
    const precedence = state.expressionsPrecedence[test.type]
    if (
      precedence === NEEDS_PARENTHESES ||
      precedence <= state.expressionsPrecedence.ConditionalExpression
    ) {
      state.write('(')
      this[test.type](test, state)
      state.write(')')
    } else {
      this[test.type](test, state)
    }
    state.write(' ? ')
    this[node.consequent.type](node.consequent, state)
    state.write(' : ')
    this[node.alternate.type](node.alternate, state)
  },
  NewExpression(node, state) {
    state.write('new ')
    const precedence = state.expressionsPrecedence[node.callee.type]
    if (
      precedence === NEEDS_PARENTHESES ||
      precedence < state.expressionsPrecedence.CallExpression ||
      hasCallExpression(node.callee)
    ) {
      state.write('(')
      this[node.callee.type](node.callee, state)
      state.write(')')
    } else {
      this[node.callee.type](node.callee, state)
    }
    formatSequence(state, node['arguments'])
  },
  CallExpression(node, state) {
    const precedence = state.expressionsPrecedence[node.callee.type]
    if (
      precedence === NEEDS_PARENTHESES ||
      precedence < state.expressionsPrecedence.CallExpression
    ) {
      state.write('(')
      this[node.callee.type](node.callee, state)
      state.write(')')
    } else {
      this[node.callee.type](node.callee, state)
    }
    if (node.optional) {
      state.write('?.')
    }
    formatSequence(state, node['arguments'])
  },
  ChainExpression(node, state) {
    this[node.expression.type](node.expression, state)
  },
  MemberExpression(node, state) {
    const precedence = state.expressionsPrecedence[node.object.type]
    if (
      precedence === NEEDS_PARENTHESES ||
      precedence < state.expressionsPrecedence.MemberExpression
    ) {
      state.write('(')
      this[node.object.type](node.object, state)
      state.write(')')
    } else {
      this[node.object.type](node.object, state)
    }
    if (node.computed) {
      if (node.optional) {
        state.write('?.')
      }
      state.write('[')
      this[node.property.type](node.property, state)
      state.write(']')
    } else {
      if (node.optional) {
        state.write('?.')
      } else {
        state.write('.')
      }
      this[node.property.type](node.property, state)
    }
  },
  MetaProperty(node, state) {
    state.write(node.meta.name + '.' + node.property.name, node)
  },
  Identifier(node, state) {
    state.write(node.name, node)
  },
  PrivateIdentifier(node, state) {
    state.write(`#${node.name}`, node)
  },
  Literal(node, state) {
    if (node.raw != null) {
      // Non-standard property
      state.write(node.raw, node)
    } else if (node.regex != null) {
      this.RegExpLiteral(node, state)
    } else if (node.bigint != null) {
      state.write(node.bigint + 'n', node)
    } else {
      state.write(stringify(node.value), node)
    }
  },
  RegExpLiteral(node, state) {
    const { regex } = node
    state.write(`/${regex.pattern}/${regex.flags}`, node)
  },
}

const EMPTY_OBJECT = {}

/*
DEPRECATED: Alternate export of `GENERATOR`.
*/
const baseGenerator = GENERATOR

class State {
  constructor(options) {
    const setup = options == null ? EMPTY_OBJECT : options
    this.output = ''
    // Functional options
    if (setup.output != null) {
      this.output = setup.output
      this.write = this.writeToStream
    } else {
      this.output = ''
    }
    this.generator = setup.generator != null ? setup.generator : GENERATOR
    this.expressionsPrecedence =
      setup.expressionsPrecedence != null
        ? setup.expressionsPrecedence
        : EXPRESSIONS_PRECEDENCE
    // Formating setup
    this.indent = setup.indent != null ? setup.indent : '  '
    this.lineEnd = setup.lineEnd != null ? setup.lineEnd : '\n'
    this.indentLevel =
      setup.startingIndentLevel != null ? setup.startingIndentLevel : 0
    this.writeComments = setup.comments ? setup.comments : false
    // Source map
    if (setup.sourceMap != null) {
      this.write =
        setup.output == null ? this.writeAndMap : this.writeToStreamAndMap
      this.sourceMap = setup.sourceMap
      this.line = 1
      this.column = 0
      this.lineEndSize = this.lineEnd.split('\n').length - 1
      this.mapping = {
        original: null,
        // Uses the entire state to avoid generating ephemeral objects
        generated: this,
        name: undefined,
        source: setup.sourceMap.file || setup.sourceMap._file,
      }
    }
  }

  write(code) {
    this.output += code
  }

  writeToStream(code) {
    this.output.write(code)
  }

  writeAndMap(code, node) {
    this.output += code
    this.map(code, node)
  }

  writeToStreamAndMap(code, node) {
    this.output.write(code)
    this.map(code, node)
  }

  map(code, node) {
    if (node != null) {
      const { type } = node
      if (type[0] === 'L' && type[2] === 'n') {
        // LineComment
        this.column = 0
        this.line++
        return
      }
      if (node.loc != null) {
        const { mapping } = this
        mapping.original = node.loc.start
        mapping.name = node.name
        this.sourceMap.addMapping(mapping)
      }
      if (
        (type[0] === 'T' && type[8] === 'E') ||
        (type[0] === 'L' && type[1] === 'i' && typeof node.value === 'string')
      ) {
        // TemplateElement or Literal string node
        const { length } = code
        let { column, line } = this
        for (let i = 0; i < length; i++) {
          if (code[i] === '\n') {
            column = 0
            line++
          } else {
            column++
          }
        }
        this.column = column
        this.line = line
        return
      }
    }
    const { length } = code
    const { lineEnd } = this
    if (length > 0) {
      if (
        this.lineEndSize > 0 &&
        (lineEnd.length === 1
          ? code[length - 1] === lineEnd
          : code.endsWith(lineEnd))
      ) {
        this.line += this.lineEndSize
        this.column = 0
      } else {
        this.column += length
      }
    }
  }

  toString() {
    return this.output
  }
}

function generate(node, options) {
  /*
  Returns a string representing the rendered code of the provided AST `node`.
  The `options` are:

  - `indent`: string to use for indentation (defaults to `␣␣`)
  - `lineEnd`: string to use for line endings (defaults to `\n`)
  - `startingIndentLevel`: indent level to start from (defaults to `0`)
  - `comments`: generate comments if `true` (defaults to `false`)
  - `output`: output stream to write the rendered code to (defaults to `null`)
  - `generator`: custom code generator (defaults to `GENERATOR`)
  - `expressionsPrecedence`: custom map of node types and their precedence level (defaults to `EXPRESSIONS_PRECEDENCE`)
  */
  const state = new State(options)
  // Travel through the AST node and generate the code
  state.generator[node.type](node, state)
  return state.output
}


}),
"./node_modules/meriyah/dist/meriyah.esm.mjs": (function (__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  ESTree: function() { return estree; },
  parse: function() { return parse; },
  parseModule: function() { return parseModule; },
  parseScript: function() { return parseScript; },
  version: function() { return version; }
});
const errorMessages = {
    [0]: 'Unexpected token',
    [28]: "Unexpected token: '%0'",
    [1]: 'Octal escape sequences are not allowed in strict mode',
    [2]: 'Octal escape sequences are not allowed in template strings',
    [3]: 'Unexpected token `#`',
    [4]: 'Illegal Unicode escape sequence',
    [5]: 'Invalid code point %0',
    [6]: 'Invalid hexadecimal escape sequence',
    [8]: 'Octal literals are not allowed in strict mode',
    [7]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
    [9]: 'Expected number in radix %0',
    [146]: 'Invalid left-hand side assignment to a destructible right-hand side',
    [10]: 'Non-number found after exponent indicator',
    [11]: 'Invalid BigIntLiteral',
    [12]: 'No identifiers allowed directly after numeric literal',
    [13]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
    [14]: 'Unterminated string literal',
    [15]: 'Unterminated template literal',
    [16]: 'Multiline comment was not closed properly',
    [17]: 'The identifier contained dynamic unicode escape that was not closed',
    [18]: "Illegal character '%0'",
    [19]: 'Missing hexadecimal digits',
    [20]: 'Invalid implicit octal',
    [21]: 'Invalid line break in string literal',
    [22]: 'Only unicode escapes are legal in identifier names',
    [23]: "Expected '%0'",
    [24]: 'Invalid left-hand side in assignment',
    [25]: 'Invalid left-hand side in async arrow',
    [26]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
    [27]: 'Member access on super must be in a method',
    [29]: 'Await expression not allowed in formal parameter',
    [30]: 'Yield expression not allowed in formal parameter',
    [93]: "Unexpected token: 'escaped keyword'",
    [31]: 'Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses',
    [120]: 'Async functions can only be declared at the top level or inside a block',
    [32]: 'Unterminated regular expression',
    [33]: 'Unexpected regular expression flag',
    [34]: "Duplicate regular expression flag '%0'",
    [35]: '%0 functions must have exactly %1 argument%2',
    [36]: 'Setter function argument must not be a rest parameter',
    [37]: '%0 declaration must have a name in this context',
    [38]: 'Function name may not contain any reserved words or be eval or arguments in strict mode',
    [39]: 'The rest operator is missing an argument',
    [40]: 'A getter cannot be a generator',
    [41]: 'A setter cannot be a generator',
    [42]: 'A computed property name must be followed by a colon or paren',
    [131]: 'Object literal keys that are strings or numbers must be a method or have a colon',
    [44]: 'Found `* async x(){}` but this should be `async * x(){}`',
    [43]: 'Getters and setters can not be generators',
    [45]: "'%0' can not be generator method",
    [46]: "No line break is allowed after '=>'",
    [47]: 'The left-hand side of the arrow can only be destructed through assignment',
    [48]: 'The binding declaration is not destructible',
    [49]: 'Async arrow can not be followed by new expression',
    [50]: "Classes may not have a static property named 'prototype'",
    [51]: 'Class constructor may not be a %0',
    [52]: 'Duplicate constructor method in class',
    [53]: 'Invalid increment/decrement operand',
    [54]: 'Invalid use of `new` keyword on an increment/decrement expression',
    [55]: '`=>` is an invalid assignment target',
    [56]: 'Rest element may not have a trailing comma',
    [57]: 'Missing initializer in %0 declaration',
    [58]: "'for-%0' loop head declarations can not have an initializer",
    [59]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
    [60]: 'Invalid shorthand property initializer',
    [61]: 'Property name __proto__ appears more than once in object literal',
    [62]: 'Let is disallowed as a lexically bound name',
    [63]: "Invalid use of '%0' inside new expression",
    [64]: "Illegal 'use strict' directive in function with non-simple parameter list",
    [65]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
    [66]: 'Illegal continue statement',
    [67]: 'Illegal break statement',
    [68]: 'Cannot have `let[...]` as a var name in strict mode',
    [69]: 'Invalid destructuring assignment target',
    [70]: 'Rest parameter may not have a default initializer',
    [71]: 'The rest argument must the be last parameter',
    [72]: 'Invalid rest argument',
    [74]: 'In strict mode code, functions can only be declared at top level or inside a block',
    [75]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
    [76]: 'Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
    [77]: "Class declaration can't appear in single-statement context",
    [78]: 'Invalid left-hand side in for-%0',
    [79]: 'Invalid assignment in for-%0',
    [80]: 'for await (... of ...) is only valid in async functions and async generators',
    [81]: 'The first token after the template expression should be a continuation of the template',
    [83]: '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
    [82]: '`let \n [` is a restricted production at the start of a statement',
    [84]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
    [85]: 'Catch clause parameter does not support default values',
    [86]: 'Missing catch or finally after try',
    [87]: 'More than one default clause in switch statement',
    [88]: 'Illegal newline after throw',
    [89]: 'Strict mode code may not include a with statement',
    [90]: 'Illegal return statement',
    [91]: 'The left hand side of the for-header binding declaration is not destructible',
    [92]: 'new.target only allowed within functions',
    [94]: "'#' not followed by identifier",
    [100]: 'Invalid keyword',
    [99]: "Can not use 'let' as a class name",
    [98]: "'A lexical declaration can't define a 'let' binding",
    [97]: 'Can not use `let` as variable name in strict mode',
    [95]: "'%0' may not be used as an identifier in this context",
    [96]: 'Await is only valid in async functions',
    [101]: 'The %0 keyword can only be used with the module goal',
    [102]: 'Unicode codepoint must not be greater than 0x10FFFF',
    [103]: '%0 source must be string',
    [104]: 'Only a identifier can be used to indicate alias',
    [105]: "Only '*' or '{...}' can be imported after default",
    [106]: 'Trailing decorator may be followed by method',
    [107]: "Decorators can't be used with a constructor",
    [109]: 'HTML comments are only allowed with web compatibility (Annex B)',
    [110]: "The identifier 'let' must not be in expression position in strict mode",
    [111]: 'Cannot assign to `eval` and `arguments` in strict mode',
    [112]: "The left-hand side of a for-of loop may not start with 'let'",
    [113]: 'Block body arrows can not be immediately invoked without a group',
    [114]: 'Block body arrows can not be immediately accessed without a group',
    [115]: 'Unexpected strict mode reserved word',
    [116]: 'Unexpected eval or arguments in strict mode',
    [117]: 'Decorators must not be followed by a semicolon',
    [118]: 'Calling delete on expression not allowed in strict mode',
    [119]: 'Pattern can not have a tail',
    [121]: 'Can not have a `yield` expression on the left side of a ternary',
    [122]: 'An arrow function can not have a postfix update operator',
    [123]: 'Invalid object literal key character after generator star',
    [124]: 'Private fields can not be deleted',
    [126]: 'Classes may not have a field called constructor',
    [125]: 'Classes may not have a private element named constructor',
    [127]: 'A class field initializer may not contain arguments',
    [128]: 'Generators can only be declared at the top level or inside a block',
    [129]: 'Async methods are a restricted production and cannot have a newline following it',
    [130]: 'Unexpected character after object literal property name',
    [132]: 'Invalid key token',
    [133]: "Label '%0' has already been declared",
    [134]: 'continue statement must be nested within an iteration statement',
    [135]: "Undefined label '%0'",
    [136]: 'Trailing comma is disallowed inside import(...) arguments',
    [137]: 'import() requires exactly one argument',
    [138]: 'Cannot use new with import(...)',
    [139]: '... is not allowed in import()',
    [140]: "Expected '=>'",
    [141]: "Duplicate binding '%0'",
    [142]: "Cannot export a duplicate name '%0'",
    [145]: 'Duplicate %0 for-binding',
    [143]: "Exported binding '%0' needs to refer to a top-level declared variable",
    [144]: 'Unexpected private field',
    [148]: 'Numeric separators are not allowed at the end of numeric literals',
    [147]: 'Only one underscore is allowed as numeric separator',
    [149]: 'JSX value should be either an expression or a quoted JSX text',
    [150]: 'Expected corresponding JSX closing tag for %0',
    [151]: 'Adjacent JSX elements must be wrapped in an enclosing tag',
    [152]: "JSX attributes must only be assigned a non-empty 'expression'",
    [153]: "'%0' has already been declared",
    [154]: "'%0' shadowed a catch clause binding",
    [155]: 'Dot property must be an identifier',
    [156]: 'Encountered invalid input after spread/rest argument',
    [157]: 'Catch without try',
    [158]: 'Finally without try',
    [159]: 'Expected corresponding closing tag for JSX fragment',
    [160]: 'Coalescing and logical operators used together in the same expression must be disambiguated with parentheses',
    [161]: 'Invalid tagged template on optional chain',
    [162]: 'Invalid optional chain from super property',
    [163]: 'Invalid optional chain from new expression',
    [164]: 'Cannot use "import.meta" outside a module',
    [165]: 'Leading decorators must be attached to a class declaration'
};
class ParseError extends SyntaxError {
    constructor(startindex, line, column, type, ...params) {
        const message = '[' + line + ':' + column + ']: ' + errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]);
        super(`${message}`);
        this.index = startindex;
        this.line = line;
        this.column = column;
        this.description = message;
        this.loc = {
            line,
            column
        };
    }
}
function report(parser, type, ...params) {
    throw new ParseError(parser.index, parser.line, parser.column, type, ...params);
}
function reportScopeError(scope) {
    throw new ParseError(scope.index, scope.line, scope.column, scope.type, scope.params);
}
function reportMessageAt(index, line, column, type, ...params) {
    throw new ParseError(index, line, column, type, ...params);
}
function reportScannerError(index, line, column, type) {
    throw new ParseError(index, line, column, type);
}

const unicodeLookup = ((compressed, lookup) => {
    const result = new Uint32Array(104448);
    let index = 0;
    let subIndex = 0;
    while (index < 3701) {
        const inst = compressed[index++];
        if (inst < 0) {
            subIndex -= inst;
        }
        else {
            let code = compressed[index++];
            if (inst & 2)
                code = lookup[code];
            if (inst & 1) {
                result.fill(code, subIndex, subIndex += compressed[index++]);
            }
            else {
                result[subIndex++] = code;
            }
        }
    }
    return result;
})([-1, 2, 26, 2, 27, 2, 5, -1, 0, 77595648, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 16, 2, 60, 2, 0, 0, 4294836735, 0, 3221225471, 0, 4294901942, 2, 61, 0, 134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983, 0, 2684354047, 2, 18, 2, 0, 0, 4294961151, 3, 0, 2, 2, 19, 2, 0, 0, 608174079, 2, 0, 2, 54, 2, 7, 2, 6, 0, 4278222591, 3, 0, 2, 2, 1, 3, 0, 3, 0, 4294901711, 2, 40, 0, 4089839103, 0, 2961209759, 0, 1342439375, 0, 4294543342, 0, 3547201023, 0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0, 4261478351, 0, 4294549486, 2, 2, 0, 2967484831, 0, 196559, 0, 3594373100, 0, 3288319768, 0, 8469959, 2, 200, 2, 3, 0, 4093640191, 0, 660618719, 0, 65487, 0, 4294828015, 0, 4092591615, 0, 1616920031, 0, 982991, 2, 3, 2, 0, 0, 2163244511, 0, 4227923919, 0, 4236247022, 2, 66, 0, 4284449919, 0, 851904, 2, 4, 2, 12, 0, 67076095, -1, 2, 67, 0, 1073741743, 0, 4093607775, -1, 0, 50331649, 0, 3265266687, 2, 33, 0, 4294844415, 0, 4278190047, 2, 20, 2, 133, -1, 3, 0, 2, 2, 23, 2, 0, 2, 10, 2, 0, 2, 15, 2, 22, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 11, 0, 261632, 2, 25, 3, 0, 2, 2, 13, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 2151677951, 2, 29, 2, 9, 0, 909311, 3, 0, 2, 0, 814743551, 2, 42, 0, 67090432, 3, 0, 2, 2, 41, 2, 0, 2, 6, 2, 0, 2, 30, 2, 8, 0, 268374015, 2, 107, 2, 48, 2, 0, 2, 76, 0, 134153215, -1, 2, 7, 2, 0, 2, 8, 0, 2684354559, 0, 67044351, 0, 3221160064, 2, 17, -1, 3, 0, 2, 0, 67051519, 0, 1046528, 3, 0, 3, 2, 9, 2, 0, 2, 50, 0, 4294960127, 2, 10, 2, 39, 2, 11, 0, 4294377472, 2, 12, 3, 0, 16, 2, 13, 2, 0, 2, 79, 2, 10, 2, 0, 2, 80, 2, 81, 2, 82, 2, 206, 2, 129, 0, 1048577, 2, 83, 2, 14, -1, 2, 14, 0, 131042, 2, 84, 2, 85, 2, 86, 2, 0, 2, 34, -83, 3, 0, 7, 0, 1046559, 2, 0, 2, 15, 2, 0, 0, 2147516671, 2, 21, 3, 87, 2, 2, 0, -16, 2, 88, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4, 3, 0, 2, 2, 28, 2, 16, 3, 0, 2, 2, 17, 2, 0, -1, 2, 18, -16, 3, 0, 206, -2, 3, 0, 692, 2, 68, -1, 2, 18, 2, 10, 3, 0, 8, 2, 90, 2, 128, 2, 0, 0, 3220242431, 3, 0, 3, 2, 19, 2, 91, 2, 92, 3, 0, 2, 2, 93, 2, 0, 2, 94, 2, 45, 2, 0, 0, 4351, 2, 0, 2, 9, 3, 0, 2, 0, 67043391, 0, 3909091327, 2, 0, 2, 24, 2, 9, 2, 20, 3, 0, 2, 0, 67076097, 2, 8, 2, 0, 2, 21, 0, 67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999, 2, 98, 2, 99, 2, 22, 2, 23, 3, 0, 3, 0, 67057663, 3, 0, 349, 2, 100, 2, 101, 2, 7, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 32, -1, 0, 3774349439, 2, 102, 2, 103, 3, 0, 2, 2, 19, 2, 104, 3, 0, 10, 2, 10, 2, 18, 2, 0, 2, 46, 2, 0, 2, 31, 2, 105, 2, 25, 0, 1638399, 2, 170, 2, 106, 3, 0, 3, 2, 20, 2, 26, 2, 27, 2, 5, 2, 28, 2, 0, 2, 8, 2, 108, -1, 2, 109, 2, 110, 2, 111, -1, 3, 0, 3, 2, 12, -2, 2, 0, 2, 29, -3, 2, 159, -4, 2, 20, 2, 0, 2, 36, 0, 1, 2, 0, 2, 62, 2, 6, 2, 12, 2, 10, 2, 0, 2, 112, -1, 3, 0, 4, 2, 10, 2, 23, 2, 113, 2, 7, 2, 0, 2, 114, 2, 0, 2, 115, 2, 116, 2, 117, -2, 3, 0, 9, 2, 21, 2, 30, 2, 31, 2, 118, 2, 119, -2, 2, 120, 2, 121, 2, 30, 2, 21, 2, 8, -2, 2, 122, 2, 30, 2, 32, -2, 2, 0, 2, 38, -2, 0, 4277137519, 0, 2269118463, -1, 3, 20, 2, -1, 2, 33, 2, 37, 2, 0, 3, 30, 2, 2, 35, 2, 19, -3, 3, 0, 2, 2, 34, -1, 2, 0, 2, 35, 2, 0, 2, 35, 2, 0, 2, 47, -10, 2, 0, 0, 203775, -1, 2, 164, 2, 20, 2, 43, 2, 36, 2, 18, 2, 77, 2, 18, 2, 123, 2, 21, 3, 0, 2, 2, 37, 0, 2151677888, 2, 0, 2, 12, 0, 4294901764, 2, 140, 2, 0, 2, 52, 2, 51, 0, 5242879, 3, 0, 2, 0, 402644511, -1, 2, 125, 2, 38, 0, 3, -1, 2, 126, 2, 39, 2, 0, 0, 67045375, 2, 40, 0, 4226678271, 0, 3766565279, 0, 2039759, -4, 3, 0, 2, 0, 3288270847, 0, 3, 3, 0, 2, 0, 67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0, 2, 0, 67043345, -1, 2, 0, 2, 41, 2, 42, -1, 2, 11, 2, 55, 2, 37, -5, 2, 0, 2, 12, -3, 3, 0, 2, 0, 2147484671, 2, 130, 0, 4190109695, 2, 49, -2, 2, 131, 0, 4244635647, 0, 27, 2, 0, 2, 8, 2, 43, 2, 0, 2, 63, 2, 18, 2, 0, 2, 41, -8, 2, 53, 2, 44, 0, 67043329, 2, 45, 2, 46, 0, 8388351, -2, 2, 132, 0, 3028287487, 2, 47, 2, 134, 0, 33259519, 2, 42, -9, 2, 21, 0, 4294836223, 0, 3355443199, 0, 67043335, -2, 2, 64, -2, 3, 0, 28, 2, 32, -3, 3, 0, 3, 2, 17, 3, 0, 6, 2, 78, -81, 2, 18, 3, 0, 2, 2, 36, 3, 0, 33, 2, 25, 2, 30, -125, 3, 0, 18, 2, 37, -269, 3, 0, 17, 2, 41, 2, 8, 2, 23, 2, 0, 2, 8, 2, 23, 2, 48, 2, 0, 2, 21, 2, 49, 2, 135, 2, 25, -21, 3, 0, 2, -4, 3, 0, 2, 0, 4294936575, 2, 0, 0, 4294934783, -2, 0, 196635, 3, 0, 191, 2, 50, 3, 0, 38, 2, 30, -1, 2, 34, -278, 2, 136, 3, 0, 9, 2, 137, 2, 138, 2, 51, 3, 0, 11, 2, 7, -72, 3, 0, 3, 2, 139, 0, 1677656575, -147, 2, 0, 2, 24, 2, 37, -16, 0, 4161266656, 0, 4071, 2, 201, -4, 0, 28, -13, 3, 0, 2, 2, 52, 2, 0, 2, 141, 2, 142, 2, 56, 2, 0, 2, 143, 2, 144, 2, 145, 3, 0, 10, 2, 146, 2, 147, 2, 22, 3, 52, 2, 3, 148, 2, 3, 53, 2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 89, 2, 0, 0, 2105343, 0, 4160749584, 2, 174, -34, 2, 8, 2, 150, -6, 0, 4194303871, 0, 4294903771, 2, 0, 2, 54, 2, 97, -3, 2, 0, 0, 1073684479, 0, 17407, -9, 2, 18, 2, 17, 2, 0, 2, 32, -14, 2, 18, 2, 32, -23, 2, 151, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 55, -37, 2, 56, 2, 152, 2, 153, 2, 154, 2, 155, 2, 156, -105, 2, 26, -32, 3, 0, 1335, -1, 3, 0, 129, 2, 32, 3, 0, 6, 2, 10, 3, 0, 180, 2, 157, 3, 0, 233, 2, 158, 3, 0, 18, 2, 10, -77, 3, 0, 16, 2, 10, -47, 3, 0, 154, 2, 6, 3, 0, 130, 2, 25, -22250, 3, 0, 7, 2, 25, -6130, 3, 5, 2, -1, 0, 69207040, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, -3, 0, 3168731136, 0, 4294956864, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 16, 2, 60, 2, 0, 2, 34, -1, 2, 18, 2, 61, -1, 2, 0, 0, 2047, 0, 4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0, 4294770688, 2, 25, 2, 62, 3, 0, 2, 0, 131135, 2, 95, 0, 70256639, 0, 71303167, 0, 272, 2, 41, 2, 6, 0, 32511, 2, 0, 2, 42, -1, 2, 96, 2, 63, 0, 4278255616, 0, 4294836227, 0, 4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0, 4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0, 4294688736, 2, 65, 2, 64, 0, 33554435, 2, 127, 2, 65, 2, 160, 0, 131075, 0, 3594373096, 0, 67094296, 2, 64, -1, 0, 4294828000, 0, 603979263, 0, 654311424, 0, 3, 0, 4294828001, 0, 602930687, 2, 167, 0, 393219, 0, 4294828016, 0, 671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2, 66, 2, 37, -1, 2, 4, 0, 917503, 2, 37, -1, 2, 67, 0, 537788335, 0, 4026531935, -1, 0, 1, -1, 2, 33, 2, 68, 0, 7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930, 0, 16387, 2, 0, 2, 15, 2, 22, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 12, -1, 2, 25, 3, 0, 2, 2, 13, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 2147745791, 3, 19, 2, 0, 122879, 2, 0, 2, 9, 0, 276824064, -2, 3, 0, 2, 2, 41, 2, 0, 0, 4294903295, 2, 0, 2, 30, 2, 8, -1, 2, 18, 2, 48, 2, 0, 2, 76, 2, 42, -1, 2, 21, 2, 0, 2, 29, -2, 0, 128, -2, 2, 28, 2, 9, 0, 8160, -1, 2, 124, 0, 4227907585, 2, 0, 2, 77, 2, 0, 2, 78, 2, 180, 2, 10, 2, 39, 2, 11, -1, 0, 74440192, 3, 0, 6, -2, 3, 0, 8, 2, 13, 2, 0, 2, 79, 2, 10, 2, 0, 2, 80, 2, 81, 2, 82, -3, 2, 83, 2, 14, -3, 2, 84, 2, 85, 2, 86, 2, 0, 2, 34, -83, 3, 0, 7, 0, 817183, 2, 0, 2, 15, 2, 0, 0, 33023, 2, 21, 3, 87, 2, -17, 2, 88, 0, 524157950, 2, 4, 2, 0, 2, 89, 2, 4, 2, 0, 2, 22, 2, 28, 2, 16, 3, 0, 2, 2, 17, 2, 0, -1, 2, 18, -16, 3, 0, 206, -2, 3, 0, 692, 2, 68, -1, 2, 18, 2, 10, 3, 0, 8, 2, 90, 0, 3072, 2, 0, 0, 2147516415, 2, 10, 3, 0, 2, 2, 25, 2, 91, 2, 92, 3, 0, 2, 2, 93, 2, 0, 2, 94, 2, 45, 0, 4294965179, 0, 7, 2, 0, 2, 9, 2, 92, 2, 9, -1, 0, 1761345536, 2, 95, 0, 4294901823, 2, 37, 2, 20, 2, 96, 2, 35, 2, 97, 0, 2080440287, 2, 0, 2, 34, 2, 149, 0, 3296722943, 2, 0, 0, 1046675455, 0, 939524101, 0, 1837055, 2, 98, 2, 99, 2, 22, 2, 23, 3, 0, 3, 0, 7, 3, 0, 349, 2, 100, 2, 101, 2, 7, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 32, -1, 0, 2700607615, 2, 102, 2, 103, 3, 0, 2, 2, 19, 2, 104, 3, 0, 10, 2, 10, 2, 18, 2, 0, 2, 46, 2, 0, 2, 31, 2, 105, -3, 2, 106, 3, 0, 3, 2, 20, -1, 3, 5, 2, 2, 107, 2, 0, 2, 8, 2, 108, -1, 2, 109, 2, 110, 2, 111, -1, 3, 0, 3, 2, 12, -2, 2, 0, 2, 29, -8, 2, 20, 2, 0, 2, 36, -1, 2, 0, 2, 62, 2, 6, 2, 30, 2, 10, 2, 0, 2, 112, -1, 3, 0, 4, 2, 10, 2, 18, 2, 113, 2, 7, 2, 0, 2, 114, 2, 0, 2, 115, 2, 116, 2, 117, -2, 3, 0, 9, 2, 21, 2, 30, 2, 31, 2, 118, 2, 119, -2, 2, 120, 2, 121, 2, 30, 2, 21, 2, 8, -2, 2, 122, 2, 30, 2, 32, -2, 2, 0, 2, 38, -2, 0, 4277075969, 2, 30, -1, 3, 20, 2, -1, 2, 33, 2, 123, 2, 0, 3, 30, 2, 2, 35, 2, 19, -3, 3, 0, 2, 2, 34, -1, 2, 0, 2, 35, 2, 0, 2, 35, 2, 0, 2, 78, -10, 2, 0, 0, 197631, -2, 2, 20, 2, 43, 2, 77, 2, 18, 0, 3, 2, 18, 2, 123, 2, 21, 2, 124, 2, 50, -1, 0, 2490368, 2, 124, 2, 25, 2, 18, 2, 34, 2, 124, 2, 37, 0, 4294901904, 0, 4718591, 2, 124, 2, 35, 0, 335544350, -1, 2, 125, 0, 2147487743, 0, 1, -1, 2, 126, 2, 39, 2, 8, -1, 2, 127, 2, 65, 0, 3758161920, 0, 3, -4, 2, 0, 2, 29, 0, 2147485568, 0, 3, 2, 0, 2, 25, 0, 176, -5, 2, 0, 2, 17, 2, 188, -1, 2, 0, 2, 25, 2, 205, -1, 2, 0, 0, 16779263, -2, 2, 12, -1, 2, 37, -5, 2, 0, 2, 128, -3, 3, 0, 2, 2, 129, 2, 130, 0, 2147549183, 0, 2, -2, 2, 131, 2, 36, 0, 10, 0, 4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 536871935, 2, 18, 2, 0, 2, 41, -8, 2, 53, 2, 17, 0, 1, 2, 45, 2, 25, -3, 2, 132, 2, 36, 2, 133, 2, 134, 0, 16778239, -10, 2, 35, 0, 4294836212, 2, 9, -3, 2, 64, -2, 3, 0, 28, 2, 32, -3, 3, 0, 3, 2, 17, 3, 0, 6, 2, 78, -81, 2, 18, 3, 0, 2, 2, 36, 3, 0, 33, 2, 25, 0, 126, -125, 3, 0, 18, 2, 37, -269, 3, 0, 17, 2, 41, 2, 8, 2, 18, 2, 0, 2, 8, 2, 18, 2, 54, 2, 0, 2, 25, 2, 78, 2, 135, 2, 25, -21, 3, 0, 2, -4, 3, 0, 2, 0, 67583, -1, 2, 104, -2, 0, 11, 3, 0, 191, 2, 50, 3, 0, 38, 2, 30, -1, 2, 34, -278, 2, 136, 3, 0, 9, 2, 137, 2, 138, 2, 51, 3, 0, 11, 2, 7, -72, 3, 0, 3, 2, 139, 2, 140, -187, 3, 0, 2, 2, 52, 2, 0, 2, 141, 2, 142, 2, 56, 2, 0, 2, 143, 2, 144, 2, 145, 3, 0, 10, 2, 146, 2, 147, 2, 22, 3, 52, 2, 3, 148, 2, 3, 53, 2, 2, 149, -57, 2, 8, 2, 150, -7, 2, 18, 2, 0, 2, 54, -4, 2, 0, 0, 1065361407, 0, 16384, -9, 2, 18, 2, 54, 2, 0, 2, 128, -14, 2, 18, 2, 128, -23, 2, 151, 3, 0, 6, 2, 123, -1, 3, 0, 2, 0, 2063, -37, 2, 56, 2, 152, 2, 153, 2, 154, 2, 155, 2, 156, -138, 3, 0, 1335, -1, 3, 0, 129, 2, 32, 3, 0, 6, 2, 10, 3, 0, 180, 2, 157, 3, 0, 233, 2, 158, 3, 0, 18, 2, 10, -77, 3, 0, 16, 2, 10, -47, 3, 0, 154, 2, 6, 3, 0, 130, 2, 25, -28386, 2, 0, 0, 1, -1, 2, 129, 2, 0, 0, 8193, -21, 2, 198, 0, 10255, 0, 4, -11, 2, 64, 2, 179, -1, 0, 71680, -1, 2, 171, 0, 4292900864, 0, 268435519, -5, 2, 159, -1, 2, 169, -1, 0, 6144, -2, 2, 45, -1, 2, 163, -1, 0, 2147532800, 2, 160, 2, 166, 0, 16744448, -2, 0, 4, -4, 2, 194, 0, 205128192, 0, 1333757536, 0, 2147483696, 0, 423953, 0, 747766272, 0, 2717763192, 0, 4286578751, 0, 278545, 2, 161, 0, 4294886464, 0, 33292336, 0, 417809, 2, 161, 0, 1327482464, 0, 4278190128, 0, 700594195, 0, 1006647527, 0, 4286497336, 0, 4160749631, 2, 162, 0, 201327104, 0, 3634348576, 0, 8323120, 2, 162, 0, 202375680, 0, 2678047264, 0, 4293984304, 2, 162, -1, 0, 983584, 0, 48, 0, 58720273, 0, 3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920, 2, 182, 2, 0, 0, 2089, 0, 3221225552, 0, 201359520, 2, 0, -2, 0, 256, 0, 122880, 0, 16777216, 2, 159, 0, 4160757760, 2, 0, -6, 2, 176, -11, 0, 3263218176, -1, 0, 49664, 0, 2160197632, 0, 8388802, -1, 0, 12713984, -1, 2, 163, 2, 164, 2, 183, -2, 2, 172, -20, 0, 3758096385, -2, 2, 165, 2, 191, 2, 91, 2, 177, 0, 4294057984, -2, 2, 173, 2, 168, 0, 4227874816, -2, 2, 165, -1, 2, 166, -1, 2, 178, 2, 129, 0, 4026593280, 0, 14, 0, 4292919296, -1, 2, 175, 0, 939588608, -1, 0, 805306368, -1, 2, 129, 2, 167, 2, 168, 2, 169, 2, 207, 2, 0, -2, 2, 170, 2, 129, -3, 0, 267386880, -1, 0, 117440512, 0, 7168, -1, 2, 210, 2, 163, 2, 171, 2, 184, -16, 2, 172, -1, 0, 1426112704, 2, 173, -1, 2, 192, 0, 271581216, 0, 2149777408, 2, 25, 2, 171, 2, 129, 0, 851967, 2, 185, -1, 2, 174, 2, 186, -4, 2, 175, -20, 2, 197, 2, 204, -56, 0, 3145728, 2, 187, -10, 0, 32505856, -1, 2, 176, -1, 0, 2147385088, 2, 91, 1, 2155905152, 2, -3, 2, 173, 2, 0, 0, 67108864, -2, 2, 177, -6, 2, 178, 2, 25, 0, 1, -1, 0, 1, -1, 2, 179, -3, 2, 123, 2, 64, -2, 2, 97, -2, 0, 32752, 2, 129, -915, 2, 170, -1, 2, 203, -10, 2, 190, -5, 2, 181, -6, 0, 4229232640, 2, 19, -1, 2, 180, -1, 2, 181, -2, 0, 4227874752, -3, 0, 2146435072, 2, 164, -2, 0, 1006649344, 2, 129, -1, 2, 91, 0, 201375744, -3, 0, 134217720, 2, 91, 0, 4286677377, 0, 32896, -1, 2, 175, -3, 0, 4227907584, -349, 0, 65520, 0, 1920, 2, 182, 3, 0, 264, -11, 2, 169, -2, 2, 183, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0, 524280, -13, 2, 189, -1, 0, 4294934272, 2, 25, 2, 183, -1, 2, 213, 0, 2158720, -3, 2, 164, 0, 1, -4, 2, 129, 0, 3808625411, 0, 3489628288, 0, 4096, 0, 1207959680, 0, 3221274624, 2, 0, -3, 2, 184, 0, 120, 0, 7340032, -2, 2, 185, 2, 4, 2, 25, 2, 173, 3, 0, 4, 2, 164, -1, 2, 186, 2, 182, -1, 0, 8176, 2, 166, 2, 184, 2, 211, -1, 0, 4290773232, 2, 0, -4, 2, 173, 2, 193, 0, 15728640, 2, 182, -1, 2, 171, -1, 0, 134250480, 0, 4720640, 0, 3825467396, 3, 0, 2, -9, 2, 91, 2, 178, 0, 4294967040, 2, 133, 0, 4160880640, 3, 0, 2, 0, 704, 0, 1849688064, 2, 187, -1, 2, 129, 0, 4294901887, 2, 0, 0, 130547712, 0, 1879048192, 2, 208, 3, 0, 2, -1, 2, 188, 2, 189, -1, 0, 17829776, 0, 2025848832, 2, 212, -2, 2, 0, -1, 0, 4286580608, -1, 0, 29360128, 2, 196, 0, 16252928, 0, 3791388672, 2, 39, 3, 0, 2, -2, 2, 202, 2, 0, -1, 2, 104, -1, 0, 66584576, -1, 2, 195, 3, 0, 9, 2, 129, -1, 0, 4294755328, 2, 0, 2, 20, -1, 2, 171, 2, 183, 2, 25, 2, 95, 2, 25, 2, 190, 2, 91, -2, 0, 245760, 2, 191, -1, 2, 159, 2, 199, 0, 4227923456, -1, 2, 192, 2, 171, 2, 91, -3, 0, 4292870145, 0, 262144, -1, 2, 92, 2, 0, 0, 1073758848, 2, 193, -1, 0, 4227921920, 2, 194, 0, 68289024, 0, 528402016, 0, 4292927536, 3, 0, 4, -2, 0, 268435456, 2, 92, -2, 2, 195, 3, 0, 5, -1, 2, 196, 2, 173, 2, 0, -2, 0, 4227923936, 2, 62, -1, 2, 183, 2, 95, 2, 0, 2, 163, 2, 175, 2, 197, 3, 0, 5, -1, 2, 182, 3, 0, 3, -2, 0, 2146959360, 0, 9440640, 0, 104857600, 0, 4227923840, 3, 0, 2, 0, 768, 2, 198, 2, 28, -2, 2, 171, -2, 2, 199, -1, 2, 165, 2, 95, 3, 0, 7, 0, 512, 0, 8388608, 2, 200, 2, 170, 2, 189, 0, 4286578944, 3, 0, 2, 0, 1152, 0, 1266679808, 2, 195, 0, 576, 0, 4261707776, 2, 95, 3, 0, 9, 2, 165, 0, 131072, 0, 939524096, 2, 183, 3, 0, 2, 2, 16, -1, 0, 2147221504, -28, 2, 183, 3, 0, 3, -3, 0, 4292902912, -6, 2, 96, 3, 0, 81, 2, 25, -2, 2, 104, -33, 2, 18, 2, 178, 3, 0, 125, -18, 2, 197, 3, 0, 269, -17, 2, 165, 2, 129, 2, 201, -1, 2, 129, 2, 193, 0, 4290822144, -2, 0, 67174336, 0, 520093700, 2, 18, 3, 0, 21, -2, 2, 184, 3, 0, 3, -2, 0, 30720, -1, 0, 32512, 3, 0, 2, 0, 4294770656, -191, 2, 181, -38, 2, 178, 2, 0, 2, 202, 3, 0, 278, 0, 2417033215, -9, 0, 4294705144, 0, 4292411391, 0, 65295, -11, 2, 182, 3, 0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 147, -1, 2, 169, 2, 203, -3, 2, 96, 2, 0, -7, 2, 178, -1, 0, 384, -1, 0, 133693440, -3, 2, 204, -2, 2, 107, 3, 0, 3, 3, 177, 2, -2, 2, 91, 2, 165, 3, 0, 4, -2, 2, 192, -1, 2, 159, 0, 335552923, 2, 205, -1, 0, 538974272, 0, 2214592512, 0, 132000, -10, 0, 192, -8, 2, 206, -21, 0, 134213632, 2, 158, 3, 0, 34, 2, 129, 0, 4294965279, 3, 0, 6, 0, 100663424, 0, 63524, -1, 2, 209, 2, 148, 3, 0, 3, -1, 0, 3221282816, 0, 4294917120, 3, 0, 9, 2, 25, 2, 207, -1, 2, 208, 3, 0, 14, 2, 25, 2, 183, 3, 0, 23, 0, 2147520640, -6, 0, 4286578784, 2, 0, -2, 0, 1006694400, 3, 0, 24, 2, 36, -1, 0, 4292870144, 3, 0, 2, 0, 1, 2, 173, 3, 0, 6, 2, 205, 0, 4110942569, 0, 1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2, 0, 2, 46, 3, 0, 8, -1, 2, 175, -2, 2, 177, 0, 98304, 0, 65537, 2, 178, -5, 2, 209, 2, 0, 2, 77, 2, 199, 2, 182, 0, 4294770176, 2, 107, 3, 0, 4, -30, 2, 188, 0, 3758153728, -3, 0, 125829120, -2, 2, 183, 0, 4294897664, 2, 175, -1, 2, 195, -1, 2, 171, 0, 4294754304, 3, 0, 2, -10, 2, 177, 0, 3758145536, 2, 210, 2, 211, 0, 4026548160, 2, 212, -4, 2, 213, -1, 2, 204, 0, 4227923967, 3, 0, 32, -1335, 2, 0, -129, 2, 183, -6, 2, 173, -180, 0, 65532, -233, 2, 174, -18, 2, 173, 3, 0, 77, -16, 2, 173, 3, 0, 47, -154, 2, 166, -130, 2, 18, 3, 0, 22250, -7, 2, 18, 3, 0, 6128], [4294967295, 4294967291, 4092460543, 4294828031, 4294967294, 134217726, 4294903807, 268435455, 2147483647, 1048575, 1073741823, 3892314111, 134217727, 1061158911, 536805376, 4294910143, 4294901759, 32767, 4294901760, 262143, 536870911, 8388607, 4160749567, 4294902783, 4294918143, 65535, 67043328, 2281701374, 4294967264, 2097151, 4194303, 255, 67108863, 4294967039, 511, 524287, 131071, 127, 3238002687, 4294902271, 4294549487, 33554431, 1023, 4294901888, 4286578687, 4294705152, 4294770687, 67043583, 2047999, 67043343, 16777215, 4294902000, 4292870143, 4294966783, 16383, 67047423, 4294967279, 262083, 20511, 4290772991, 41943039, 493567, 4294959104, 603979775, 65536, 602799615, 805044223, 4294965206, 8191, 1031749119, 4294917631, 2134769663, 4286578493, 4282253311, 4294942719, 33540095, 4294905855, 63, 15, 2868854591, 1608515583, 265232348, 534519807, 2147614720, 1060109444, 4093640016, 17376, 2139062143, 224, 4169138175, 4294909951, 4286578688, 4294967292, 4294965759, 65734655, 4294966272, 4294967280, 32768, 8289918, 4294934399, 4294901775, 4294965375, 1602223615, 4294967259, 4294443008, 268369920, 4292804608, 4294967232, 486341884, 4294963199, 3087007615, 1073692671, 4128527, 4279238655, 4294902015, 4160684047, 4290246655, 469499899, 4294967231, 134086655, 4294966591, 2445279231, 3670015, 31, 4294967288, 4294705151, 3221208447, 4294549472, 4095, 2147483648, 4285526655, 4294966527, 4294966143, 64, 4294966719, 3774873592, 1877934080, 262151, 2555904, 536807423, 67043839, 3758096383, 3959414372, 3755993023, 2080374783, 4294835295, 4294967103, 4160749565, 4294934527, 4087, 2016, 2147446655, 184024726, 2862017156, 1593309078, 268434431, 268434414, 4294901763, 4294901761, 536870912, 2952790016, 202506752, 139264, 402653184, 3758096384, 4261412864, 63488, 1610612736, 4227922944, 49152, 57344, 65280, 3233808384, 3221225472, 65534, 61440, 57152, 4293918720, 4290772992, 25165824, 4227915776, 4278190080, 4026531840, 4227858432, 4160749568, 3758129152, 4294836224, 4194304, 251658240, 196608, 4294963200, 2143289344, 2097152, 64512, 417808, 4227923712, 12582912, 4294967168, 50331648, 65528, 65472, 15360, 4294966784, 65408, 4294965248, 16, 12288, 4294934528, 2080374784, 4294950912, 65024, 1073741824, 4261477888, 524288]);

function advanceChar(parser) {
    parser.column++;
    return (parser.currentChar = parser.source.charCodeAt(++parser.index));
}
function consumeMultiUnitCodePoint(parser, hi) {
    if ((hi & 0xfc00) !== 55296)
        return 0;
    const lo = parser.source.charCodeAt(parser.index + 1);
    if ((lo & 0xfc00) !== 0xdc00)
        return 0;
    hi = parser.currentChar = 65536 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
    if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
        report(parser, 18, fromCodePoint(hi));
    }
    parser.index++;
    parser.column++;
    return 1;
}
function consumeLineFeed(parser, state) {
    parser.currentChar = parser.source.charCodeAt(++parser.index);
    parser.flags |= 1;
    if ((state & 4) === 0) {
        parser.column = 0;
        parser.line++;
    }
}
function scanNewLine(parser) {
    parser.flags |= 1;
    parser.currentChar = parser.source.charCodeAt(++parser.index);
    parser.column = 0;
    parser.line++;
}
function isExoticECMAScriptWhitespace(ch) {
    return (ch === 160 ||
        ch === 65279 ||
        ch === 133 ||
        ch === 5760 ||
        (ch >= 8192 && ch <= 8203) ||
        ch === 8239 ||
        ch === 8287 ||
        ch === 12288 ||
        ch === 8201 ||
        ch === 65519);
}
function fromCodePoint(codePoint) {
    return codePoint <= 65535
        ? String.fromCharCode(codePoint)
        : String.fromCharCode(codePoint >>> 10) + String.fromCharCode(codePoint & 0x3ff);
}
function toHex(code) {
    return code < 65 ? code - 48 : (code - 65 + 10) & 0xf;
}
function convertTokenType(t) {
    switch (t) {
        case 134283266:
            return 'NumericLiteral';
        case 134283267:
            return 'StringLiteral';
        case 86021:
        case 86022:
            return 'BooleanLiteral';
        case 86023:
            return 'NullLiteral';
        case 65540:
            return 'RegularExpression';
        case 67174408:
        case 67174409:
        case 132:
            return 'TemplateLiteral';
        default:
            if ((t & 143360) === 143360)
                return 'Identifier';
            if ((t & 4096) === 4096)
                return 'Keyword';
            return 'Punctuator';
    }
}

const CharTypes = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    8 | 1024,
    0,
    0,
    8 | 2048,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    8192,
    0,
    1 | 2,
    0,
    0,
    8192,
    0,
    0,
    0,
    256,
    0,
    256 | 32768,
    0,
    0,
    2 | 16 | 128 | 32 | 64,
    2 | 16 | 128 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 32 | 64,
    2 | 16 | 512 | 64,
    2 | 16 | 512 | 64,
    0,
    0,
    16384,
    0,
    0,
    0,
    0,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2 | 64,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    1 | 2,
    0,
    1,
    0,
    0,
    1 | 2 | 4096,
    0,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4 | 64,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    1 | 2 | 4,
    16384,
    0,
    0,
    0,
    0
];
const isIdStart = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
];
const isIdPart = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    0
];
function isIdentifierStart(code) {
    return code <= 0x7F
        ? isIdStart[code]
        : (unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1;
}
function isIdentifierPart(code) {
    return code <= 0x7F
        ? isIdPart[code]
        : (unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1 || (code === 8204 || code === 8205);
}

const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
function skipHashBang(parser) {
    const source = parser.source;
    if (parser.currentChar === 35 && source.charCodeAt(parser.index + 1) === 33) {
        advanceChar(parser);
        advanceChar(parser);
        skipSingleLineComment(parser, source, 0, 4, parser.tokenPos, parser.linePos, parser.colPos);
    }
}
function skipSingleHTMLComment(parser, source, state, context, type, start, line, column) {
    if (context & 2048)
        report(parser, 0);
    return skipSingleLineComment(parser, source, state, type, start, line, column);
}
function skipSingleLineComment(parser, source, state, type, start, line, column) {
    const { index } = parser;
    parser.tokenPos = parser.index;
    parser.linePos = parser.line;
    parser.colPos = parser.column;
    while (parser.index < parser.end) {
        if (CharTypes[parser.currentChar] & 8) {
            const isCR = parser.currentChar === 13;
            scanNewLine(parser);
            if (isCR && parser.index < parser.end && parser.currentChar === 10)
                parser.currentChar = source.charCodeAt(++parser.index);
            break;
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            scanNewLine(parser);
            break;
        }
        advanceChar(parser);
        parser.tokenPos = parser.index;
        parser.linePos = parser.line;
        parser.colPos = parser.column;
    }
    if (parser.onComment) {
        const loc = {
            start: {
                line,
                column
            },
            end: {
                line: parser.linePos,
                column: parser.colPos
            }
        };
        parser.onComment(CommentTypes[type & 0xff], source.slice(index, parser.tokenPos), start, parser.tokenPos, loc);
    }
    return state | 1;
}
function skipMultiLineComment(parser, source, state) {
    const { index } = parser;
    while (parser.index < parser.end) {
        if (parser.currentChar < 0x2b) {
            let skippedOneAsterisk = false;
            while (parser.currentChar === 42) {
                if (!skippedOneAsterisk) {
                    state &= ~4;
                    skippedOneAsterisk = true;
                }
                if (advanceChar(parser) === 47) {
                    advanceChar(parser);
                    if (parser.onComment) {
                        const loc = {
                            start: {
                                line: parser.linePos,
                                column: parser.colPos
                            },
                            end: {
                                line: parser.line,
                                column: parser.column
                            }
                        };
                        parser.onComment(CommentTypes[1 & 0xff], source.slice(index, parser.index - 2), index - 2, parser.index, loc);
                    }
                    parser.tokenPos = parser.index;
                    parser.linePos = parser.line;
                    parser.colPos = parser.column;
                    return state;
                }
            }
            if (skippedOneAsterisk) {
                continue;
            }
            if (CharTypes[parser.currentChar] & 8) {
                if (parser.currentChar === 13) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
            }
            else {
                advanceChar(parser);
            }
        }
        else if ((parser.currentChar ^ 8232) <= 1) {
            state = (state & ~4) | 1;
            scanNewLine(parser);
        }
        else {
            state &= ~4;
            advanceChar(parser);
        }
    }
    report(parser, 16);
}

function scanRegularExpression(parser, context) {
    const bodyStart = parser.index;
    let preparseState = 0;
    loop: while (true) {
        const ch = parser.currentChar;
        advanceChar(parser);
        if (preparseState & 1) {
            preparseState &= ~1;
        }
        else {
            switch (ch) {
                case 47:
                    if (!preparseState)
                        break loop;
                    else
                        break;
                case 92:
                    preparseState |= 1;
                    break;
                case 91:
                    preparseState |= 2;
                    break;
                case 93:
                    preparseState &= 1;
                    break;
                case 13:
                case 10:
                case 8232:
                case 8233:
                    report(parser, 32);
            }
        }
        if (parser.index >= parser.source.length) {
            return report(parser, 32);
        }
    }
    const bodyEnd = parser.index - 1;
    let mask = 0;
    let char = parser.currentChar;
    const { index: flagStart } = parser;
    while (isIdentifierPart(char)) {
        switch (char) {
            case 103:
                if (mask & 2)
                    report(parser, 34, 'g');
                mask |= 2;
                break;
            case 105:
                if (mask & 1)
                    report(parser, 34, 'i');
                mask |= 1;
                break;
            case 109:
                if (mask & 4)
                    report(parser, 34, 'm');
                mask |= 4;
                break;
            case 117:
                if (mask & 16)
                    report(parser, 34, 'u');
                mask |= 16;
                break;
            case 121:
                if (mask & 8)
                    report(parser, 34, 'y');
                mask |= 8;
                break;
            case 115:
                if (mask & 32)
                    report(parser, 34, 's');
                mask |= 32;
                break;
            case 100:
                if (mask & 64)
                    report(parser, 34, 'd');
                mask |= 64;
                break;
            default:
                report(parser, 33);
        }
        char = advanceChar(parser);
    }
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    parser.tokenRegExp = { pattern, flags };
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    parser.tokenValue = validate(parser, pattern, flags);
    return 65540;
}
function validate(parser, pattern, flags) {
    try {
        return new RegExp(pattern, flags);
    }
    catch (e) {
        try {
            new RegExp(pattern, flags.replace('d', ''));
            return null;
        }
        catch (e) {
            report(parser, 32);
        }
    }
}

function scanString(parser, context, quote) {
    const { index: start } = parser;
    let ret = '';
    let char = advanceChar(parser);
    let marker = parser.index;
    while ((CharTypes[char] & 8) === 0) {
        if (char === quote) {
            ret += parser.source.slice(marker, parser.index);
            advanceChar(parser);
            if (context & 512)
                parser.tokenRaw = parser.source.slice(start, parser.index);
            parser.tokenValue = ret;
            return 134283267;
        }
        if ((char & 8) === 8 && char === 92) {
            ret += parser.source.slice(marker, parser.index);
            char = advanceChar(parser);
            if (char < 0x7f || char === 8232 || char === 8233) {
                const code = parseEscape(parser, context, char);
                if (code >= 0)
                    ret += fromCodePoint(code);
                else
                    handleStringError(parser, code, 0);
            }
            else {
                ret += fromCodePoint(char);
            }
            marker = parser.index + 1;
        }
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    report(parser, 14);
}
function parseEscape(parser, context, first) {
    switch (first) {
        case 98:
            return 8;
        case 102:
            return 12;
        case 114:
            return 13;
        case 110:
            return 10;
        case 116:
            return 9;
        case 118:
            return 11;
        case 13: {
            if (parser.index < parser.end) {
                const nextChar = parser.source.charCodeAt(parser.index + 1);
                if (nextChar === 10) {
                    parser.index = parser.index + 1;
                    parser.currentChar = nextChar;
                }
            }
        }
        case 10:
        case 8232:
        case 8233:
            parser.column = -1;
            parser.line++;
            return -1;
        case 48:
        case 49:
        case 50:
        case 51: {
            let code = first - 48;
            let index = parser.index + 1;
            let column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if ((CharTypes[next] & 32) === 0) {
                    if ((code !== 0 || CharTypes[next] & 512) && context & 1024)
                        return -2;
                }
                else if (context & 1024) {
                    return -2;
                }
                else {
                    parser.currentChar = next;
                    code = (code << 3) | (next - 48);
                    index++;
                    column++;
                    if (index < parser.end) {
                        const next = parser.source.charCodeAt(index);
                        if (CharTypes[next] & 32) {
                            parser.currentChar = next;
                            code = (code << 3) | (next - 48);
                            index++;
                            column++;
                        }
                    }
                    parser.flags |= 64;
                    parser.index = index - 1;
                    parser.column = column - 1;
                }
            }
            return code;
        }
        case 52:
        case 53:
        case 54:
        case 55: {
            if (context & 1024)
                return -2;
            let code = first - 48;
            const index = parser.index + 1;
            const column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if (CharTypes[next] & 32) {
                    code = (code << 3) | (next - 48);
                    parser.currentChar = next;
                    parser.index = index;
                    parser.column = column;
                }
            }
            parser.flags |= 64;
            return code;
        }
        case 120: {
            const ch1 = advanceChar(parser);
            if ((CharTypes[ch1] & 64) === 0)
                return -4;
            const hi = toHex(ch1);
            const ch2 = advanceChar(parser);
            if ((CharTypes[ch2] & 64) === 0)
                return -4;
            const lo = toHex(ch2);
            return (hi << 4) | lo;
        }
        case 117: {
            const ch = advanceChar(parser);
            if (parser.currentChar === 123) {
                let code = 0;
                while ((CharTypes[advanceChar(parser)] & 64) !== 0) {
                    code = (code << 4) | toHex(parser.currentChar);
                    if (code > 1114111)
                        return -5;
                }
                if (parser.currentChar < 1 || parser.currentChar !== 125) {
                    return -4;
                }
                return code;
            }
            else {
                if ((CharTypes[ch] & 64) === 0)
                    return -4;
                const ch2 = parser.source.charCodeAt(parser.index + 1);
                if ((CharTypes[ch2] & 64) === 0)
                    return -4;
                const ch3 = parser.source.charCodeAt(parser.index + 2);
                if ((CharTypes[ch3] & 64) === 0)
                    return -4;
                const ch4 = parser.source.charCodeAt(parser.index + 3);
                if ((CharTypes[ch4] & 64) === 0)
                    return -4;
                parser.index += 3;
                parser.column += 3;
                parser.currentChar = parser.source.charCodeAt(parser.index);
                return (toHex(ch) << 12) | (toHex(ch2) << 8) | (toHex(ch3) << 4) | toHex(ch4);
            }
        }
        case 56:
        case 57:
            if ((context & 256) === 0)
                return -3;
        default:
            return first;
    }
}
function handleStringError(state, code, isTemplate) {
    switch (code) {
        case -1:
            return;
        case -2:
            report(state, isTemplate ? 2 : 1);
        case -3:
            report(state, 13);
        case -4:
            report(state, 6);
        case -5:
            report(state, 102);
    }
}

function scanTemplate(parser, context) {
    const { index: start } = parser;
    let token = 67174409;
    let ret = '';
    let char = advanceChar(parser);
    while (char !== 96) {
        if (char === 36 && parser.source.charCodeAt(parser.index + 1) === 123) {
            advanceChar(parser);
            token = 67174408;
            break;
        }
        else if ((char & 8) === 8 && char === 92) {
            char = advanceChar(parser);
            if (char > 0x7e) {
                ret += fromCodePoint(char);
            }
            else {
                const code = parseEscape(parser, context | 1024, char);
                if (code >= 0) {
                    ret += fromCodePoint(code);
                }
                else if (code !== -1 && context & 65536) {
                    ret = undefined;
                    char = scanBadTemplate(parser, char);
                    if (char < 0)
                        token = 67174408;
                    break;
                }
                else {
                    handleStringError(parser, code, 1);
                }
            }
        }
        else {
            if (parser.index < parser.end &&
                char === 13 &&
                parser.source.charCodeAt(parser.index) === 10) {
                ret += fromCodePoint(char);
                parser.currentChar = parser.source.charCodeAt(++parser.index);
            }
            if (((char & 83) < 3 && char === 10) || (char ^ 8232) <= 1) {
                parser.column = -1;
                parser.line++;
            }
            ret += fromCodePoint(char);
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        char = advanceChar(parser);
    }
    advanceChar(parser);
    parser.tokenValue = ret;
    parser.tokenRaw = parser.source.slice(start + 1, parser.index - (token === 67174409 ? 1 : 2));
    return token;
}
function scanBadTemplate(parser, ch) {
    while (ch !== 96) {
        switch (ch) {
            case 36: {
                const index = parser.index + 1;
                if (index < parser.end && parser.source.charCodeAt(index) === 123) {
                    parser.index = index;
                    parser.column++;
                    return -ch;
                }
                break;
            }
            case 10:
            case 8232:
            case 8233:
                parser.column = -1;
                parser.line++;
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        ch = advanceChar(parser);
    }
    return ch;
}
function scanTemplateTail(parser, context) {
    if (parser.index >= parser.end)
        report(parser, 0);
    parser.index--;
    parser.column--;
    return scanTemplate(parser, context);
}

function scanNumber(parser, context, kind) {
    let char = parser.currentChar;
    let value = 0;
    let digit = 9;
    let atStart = kind & 64 ? 0 : 1;
    let digits = 0;
    let allowSeparator = 0;
    if (kind & 64) {
        value = '.' + scanDecimalDigitsOrSeparator(parser, char);
        char = parser.currentChar;
        if (char === 110)
            report(parser, 11);
    }
    else {
        if (char === 48) {
            char = advanceChar(parser);
            if ((char | 32) === 120) {
                kind = 8 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (64 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator)
                            report(parser, 147);
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 0x10 + toHex(char);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 19 : 148);
                }
            }
            else if ((char | 32) === 111) {
                kind = 4 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (32 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 147);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 8 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 148);
                }
            }
            else if ((char | 32) === 98) {
                kind = 2 | 128;
                char = advanceChar(parser);
                while (CharTypes[char] & (128 | 4096)) {
                    if (char === 95) {
                        if (!allowSeparator) {
                            report(parser, 147);
                        }
                        allowSeparator = 0;
                        char = advanceChar(parser);
                        continue;
                    }
                    allowSeparator = 1;
                    value = value * 2 + (char - 48);
                    digits++;
                    char = advanceChar(parser);
                }
                if (digits === 0 || !allowSeparator) {
                    report(parser, digits === 0 ? 0 : 148);
                }
            }
            else if (CharTypes[char] & 32) {
                if (context & 1024)
                    report(parser, 1);
                kind = 1;
                while (CharTypes[char] & 16) {
                    if (CharTypes[char] & 512) {
                        kind = 32;
                        atStart = 0;
                        break;
                    }
                    value = value * 8 + (char - 48);
                    char = advanceChar(parser);
                }
            }
            else if (CharTypes[char] & 512) {
                if (context & 1024)
                    report(parser, 1);
                parser.flags |= 64;
                kind = 32;
            }
            else if (char === 95) {
                report(parser, 0);
            }
        }
        if (kind & 48) {
            if (atStart) {
                while (digit >= 0 && CharTypes[char] & (16 | 4096)) {
                    if (char === 95) {
                        char = advanceChar(parser);
                        if (char === 95 || kind & 32) {
                            reportScannerError(parser.index, parser.line, parser.index + 1, 147);
                        }
                        allowSeparator = 1;
                        continue;
                    }
                    allowSeparator = 0;
                    value = 10 * value + (char - 48);
                    char = advanceChar(parser);
                    --digit;
                }
                if (allowSeparator) {
                    reportScannerError(parser.index, parser.line, parser.index + 1, 148);
                }
                if (digit >= 0 && !isIdentifierStart(char) && char !== 46) {
                    parser.tokenValue = value;
                    if (context & 512)
                        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
                    return 134283266;
                }
            }
            value += scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
            if (char === 46) {
                if (advanceChar(parser) === 95)
                    report(parser, 0);
                kind = 64;
                value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
                char = parser.currentChar;
            }
        }
    }
    const end = parser.index;
    let isBigInt = 0;
    if (char === 110 && kind & 128) {
        isBigInt = 1;
        char = advanceChar(parser);
    }
    else {
        if ((char | 32) === 101) {
            char = advanceChar(parser);
            if (CharTypes[char] & 256)
                char = advanceChar(parser);
            const { index } = parser;
            if ((CharTypes[char] & 16) === 0)
                report(parser, 10);
            value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, char);
            char = parser.currentChar;
        }
    }
    if ((parser.index < parser.end && CharTypes[char] & 16) || isIdentifierStart(char)) {
        report(parser, 12);
    }
    if (isBigInt) {
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
        parser.tokenValue = BigInt(value);
        return 134283389;
    }
    parser.tokenValue =
        kind & (1 | 2 | 8 | 4)
            ? value
            : kind & 32
                ? parseFloat(parser.source.substring(parser.tokenPos, parser.index))
                : +value;
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283266;
}
function scanDecimalDigitsOrSeparator(parser, char) {
    let allowSeparator = 0;
    let start = parser.index;
    let ret = '';
    while (CharTypes[char] & (16 | 4096)) {
        if (char === 95) {
            const { index } = parser;
            char = advanceChar(parser);
            if (char === 95) {
                reportScannerError(parser.index, parser.line, parser.index + 1, 147);
            }
            allowSeparator = 1;
            ret += parser.source.substring(start, index);
            start = parser.index;
            continue;
        }
        allowSeparator = 0;
        char = advanceChar(parser);
    }
    if (allowSeparator) {
        reportScannerError(parser.index, parser.line, parser.index + 1, 148);
    }
    return ret + parser.source.substring(start, parser.index);
}

const KeywordDescTable = [
    'end of source',
    'identifier', 'number', 'string', 'regular expression',
    'false', 'true', 'null',
    'template continuation', 'template tail',
    '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',
    '++', '--',
    '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
    '&=', '||=', '&&=', '??=',
    'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
    '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',
    'var', 'let', 'const',
    'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
    'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
    'this', 'throw', 'try', 'while', 'with',
    'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',
    'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',
    'enum', 'eval', 'arguments', 'escaped keyword', 'escaped future reserved keyword', 'reserved if strict', '#',
    'BigIntLiteral', '??', '?.', 'WhiteSpace', 'Illegal', 'LineTerminator', 'PrivateField',
    'Template', '@', 'target', 'meta', 'LineFeed', 'Escaped', 'JSXText'
];
const descKeywordTable = Object.create(null, {
    this: { value: 86113 },
    function: { value: 86106 },
    if: { value: 20571 },
    return: { value: 20574 },
    var: { value: 86090 },
    else: { value: 20565 },
    for: { value: 20569 },
    new: { value: 86109 },
    in: { value: 8738868 },
    typeof: { value: 16863277 },
    while: { value: 20580 },
    case: { value: 20558 },
    break: { value: 20557 },
    try: { value: 20579 },
    catch: { value: 20559 },
    delete: { value: 16863278 },
    throw: { value: 86114 },
    switch: { value: 86112 },
    continue: { value: 20561 },
    default: { value: 20563 },
    instanceof: { value: 8476725 },
    do: { value: 20564 },
    void: { value: 16863279 },
    finally: { value: 20568 },
    async: { value: 209007 },
    await: { value: 209008 },
    class: { value: 86096 },
    const: { value: 86092 },
    constructor: { value: 12401 },
    debugger: { value: 20562 },
    export: { value: 20566 },
    extends: { value: 20567 },
    false: { value: 86021 },
    from: { value: 12404 },
    get: { value: 12402 },
    implements: { value: 36966 },
    import: { value: 86108 },
    interface: { value: 36967 },
    let: { value: 241739 },
    null: { value: 86023 },
    of: { value: 274549 },
    package: { value: 36968 },
    private: { value: 36969 },
    protected: { value: 36970 },
    public: { value: 36971 },
    set: { value: 12403 },
    static: { value: 36972 },
    super: { value: 86111 },
    true: { value: 86022 },
    with: { value: 20581 },
    yield: { value: 241773 },
    enum: { value: 86134 },
    eval: { value: 537079927 },
    as: { value: 77934 },
    arguments: { value: 537079928 },
    target: { value: 143494 },
    meta: { value: 143495 },
});

function scanIdentifier(parser, context, isValidAsKeyword) {
    while (isIdPart[advanceChar(parser)]) { }
    parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
    return parser.currentChar !== 92 && parser.currentChar <= 0x7e
        ? descKeywordTable[parser.tokenValue] || 208897
        : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
}
function scanUnicodeIdentifier(parser, context) {
    const cookedChar = scanIdentifierUnicodeEscape(parser);
    if (!isIdentifierPart(cookedChar))
        report(parser, 4);
    parser.tokenValue = fromCodePoint(cookedChar);
    return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & 4);
}
function scanIdentifierSlowCase(parser, context, hasEscape, isValidAsKeyword) {
    let start = parser.index;
    while (parser.index < parser.end) {
        if (parser.currentChar === 92) {
            parser.tokenValue += parser.source.slice(start, parser.index);
            hasEscape = 1;
            const code = scanIdentifierUnicodeEscape(parser);
            if (!isIdentifierPart(code))
                report(parser, 4);
            isValidAsKeyword = isValidAsKeyword && CharTypes[code] & 4;
            parser.tokenValue += fromCodePoint(code);
            start = parser.index;
        }
        else if (isIdentifierPart(parser.currentChar) || consumeMultiUnitCodePoint(parser, parser.currentChar)) {
            advanceChar(parser);
        }
        else {
            break;
        }
    }
    if (parser.index <= parser.end) {
        parser.tokenValue += parser.source.slice(start, parser.index);
    }
    const length = parser.tokenValue.length;
    if (isValidAsKeyword && length >= 2 && length <= 11) {
        const token = descKeywordTable[parser.tokenValue];
        if (token === void 0)
            return 208897;
        if (!hasEscape)
            return token;
        if (token === 209008) {
            if ((context & (2048 | 4194304)) === 0) {
                return token;
            }
            return 121;
        }
        if (context & 1024) {
            if (token === 36972) {
                return 122;
            }
            if ((token & 36864) === 36864) {
                return 122;
            }
            if ((token & 20480) === 20480) {
                if (context & 268435456 && (context & 8192) === 0) {
                    return token;
                }
                else {
                    return 121;
                }
            }
            return 143483;
        }
        if (context & 268435456 &&
            (context & 8192) === 0 &&
            (token & 20480) === 20480)
            return token;
        if (token === 241773) {
            return context & 268435456
                ? 143483
                : context & 2097152
                    ? 121
                    : token;
        }
        if (token === 209007) {
            return 143483;
        }
        if ((token & 36864) === 36864) {
            return token;
        }
        return 121;
    }
    return 208897;
}
function scanPrivateIdentifier(parser) {
    if (!isIdentifierStart(advanceChar(parser)))
        report(parser, 94);
    return 131;
}
function scanIdentifierUnicodeEscape(parser) {
    if (parser.source.charCodeAt(parser.index + 1) !== 117) {
        report(parser, 4);
    }
    parser.currentChar = parser.source.charCodeAt((parser.index += 2));
    return scanUnicodeEscape(parser);
}
function scanUnicodeEscape(parser) {
    let codePoint = 0;
    const char = parser.currentChar;
    if (char === 123) {
        const begin = parser.index - 2;
        while (CharTypes[advanceChar(parser)] & 64) {
            codePoint = (codePoint << 4) | toHex(parser.currentChar);
            if (codePoint > 1114111)
                reportScannerError(begin, parser.line, parser.index + 1, 102);
        }
        if (parser.currentChar !== 125) {
            reportScannerError(begin, parser.line, parser.index - 1, 6);
        }
        advanceChar(parser);
        return codePoint;
    }
    if ((CharTypes[char] & 64) === 0)
        report(parser, 6);
    const char2 = parser.source.charCodeAt(parser.index + 1);
    if ((CharTypes[char2] & 64) === 0)
        report(parser, 6);
    const char3 = parser.source.charCodeAt(parser.index + 2);
    if ((CharTypes[char3] & 64) === 0)
        report(parser, 6);
    const char4 = parser.source.charCodeAt(parser.index + 3);
    if ((CharTypes[char4] & 64) === 0)
        report(parser, 6);
    codePoint = (toHex(char) << 12) | (toHex(char2) << 8) | (toHex(char3) << 4) | toHex(char4);
    parser.currentChar = parser.source.charCodeAt((parser.index += 4));
    return codePoint;
}

const TokenLookup = [
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    136,
    128,
    128,
    130,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    128,
    16842800,
    134283267,
    131,
    208897,
    8457015,
    8455751,
    134283267,
    67174411,
    16,
    8457014,
    25233970,
    18,
    25233971,
    67108877,
    8457016,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    21,
    1074790417,
    8456258,
    1077936157,
    8456259,
    22,
    133,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    69271571,
    137,
    20,
    8455497,
    208897,
    132,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    4096,
    208897,
    4096,
    208897,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    208897,
    4096,
    4096,
    4096,
    208897,
    4096,
    4096,
    208897,
    4096,
    4096,
    2162700,
    8455240,
    1074790415,
    16842801,
    129
];
function nextToken(parser, context) {
    parser.flags = (parser.flags | 1) ^ 1;
    parser.startPos = parser.index;
    parser.startColumn = parser.column;
    parser.startLine = parser.line;
    parser.token = scanSingleToken(parser, context, 0);
    if (parser.onToken && parser.token !== 1048576) {
        const loc = {
            start: {
                line: parser.linePos,
                column: parser.colPos
            },
            end: {
                line: parser.line,
                column: parser.column
            }
        };
        parser.onToken(convertTokenType(parser.token), parser.tokenPos, parser.index, loc);
    }
}
function scanSingleToken(parser, context, state) {
    const isStartOfLine = parser.index === 0;
    const source = parser.source;
    let startPos = parser.index;
    let startLine = parser.line;
    let startColumn = parser.column;
    while (parser.index < parser.end) {
        parser.tokenPos = parser.index;
        parser.colPos = parser.column;
        parser.linePos = parser.line;
        let char = parser.currentChar;
        if (char <= 0x7e) {
            const token = TokenLookup[char];
            switch (token) {
                case 67174411:
                case 16:
                case 2162700:
                case 1074790415:
                case 69271571:
                case 20:
                case 21:
                case 1074790417:
                case 18:
                case 16842801:
                case 133:
                case 129:
                    advanceChar(parser);
                    return token;
                case 208897:
                    return scanIdentifier(parser, context, 0);
                case 4096:
                    return scanIdentifier(parser, context, 1);
                case 134283266:
                    return scanNumber(parser, context, 16 | 128);
                case 134283267:
                    return scanString(parser, context, char);
                case 132:
                    return scanTemplate(parser, context);
                case 137:
                    return scanUnicodeIdentifier(parser, context);
                case 131:
                    return scanPrivateIdentifier(parser);
                case 128:
                    advanceChar(parser);
                    break;
                case 130:
                    state |= 1 | 4;
                    scanNewLine(parser);
                    break;
                case 136:
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                    break;
                case 8456258:
                    let ch = advanceChar(parser);
                    if (parser.index < parser.end) {
                        if (ch === 60) {
                            if (parser.index < parser.end && advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194334;
                            }
                            return 8456516;
                        }
                        else if (ch === 61) {
                            advanceChar(parser);
                            return 8456256;
                        }
                        if (ch === 33) {
                            const index = parser.index + 1;
                            if (index + 1 < parser.end &&
                                source.charCodeAt(index) === 45 &&
                                source.charCodeAt(index + 1) == 45) {
                                parser.column += 3;
                                parser.currentChar = source.charCodeAt((parser.index += 3));
                                state = skipSingleHTMLComment(parser, source, state, context, 2, parser.tokenPos, parser.linePos, parser.colPos);
                                startPos = parser.tokenPos;
                                startLine = parser.linePos;
                                startColumn = parser.colPos;
                                continue;
                            }
                            return 8456258;
                        }
                        if (ch === 47) {
                            if ((context & 16) === 0)
                                return 8456258;
                            const index = parser.index + 1;
                            if (index < parser.end) {
                                ch = source.charCodeAt(index);
                                if (ch === 42 || ch === 47)
                                    break;
                            }
                            advanceChar(parser);
                            return 25;
                        }
                    }
                    return 8456258;
                case 1077936157: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        if (advanceChar(parser) === 61) {
                            advanceChar(parser);
                            return 8455996;
                        }
                        return 8455998;
                    }
                    if (ch === 62) {
                        advanceChar(parser);
                        return 10;
                    }
                    return 1077936157;
                }
                case 16842800:
                    if (advanceChar(parser) !== 61) {
                        return 16842800;
                    }
                    if (advanceChar(parser) !== 61) {
                        return 8455999;
                    }
                    advanceChar(parser);
                    return 8455997;
                case 8457015:
                    if (advanceChar(parser) !== 61)
                        return 8457015;
                    advanceChar(parser);
                    return 4194342;
                case 8457014: {
                    advanceChar(parser);
                    if (parser.index >= parser.end)
                        return 8457014;
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194340;
                    }
                    if (ch !== 42)
                        return 8457014;
                    if (advanceChar(parser) !== 61)
                        return 8457273;
                    advanceChar(parser);
                    return 4194337;
                }
                case 8455497:
                    if (advanceChar(parser) !== 61)
                        return 8455497;
                    advanceChar(parser);
                    return 4194343;
                case 25233970: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 43) {
                        advanceChar(parser);
                        return 33619995;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194338;
                    }
                    return 25233970;
                }
                case 25233971: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 45) {
                        advanceChar(parser);
                        if ((state & 1 || isStartOfLine) && parser.currentChar === 62) {
                            if ((context & 256) === 0)
                                report(parser, 109);
                            advanceChar(parser);
                            state = skipSingleHTMLComment(parser, source, state, context, 3, startPos, startLine, startColumn);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        return 33619996;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194339;
                    }
                    return 25233971;
                }
                case 8457016: {
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 47) {
                            advanceChar(parser);
                            state = skipSingleLineComment(parser, source, state, 0, parser.tokenPos, parser.linePos, parser.colPos);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (ch === 42) {
                            advanceChar(parser);
                            state = skipMultiLineComment(parser, source, state);
                            startPos = parser.tokenPos;
                            startLine = parser.linePos;
                            startColumn = parser.colPos;
                            continue;
                        }
                        if (context & 32768) {
                            return scanRegularExpression(parser, context);
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4259877;
                        }
                    }
                    return 8457016;
                }
                case 67108877:
                    const next = advanceChar(parser);
                    if (next >= 48 && next <= 57)
                        return scanNumber(parser, context, 64 | 16);
                    if (next === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end && source.charCodeAt(index) === 46) {
                            parser.column += 2;
                            parser.currentChar = source.charCodeAt((parser.index += 2));
                            return 14;
                        }
                    }
                    return 67108877;
                case 8455240: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 124) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194346;
                        }
                        return 8979003;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194344;
                    }
                    return 8455240;
                }
                case 8456259: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 61) {
                        advanceChar(parser);
                        return 8456257;
                    }
                    if (ch !== 62)
                        return 8456259;
                    advanceChar(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.currentChar;
                        if (ch === 62) {
                            if (advanceChar(parser) === 61) {
                                advanceChar(parser);
                                return 4194336;
                            }
                            return 8456518;
                        }
                        if (ch === 61) {
                            advanceChar(parser);
                            return 4194335;
                        }
                    }
                    return 8456517;
                }
                case 8455751: {
                    advanceChar(parser);
                    const ch = parser.currentChar;
                    if (ch === 38) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194347;
                        }
                        return 8979258;
                    }
                    if (ch === 61) {
                        advanceChar(parser);
                        return 4194345;
                    }
                    return 8455751;
                }
                case 22: {
                    let ch = advanceChar(parser);
                    if (ch === 63) {
                        advanceChar(parser);
                        if (parser.currentChar === 61) {
                            advanceChar(parser);
                            return 4194348;
                        }
                        return 276889982;
                    }
                    if (ch === 46) {
                        const index = parser.index + 1;
                        if (index < parser.end) {
                            ch = source.charCodeAt(index);
                            if (!(ch >= 48 && ch <= 57)) {
                                advanceChar(parser);
                                return 67108991;
                            }
                        }
                    }
                    return 22;
                }
            }
        }
        else {
            if ((char ^ 8232) <= 1) {
                state = (state & ~4) | 1;
                scanNewLine(parser);
                continue;
            }
            if ((char & 0xfc00) === 0xd800 || ((unicodeLookup[(char >>> 5) + 34816] >>> char) & 31 & 1) !== 0) {
                if ((char & 0xfc00) === 0xdc00) {
                    char = ((char & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
                    if (((unicodeLookup[(char >>> 5) + 0] >>> char) & 31 & 1) === 0) {
                        report(parser, 18, fromCodePoint(char));
                    }
                    parser.index++;
                    parser.currentChar = char;
                }
                parser.column++;
                parser.tokenValue = '';
                return scanIdentifierSlowCase(parser, context, 0, 0);
            }
            if (isExoticECMAScriptWhitespace(char)) {
                advanceChar(parser);
                continue;
            }
            report(parser, 18, fromCodePoint(char));
        }
    }
    return 1048576;
}

const entities = {
    AElig: '\u00C6',
    AMP: '\u0026',
    Aacute: '\u00C1',
    Abreve: '\u0102',
    Acirc: '\u00C2',
    Acy: '\u0410',
    Afr: '\uD835\uDD04',
    Agrave: '\u00C0',
    Alpha: '\u0391',
    Amacr: '\u0100',
    And: '\u2A53',
    Aogon: '\u0104',
    Aopf: '\uD835\uDD38',
    ApplyFunction: '\u2061',
    Aring: '\u00C5',
    Ascr: '\uD835\uDC9C',
    Assign: '\u2254',
    Atilde: '\u00C3',
    Auml: '\u00C4',
    Backslash: '\u2216',
    Barv: '\u2AE7',
    Barwed: '\u2306',
    Bcy: '\u0411',
    Because: '\u2235',
    Bernoullis: '\u212C',
    Beta: '\u0392',
    Bfr: '\uD835\uDD05',
    Bopf: '\uD835\uDD39',
    Breve: '\u02D8',
    Bscr: '\u212C',
    Bumpeq: '\u224E',
    CHcy: '\u0427',
    COPY: '\u00A9',
    Cacute: '\u0106',
    Cap: '\u22D2',
    CapitalDifferentialD: '\u2145',
    Cayleys: '\u212D',
    Ccaron: '\u010C',
    Ccedil: '\u00C7',
    Ccirc: '\u0108',
    Cconint: '\u2230',
    Cdot: '\u010A',
    Cedilla: '\u00B8',
    CenterDot: '\u00B7',
    Cfr: '\u212D',
    Chi: '\u03A7',
    CircleDot: '\u2299',
    CircleMinus: '\u2296',
    CirclePlus: '\u2295',
    CircleTimes: '\u2297',
    ClockwiseContourIntegral: '\u2232',
    CloseCurlyDoubleQuote: '\u201D',
    CloseCurlyQuote: '\u2019',
    Colon: '\u2237',
    Colone: '\u2A74',
    Congruent: '\u2261',
    Conint: '\u222F',
    ContourIntegral: '\u222E',
    Copf: '\u2102',
    Coproduct: '\u2210',
    CounterClockwiseContourIntegral: '\u2233',
    Cross: '\u2A2F',
    Cscr: '\uD835\uDC9E',
    Cup: '\u22D3',
    CupCap: '\u224D',
    DD: '\u2145',
    DDotrahd: '\u2911',
    DJcy: '\u0402',
    DScy: '\u0405',
    DZcy: '\u040F',
    Dagger: '\u2021',
    Darr: '\u21A1',
    Dashv: '\u2AE4',
    Dcaron: '\u010E',
    Dcy: '\u0414',
    Del: '\u2207',
    Delta: '\u0394',
    Dfr: '\uD835\uDD07',
    DiacriticalAcute: '\u00B4',
    DiacriticalDot: '\u02D9',
    DiacriticalDoubleAcute: '\u02DD',
    DiacriticalGrave: '\u0060',
    DiacriticalTilde: '\u02DC',
    Diamond: '\u22C4',
    DifferentialD: '\u2146',
    Dopf: '\uD835\uDD3B',
    Dot: '\u00A8',
    DotDot: '\u20DC',
    DotEqual: '\u2250',
    DoubleContourIntegral: '\u222F',
    DoubleDot: '\u00A8',
    DoubleDownArrow: '\u21D3',
    DoubleLeftArrow: '\u21D0',
    DoubleLeftRightArrow: '\u21D4',
    DoubleLeftTee: '\u2AE4',
    DoubleLongLeftArrow: '\u27F8',
    DoubleLongLeftRightArrow: '\u27FA',
    DoubleLongRightArrow: '\u27F9',
    DoubleRightArrow: '\u21D2',
    DoubleRightTee: '\u22A8',
    DoubleUpArrow: '\u21D1',
    DoubleUpDownArrow: '\u21D5',
    DoubleVerticalBar: '\u2225',
    DownArrow: '\u2193',
    DownArrowBar: '\u2913',
    DownArrowUpArrow: '\u21F5',
    DownBreve: '\u0311',
    DownLeftRightVector: '\u2950',
    DownLeftTeeVector: '\u295E',
    DownLeftVector: '\u21BD',
    DownLeftVectorBar: '\u2956',
    DownRightTeeVector: '\u295F',
    DownRightVector: '\u21C1',
    DownRightVectorBar: '\u2957',
    DownTee: '\u22A4',
    DownTeeArrow: '\u21A7',
    Downarrow: '\u21D3',
    Dscr: '\uD835\uDC9F',
    Dstrok: '\u0110',
    ENG: '\u014A',
    ETH: '\u00D0',
    Eacute: '\u00C9',
    Ecaron: '\u011A',
    Ecirc: '\u00CA',
    Ecy: '\u042D',
    Edot: '\u0116',
    Efr: '\uD835\uDD08',
    Egrave: '\u00C8',
    Element: '\u2208',
    Emacr: '\u0112',
    EmptySmallSquare: '\u25FB',
    EmptyVerySmallSquare: '\u25AB',
    Eogon: '\u0118',
    Eopf: '\uD835\uDD3C',
    Epsilon: '\u0395',
    Equal: '\u2A75',
    EqualTilde: '\u2242',
    Equilibrium: '\u21CC',
    Escr: '\u2130',
    Esim: '\u2A73',
    Eta: '\u0397',
    Euml: '\u00CB',
    Exists: '\u2203',
    ExponentialE: '\u2147',
    Fcy: '\u0424',
    Ffr: '\uD835\uDD09',
    FilledSmallSquare: '\u25FC',
    FilledVerySmallSquare: '\u25AA',
    Fopf: '\uD835\uDD3D',
    ForAll: '\u2200',
    Fouriertrf: '\u2131',
    Fscr: '\u2131',
    GJcy: '\u0403',
    GT: '\u003E',
    Gamma: '\u0393',
    Gammad: '\u03DC',
    Gbreve: '\u011E',
    Gcedil: '\u0122',
    Gcirc: '\u011C',
    Gcy: '\u0413',
    Gdot: '\u0120',
    Gfr: '\uD835\uDD0A',
    Gg: '\u22D9',
    Gopf: '\uD835\uDD3E',
    GreaterEqual: '\u2265',
    GreaterEqualLess: '\u22DB',
    GreaterFullEqual: '\u2267',
    GreaterGreater: '\u2AA2',
    GreaterLess: '\u2277',
    GreaterSlantEqual: '\u2A7E',
    GreaterTilde: '\u2273',
    Gscr: '\uD835\uDCA2',
    Gt: '\u226B',
    HARDcy: '\u042A',
    Hacek: '\u02C7',
    Hat: '\u005E',
    Hcirc: '\u0124',
    Hfr: '\u210C',
    HilbertSpace: '\u210B',
    Hopf: '\u210D',
    HorizontalLine: '\u2500',
    Hscr: '\u210B',
    Hstrok: '\u0126',
    HumpDownHump: '\u224E',
    HumpEqual: '\u224F',
    IEcy: '\u0415',
    IJlig: '\u0132',
    IOcy: '\u0401',
    Iacute: '\u00CD',
    Icirc: '\u00CE',
    Icy: '\u0418',
    Idot: '\u0130',
    Ifr: '\u2111',
    Igrave: '\u00CC',
    Im: '\u2111',
    Imacr: '\u012A',
    ImaginaryI: '\u2148',
    Implies: '\u21D2',
    Int: '\u222C',
    Integral: '\u222B',
    Intersection: '\u22C2',
    InvisibleComma: '\u2063',
    InvisibleTimes: '\u2062',
    Iogon: '\u012E',
    Iopf: '\uD835\uDD40',
    Iota: '\u0399',
    Iscr: '\u2110',
    Itilde: '\u0128',
    Iukcy: '\u0406',
    Iuml: '\u00CF',
    Jcirc: '\u0134',
    Jcy: '\u0419',
    Jfr: '\uD835\uDD0D',
    Jopf: '\uD835\uDD41',
    Jscr: '\uD835\uDCA5',
    Jsercy: '\u0408',
    Jukcy: '\u0404',
    KHcy: '\u0425',
    KJcy: '\u040C',
    Kappa: '\u039A',
    Kcedil: '\u0136',
    Kcy: '\u041A',
    Kfr: '\uD835\uDD0E',
    Kopf: '\uD835\uDD42',
    Kscr: '\uD835\uDCA6',
    LJcy: '\u0409',
    LT: '\u003C',
    Lacute: '\u0139',
    Lambda: '\u039B',
    Lang: '\u27EA',
    Laplacetrf: '\u2112',
    Larr: '\u219E',
    Lcaron: '\u013D',
    Lcedil: '\u013B',
    Lcy: '\u041B',
    LeftAngleBracket: '\u27E8',
    LeftArrow: '\u2190',
    LeftArrowBar: '\u21E4',
    LeftArrowRightArrow: '\u21C6',
    LeftCeiling: '\u2308',
    LeftDoubleBracket: '\u27E6',
    LeftDownTeeVector: '\u2961',
    LeftDownVector: '\u21C3',
    LeftDownVectorBar: '\u2959',
    LeftFloor: '\u230A',
    LeftRightArrow: '\u2194',
    LeftRightVector: '\u294E',
    LeftTee: '\u22A3',
    LeftTeeArrow: '\u21A4',
    LeftTeeVector: '\u295A',
    LeftTriangle: '\u22B2',
    LeftTriangleBar: '\u29CF',
    LeftTriangleEqual: '\u22B4',
    LeftUpDownVector: '\u2951',
    LeftUpTeeVector: '\u2960',
    LeftUpVector: '\u21BF',
    LeftUpVectorBar: '\u2958',
    LeftVector: '\u21BC',
    LeftVectorBar: '\u2952',
    Leftarrow: '\u21D0',
    Leftrightarrow: '\u21D4',
    LessEqualGreater: '\u22DA',
    LessFullEqual: '\u2266',
    LessGreater: '\u2276',
    LessLess: '\u2AA1',
    LessSlantEqual: '\u2A7D',
    LessTilde: '\u2272',
    Lfr: '\uD835\uDD0F',
    Ll: '\u22D8',
    Lleftarrow: '\u21DA',
    Lmidot: '\u013F',
    LongLeftArrow: '\u27F5',
    LongLeftRightArrow: '\u27F7',
    LongRightArrow: '\u27F6',
    Longleftarrow: '\u27F8',
    Longleftrightarrow: '\u27FA',
    Longrightarrow: '\u27F9',
    Lopf: '\uD835\uDD43',
    LowerLeftArrow: '\u2199',
    LowerRightArrow: '\u2198',
    Lscr: '\u2112',
    Lsh: '\u21B0',
    Lstrok: '\u0141',
    Lt: '\u226A',
    Map: '\u2905',
    Mcy: '\u041C',
    MediumSpace: '\u205F',
    Mellintrf: '\u2133',
    Mfr: '\uD835\uDD10',
    MinusPlus: '\u2213',
    Mopf: '\uD835\uDD44',
    Mscr: '\u2133',
    Mu: '\u039C',
    NJcy: '\u040A',
    Nacute: '\u0143',
    Ncaron: '\u0147',
    Ncedil: '\u0145',
    Ncy: '\u041D',
    NegativeMediumSpace: '\u200B',
    NegativeThickSpace: '\u200B',
    NegativeThinSpace: '\u200B',
    NegativeVeryThinSpace: '\u200B',
    NestedGreaterGreater: '\u226B',
    NestedLessLess: '\u226A',
    NewLine: '\u000A',
    Nfr: '\uD835\uDD11',
    NoBreak: '\u2060',
    NonBreakingSpace: '\u00A0',
    Nopf: '\u2115',
    Not: '\u2AEC',
    NotCongruent: '\u2262',
    NotCupCap: '\u226D',
    NotDoubleVerticalBar: '\u2226',
    NotElement: '\u2209',
    NotEqual: '\u2260',
    NotEqualTilde: '\u2242\u0338',
    NotExists: '\u2204',
    NotGreater: '\u226F',
    NotGreaterEqual: '\u2271',
    NotGreaterFullEqual: '\u2267\u0338',
    NotGreaterGreater: '\u226B\u0338',
    NotGreaterLess: '\u2279',
    NotGreaterSlantEqual: '\u2A7E\u0338',
    NotGreaterTilde: '\u2275',
    NotHumpDownHump: '\u224E\u0338',
    NotHumpEqual: '\u224F\u0338',
    NotLeftTriangle: '\u22EA',
    NotLeftTriangleBar: '\u29CF\u0338',
    NotLeftTriangleEqual: '\u22EC',
    NotLess: '\u226E',
    NotLessEqual: '\u2270',
    NotLessGreater: '\u2278',
    NotLessLess: '\u226A\u0338',
    NotLessSlantEqual: '\u2A7D\u0338',
    NotLessTilde: '\u2274',
    NotNestedGreaterGreater: '\u2AA2\u0338',
    NotNestedLessLess: '\u2AA1\u0338',
    NotPrecedes: '\u2280',
    NotPrecedesEqual: '\u2AAF\u0338',
    NotPrecedesSlantEqual: '\u22E0',
    NotReverseElement: '\u220C',
    NotRightTriangle: '\u22EB',
    NotRightTriangleBar: '\u29D0\u0338',
    NotRightTriangleEqual: '\u22ED',
    NotSquareSubset: '\u228F\u0338',
    NotSquareSubsetEqual: '\u22E2',
    NotSquareSuperset: '\u2290\u0338',
    NotSquareSupersetEqual: '\u22E3',
    NotSubset: '\u2282\u20D2',
    NotSubsetEqual: '\u2288',
    NotSucceeds: '\u2281',
    NotSucceedsEqual: '\u2AB0\u0338',
    NotSucceedsSlantEqual: '\u22E1',
    NotSucceedsTilde: '\u227F\u0338',
    NotSuperset: '\u2283\u20D2',
    NotSupersetEqual: '\u2289',
    NotTilde: '\u2241',
    NotTildeEqual: '\u2244',
    NotTildeFullEqual: '\u2247',
    NotTildeTilde: '\u2249',
    NotVerticalBar: '\u2224',
    Nscr: '\uD835\uDCA9',
    Ntilde: '\u00D1',
    Nu: '\u039D',
    OElig: '\u0152',
    Oacute: '\u00D3',
    Ocirc: '\u00D4',
    Ocy: '\u041E',
    Odblac: '\u0150',
    Ofr: '\uD835\uDD12',
    Ograve: '\u00D2',
    Omacr: '\u014C',
    Omega: '\u03A9',
    Omicron: '\u039F',
    Oopf: '\uD835\uDD46',
    OpenCurlyDoubleQuote: '\u201C',
    OpenCurlyQuote: '\u2018',
    Or: '\u2A54',
    Oscr: '\uD835\uDCAA',
    Oslash: '\u00D8',
    Otilde: '\u00D5',
    Otimes: '\u2A37',
    Ouml: '\u00D6',
    OverBar: '\u203E',
    OverBrace: '\u23DE',
    OverBracket: '\u23B4',
    OverParenthesis: '\u23DC',
    PartialD: '\u2202',
    Pcy: '\u041F',
    Pfr: '\uD835\uDD13',
    Phi: '\u03A6',
    Pi: '\u03A0',
    PlusMinus: '\u00B1',
    Poincareplane: '\u210C',
    Popf: '\u2119',
    Pr: '\u2ABB',
    Precedes: '\u227A',
    PrecedesEqual: '\u2AAF',
    PrecedesSlantEqual: '\u227C',
    PrecedesTilde: '\u227E',
    Prime: '\u2033',
    Product: '\u220F',
    Proportion: '\u2237',
    Proportional: '\u221D',
    Pscr: '\uD835\uDCAB',
    Psi: '\u03A8',
    QUOT: '\u0022',
    Qfr: '\uD835\uDD14',
    Qopf: '\u211A',
    Qscr: '\uD835\uDCAC',
    RBarr: '\u2910',
    REG: '\u00AE',
    Racute: '\u0154',
    Rang: '\u27EB',
    Rarr: '\u21A0',
    Rarrtl: '\u2916',
    Rcaron: '\u0158',
    Rcedil: '\u0156',
    Rcy: '\u0420',
    Re: '\u211C',
    ReverseElement: '\u220B',
    ReverseEquilibrium: '\u21CB',
    ReverseUpEquilibrium: '\u296F',
    Rfr: '\u211C',
    Rho: '\u03A1',
    RightAngleBracket: '\u27E9',
    RightArrow: '\u2192',
    RightArrowBar: '\u21E5',
    RightArrowLeftArrow: '\u21C4',
    RightCeiling: '\u2309',
    RightDoubleBracket: '\u27E7',
    RightDownTeeVector: '\u295D',
    RightDownVector: '\u21C2',
    RightDownVectorBar: '\u2955',
    RightFloor: '\u230B',
    RightTee: '\u22A2',
    RightTeeArrow: '\u21A6',
    RightTeeVector: '\u295B',
    RightTriangle: '\u22B3',
    RightTriangleBar: '\u29D0',
    RightTriangleEqual: '\u22B5',
    RightUpDownVector: '\u294F',
    RightUpTeeVector: '\u295C',
    RightUpVector: '\u21BE',
    RightUpVectorBar: '\u2954',
    RightVector: '\u21C0',
    RightVectorBar: '\u2953',
    Rightarrow: '\u21D2',
    Ropf: '\u211D',
    RoundImplies: '\u2970',
    Rrightarrow: '\u21DB',
    Rscr: '\u211B',
    Rsh: '\u21B1',
    RuleDelayed: '\u29F4',
    SHCHcy: '\u0429',
    SHcy: '\u0428',
    SOFTcy: '\u042C',
    Sacute: '\u015A',
    Sc: '\u2ABC',
    Scaron: '\u0160',
    Scedil: '\u015E',
    Scirc: '\u015C',
    Scy: '\u0421',
    Sfr: '\uD835\uDD16',
    ShortDownArrow: '\u2193',
    ShortLeftArrow: '\u2190',
    ShortRightArrow: '\u2192',
    ShortUpArrow: '\u2191',
    Sigma: '\u03A3',
    SmallCircle: '\u2218',
    Sopf: '\uD835\uDD4A',
    Sqrt: '\u221A',
    Square: '\u25A1',
    SquareIntersection: '\u2293',
    SquareSubset: '\u228F',
    SquareSubsetEqual: '\u2291',
    SquareSuperset: '\u2290',
    SquareSupersetEqual: '\u2292',
    SquareUnion: '\u2294',
    Sscr: '\uD835\uDCAE',
    Star: '\u22C6',
    Sub: '\u22D0',
    Subset: '\u22D0',
    SubsetEqual: '\u2286',
    Succeeds: '\u227B',
    SucceedsEqual: '\u2AB0',
    SucceedsSlantEqual: '\u227D',
    SucceedsTilde: '\u227F',
    SuchThat: '\u220B',
    Sum: '\u2211',
    Sup: '\u22D1',
    Superset: '\u2283',
    SupersetEqual: '\u2287',
    Supset: '\u22D1',
    THORN: '\u00DE',
    TRADE: '\u2122',
    TSHcy: '\u040B',
    TScy: '\u0426',
    Tab: '\u0009',
    Tau: '\u03A4',
    Tcaron: '\u0164',
    Tcedil: '\u0162',
    Tcy: '\u0422',
    Tfr: '\uD835\uDD17',
    Therefore: '\u2234',
    Theta: '\u0398',
    ThickSpace: '\u205F\u200A',
    ThinSpace: '\u2009',
    Tilde: '\u223C',
    TildeEqual: '\u2243',
    TildeFullEqual: '\u2245',
    TildeTilde: '\u2248',
    Topf: '\uD835\uDD4B',
    TripleDot: '\u20DB',
    Tscr: '\uD835\uDCAF',
    Tstrok: '\u0166',
    Uacute: '\u00DA',
    Uarr: '\u219F',
    Uarrocir: '\u2949',
    Ubrcy: '\u040E',
    Ubreve: '\u016C',
    Ucirc: '\u00DB',
    Ucy: '\u0423',
    Udblac: '\u0170',
    Ufr: '\uD835\uDD18',
    Ugrave: '\u00D9',
    Umacr: '\u016A',
    UnderBar: '\u005F',
    UnderBrace: '\u23DF',
    UnderBracket: '\u23B5',
    UnderParenthesis: '\u23DD',
    Union: '\u22C3',
    UnionPlus: '\u228E',
    Uogon: '\u0172',
    Uopf: '\uD835\uDD4C',
    UpArrow: '\u2191',
    UpArrowBar: '\u2912',
    UpArrowDownArrow: '\u21C5',
    UpDownArrow: '\u2195',
    UpEquilibrium: '\u296E',
    UpTee: '\u22A5',
    UpTeeArrow: '\u21A5',
    Uparrow: '\u21D1',
    Updownarrow: '\u21D5',
    UpperLeftArrow: '\u2196',
    UpperRightArrow: '\u2197',
    Upsi: '\u03D2',
    Upsilon: '\u03A5',
    Uring: '\u016E',
    Uscr: '\uD835\uDCB0',
    Utilde: '\u0168',
    Uuml: '\u00DC',
    VDash: '\u22AB',
    Vbar: '\u2AEB',
    Vcy: '\u0412',
    Vdash: '\u22A9',
    Vdashl: '\u2AE6',
    Vee: '\u22C1',
    Verbar: '\u2016',
    Vert: '\u2016',
    VerticalBar: '\u2223',
    VerticalLine: '\u007C',
    VerticalSeparator: '\u2758',
    VerticalTilde: '\u2240',
    VeryThinSpace: '\u200A',
    Vfr: '\uD835\uDD19',
    Vopf: '\uD835\uDD4D',
    Vscr: '\uD835\uDCB1',
    Vvdash: '\u22AA',
    Wcirc: '\u0174',
    Wedge: '\u22C0',
    Wfr: '\uD835\uDD1A',
    Wopf: '\uD835\uDD4E',
    Wscr: '\uD835\uDCB2',
    Xfr: '\uD835\uDD1B',
    Xi: '\u039E',
    Xopf: '\uD835\uDD4F',
    Xscr: '\uD835\uDCB3',
    YAcy: '\u042F',
    YIcy: '\u0407',
    YUcy: '\u042E',
    Yacute: '\u00DD',
    Ycirc: '\u0176',
    Ycy: '\u042B',
    Yfr: '\uD835\uDD1C',
    Yopf: '\uD835\uDD50',
    Yscr: '\uD835\uDCB4',
    Yuml: '\u0178',
    ZHcy: '\u0416',
    Zacute: '\u0179',
    Zcaron: '\u017D',
    Zcy: '\u0417',
    Zdot: '\u017B',
    ZeroWidthSpace: '\u200B',
    Zeta: '\u0396',
    Zfr: '\u2128',
    Zopf: '\u2124',
    Zscr: '\uD835\uDCB5',
    aacute: '\u00E1',
    abreve: '\u0103',
    ac: '\u223E',
    acE: '\u223E\u0333',
    acd: '\u223F',
    acirc: '\u00E2',
    acute: '\u00B4',
    acy: '\u0430',
    aelig: '\u00E6',
    af: '\u2061',
    afr: '\uD835\uDD1E',
    agrave: '\u00E0',
    alefsym: '\u2135',
    aleph: '\u2135',
    alpha: '\u03B1',
    amacr: '\u0101',
    amalg: '\u2A3F',
    amp: '\u0026',
    and: '\u2227',
    andand: '\u2A55',
    andd: '\u2A5C',
    andslope: '\u2A58',
    andv: '\u2A5A',
    ang: '\u2220',
    ange: '\u29A4',
    angle: '\u2220',
    angmsd: '\u2221',
    angmsdaa: '\u29A8',
    angmsdab: '\u29A9',
    angmsdac: '\u29AA',
    angmsdad: '\u29AB',
    angmsdae: '\u29AC',
    angmsdaf: '\u29AD',
    angmsdag: '\u29AE',
    angmsdah: '\u29AF',
    angrt: '\u221F',
    angrtvb: '\u22BE',
    angrtvbd: '\u299D',
    angsph: '\u2222',
    angst: '\u00C5',
    angzarr: '\u237C',
    aogon: '\u0105',
    aopf: '\uD835\uDD52',
    ap: '\u2248',
    apE: '\u2A70',
    apacir: '\u2A6F',
    ape: '\u224A',
    apid: '\u224B',
    apos: '\u0027',
    approx: '\u2248',
    approxeq: '\u224A',
    aring: '\u00E5',
    ascr: '\uD835\uDCB6',
    ast: '\u002A',
    asymp: '\u2248',
    asympeq: '\u224D',
    atilde: '\u00E3',
    auml: '\u00E4',
    awconint: '\u2233',
    awint: '\u2A11',
    bNot: '\u2AED',
    backcong: '\u224C',
    backepsilon: '\u03F6',
    backprime: '\u2035',
    backsim: '\u223D',
    backsimeq: '\u22CD',
    barvee: '\u22BD',
    barwed: '\u2305',
    barwedge: '\u2305',
    bbrk: '\u23B5',
    bbrktbrk: '\u23B6',
    bcong: '\u224C',
    bcy: '\u0431',
    bdquo: '\u201E',
    becaus: '\u2235',
    because: '\u2235',
    bemptyv: '\u29B0',
    bepsi: '\u03F6',
    bernou: '\u212C',
    beta: '\u03B2',
    beth: '\u2136',
    between: '\u226C',
    bfr: '\uD835\uDD1F',
    bigcap: '\u22C2',
    bigcirc: '\u25EF',
    bigcup: '\u22C3',
    bigodot: '\u2A00',
    bigoplus: '\u2A01',
    bigotimes: '\u2A02',
    bigsqcup: '\u2A06',
    bigstar: '\u2605',
    bigtriangledown: '\u25BD',
    bigtriangleup: '\u25B3',
    biguplus: '\u2A04',
    bigvee: '\u22C1',
    bigwedge: '\u22C0',
    bkarow: '\u290D',
    blacklozenge: '\u29EB',
    blacksquare: '\u25AA',
    blacktriangle: '\u25B4',
    blacktriangledown: '\u25BE',
    blacktriangleleft: '\u25C2',
    blacktriangleright: '\u25B8',
    blank: '\u2423',
    blk12: '\u2592',
    blk14: '\u2591',
    blk34: '\u2593',
    block: '\u2588',
    bne: '\u003D\u20E5',
    bnequiv: '\u2261\u20E5',
    bnot: '\u2310',
    bopf: '\uD835\uDD53',
    bot: '\u22A5',
    bottom: '\u22A5',
    bowtie: '\u22C8',
    boxDL: '\u2557',
    boxDR: '\u2554',
    boxDl: '\u2556',
    boxDr: '\u2553',
    boxH: '\u2550',
    boxHD: '\u2566',
    boxHU: '\u2569',
    boxHd: '\u2564',
    boxHu: '\u2567',
    boxUL: '\u255D',
    boxUR: '\u255A',
    boxUl: '\u255C',
    boxUr: '\u2559',
    boxV: '\u2551',
    boxVH: '\u256C',
    boxVL: '\u2563',
    boxVR: '\u2560',
    boxVh: '\u256B',
    boxVl: '\u2562',
    boxVr: '\u255F',
    boxbox: '\u29C9',
    boxdL: '\u2555',
    boxdR: '\u2552',
    boxdl: '\u2510',
    boxdr: '\u250C',
    boxh: '\u2500',
    boxhD: '\u2565',
    boxhU: '\u2568',
    boxhd: '\u252C',
    boxhu: '\u2534',
    boxminus: '\u229F',
    boxplus: '\u229E',
    boxtimes: '\u22A0',
    boxuL: '\u255B',
    boxuR: '\u2558',
    boxul: '\u2518',
    boxur: '\u2514',
    boxv: '\u2502',
    boxvH: '\u256A',
    boxvL: '\u2561',
    boxvR: '\u255E',
    boxvh: '\u253C',
    boxvl: '\u2524',
    boxvr: '\u251C',
    bprime: '\u2035',
    breve: '\u02D8',
    brvbar: '\u00A6',
    bscr: '\uD835\uDCB7',
    bsemi: '\u204F',
    bsim: '\u223D',
    bsime: '\u22CD',
    bsol: '\u005C',
    bsolb: '\u29C5',
    bsolhsub: '\u27C8',
    bull: '\u2022',
    bullet: '\u2022',
    bump: '\u224E',
    bumpE: '\u2AAE',
    bumpe: '\u224F',
    bumpeq: '\u224F',
    cacute: '\u0107',
    cap: '\u2229',
    capand: '\u2A44',
    capbrcup: '\u2A49',
    capcap: '\u2A4B',
    capcup: '\u2A47',
    capdot: '\u2A40',
    caps: '\u2229\uFE00',
    caret: '\u2041',
    caron: '\u02C7',
    ccaps: '\u2A4D',
    ccaron: '\u010D',
    ccedil: '\u00E7',
    ccirc: '\u0109',
    ccups: '\u2A4C',
    ccupssm: '\u2A50',
    cdot: '\u010B',
    cedil: '\u00B8',
    cemptyv: '\u29B2',
    cent: '\u00A2',
    centerdot: '\u00B7',
    cfr: '\uD835\uDD20',
    chcy: '\u0447',
    check: '\u2713',
    checkmark: '\u2713',
    chi: '\u03C7',
    cir: '\u25CB',
    cirE: '\u29C3',
    circ: '\u02C6',
    circeq: '\u2257',
    circlearrowleft: '\u21BA',
    circlearrowright: '\u21BB',
    circledR: '\u00AE',
    circledS: '\u24C8',
    circledast: '\u229B',
    circledcirc: '\u229A',
    circleddash: '\u229D',
    cire: '\u2257',
    cirfnint: '\u2A10',
    cirmid: '\u2AEF',
    cirscir: '\u29C2',
    clubs: '\u2663',
    clubsuit: '\u2663',
    colon: '\u003A',
    colone: '\u2254',
    coloneq: '\u2254',
    comma: '\u002C',
    commat: '\u0040',
    comp: '\u2201',
    compfn: '\u2218',
    complement: '\u2201',
    complexes: '\u2102',
    cong: '\u2245',
    congdot: '\u2A6D',
    conint: '\u222E',
    copf: '\uD835\uDD54',
    coprod: '\u2210',
    copy: '\u00A9',
    copysr: '\u2117',
    crarr: '\u21B5',
    cross: '\u2717',
    cscr: '\uD835\uDCB8',
    csub: '\u2ACF',
    csube: '\u2AD1',
    csup: '\u2AD0',
    csupe: '\u2AD2',
    ctdot: '\u22EF',
    cudarrl: '\u2938',
    cudarrr: '\u2935',
    cuepr: '\u22DE',
    cuesc: '\u22DF',
    cularr: '\u21B6',
    cularrp: '\u293D',
    cup: '\u222A',
    cupbrcap: '\u2A48',
    cupcap: '\u2A46',
    cupcup: '\u2A4A',
    cupdot: '\u228D',
    cupor: '\u2A45',
    cups: '\u222A\uFE00',
    curarr: '\u21B7',
    curarrm: '\u293C',
    curlyeqprec: '\u22DE',
    curlyeqsucc: '\u22DF',
    curlyvee: '\u22CE',
    curlywedge: '\u22CF',
    curren: '\u00A4',
    curvearrowleft: '\u21B6',
    curvearrowright: '\u21B7',
    cuvee: '\u22CE',
    cuwed: '\u22CF',
    cwconint: '\u2232',
    cwint: '\u2231',
    cylcty: '\u232D',
    dArr: '\u21D3',
    dHar: '\u2965',
    dagger: '\u2020',
    daleth: '\u2138',
    darr: '\u2193',
    dash: '\u2010',
    dashv: '\u22A3',
    dbkarow: '\u290F',
    dblac: '\u02DD',
    dcaron: '\u010F',
    dcy: '\u0434',
    dd: '\u2146',
    ddagger: '\u2021',
    ddarr: '\u21CA',
    ddotseq: '\u2A77',
    deg: '\u00B0',
    delta: '\u03B4',
    demptyv: '\u29B1',
    dfisht: '\u297F',
    dfr: '\uD835\uDD21',
    dharl: '\u21C3',
    dharr: '\u21C2',
    diam: '\u22C4',
    diamond: '\u22C4',
    diamondsuit: '\u2666',
    diams: '\u2666',
    die: '\u00A8',
    digamma: '\u03DD',
    disin: '\u22F2',
    div: '\u00F7',
    divide: '\u00F7',
    divideontimes: '\u22C7',
    divonx: '\u22C7',
    djcy: '\u0452',
    dlcorn: '\u231E',
    dlcrop: '\u230D',
    dollar: '\u0024',
    dopf: '\uD835\uDD55',
    dot: '\u02D9',
    doteq: '\u2250',
    doteqdot: '\u2251',
    dotminus: '\u2238',
    dotplus: '\u2214',
    dotsquare: '\u22A1',
    doublebarwedge: '\u2306',
    downarrow: '\u2193',
    downdownarrows: '\u21CA',
    downharpoonleft: '\u21C3',
    downharpoonright: '\u21C2',
    drbkarow: '\u2910',
    drcorn: '\u231F',
    drcrop: '\u230C',
    dscr: '\uD835\uDCB9',
    dscy: '\u0455',
    dsol: '\u29F6',
    dstrok: '\u0111',
    dtdot: '\u22F1',
    dtri: '\u25BF',
    dtrif: '\u25BE',
    duarr: '\u21F5',
    duhar: '\u296F',
    dwangle: '\u29A6',
    dzcy: '\u045F',
    dzigrarr: '\u27FF',
    eDDot: '\u2A77',
    eDot: '\u2251',
    eacute: '\u00E9',
    easter: '\u2A6E',
    ecaron: '\u011B',
    ecir: '\u2256',
    ecirc: '\u00EA',
    ecolon: '\u2255',
    ecy: '\u044D',
    edot: '\u0117',
    ee: '\u2147',
    efDot: '\u2252',
    efr: '\uD835\uDD22',
    eg: '\u2A9A',
    egrave: '\u00E8',
    egs: '\u2A96',
    egsdot: '\u2A98',
    el: '\u2A99',
    elinters: '\u23E7',
    ell: '\u2113',
    els: '\u2A95',
    elsdot: '\u2A97',
    emacr: '\u0113',
    empty: '\u2205',
    emptyset: '\u2205',
    emptyv: '\u2205',
    emsp13: '\u2004',
    emsp14: '\u2005',
    emsp: '\u2003',
    eng: '\u014B',
    ensp: '\u2002',
    eogon: '\u0119',
    eopf: '\uD835\uDD56',
    epar: '\u22D5',
    eparsl: '\u29E3',
    eplus: '\u2A71',
    epsi: '\u03B5',
    epsilon: '\u03B5',
    epsiv: '\u03F5',
    eqcirc: '\u2256',
    eqcolon: '\u2255',
    eqsim: '\u2242',
    eqslantgtr: '\u2A96',
    eqslantless: '\u2A95',
    equals: '\u003D',
    equest: '\u225F',
    equiv: '\u2261',
    equivDD: '\u2A78',
    eqvparsl: '\u29E5',
    erDot: '\u2253',
    erarr: '\u2971',
    escr: '\u212F',
    esdot: '\u2250',
    esim: '\u2242',
    eta: '\u03B7',
    eth: '\u00F0',
    euml: '\u00EB',
    euro: '\u20AC',
    excl: '\u0021',
    exist: '\u2203',
    expectation: '\u2130',
    exponentiale: '\u2147',
    fallingdotseq: '\u2252',
    fcy: '\u0444',
    female: '\u2640',
    ffilig: '\uFB03',
    fflig: '\uFB00',
    ffllig: '\uFB04',
    ffr: '\uD835\uDD23',
    filig: '\uFB01',
    fjlig: '\u0066\u006A',
    flat: '\u266D',
    fllig: '\uFB02',
    fltns: '\u25B1',
    fnof: '\u0192',
    fopf: '\uD835\uDD57',
    forall: '\u2200',
    fork: '\u22D4',
    forkv: '\u2AD9',
    fpartint: '\u2A0D',
    frac12: '\u00BD',
    frac13: '\u2153',
    frac14: '\u00BC',
    frac15: '\u2155',
    frac16: '\u2159',
    frac18: '\u215B',
    frac23: '\u2154',
    frac25: '\u2156',
    frac34: '\u00BE',
    frac35: '\u2157',
    frac38: '\u215C',
    frac45: '\u2158',
    frac56: '\u215A',
    frac58: '\u215D',
    frac78: '\u215E',
    frasl: '\u2044',
    frown: '\u2322',
    fscr: '\uD835\uDCBB',
    gE: '\u2267',
    gEl: '\u2A8C',
    gacute: '\u01F5',
    gamma: '\u03B3',
    gammad: '\u03DD',
    gap: '\u2A86',
    gbreve: '\u011F',
    gcirc: '\u011D',
    gcy: '\u0433',
    gdot: '\u0121',
    ge: '\u2265',
    gel: '\u22DB',
    geq: '\u2265',
    geqq: '\u2267',
    geqslant: '\u2A7E',
    ges: '\u2A7E',
    gescc: '\u2AA9',
    gesdot: '\u2A80',
    gesdoto: '\u2A82',
    gesdotol: '\u2A84',
    gesl: '\u22DB\uFE00',
    gesles: '\u2A94',
    gfr: '\uD835\uDD24',
    gg: '\u226B',
    ggg: '\u22D9',
    gimel: '\u2137',
    gjcy: '\u0453',
    gl: '\u2277',
    glE: '\u2A92',
    gla: '\u2AA5',
    glj: '\u2AA4',
    gnE: '\u2269',
    gnap: '\u2A8A',
    gnapprox: '\u2A8A',
    gne: '\u2A88',
    gneq: '\u2A88',
    gneqq: '\u2269',
    gnsim: '\u22E7',
    gopf: '\uD835\uDD58',
    grave: '\u0060',
    gscr: '\u210A',
    gsim: '\u2273',
    gsime: '\u2A8E',
    gsiml: '\u2A90',
    gt: '\u003E',
    gtcc: '\u2AA7',
    gtcir: '\u2A7A',
    gtdot: '\u22D7',
    gtlPar: '\u2995',
    gtquest: '\u2A7C',
    gtrapprox: '\u2A86',
    gtrarr: '\u2978',
    gtrdot: '\u22D7',
    gtreqless: '\u22DB',
    gtreqqless: '\u2A8C',
    gtrless: '\u2277',
    gtrsim: '\u2273',
    gvertneqq: '\u2269\uFE00',
    gvnE: '\u2269\uFE00',
    hArr: '\u21D4',
    hairsp: '\u200A',
    half: '\u00BD',
    hamilt: '\u210B',
    hardcy: '\u044A',
    harr: '\u2194',
    harrcir: '\u2948',
    harrw: '\u21AD',
    hbar: '\u210F',
    hcirc: '\u0125',
    hearts: '\u2665',
    heartsuit: '\u2665',
    hellip: '\u2026',
    hercon: '\u22B9',
    hfr: '\uD835\uDD25',
    hksearow: '\u2925',
    hkswarow: '\u2926',
    hoarr: '\u21FF',
    homtht: '\u223B',
    hookleftarrow: '\u21A9',
    hookrightarrow: '\u21AA',
    hopf: '\uD835\uDD59',
    horbar: '\u2015',
    hscr: '\uD835\uDCBD',
    hslash: '\u210F',
    hstrok: '\u0127',
    hybull: '\u2043',
    hyphen: '\u2010',
    iacute: '\u00ED',
    ic: '\u2063',
    icirc: '\u00EE',
    icy: '\u0438',
    iecy: '\u0435',
    iexcl: '\u00A1',
    iff: '\u21D4',
    ifr: '\uD835\uDD26',
    igrave: '\u00EC',
    ii: '\u2148',
    iiiint: '\u2A0C',
    iiint: '\u222D',
    iinfin: '\u29DC',
    iiota: '\u2129',
    ijlig: '\u0133',
    imacr: '\u012B',
    image: '\u2111',
    imagline: '\u2110',
    imagpart: '\u2111',
    imath: '\u0131',
    imof: '\u22B7',
    imped: '\u01B5',
    in: '\u2208',
    incare: '\u2105',
    infin: '\u221E',
    infintie: '\u29DD',
    inodot: '\u0131',
    int: '\u222B',
    intcal: '\u22BA',
    integers: '\u2124',
    intercal: '\u22BA',
    intlarhk: '\u2A17',
    intprod: '\u2A3C',
    iocy: '\u0451',
    iogon: '\u012F',
    iopf: '\uD835\uDD5A',
    iota: '\u03B9',
    iprod: '\u2A3C',
    iquest: '\u00BF',
    iscr: '\uD835\uDCBE',
    isin: '\u2208',
    isinE: '\u22F9',
    isindot: '\u22F5',
    isins: '\u22F4',
    isinsv: '\u22F3',
    isinv: '\u2208',
    it: '\u2062',
    itilde: '\u0129',
    iukcy: '\u0456',
    iuml: '\u00EF',
    jcirc: '\u0135',
    jcy: '\u0439',
    jfr: '\uD835\uDD27',
    jmath: '\u0237',
    jopf: '\uD835\uDD5B',
    jscr: '\uD835\uDCBF',
    jsercy: '\u0458',
    jukcy: '\u0454',
    kappa: '\u03BA',
    kappav: '\u03F0',
    kcedil: '\u0137',
    kcy: '\u043A',
    kfr: '\uD835\uDD28',
    kgreen: '\u0138',
    khcy: '\u0445',
    kjcy: '\u045C',
    kopf: '\uD835\uDD5C',
    kscr: '\uD835\uDCC0',
    lAarr: '\u21DA',
    lArr: '\u21D0',
    lAtail: '\u291B',
    lBarr: '\u290E',
    lE: '\u2266',
    lEg: '\u2A8B',
    lHar: '\u2962',
    lacute: '\u013A',
    laemptyv: '\u29B4',
    lagran: '\u2112',
    lambda: '\u03BB',
    lang: '\u27E8',
    langd: '\u2991',
    langle: '\u27E8',
    lap: '\u2A85',
    laquo: '\u00AB',
    larr: '\u2190',
    larrb: '\u21E4',
    larrbfs: '\u291F',
    larrfs: '\u291D',
    larrhk: '\u21A9',
    larrlp: '\u21AB',
    larrpl: '\u2939',
    larrsim: '\u2973',
    larrtl: '\u21A2',
    lat: '\u2AAB',
    latail: '\u2919',
    late: '\u2AAD',
    lates: '\u2AAD\uFE00',
    lbarr: '\u290C',
    lbbrk: '\u2772',
    lbrace: '\u007B',
    lbrack: '\u005B',
    lbrke: '\u298B',
    lbrksld: '\u298F',
    lbrkslu: '\u298D',
    lcaron: '\u013E',
    lcedil: '\u013C',
    lceil: '\u2308',
    lcub: '\u007B',
    lcy: '\u043B',
    ldca: '\u2936',
    ldquo: '\u201C',
    ldquor: '\u201E',
    ldrdhar: '\u2967',
    ldrushar: '\u294B',
    ldsh: '\u21B2',
    le: '\u2264',
    leftarrow: '\u2190',
    leftarrowtail: '\u21A2',
    leftharpoondown: '\u21BD',
    leftharpoonup: '\u21BC',
    leftleftarrows: '\u21C7',
    leftrightarrow: '\u2194',
    leftrightarrows: '\u21C6',
    leftrightharpoons: '\u21CB',
    leftrightsquigarrow: '\u21AD',
    leftthreetimes: '\u22CB',
    leg: '\u22DA',
    leq: '\u2264',
    leqq: '\u2266',
    leqslant: '\u2A7D',
    les: '\u2A7D',
    lescc: '\u2AA8',
    lesdot: '\u2A7F',
    lesdoto: '\u2A81',
    lesdotor: '\u2A83',
    lesg: '\u22DA\uFE00',
    lesges: '\u2A93',
    lessapprox: '\u2A85',
    lessdot: '\u22D6',
    lesseqgtr: '\u22DA',
    lesseqqgtr: '\u2A8B',
    lessgtr: '\u2276',
    lesssim: '\u2272',
    lfisht: '\u297C',
    lfloor: '\u230A',
    lfr: '\uD835\uDD29',
    lg: '\u2276',
    lgE: '\u2A91',
    lhard: '\u21BD',
    lharu: '\u21BC',
    lharul: '\u296A',
    lhblk: '\u2584',
    ljcy: '\u0459',
    ll: '\u226A',
    llarr: '\u21C7',
    llcorner: '\u231E',
    llhard: '\u296B',
    lltri: '\u25FA',
    lmidot: '\u0140',
    lmoust: '\u23B0',
    lmoustache: '\u23B0',
    lnE: '\u2268',
    lnap: '\u2A89',
    lnapprox: '\u2A89',
    lne: '\u2A87',
    lneq: '\u2A87',
    lneqq: '\u2268',
    lnsim: '\u22E6',
    loang: '\u27EC',
    loarr: '\u21FD',
    lobrk: '\u27E6',
    longleftarrow: '\u27F5',
    longleftrightarrow: '\u27F7',
    longmapsto: '\u27FC',
    longrightarrow: '\u27F6',
    looparrowleft: '\u21AB',
    looparrowright: '\u21AC',
    lopar: '\u2985',
    lopf: '\uD835\uDD5D',
    loplus: '\u2A2D',
    lotimes: '\u2A34',
    lowast: '\u2217',
    lowbar: '\u005F',
    loz: '\u25CA',
    lozenge: '\u25CA',
    lozf: '\u29EB',
    lpar: '\u0028',
    lparlt: '\u2993',
    lrarr: '\u21C6',
    lrcorner: '\u231F',
    lrhar: '\u21CB',
    lrhard: '\u296D',
    lrm: '\u200E',
    lrtri: '\u22BF',
    lsaquo: '\u2039',
    lscr: '\uD835\uDCC1',
    lsh: '\u21B0',
    lsim: '\u2272',
    lsime: '\u2A8D',
    lsimg: '\u2A8F',
    lsqb: '\u005B',
    lsquo: '\u2018',
    lsquor: '\u201A',
    lstrok: '\u0142',
    lt: '\u003C',
    ltcc: '\u2AA6',
    ltcir: '\u2A79',
    ltdot: '\u22D6',
    lthree: '\u22CB',
    ltimes: '\u22C9',
    ltlarr: '\u2976',
    ltquest: '\u2A7B',
    ltrPar: '\u2996',
    ltri: '\u25C3',
    ltrie: '\u22B4',
    ltrif: '\u25C2',
    lurdshar: '\u294A',
    luruhar: '\u2966',
    lvertneqq: '\u2268\uFE00',
    lvnE: '\u2268\uFE00',
    mDDot: '\u223A',
    macr: '\u00AF',
    male: '\u2642',
    malt: '\u2720',
    maltese: '\u2720',
    map: '\u21A6',
    mapsto: '\u21A6',
    mapstodown: '\u21A7',
    mapstoleft: '\u21A4',
    mapstoup: '\u21A5',
    marker: '\u25AE',
    mcomma: '\u2A29',
    mcy: '\u043C',
    mdash: '\u2014',
    measuredangle: '\u2221',
    mfr: '\uD835\uDD2A',
    mho: '\u2127',
    micro: '\u00B5',
    mid: '\u2223',
    midast: '\u002A',
    midcir: '\u2AF0',
    middot: '\u00B7',
    minus: '\u2212',
    minusb: '\u229F',
    minusd: '\u2238',
    minusdu: '\u2A2A',
    mlcp: '\u2ADB',
    mldr: '\u2026',
    mnplus: '\u2213',
    models: '\u22A7',
    mopf: '\uD835\uDD5E',
    mp: '\u2213',
    mscr: '\uD835\uDCC2',
    mstpos: '\u223E',
    mu: '\u03BC',
    multimap: '\u22B8',
    mumap: '\u22B8',
    nGg: '\u22D9\u0338',
    nGt: '\u226B\u20D2',
    nGtv: '\u226B\u0338',
    nLeftarrow: '\u21CD',
    nLeftrightarrow: '\u21CE',
    nLl: '\u22D8\u0338',
    nLt: '\u226A\u20D2',
    nLtv: '\u226A\u0338',
    nRightarrow: '\u21CF',
    nVDash: '\u22AF',
    nVdash: '\u22AE',
    nabla: '\u2207',
    nacute: '\u0144',
    nang: '\u2220\u20D2',
    nap: '\u2249',
    napE: '\u2A70\u0338',
    napid: '\u224B\u0338',
    napos: '\u0149',
    napprox: '\u2249',
    natur: '\u266E',
    natural: '\u266E',
    naturals: '\u2115',
    nbsp: '\u00A0',
    nbump: '\u224E\u0338',
    nbumpe: '\u224F\u0338',
    ncap: '\u2A43',
    ncaron: '\u0148',
    ncedil: '\u0146',
    ncong: '\u2247',
    ncongdot: '\u2A6D\u0338',
    ncup: '\u2A42',
    ncy: '\u043D',
    ndash: '\u2013',
    ne: '\u2260',
    neArr: '\u21D7',
    nearhk: '\u2924',
    nearr: '\u2197',
    nearrow: '\u2197',
    nedot: '\u2250\u0338',
    nequiv: '\u2262',
    nesear: '\u2928',
    nesim: '\u2242\u0338',
    nexist: '\u2204',
    nexists: '\u2204',
    nfr: '\uD835\uDD2B',
    ngE: '\u2267\u0338',
    nge: '\u2271',
    ngeq: '\u2271',
    ngeqq: '\u2267\u0338',
    ngeqslant: '\u2A7E\u0338',
    nges: '\u2A7E\u0338',
    ngsim: '\u2275',
    ngt: '\u226F',
    ngtr: '\u226F',
    nhArr: '\u21CE',
    nharr: '\u21AE',
    nhpar: '\u2AF2',
    ni: '\u220B',
    nis: '\u22FC',
    nisd: '\u22FA',
    niv: '\u220B',
    njcy: '\u045A',
    nlArr: '\u21CD',
    nlE: '\u2266\u0338',
    nlarr: '\u219A',
    nldr: '\u2025',
    nle: '\u2270',
    nleftarrow: '\u219A',
    nleftrightarrow: '\u21AE',
    nleq: '\u2270',
    nleqq: '\u2266\u0338',
    nleqslant: '\u2A7D\u0338',
    nles: '\u2A7D\u0338',
    nless: '\u226E',
    nlsim: '\u2274',
    nlt: '\u226E',
    nltri: '\u22EA',
    nltrie: '\u22EC',
    nmid: '\u2224',
    nopf: '\uD835\uDD5F',
    not: '\u00AC',
    notin: '\u2209',
    notinE: '\u22F9\u0338',
    notindot: '\u22F5\u0338',
    notinva: '\u2209',
    notinvb: '\u22F7',
    notinvc: '\u22F6',
    notni: '\u220C',
    notniva: '\u220C',
    notnivb: '\u22FE',
    notnivc: '\u22FD',
    npar: '\u2226',
    nparallel: '\u2226',
    nparsl: '\u2AFD\u20E5',
    npart: '\u2202\u0338',
    npolint: '\u2A14',
    npr: '\u2280',
    nprcue: '\u22E0',
    npre: '\u2AAF\u0338',
    nprec: '\u2280',
    npreceq: '\u2AAF\u0338',
    nrArr: '\u21CF',
    nrarr: '\u219B',
    nrarrc: '\u2933\u0338',
    nrarrw: '\u219D\u0338',
    nrightarrow: '\u219B',
    nrtri: '\u22EB',
    nrtrie: '\u22ED',
    nsc: '\u2281',
    nsccue: '\u22E1',
    nsce: '\u2AB0\u0338',
    nscr: '\uD835\uDCC3',
    nshortmid: '\u2224',
    nshortparallel: '\u2226',
    nsim: '\u2241',
    nsime: '\u2244',
    nsimeq: '\u2244',
    nsmid: '\u2224',
    nspar: '\u2226',
    nsqsube: '\u22E2',
    nsqsupe: '\u22E3',
    nsub: '\u2284',
    nsubE: '\u2AC5\u0338',
    nsube: '\u2288',
    nsubset: '\u2282\u20D2',
    nsubseteq: '\u2288',
    nsubseteqq: '\u2AC5\u0338',
    nsucc: '\u2281',
    nsucceq: '\u2AB0\u0338',
    nsup: '\u2285',
    nsupE: '\u2AC6\u0338',
    nsupe: '\u2289',
    nsupset: '\u2283\u20D2',
    nsupseteq: '\u2289',
    nsupseteqq: '\u2AC6\u0338',
    ntgl: '\u2279',
    ntilde: '\u00F1',
    ntlg: '\u2278',
    ntriangleleft: '\u22EA',
    ntrianglelefteq: '\u22EC',
    ntriangleright: '\u22EB',
    ntrianglerighteq: '\u22ED',
    nu: '\u03BD',
    num: '\u0023',
    numero: '\u2116',
    numsp: '\u2007',
    nvDash: '\u22AD',
    nvHarr: '\u2904',
    nvap: '\u224D\u20D2',
    nvdash: '\u22AC',
    nvge: '\u2265\u20D2',
    nvgt: '\u003E\u20D2',
    nvinfin: '\u29DE',
    nvlArr: '\u2902',
    nvle: '\u2264\u20D2',
    nvlt: '\u003C\u20D2',
    nvltrie: '\u22B4\u20D2',
    nvrArr: '\u2903',
    nvrtrie: '\u22B5\u20D2',
    nvsim: '\u223C\u20D2',
    nwArr: '\u21D6',
    nwarhk: '\u2923',
    nwarr: '\u2196',
    nwarrow: '\u2196',
    nwnear: '\u2927',
    oS: '\u24C8',
    oacute: '\u00F3',
    oast: '\u229B',
    ocir: '\u229A',
    ocirc: '\u00F4',
    ocy: '\u043E',
    odash: '\u229D',
    odblac: '\u0151',
    odiv: '\u2A38',
    odot: '\u2299',
    odsold: '\u29BC',
    oelig: '\u0153',
    ofcir: '\u29BF',
    ofr: '\uD835\uDD2C',
    ogon: '\u02DB',
    ograve: '\u00F2',
    ogt: '\u29C1',
    ohbar: '\u29B5',
    ohm: '\u03A9',
    oint: '\u222E',
    olarr: '\u21BA',
    olcir: '\u29BE',
    olcross: '\u29BB',
    oline: '\u203E',
    olt: '\u29C0',
    omacr: '\u014D',
    omega: '\u03C9',
    omicron: '\u03BF',
    omid: '\u29B6',
    ominus: '\u2296',
    oopf: '\uD835\uDD60',
    opar: '\u29B7',
    operp: '\u29B9',
    oplus: '\u2295',
    or: '\u2228',
    orarr: '\u21BB',
    ord: '\u2A5D',
    order: '\u2134',
    orderof: '\u2134',
    ordf: '\u00AA',
    ordm: '\u00BA',
    origof: '\u22B6',
    oror: '\u2A56',
    orslope: '\u2A57',
    orv: '\u2A5B',
    oscr: '\u2134',
    oslash: '\u00F8',
    osol: '\u2298',
    otilde: '\u00F5',
    otimes: '\u2297',
    otimesas: '\u2A36',
    ouml: '\u00F6',
    ovbar: '\u233D',
    par: '\u2225',
    para: '\u00B6',
    parallel: '\u2225',
    parsim: '\u2AF3',
    parsl: '\u2AFD',
    part: '\u2202',
    pcy: '\u043F',
    percnt: '\u0025',
    period: '\u002E',
    permil: '\u2030',
    perp: '\u22A5',
    pertenk: '\u2031',
    pfr: '\uD835\uDD2D',
    phi: '\u03C6',
    phiv: '\u03D5',
    phmmat: '\u2133',
    phone: '\u260E',
    pi: '\u03C0',
    pitchfork: '\u22D4',
    piv: '\u03D6',
    planck: '\u210F',
    planckh: '\u210E',
    plankv: '\u210F',
    plus: '\u002B',
    plusacir: '\u2A23',
    plusb: '\u229E',
    pluscir: '\u2A22',
    plusdo: '\u2214',
    plusdu: '\u2A25',
    pluse: '\u2A72',
    plusmn: '\u00B1',
    plussim: '\u2A26',
    plustwo: '\u2A27',
    pm: '\u00B1',
    pointint: '\u2A15',
    popf: '\uD835\uDD61',
    pound: '\u00A3',
    pr: '\u227A',
    prE: '\u2AB3',
    prap: '\u2AB7',
    prcue: '\u227C',
    pre: '\u2AAF',
    prec: '\u227A',
    precapprox: '\u2AB7',
    preccurlyeq: '\u227C',
    preceq: '\u2AAF',
    precnapprox: '\u2AB9',
    precneqq: '\u2AB5',
    precnsim: '\u22E8',
    precsim: '\u227E',
    prime: '\u2032',
    primes: '\u2119',
    prnE: '\u2AB5',
    prnap: '\u2AB9',
    prnsim: '\u22E8',
    prod: '\u220F',
    profalar: '\u232E',
    profline: '\u2312',
    profsurf: '\u2313',
    prop: '\u221D',
    propto: '\u221D',
    prsim: '\u227E',
    prurel: '\u22B0',
    pscr: '\uD835\uDCC5',
    psi: '\u03C8',
    puncsp: '\u2008',
    qfr: '\uD835\uDD2E',
    qint: '\u2A0C',
    qopf: '\uD835\uDD62',
    qprime: '\u2057',
    qscr: '\uD835\uDCC6',
    quaternions: '\u210D',
    quatint: '\u2A16',
    quest: '\u003F',
    questeq: '\u225F',
    quot: '\u0022',
    rAarr: '\u21DB',
    rArr: '\u21D2',
    rAtail: '\u291C',
    rBarr: '\u290F',
    rHar: '\u2964',
    race: '\u223D\u0331',
    racute: '\u0155',
    radic: '\u221A',
    raemptyv: '\u29B3',
    rang: '\u27E9',
    rangd: '\u2992',
    range: '\u29A5',
    rangle: '\u27E9',
    raquo: '\u00BB',
    rarr: '\u2192',
    rarrap: '\u2975',
    rarrb: '\u21E5',
    rarrbfs: '\u2920',
    rarrc: '\u2933',
    rarrfs: '\u291E',
    rarrhk: '\u21AA',
    rarrlp: '\u21AC',
    rarrpl: '\u2945',
    rarrsim: '\u2974',
    rarrtl: '\u21A3',
    rarrw: '\u219D',
    ratail: '\u291A',
    ratio: '\u2236',
    rationals: '\u211A',
    rbarr: '\u290D',
    rbbrk: '\u2773',
    rbrace: '\u007D',
    rbrack: '\u005D',
    rbrke: '\u298C',
    rbrksld: '\u298E',
    rbrkslu: '\u2990',
    rcaron: '\u0159',
    rcedil: '\u0157',
    rceil: '\u2309',
    rcub: '\u007D',
    rcy: '\u0440',
    rdca: '\u2937',
    rdldhar: '\u2969',
    rdquo: '\u201D',
    rdquor: '\u201D',
    rdsh: '\u21B3',
    real: '\u211C',
    realine: '\u211B',
    realpart: '\u211C',
    reals: '\u211D',
    rect: '\u25AD',
    reg: '\u00AE',
    rfisht: '\u297D',
    rfloor: '\u230B',
    rfr: '\uD835\uDD2F',
    rhard: '\u21C1',
    rharu: '\u21C0',
    rharul: '\u296C',
    rho: '\u03C1',
    rhov: '\u03F1',
    rightarrow: '\u2192',
    rightarrowtail: '\u21A3',
    rightharpoondown: '\u21C1',
    rightharpoonup: '\u21C0',
    rightleftarrows: '\u21C4',
    rightleftharpoons: '\u21CC',
    rightrightarrows: '\u21C9',
    rightsquigarrow: '\u219D',
    rightthreetimes: '\u22CC',
    ring: '\u02DA',
    risingdotseq: '\u2253',
    rlarr: '\u21C4',
    rlhar: '\u21CC',
    rlm: '\u200F',
    rmoust: '\u23B1',
    rmoustache: '\u23B1',
    rnmid: '\u2AEE',
    roang: '\u27ED',
    roarr: '\u21FE',
    robrk: '\u27E7',
    ropar: '\u2986',
    ropf: '\uD835\uDD63',
    roplus: '\u2A2E',
    rotimes: '\u2A35',
    rpar: '\u0029',
    rpargt: '\u2994',
    rppolint: '\u2A12',
    rrarr: '\u21C9',
    rsaquo: '\u203A',
    rscr: '\uD835\uDCC7',
    rsh: '\u21B1',
    rsqb: '\u005D',
    rsquo: '\u2019',
    rsquor: '\u2019',
    rthree: '\u22CC',
    rtimes: '\u22CA',
    rtri: '\u25B9',
    rtrie: '\u22B5',
    rtrif: '\u25B8',
    rtriltri: '\u29CE',
    ruluhar: '\u2968',
    rx: '\u211E',
    sacute: '\u015B',
    sbquo: '\u201A',
    sc: '\u227B',
    scE: '\u2AB4',
    scap: '\u2AB8',
    scaron: '\u0161',
    sccue: '\u227D',
    sce: '\u2AB0',
    scedil: '\u015F',
    scirc: '\u015D',
    scnE: '\u2AB6',
    scnap: '\u2ABA',
    scnsim: '\u22E9',
    scpolint: '\u2A13',
    scsim: '\u227F',
    scy: '\u0441',
    sdot: '\u22C5',
    sdotb: '\u22A1',
    sdote: '\u2A66',
    seArr: '\u21D8',
    searhk: '\u2925',
    searr: '\u2198',
    searrow: '\u2198',
    sect: '\u00A7',
    semi: '\u003B',
    seswar: '\u2929',
    setminus: '\u2216',
    setmn: '\u2216',
    sext: '\u2736',
    sfr: '\uD835\uDD30',
    sfrown: '\u2322',
    sharp: '\u266F',
    shchcy: '\u0449',
    shcy: '\u0448',
    shortmid: '\u2223',
    shortparallel: '\u2225',
    shy: '\u00AD',
    sigma: '\u03C3',
    sigmaf: '\u03C2',
    sigmav: '\u03C2',
    sim: '\u223C',
    simdot: '\u2A6A',
    sime: '\u2243',
    simeq: '\u2243',
    simg: '\u2A9E',
    simgE: '\u2AA0',
    siml: '\u2A9D',
    simlE: '\u2A9F',
    simne: '\u2246',
    simplus: '\u2A24',
    simrarr: '\u2972',
    slarr: '\u2190',
    smallsetminus: '\u2216',
    smashp: '\u2A33',
    smeparsl: '\u29E4',
    smid: '\u2223',
    smile: '\u2323',
    smt: '\u2AAA',
    smte: '\u2AAC',
    smtes: '\u2AAC\uFE00',
    softcy: '\u044C',
    sol: '\u002F',
    solb: '\u29C4',
    solbar: '\u233F',
    sopf: '\uD835\uDD64',
    spades: '\u2660',
    spadesuit: '\u2660',
    spar: '\u2225',
    sqcap: '\u2293',
    sqcaps: '\u2293\uFE00',
    sqcup: '\u2294',
    sqcups: '\u2294\uFE00',
    sqsub: '\u228F',
    sqsube: '\u2291',
    sqsubset: '\u228F',
    sqsubseteq: '\u2291',
    sqsup: '\u2290',
    sqsupe: '\u2292',
    sqsupset: '\u2290',
    sqsupseteq: '\u2292',
    squ: '\u25A1',
    square: '\u25A1',
    squarf: '\u25AA',
    squf: '\u25AA',
    srarr: '\u2192',
    sscr: '\uD835\uDCC8',
    ssetmn: '\u2216',
    ssmile: '\u2323',
    sstarf: '\u22C6',
    star: '\u2606',
    starf: '\u2605',
    straightepsilon: '\u03F5',
    straightphi: '\u03D5',
    strns: '\u00AF',
    sub: '\u2282',
    subE: '\u2AC5',
    subdot: '\u2ABD',
    sube: '\u2286',
    subedot: '\u2AC3',
    submult: '\u2AC1',
    subnE: '\u2ACB',
    subne: '\u228A',
    subplus: '\u2ABF',
    subrarr: '\u2979',
    subset: '\u2282',
    subseteq: '\u2286',
    subseteqq: '\u2AC5',
    subsetneq: '\u228A',
    subsetneqq: '\u2ACB',
    subsim: '\u2AC7',
    subsub: '\u2AD5',
    subsup: '\u2AD3',
    succ: '\u227B',
    succapprox: '\u2AB8',
    succcurlyeq: '\u227D',
    succeq: '\u2AB0',
    succnapprox: '\u2ABA',
    succneqq: '\u2AB6',
    succnsim: '\u22E9',
    succsim: '\u227F',
    sum: '\u2211',
    sung: '\u266A',
    sup1: '\u00B9',
    sup2: '\u00B2',
    sup3: '\u00B3',
    sup: '\u2283',
    supE: '\u2AC6',
    supdot: '\u2ABE',
    supdsub: '\u2AD8',
    supe: '\u2287',
    supedot: '\u2AC4',
    suphsol: '\u27C9',
    suphsub: '\u2AD7',
    suplarr: '\u297B',
    supmult: '\u2AC2',
    supnE: '\u2ACC',
    supne: '\u228B',
    supplus: '\u2AC0',
    supset: '\u2283',
    supseteq: '\u2287',
    supseteqq: '\u2AC6',
    supsetneq: '\u228B',
    supsetneqq: '\u2ACC',
    supsim: '\u2AC8',
    supsub: '\u2AD4',
    supsup: '\u2AD6',
    swArr: '\u21D9',
    swarhk: '\u2926',
    swarr: '\u2199',
    swarrow: '\u2199',
    swnwar: '\u292A',
    szlig: '\u00DF',
    target: '\u2316',
    tau: '\u03C4',
    tbrk: '\u23B4',
    tcaron: '\u0165',
    tcedil: '\u0163',
    tcy: '\u0442',
    tdot: '\u20DB',
    telrec: '\u2315',
    tfr: '\uD835\uDD31',
    there4: '\u2234',
    therefore: '\u2234',
    theta: '\u03B8',
    thetasym: '\u03D1',
    thetav: '\u03D1',
    thickapprox: '\u2248',
    thicksim: '\u223C',
    thinsp: '\u2009',
    thkap: '\u2248',
    thksim: '\u223C',
    thorn: '\u00FE',
    tilde: '\u02DC',
    times: '\u00D7',
    timesb: '\u22A0',
    timesbar: '\u2A31',
    timesd: '\u2A30',
    tint: '\u222D',
    toea: '\u2928',
    top: '\u22A4',
    topbot: '\u2336',
    topcir: '\u2AF1',
    topf: '\uD835\uDD65',
    topfork: '\u2ADA',
    tosa: '\u2929',
    tprime: '\u2034',
    trade: '\u2122',
    triangle: '\u25B5',
    triangledown: '\u25BF',
    triangleleft: '\u25C3',
    trianglelefteq: '\u22B4',
    triangleq: '\u225C',
    triangleright: '\u25B9',
    trianglerighteq: '\u22B5',
    tridot: '\u25EC',
    trie: '\u225C',
    triminus: '\u2A3A',
    triplus: '\u2A39',
    trisb: '\u29CD',
    tritime: '\u2A3B',
    trpezium: '\u23E2',
    tscr: '\uD835\uDCC9',
    tscy: '\u0446',
    tshcy: '\u045B',
    tstrok: '\u0167',
    twixt: '\u226C',
    twoheadleftarrow: '\u219E',
    twoheadrightarrow: '\u21A0',
    uArr: '\u21D1',
    uHar: '\u2963',
    uacute: '\u00FA',
    uarr: '\u2191',
    ubrcy: '\u045E',
    ubreve: '\u016D',
    ucirc: '\u00FB',
    ucy: '\u0443',
    udarr: '\u21C5',
    udblac: '\u0171',
    udhar: '\u296E',
    ufisht: '\u297E',
    ufr: '\uD835\uDD32',
    ugrave: '\u00F9',
    uharl: '\u21BF',
    uharr: '\u21BE',
    uhblk: '\u2580',
    ulcorn: '\u231C',
    ulcorner: '\u231C',
    ulcrop: '\u230F',
    ultri: '\u25F8',
    umacr: '\u016B',
    uml: '\u00A8',
    uogon: '\u0173',
    uopf: '\uD835\uDD66',
    uparrow: '\u2191',
    updownarrow: '\u2195',
    upharpoonleft: '\u21BF',
    upharpoonright: '\u21BE',
    uplus: '\u228E',
    upsi: '\u03C5',
    upsih: '\u03D2',
    upsilon: '\u03C5',
    upuparrows: '\u21C8',
    urcorn: '\u231D',
    urcorner: '\u231D',
    urcrop: '\u230E',
    uring: '\u016F',
    urtri: '\u25F9',
    uscr: '\uD835\uDCCA',
    utdot: '\u22F0',
    utilde: '\u0169',
    utri: '\u25B5',
    utrif: '\u25B4',
    uuarr: '\u21C8',
    uuml: '\u00FC',
    uwangle: '\u29A7',
    vArr: '\u21D5',
    vBar: '\u2AE8',
    vBarv: '\u2AE9',
    vDash: '\u22A8',
    vangrt: '\u299C',
    varepsilon: '\u03F5',
    varkappa: '\u03F0',
    varnothing: '\u2205',
    varphi: '\u03D5',
    varpi: '\u03D6',
    varpropto: '\u221D',
    varr: '\u2195',
    varrho: '\u03F1',
    varsigma: '\u03C2',
    varsubsetneq: '\u228A\uFE00',
    varsubsetneqq: '\u2ACB\uFE00',
    varsupsetneq: '\u228B\uFE00',
    varsupsetneqq: '\u2ACC\uFE00',
    vartheta: '\u03D1',
    vartriangleleft: '\u22B2',
    vartriangleright: '\u22B3',
    vcy: '\u0432',
    vdash: '\u22A2',
    vee: '\u2228',
    veebar: '\u22BB',
    veeeq: '\u225A',
    vellip: '\u22EE',
    verbar: '\u007C',
    vert: '\u007C',
    vfr: '\uD835\uDD33',
    vltri: '\u22B2',
    vnsub: '\u2282\u20D2',
    vnsup: '\u2283\u20D2',
    vopf: '\uD835\uDD67',
    vprop: '\u221D',
    vrtri: '\u22B3',
    vscr: '\uD835\uDCCB',
    vsubnE: '\u2ACB\uFE00',
    vsubne: '\u228A\uFE00',
    vsupnE: '\u2ACC\uFE00',
    vsupne: '\u228B\uFE00',
    vzigzag: '\u299A',
    wcirc: '\u0175',
    wedbar: '\u2A5F',
    wedge: '\u2227',
    wedgeq: '\u2259',
    weierp: '\u2118',
    wfr: '\uD835\uDD34',
    wopf: '\uD835\uDD68',
    wp: '\u2118',
    wr: '\u2240',
    wreath: '\u2240',
    wscr: '\uD835\uDCCC',
    xcap: '\u22C2',
    xcirc: '\u25EF',
    xcup: '\u22C3',
    xdtri: '\u25BD',
    xfr: '\uD835\uDD35',
    xhArr: '\u27FA',
    xharr: '\u27F7',
    xi: '\u03BE',
    xlArr: '\u27F8',
    xlarr: '\u27F5',
    xmap: '\u27FC',
    xnis: '\u22FB',
    xodot: '\u2A00',
    xopf: '\uD835\uDD69',
    xoplus: '\u2A01',
    xotime: '\u2A02',
    xrArr: '\u27F9',
    xrarr: '\u27F6',
    xscr: '\uD835\uDCCD',
    xsqcup: '\u2A06',
    xuplus: '\u2A04',
    xutri: '\u25B3',
    xvee: '\u22C1',
    xwedge: '\u22C0',
    yacute: '\u00FD',
    yacy: '\u044F',
    ycirc: '\u0177',
    ycy: '\u044B',
    yen: '\u00A5',
    yfr: '\uD835\uDD36',
    yicy: '\u0457',
    yopf: '\uD835\uDD6A',
    yscr: '\uD835\uDCCE',
    yucy: '\u044E',
    yuml: '\u00FF',
    zacute: '\u017A',
    zcaron: '\u017E',
    zcy: '\u0437',
    zdot: '\u017C',
    zeetrf: '\u2128',
    zeta: '\u03B6',
    zfr: '\uD835\uDD37',
    zhcy: '\u0436',
    zigrarr: '\u21DD',
    zopf: '\uD835\uDD6B',
    zscr: '\uD835\uDCCF',
    zwj: '\u200D',
    zwnj: '\u200C'
};
const decodeMap = {
    '0': 65533,
    '128': 8364,
    '130': 8218,
    '131': 402,
    '132': 8222,
    '133': 8230,
    '134': 8224,
    '135': 8225,
    '136': 710,
    '137': 8240,
    '138': 352,
    '139': 8249,
    '140': 338,
    '142': 381,
    '145': 8216,
    '146': 8217,
    '147': 8220,
    '148': 8221,
    '149': 8226,
    '150': 8211,
    '151': 8212,
    '152': 732,
    '153': 8482,
    '154': 353,
    '155': 8250,
    '156': 339,
    '158': 382,
    '159': 376
};
function decodeHTMLStrict(text) {
    return text.replace(/&(?:[a-zA-Z]+|#[xX][\da-fA-F]+|#\d+);/g, (key) => {
        if (key.charAt(1) === '#') {
            const secondChar = key.charAt(2);
            const codePoint = secondChar === 'X' || secondChar === 'x'
                ? parseInt(key.slice(3), 16)
                : parseInt(key.slice(2), 10);
            return decodeCodePoint(codePoint);
        }
        return entities[key.slice(1, -1)] || key;
    });
}
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return '\uFFFD';
    }
    if (codePoint in decodeMap) {
        codePoint = decodeMap[codePoint];
    }
    return String.fromCodePoint(codePoint);
}

function scanJSXAttributeValue(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    parser.token =
        CharTypes[parser.currentChar] & 8192
            ? scanJSXString(parser, context)
            : scanSingleToken(parser, context, 0);
    return parser.token;
}
function scanJSXString(parser, context) {
    const quote = parser.currentChar;
    let char = advanceChar(parser);
    const start = parser.index;
    while (char !== quote) {
        if (parser.index >= parser.end)
            report(parser, 14);
        char = advanceChar(parser);
    }
    if (char !== quote)
        report(parser, 14);
    parser.tokenValue = parser.source.slice(start, parser.index);
    advanceChar(parser);
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    return 134283267;
}
function scanJSXToken(parser, context) {
    parser.startPos = parser.tokenPos = parser.index;
    parser.startColumn = parser.colPos = parser.column;
    parser.startLine = parser.linePos = parser.line;
    if (parser.index >= parser.end)
        return (parser.token = 1048576);
    const token = TokenLookup[parser.source.charCodeAt(parser.index)];
    switch (token) {
        case 8456258: {
            advanceChar(parser);
            if (parser.currentChar === 47) {
                advanceChar(parser);
                parser.token = 25;
            }
            else {
                parser.token = 8456258;
            }
            break;
        }
        case 2162700: {
            advanceChar(parser);
            parser.token = 2162700;
            break;
        }
        default: {
            let state = 0;
            while (parser.index < parser.end) {
                const type = CharTypes[parser.source.charCodeAt(parser.index)];
                if (type & 1024) {
                    state |= 1 | 4;
                    scanNewLine(parser);
                }
                else if (type & 2048) {
                    consumeLineFeed(parser, state);
                    state = (state & ~4) | 1;
                }
                else {
                    advanceChar(parser);
                }
                if (CharTypes[parser.currentChar] & 16384)
                    break;
            }
            const raw = parser.source.slice(parser.tokenPos, parser.index);
            if (context & 512)
                parser.tokenRaw = raw;
            parser.tokenValue = decodeHTMLStrict(raw);
            parser.token = 138;
        }
    }
    return parser.token;
}
function scanJSXIdentifier(parser) {
    if ((parser.token & 143360) === 143360) {
        const { index } = parser;
        let char = parser.currentChar;
        while (CharTypes[char] & (32768 | 2)) {
            char = advanceChar(parser);
        }
        parser.tokenValue += parser.source.slice(index, parser.index);
    }
    parser.token = 208897;
    return parser.token;
}

function matchOrInsertSemicolon(parser, context) {
    if ((parser.flags & 1) === 0 &&
        (parser.token & 1048576) !== 1048576) {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    if (!consumeOpt(parser, context, 1074790417)) {
        parser.onInsertedSemicolon?.(parser.startPos);
    }
}
function isValidStrictMode(parser, index, tokenPos, tokenValue) {
    if (index - tokenPos < 13 && tokenValue === 'use strict') {
        if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
            return 1;
        }
    }
    return 0;
}
function optionalBit(parser, context, t) {
    if (parser.token !== t)
        return 0;
    nextToken(parser, context);
    return 1;
}
function consumeOpt(parser, context, t) {
    if (parser.token !== t)
        return false;
    nextToken(parser, context);
    return true;
}
function consume(parser, context, t) {
    if (parser.token !== t)
        report(parser, 23, KeywordDescTable[t & 255]);
    nextToken(parser, context);
}
function reinterpretToPattern(state, node) {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            const elements = node.elements;
            for (let i = 0, n = elements.length; i < n; ++i) {
                const element = elements[i];
                if (element)
                    reinterpretToPattern(state, element);
            }
            return;
        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            const properties = node.properties;
            for (let i = 0, n = properties.length; i < n; ++i) {
                reinterpretToPattern(state, properties[i]);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
            if (node.operator !== '=')
                report(state, 69);
            delete node.operator;
            reinterpretToPattern(state, node.left);
            return;
        case 'Property':
            reinterpretToPattern(state, node.value);
            return;
        case 'SpreadElement':
            node.type = 'RestElement';
            reinterpretToPattern(state, node.argument);
    }
}
function validateBindingIdentifier(parser, context, kind, t, skipEvalArgCheck) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 115);
        }
        if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
            report(parser, 116);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 100);
    }
    if (kind & (8 | 16) && t === 241739) {
        report(parser, 98);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 96);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 95, 'yield');
    }
}
function validateFunctionName(parser, context, t) {
    if (context & 1024) {
        if ((t & 36864) === 36864) {
            report(parser, 115);
        }
        if ((t & 537079808) === 537079808) {
            report(parser, 116);
        }
        if (t === 122) {
            report(parser, 93);
        }
        if (t === 121) {
            report(parser, 93);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 100);
    }
    if (context & (4194304 | 2048) && t === 209008) {
        report(parser, 96);
    }
    if (context & (2097152 | 1024) && t === 241773) {
        report(parser, 95, 'yield');
    }
}
function isStrictReservedWord(parser, context, t) {
    if (t === 209008) {
        if (context & (4194304 | 2048))
            report(parser, 96);
        parser.destructible |= 128;
    }
    if (t === 241773 && context & 2097152)
        report(parser, 95, 'yield');
    return ((t & 20480) === 20480 ||
        (t & 36864) === 36864 ||
        t == 122);
}
function isPropertyWithPrivateFieldKey(expr) {
    return !expr.property ? false : expr.property.type === 'PrivateIdentifier';
}
function isValidLabel(parser, labels, name, isIterationStatement) {
    while (labels) {
        if (labels['$' + name]) {
            if (isIterationStatement)
                report(parser, 134);
            return 1;
        }
        if (isIterationStatement && labels.loop)
            isIterationStatement = 0;
        labels = labels['$'];
    }
    return 0;
}
function validateAndDeclareLabel(parser, labels, name) {
    let set = labels;
    while (set) {
        if (set['$' + name])
            report(parser, 133, name);
        set = set['$'];
    }
    labels['$' + name] = 1;
}
function finishNode(parser, context, start, line, column, node) {
    if (context & 2) {
        node.start = start;
        node.end = parser.startPos;
        node.range = [start, parser.startPos];
    }
    if (context & 4) {
        node.loc = {
            start: {
                line,
                column
            },
            end: {
                line: parser.startLine,
                column: parser.startColumn
            }
        };
        if (parser.sourceFile) {
            node.loc.source = parser.sourceFile;
        }
    }
    return node;
}
function isEqualTagName(elementName) {
    switch (elementName.type) {
        case 'JSXIdentifier':
            return elementName.name;
        case 'JSXNamespacedName':
            return elementName.namespace + ':' + elementName.name;
        case 'JSXMemberExpression':
            return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
    }
}
function createArrowHeadParsingScope(parser, context, value) {
    const scope = addChildScope(createScope(), 1024);
    addBlockName(parser, context, scope, value, 1, 0);
    return scope;
}
function recordScopeError(parser, type, ...params) {
    const { index, line, column } = parser;
    return {
        type,
        params,
        index,
        line,
        column
    };
}
function createScope() {
    return {
        parent: void 0,
        type: 2
    };
}
function addChildScope(parent, type) {
    return {
        parent,
        type,
        scopeError: void 0
    };
}
function addVarOrBlock(parser, context, scope, name, kind, origin) {
    if (kind & 4) {
        addVarName(parser, context, scope, name, kind);
    }
    else {
        addBlockName(parser, context, scope, name, kind, origin);
    }
    if (origin & 64) {
        declareUnboundVariable(parser, name);
    }
}
function addBlockName(parser, context, scope, name, kind, origin) {
    const value = scope['#' + name];
    if (value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 141, name);
        }
        else if (context & 256 &&
            value & 64 &&
            origin & 2) ;
        else {
            report(parser, 141, name);
        }
    }
    if (scope.type & 128 &&
        (scope.parent['#' + name] && (scope.parent['#' + name] & 2) === 0)) {
        report(parser, 141, name);
    }
    if (scope.type & 1024 && value && (value & 2) === 0) {
        if (kind & 1) {
            scope.scopeError = recordScopeError(parser, 141, name);
        }
    }
    if (scope.type & 64) {
        if (scope.parent['#' + name] & 768)
            report(parser, 154, name);
    }
    scope['#' + name] = kind;
}
function addVarName(parser, context, scope, name, kind) {
    let currentScope = scope;
    while (currentScope && (currentScope.type & 256) === 0) {
        const value = currentScope['#' + name];
        if (value & 248) {
            if (context & 256 &&
                (context & 1024) === 0 &&
                ((kind & 128 && value & 68) ||
                    (value & 128 && kind & 68))) ;
            else {
                report(parser, 141, name);
            }
        }
        if (currentScope === scope) {
            if (value & 1 && kind & 1) {
                currentScope.scopeError = recordScopeError(parser, 141, name);
            }
        }
        if (value & (512 | 256)) {
            if ((value & 512) === 0 ||
                (context & 256) === 0 ||
                context & 1024) {
                report(parser, 141, name);
            }
        }
        currentScope['#' + name] = kind;
        currentScope = currentScope.parent;
    }
}
function declareUnboundVariable(parser, name) {
    if (parser.exportedNames !== void 0 && name !== '') {
        if (parser.exportedNames['#' + name]) {
            report(parser, 142, name);
        }
        parser.exportedNames['#' + name] = 1;
    }
}
function addBindingToExports(parser, name) {
    if (parser.exportedBindings !== void 0 && name !== '') {
        parser.exportedBindings['#' + name] = 1;
    }
}
function pushComment(context, array) {
    return function (type, value, start, end, loc) {
        const comment = {
            type,
            value
        };
        if (context & 2) {
            comment.start = start;
            comment.end = end;
            comment.range = [start, end];
        }
        if (context & 4) {
            comment.loc = loc;
        }
        array.push(comment);
    };
}
function pushToken(context, array) {
    return function (token, start, end, loc) {
        const tokens = {
            token
        };
        if (context & 2) {
            tokens.start = start;
            tokens.end = end;
            tokens.range = [start, end];
        }
        if (context & 4) {
            tokens.loc = loc;
        }
        array.push(tokens);
    };
}
function isValidIdentifier(context, t) {
    if (context & (1024 | 2097152)) {
        if (context & 2048 && t === 209008)
            return false;
        if (context & 2097152 && t === 241773)
            return false;
        return (t & 143360) === 143360 || (t & 12288) === 12288;
    }
    return ((t & 143360) === 143360 ||
        (t & 12288) === 12288 ||
        (t & 36864) === 36864);
}
function classifyIdentifier(parser, context, t) {
    if ((t & 537079808) === 537079808) {
        if (context & 1024)
            report(parser, 116);
        parser.flags |= 512;
    }
    if (!isValidIdentifier(context, t))
        report(parser, 0);
}

function create(source, sourceFile, onComment, onToken, onInsertedSemicolon) {
    return {
        source,
        flags: 0,
        index: 0,
        line: 1,
        column: 0,
        startPos: 0,
        end: source.length,
        tokenPos: 0,
        startColumn: 0,
        colPos: 0,
        linePos: 1,
        startLine: 1,
        sourceFile,
        tokenValue: '',
        token: 1048576,
        tokenRaw: '',
        tokenRegExp: void 0,
        currentChar: source.charCodeAt(0),
        exportedNames: [],
        exportedBindings: [],
        assignable: 1,
        destructible: 0,
        onComment,
        onToken,
        onInsertedSemicolon,
        leadingDecorators: []
    };
}
function parseSource(source, options, context) {
    let sourceFile = '';
    let onComment;
    let onInsertedSemicolon;
    let onToken;
    if (options != null) {
        if (options.module)
            context |= 2048 | 1024;
        if (options.next)
            context |= 1;
        if (options.loc)
            context |= 4;
        if (options.ranges)
            context |= 2;
        if (options.uniqueKeyInPattern)
            context |= 536870912;
        if (options.lexical)
            context |= 64;
        if (options.webcompat)
            context |= 256;
        if (options.directives)
            context |= 8 | 512;
        if (options.globalReturn)
            context |= 32;
        if (options.raw)
            context |= 512;
        if (options.preserveParens)
            context |= 128;
        if (options.impliedStrict)
            context |= 1024;
        if (options.jsx)
            context |= 16;
        if (options.source)
            sourceFile = options.source;
        if (options.onComment != null) {
            onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
        }
        if (options.onInsertedSemicolon != null)
            onInsertedSemicolon = options.onInsertedSemicolon;
        if (options.onToken != null) {
            onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
        }
    }
    const parser = create(source, sourceFile, onComment, onToken, onInsertedSemicolon);
    if (context & 1)
        skipHashBang(parser);
    const scope = context & 64 ? createScope() : void 0;
    let body = [];
    let sourceType = 'script';
    if (context & 2048) {
        sourceType = 'module';
        body = parseModuleItemList(parser, context | 8192, scope);
        if (scope) {
            for (const key in parser.exportedBindings) {
                if (key[0] === '#' && !scope[key])
                    report(parser, 143, key.slice(1));
            }
        }
    }
    else {
        body = parseStatementList(parser, context | 8192, scope);
    }
    const node = {
        type: 'Program',
        sourceType,
        body
    };
    if (context & 2) {
        node.start = 0;
        node.end = source.length;
        node.range = [0, source.length];
    }
    if (context & 4) {
        node.loc = {
            start: { line: 1, column: 0 },
            end: { line: parser.line, column: parser.column }
        };
        if (parser.sourceFile)
            node.loc.source = sourceFile;
    }
    return node;
}
function parseStatementList(parser, context, scope) {
    nextToken(parser, context | 32768 | 268435456);
    const statements = [];
    while (parser.token === 134283267) {
        const { index, tokenPos, tokenValue, linePos, colPos, token } = parser;
        const expr = parseLiteral(parser, context);
        if (isValidStrictMode(parser, index, tokenPos, tokenValue))
            context |= 1024;
        statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
    }
    while (parser.token !== 1048576) {
        statements.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    return statements;
}
function parseModuleItemList(parser, context, scope) {
    nextToken(parser, context | 32768);
    const statements = [];
    if (context & 8) {
        while (parser.token === 134283267) {
            const { tokenPos, linePos, colPos, token } = parser;
            statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
        }
    }
    while (parser.token !== 1048576) {
        statements.push(parseModuleItem(parser, context, scope));
    }
    return statements;
}
function parseModuleItem(parser, context, scope) {
    parser.leadingDecorators = parseDecorators(parser, context);
    let moduleItem;
    switch (parser.token) {
        case 20566:
            moduleItem = parseExportDeclaration(parser, context, scope);
            break;
        case 86108:
            moduleItem = parseImportDeclaration(parser, context, scope);
            break;
        default:
            moduleItem = parseStatementListItem(parser, context, scope, 4, {});
    }
    if (parser.leadingDecorators.length) {
        report(parser, 165);
    }
    return moduleItem;
}
function parseStatementListItem(parser, context, scope, origin, labels) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    switch (parser.token) {
        case 86106:
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 0, start, line, column);
        case 133:
        case 86096:
            return parseClassDeclaration(parser, context, scope, 0, start, line, column);
        case 86092:
            return parseLexicalDeclaration(parser, context, scope, 16, 0, start, line, column);
        case 241739:
            return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
        case 20566:
            report(parser, 101, 'export');
        case 86108:
            nextToken(parser, context);
            switch (parser.token) {
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 101, 'import');
            }
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
        default:
            return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
    }
}
function parseStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    switch (parser.token) {
        case 86090:
            return parseVariableStatement(parser, context, scope, 0, start, line, column);
        case 20574:
            return parseReturnStatement(parser, context, start, line, column);
        case 20571:
            return parseIfStatement(parser, context, scope, labels, start, line, column);
        case 20569:
            return parseForStatement(parser, context, scope, labels, start, line, column);
        case 20564:
            return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
        case 20580:
            return parseWhileStatement(parser, context, scope, labels, start, line, column);
        case 86112:
            return parseSwitchStatement(parser, context, scope, labels, start, line, column);
        case 1074790417:
            return parseEmptyStatement(parser, context, start, line, column);
        case 2162700:
            return parseBlock(parser, context, scope ? addChildScope(scope, 2) : scope, labels, start, line, column);
        case 86114:
            return parseThrowStatement(parser, context, start, line, column);
        case 20557:
            return parseBreakStatement(parser, context, labels, start, line, column);
        case 20561:
            return parseContinueStatement(parser, context, labels, start, line, column);
        case 20579:
            return parseTryStatement(parser, context, scope, labels, start, line, column);
        case 20581:
            return parseWithStatement(parser, context, scope, labels, start, line, column);
        case 20562:
            return parseDebuggerStatement(parser, context, start, line, column);
        case 209007:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
        case 20559:
            report(parser, 157);
        case 20568:
            report(parser, 158);
        case 86106:
            report(parser, context & 1024
                ? 74
                : (context & 256) === 0
                    ? 76
                    : 75);
        case 86096:
            report(parser, 77);
        default:
            return parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column);
    }
}
function parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { tokenValue, token } = parser;
    let expr;
    switch (token) {
        case 241739:
            expr = parseIdentifier(parser, context);
            if (context & 1024)
                report(parser, 83);
            if (parser.token === 69271571)
                report(parser, 82);
            break;
        default:
            expr = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (token & 143360 && parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseBlock(parser, context, scope, labels, start, line, column) {
    const body = [];
    consume(parser, context | 32768, 2162700);
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 2, { $: labels }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'BlockStatement',
        body
    });
}
function parseReturnStatement(parser, context, start, line, column) {
    if ((context & 32) === 0 && context & 8192)
        report(parser, 90);
    nextToken(parser, context | 32768);
    const argument = parser.flags & 1 || parser.token & 1048576
        ? null
        : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ReturnStatement',
        argument
    });
}
function parseExpressionStatement(parser, context, expression, start, line, column) {
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression
    });
}
function parseLabelledStatement(parser, context, scope, origin, labels, value, expr, token, allowFuncDecl, start, line, column) {
    validateBindingIdentifier(parser, context, 0, token, 1);
    validateAndDeclareLabel(parser, labels, value);
    nextToken(parser, context | 32768);
    const body = allowFuncDecl &&
        (context & 1024) === 0 &&
        context & 256 &&
        parser.token === 86106
        ? parseFunctionDeclaration(parser, context, addChildScope(scope, 2), origin, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseStatement(parser, context, scope, origin, labels, allowFuncDecl, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'LabeledStatement',
        label: expr,
        body
    });
}
function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, 1, start, line, column);
    }
    const asyncNewLine = parser.flags & 1;
    if (!asyncNewLine) {
        if (parser.token === 86106) {
            if (!allowFuncDecl)
                report(parser, 120);
            return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 1, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            expr = parseAsyncArrowAfterIdent(parser, context, 1, start, line, column);
            if (parser.token === 18)
                expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
            return parseExpressionStatement(parser, context, expr, start, line, column);
        }
    }
    if (parser.token === 67174411) {
        expr = parseAsyncArrowOrCallExpression(parser, context, expr, 1, 1, 0, asyncNewLine, start, line, column);
    }
    else {
        if (parser.token === 10) {
            classifyIdentifier(parser, context, token);
            expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
        }
        parser.assignable = 1;
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    parser.assignable = 1;
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseDirective(parser, context, expression, token, start, line, column) {
    if (token !== 1074790417) {
        parser.assignable = 2;
        expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
        if (parser.token !== 1074790417) {
            expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);
            if (parser.token === 18) {
                expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
            }
        }
        matchOrInsertSemicolon(parser, context | 32768);
    }
    return context & 8 && expression.type === 'Literal' && typeof expression.value === 'string'
        ? finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression,
            directive: expression.raw.slice(1, -1)
        })
        : finishNode(parser, context, start, line, column, {
            type: 'ExpressionStatement',
            expression
        });
}
function parseEmptyStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'EmptyStatement'
    });
}
function parseThrowStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    if (parser.flags & 1)
        report(parser, 88);
    const argument = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ThrowStatement',
        argument
    });
}
function parseIfStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    parser.assignable = 1;
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
    consume(parser, context | 32768, 16);
    const consequent = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    let alternate = null;
    if (parser.token === 20565) {
        nextToken(parser, context | 32768);
        alternate = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    });
}
function parseConsequentOrAlternative(parser, context, scope, labels, start, line, column) {
    return context & 1024 ||
        (context & 256) === 0 ||
        parser.token !== 86106
        ? parseStatement(parser, context, scope, 0, { $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos)
        : parseFunctionDeclaration(parser, context, addChildScope(scope, 2), 0, 0, 0, 0, start, line, column);
}
function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    consume(parser, context, 2162700);
    const cases = [];
    let seenDefault = 0;
    if (scope)
        scope = addChildScope(scope, 8);
    while (parser.token !== 1074790415) {
        const { tokenPos, linePos, colPos } = parser;
        let test = null;
        const consequent = [];
        if (consumeOpt(parser, context | 32768, 20558)) {
            test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        }
        else {
            consume(parser, context | 32768, 20563);
            if (seenDefault)
                report(parser, 87);
            seenDefault = 1;
        }
        consume(parser, context | 32768, 21);
        while (parser.token !== 20558 &&
            parser.token !== 1074790415 &&
            parser.token !== 20563) {
            consequent.push(parseStatementListItem(parser, context | 4096, scope, 2, {
                $: labels
            }));
        }
        cases.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'SwitchCase',
            test,
            consequent
        }));
    }
    consume(parser, context | 32768, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'SwitchStatement',
        discriminant,
        cases
    });
}
function parseWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'WhileStatement',
        test,
        body
    });
}
function parseIterationStatementBody(parser, context, scope, labels) {
    return parseStatement(parser, ((context | 134217728) ^ 134217728) | 131072, scope, 0, { loop: 1, $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos);
}
function parseContinueStatement(parser, context, labels, start, line, column) {
    if ((context & 131072) === 0)
        report(parser, 66);
    nextToken(parser, context);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768);
        if (!isValidLabel(parser, labels, tokenValue, 1))
            report(parser, 135, tokenValue);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ContinueStatement',
        label
    });
}
function parseBreakStatement(parser, context, labels, start, line, column) {
    nextToken(parser, context | 32768);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue } = parser;
        label = parseIdentifier(parser, context | 32768);
        if (!isValidLabel(parser, labels, tokenValue, 0))
            report(parser, 135, tokenValue);
    }
    else if ((context & (4096 | 131072)) === 0) {
        report(parser, 67);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'BreakStatement',
        label
    });
}
function parseWithStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    if (context & 1024)
        report(parser, 89);
    consume(parser, context | 32768, 67174411);
    const object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseStatement(parser, context, scope, 2, labels, 0, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'WithStatement',
        object,
        body
    });
}
function parseDebuggerStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'DebuggerStatement'
    });
}
function parseTryStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const firstScope = scope ? addChildScope(scope, 32) : void 0;
    const block = parseBlock(parser, context, firstScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    const { tokenPos, linePos, colPos } = parser;
    const handler = consumeOpt(parser, context | 32768, 20559)
        ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos)
        : null;
    let finalizer = null;
    if (parser.token === 20568) {
        nextToken(parser, context | 32768);
        const finalizerScope = firstScope ? addChildScope(scope, 4) : void 0;
        finalizer = parseBlock(parser, context, finalizerScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    }
    if (!handler && !finalizer) {
        report(parser, 86);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    });
}
function parseCatchBlock(parser, context, scope, labels, start, line, column) {
    let param = null;
    let additionalScope = scope;
    if (consumeOpt(parser, context, 67174411)) {
        if (scope)
            scope = addChildScope(scope, 4);
        param = parseBindingPattern(parser, context, scope, (parser.token & 2097152) === 2097152
            ? 256
            : 512, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 18) {
            report(parser, 84);
        }
        else if (parser.token === 1077936157) {
            report(parser, 85);
        }
        consume(parser, context | 32768, 16);
        if (scope)
            additionalScope = addChildScope(scope, 64);
    }
    const body = parseBlock(parser, context, additionalScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'CatchClause',
        param,
        body
    });
}
function parseStaticBlock(parser, context, scope, start, line, column) {
    if (scope)
        scope = addChildScope(scope, 2);
    const ctorContext = 16384 | 524288;
    context = ((context | ctorContext) ^ ctorContext) | 262144;
    const { body } = parseBlock(parser, context, scope, {}, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'StaticBlock',
        body
    });
}
function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    consume(parser, context, 20580);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    consumeOpt(parser, context | 32768, 1074790417);
    return finishNode(parser, context, start, line, column, {
        type: 'DoWhileStatement',
        body,
        test
    });
}
function parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context);
    if (parser.token & (143360 | 2097152)) {
        const declarations = parseVariableDeclarationList(parser, context, scope, 8, 0);
        matchOrInsertSemicolon(parser, context | 32768);
        return finishNode(parser, context, start, line, column, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations
        });
    }
    parser.assignable = 1;
    if (context & 1024)
        report(parser, 83);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
    }
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    else {
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
        expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    }
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseLexicalDeclaration(parser, context, scope, kind, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: kind & 8 ? 'let' : 'const',
        declarations
    });
}
function parseVariableStatement(parser, context, scope, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, 4, origin);
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations
    });
}
function parseVariableDeclarationList(parser, context, scope, kind, origin) {
    let bindingCount = 1;
    const list = [parseVariableDeclaration(parser, context, scope, kind, origin)];
    while (consumeOpt(parser, context, 18)) {
        bindingCount++;
        list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
    }
    if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
        report(parser, 59, KeywordDescTable[parser.token & 255]);
    }
    return list;
}
function parseVariableDeclaration(parser, context, scope, kind, origin) {
    const { token, tokenPos, linePos, colPos } = parser;
    let init = null;
    const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        init = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
        if (origin & 32 || (token & 2097152) === 0) {
            if (parser.token === 274549 ||
                (parser.token === 8738868 &&
                    (token & 2097152 || (kind & 4) === 0 || context & 1024))) {
                reportMessageAt(tokenPos, parser.line, parser.index - 3, 58, parser.token === 274549 ? 'of' : 'in');
            }
        }
    }
    else if ((kind & 16 || (token & 2097152) > 0) &&
        (parser.token & 262144) !== 262144) {
        report(parser, 57, kind & 16 ? 'const' : 'destructuring');
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'VariableDeclarator',
        id,
        init
    });
}
function parseForStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    const forAwait = ((context & 4194304) > 0 || ((context & 2048) > 0 && (context & 8192) > 0)) &&
        consumeOpt(parser, context, 209008);
    consume(parser, context | 32768, 67174411);
    if (scope)
        scope = addChildScope(scope, 1);
    let test = null;
    let update = null;
    let destructible = 0;
    let init = null;
    let isVarDecl = parser.token === 86090 || parser.token === 241739 || parser.token === 86092;
    let right;
    const { token, tokenPos, linePos, colPos } = parser;
    if (isVarDecl) {
        if (token === 241739) {
            init = parseIdentifier(parser, context);
            if (parser.token & (143360 | 2097152)) {
                if (parser.token === 8738868) {
                    if (context & 1024)
                        report(parser, 65);
                }
                else {
                    init = finishNode(parser, context, tokenPos, linePos, colPos, {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 8, 32)
                    });
                }
                parser.assignable = 1;
            }
            else if (context & 1024) {
                report(parser, 65);
            }
            else {
                isVarDecl = false;
                parser.assignable = 1;
                init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);
                if (parser.token === 274549)
                    report(parser, 112);
            }
        }
        else {
            nextToken(parser, context);
            init = finishNode(parser, context, tokenPos, linePos, colPos, token === 86090
                ? {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 4, 32)
                }
                : {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 16, 32)
                });
            parser.assignable = 1;
        }
    }
    else if (token === 1074790417) {
        if (forAwait)
            report(parser, 80);
    }
    else if ((token & 2097152) === 2097152) {
        init =
            token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos);
        destructible = parser.destructible;
        if (context & 256 && destructible & 64) {
            report(parser, 61);
        }
        parser.assignable =
            destructible & 16 ? 2 : 1;
        init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, 1, tokenPos, linePos, colPos);
    }
    if ((parser.token & 262144) === 262144) {
        if (parser.token === 274549) {
            if (parser.assignable & 2)
                report(parser, 78, forAwait ? 'await' : 'of');
            reinterpretToPattern(parser, init);
            nextToken(parser, context | 32768);
            right = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
            consume(parser, context | 32768, 16);
            const body = parseIterationStatementBody(parser, context, scope, labels);
            return finishNode(parser, context, start, line, column, {
                type: 'ForOfStatement',
                left: init,
                right,
                body,
                await: forAwait
            });
        }
        if (parser.assignable & 2)
            report(parser, 78, 'in');
        reinterpretToPattern(parser, init);
        nextToken(parser, context | 32768);
        if (forAwait)
            report(parser, 80);
        right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        consume(parser, context | 32768, 16);
        const body = parseIterationStatementBody(parser, context, scope, labels);
        return finishNode(parser, context, start, line, column, {
            type: 'ForInStatement',
            body,
            left: init,
            right
        });
    }
    if (forAwait)
        report(parser, 80);
    if (!isVarDecl) {
        if (destructible & 8 && parser.token !== 1077936157) {
            report(parser, 78, 'loop');
        }
        init = parseAssignmentExpression(parser, context | 134217728, 0, 0, tokenPos, linePos, colPos, init);
    }
    if (parser.token === 18)
        init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 1074790417)
        test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1074790417);
    if (parser.token !== 16)
        update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 16);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'ForStatement',
        init,
        test,
        update,
        body
    });
}
function parseRestrictedIdentifier(parser, context, scope) {
    if (!isValidIdentifier(context, parser.token))
        report(parser, 115);
    if ((parser.token & 537079808) === 537079808)
        report(parser, 116);
    if (scope)
        addBlockName(parser, context, scope, parser.tokenValue, 8, 0);
    return parseIdentifier(parser, context);
}
function parseImportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context);
    let source = null;
    const { tokenPos, linePos, colPos } = parser;
    let specifiers = [];
    if (parser.token === 134283267) {
        source = parseLiteral(parser, context);
    }
    else {
        if (parser.token & 143360) {
            const local = parseRestrictedIdentifier(parser, context, scope);
            specifiers = [
                finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ImportDefaultSpecifier',
                    local
                })
            ];
            if (consumeOpt(parser, context, 18)) {
                switch (parser.token) {
                    case 8457014:
                        specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
                        break;
                    case 2162700:
                        parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                        break;
                    default:
                        report(parser, 105);
                }
            }
        }
        else {
            switch (parser.token) {
                case 8457014:
                    specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
                    break;
                case 2162700:
                    parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                    break;
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                case 67108877:
                    return parseImportMetaDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
        }
        source = parseModuleSpecifier(parser, context);
    }
    matchOrInsertSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportDeclaration',
        specifiers,
        source
    });
}
function parseImportNamespaceSpecifier(parser, context, scope) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    consume(parser, context, 77934);
    if ((parser.token & 134217728) === 134217728) {
        reportMessageAt(tokenPos, parser.line, parser.index, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ImportNamespaceSpecifier',
        local: parseRestrictedIdentifier(parser, context, scope)
    });
}
function parseModuleSpecifier(parser, context) {
    if (!consumeOpt(parser, context, 12404)) {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    if (parser.token !== 134283267)
        report(parser, 103, 'Import');
    return parseLiteral(parser, context);
}
function parseImportSpecifierOrNamedImports(parser, context, scope, specifiers) {
    nextToken(parser, context);
    while (parser.token & 143360) {
        let { token, tokenValue, tokenPos, linePos, colPos } = parser;
        const imported = parseIdentifier(parser, context);
        let local;
        if (consumeOpt(parser, context, 77934)) {
            if ((parser.token & 134217728) === 134217728 || parser.token === 18) {
                report(parser, 104);
            }
            else {
                validateBindingIdentifier(parser, context, 16, parser.token, 0);
            }
            tokenValue = parser.tokenValue;
            local = parseIdentifier(parser, context);
        }
        else {
            validateBindingIdentifier(parser, context, 16, token, 0);
            local = imported;
        }
        if (scope)
            addBlockName(parser, context, scope, tokenValue, 8, 0);
        specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'ImportSpecifier',
            local,
            imported
        }));
        if (parser.token !== 1074790415)
            consume(parser, context, 18);
    }
    consume(parser, context, 1074790415);
    return specifiers;
}
function parseImportMetaDeclaration(parser, context, start, line, column) {
    let expr = parseImportMetaExpression(parser, context, finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: 'import'
    }), start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseImportCallDeclaration(parser, context, start, line, column) {
    let expr = parseImportExpression(parser, context, 0, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    if (parser.token === 18) {
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseExportDeclaration(parser, context, scope) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;
    nextToken(parser, context | 32768);
    const specifiers = [];
    let declaration = null;
    let source = null;
    let key;
    if (consumeOpt(parser, context | 32768, 20563)) {
        switch (parser.token) {
            case 86106: {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            }
            case 133:
            case 86096:
                declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenPos, parser.linePos, parser.colPos);
                break;
            case 209007:
                const { tokenPos, linePos, colPos } = parser;
                declaration = parseIdentifier(parser, context);
                const { flags } = parser;
                if ((flags & 1) === 0) {
                    if (parser.token === 86106) {
                        declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 1, tokenPos, linePos, colPos);
                    }
                    else {
                        if (parser.token === 67174411) {
                            declaration = parseAsyncArrowOrCallExpression(parser, context, declaration, 1, 1, 0, flags, tokenPos, linePos, colPos);
                            declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, tokenPos, linePos, colPos);
                            declaration = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, declaration);
                        }
                        else if (parser.token & 143360) {
                            if (scope)
                                scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);
                            declaration = parseIdentifier(parser, context);
                            declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, tokenPos, linePos, colPos);
                        }
                    }
                }
                break;
            default:
                declaration = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
                matchOrInsertSemicolon(parser, context | 32768);
        }
        if (scope)
            declareUnboundVariable(parser, 'default');
        return finishNode(parser, context, start, line, column, {
            type: 'ExportDefaultDeclaration',
            declaration
        });
    }
    switch (parser.token) {
        case 8457014: {
            nextToken(parser, context);
            let exported = null;
            const isNamedDeclaration = consumeOpt(parser, context, 77934);
            if (isNamedDeclaration) {
                if (scope)
                    declareUnboundVariable(parser, parser.tokenValue);
                exported = parseIdentifier(parser, context);
            }
            consume(parser, context, 12404);
            if (parser.token !== 134283267)
                report(parser, 103, 'Export');
            source = parseLiteral(parser, context);
            matchOrInsertSemicolon(parser, context | 32768);
            return finishNode(parser, context, start, line, column, {
                type: 'ExportAllDeclaration',
                source,
                exported
            });
        }
        case 2162700: {
            nextToken(parser, context);
            const tmpExportedNames = [];
            const tmpExportedBindings = [];
            while (parser.token & 143360) {
                const { tokenPos, tokenValue, linePos, colPos } = parser;
                const local = parseIdentifier(parser, context);
                let exported;
                if (parser.token === 77934) {
                    nextToken(parser, context);
                    if ((parser.token & 134217728) === 134217728) {
                        report(parser, 104);
                    }
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(tokenValue);
                    }
                    exported = parseIdentifier(parser, context);
                }
                else {
                    if (scope) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(parser.tokenValue);
                    }
                    exported = local;
                }
                specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                    type: 'ExportSpecifier',
                    local,
                    exported
                }));
                if (parser.token !== 1074790415)
                    consume(parser, context, 18);
            }
            consume(parser, context, 1074790415);
            if (consumeOpt(parser, context, 12404)) {
                if (parser.token !== 134283267)
                    report(parser, 103, 'Export');
                source = parseLiteral(parser, context);
            }
            else if (scope) {
                let i = 0;
                let iMax = tmpExportedNames.length;
                for (; i < iMax; i++) {
                    declareUnboundVariable(parser, tmpExportedNames[i]);
                }
                i = 0;
                iMax = tmpExportedBindings.length;
                for (; i < iMax; i++) {
                    addBindingToExports(parser, tmpExportedBindings[i]);
                }
            }
            matchOrInsertSemicolon(parser, context | 32768);
            break;
        }
        case 86096:
            declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86106:
            declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 0, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 241739:
            declaration = parseLexicalDeclaration(parser, context, scope, 8, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86092:
            declaration = parseLexicalDeclaration(parser, context, scope, 16, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 86090:
            declaration = parseVariableStatement(parser, context, scope, 64, parser.tokenPos, parser.linePos, parser.colPos);
            break;
        case 209007:
            const { tokenPos, linePos, colPos } = parser;
            nextToken(parser, context);
            if ((parser.flags & 1) === 0 && parser.token === 86106) {
                declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 1, tokenPos, linePos, colPos);
                if (scope) {
                    key = declaration.id ? declaration.id.name : '';
                    declareUnboundVariable(parser, key);
                }
                break;
            }
        default:
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'ExportNamedDeclaration',
        declaration,
        specifiers,
        source
    });
}
function parseExpression(parser, context, canAssign, inGroup, start, line, column) {
    let expr = parsePrimaryExpression(parser, context, 2, 0, canAssign, inGroup, 1, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
    return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
}
function parseSequenceExpression(parser, context, inGroup, start, line, column, expr) {
    const expressions = [expr];
    while (consumeOpt(parser, context | 32768, 18)) {
        expressions.push(parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return finishNode(parser, context, start, line, column, {
        type: 'SequenceExpression',
        expressions
    });
}
function parseExpressions(parser, context, inGroup, canAssign, start, line, column) {
    const expr = parseExpression(parser, context, canAssign, inGroup, start, line, column);
    return parser.token === 18
        ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
        : expr;
}
function parseAssignmentExpression(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    if ((token & 4194304) === 4194304) {
        if (parser.assignable & 2)
            report(parser, 24);
        if ((!isPattern && token === 1077936157 && left.type === 'ArrayExpression') ||
            left.type === 'ObjectExpression') {
            reinterpretToPattern(parser, left);
        }
        nextToken(parser, context | 32768);
        const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, isPattern
            ? {
                type: 'AssignmentPattern',
                left,
                right
            }
            : {
                type: 'AssignmentExpression',
                left,
                operator: KeywordDescTable[token & 255],
                right
            });
    }
    if ((token & 8454144) === 8454144) {
        left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
    }
    if (consumeOpt(parser, context | 32768, 22)) {
        left = parseConditionalExpression(parser, context, left, start, line, column);
    }
    return left;
}
function parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, start, line, column, left) {
    const { token } = parser;
    nextToken(parser, context | 32768);
    const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    left = finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left,
            right
        }
        : {
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[token & 255],
            right
        });
    parser.assignable = 2;
    return left;
}
function parseConditionalExpression(parser, context, test, start, line, column) {
    const consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 21);
    parser.assignable = 1;
    const alternate = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    });
}
function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, operator, left) {
    const bit = -((context & 134217728) > 0) & 8738868;
    let t;
    let prec;
    parser.assignable = 2;
    while (parser.token & 8454144) {
        t = parser.token;
        prec = t & 3840;
        if ((t & 524288 && operator & 268435456) || (operator & 524288 && t & 268435456)) {
            report(parser, 160);
        }
        if (prec + ((t === 8457273) << 8) - ((bit === t) << 12) <= minPrec)
            break;
        nextToken(parser, context | 32768);
        left = finishNode(parser, context, start, line, column, {
            type: t & 524288 || t & 268435456 ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, inGroup, parser.tokenPos, parser.linePos, parser.colPos, prec, t, parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)),
            operator: KeywordDescTable[t & 255]
        });
    }
    if (parser.token === 1077936157)
        report(parser, 24);
    return left;
}
function parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup) {
    if (!isLHS)
        report(parser, 0);
    const unaryOperator = parser.token;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.token === 8457273)
        report(parser, 31);
    if (context & 1024 && unaryOperator === 16863278) {
        if (arg.type === 'Identifier') {
            report(parser, 118);
        }
        else if (isPropertyWithPrivateFieldKey(arg)) {
            report(parser, 124);
        }
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UnaryExpression',
        operator: KeywordDescTable[unaryOperator & 255],
        argument: arg,
        prefix: true
    });
}
function parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, inNew, start, line, column) {
    const { token } = parser;
    const expr = parseIdentifier(parser, context);
    const { flags } = parser;
    if ((flags & 1) === 0) {
        if (parser.token === 86106) {
            return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            if (!isLHS)
                report(parser, 0);
            return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
        }
    }
    if (!inNew && parser.token === 67174411) {
        return parseAsyncArrowOrCallExpression(parser, context, expr, canAssign, 1, 0, flags, start, line, column);
    }
    if (parser.token === 10) {
        classifyIdentifier(parser, context, token);
        if (inNew)
            report(parser, 49);
        return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
    }
    parser.assignable = 1;
    return expr;
}
function parseYieldExpression(parser, context, inGroup, canAssign, start, line, column) {
    if (inGroup)
        parser.destructible |= 256;
    if (context & 2097152) {
        nextToken(parser, context | 32768);
        if (context & 8388608)
            report(parser, 30);
        if (!canAssign)
            report(parser, 24);
        if (parser.token === 22)
            report(parser, 121);
        let argument = null;
        let delegate = false;
        if ((parser.flags & 1) === 0) {
            delegate = consumeOpt(parser, context | 32768, 8457014);
            if (parser.token & (12288 | 65536) || delegate) {
                argument = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
            }
        }
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'YieldExpression',
            argument,
            delegate
        });
    }
    if (context & 1024)
        report(parser, 95, 'yield');
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseAwaitExpression(parser, context, inNew, inGroup, start, line, column) {
    if (inGroup)
        parser.destructible |= 128;
    if (context & 4194304 || (context & 2048 && context & 8192)) {
        if (inNew)
            report(parser, 0);
        if (context & 8388608) {
            reportMessageAt(parser.index, parser.line, parser.index, 29);
        }
        nextToken(parser, context | 32768);
        const argument = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
        if (parser.token === 8457273)
            report(parser, 31);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'AwaitExpression',
            argument
        });
    }
    if (context & 2048)
        report(parser, 96);
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
function parseFunctionBody(parser, context, scope, origin, firstRestricted, scopeError) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    const body = [];
    const prevContext = context;
    if (parser.token !== 1074790415) {
        while (parser.token === 134283267) {
            const { index, tokenPos, tokenValue, token } = parser;
            const expr = parseLiteral(parser, context);
            if (isValidStrictMode(parser, index, tokenPos, tokenValue)) {
                context |= 1024;
                if (parser.flags & 128) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 64);
                }
                if (parser.flags & 64) {
                    reportMessageAt(parser.index, parser.line, parser.tokenPos, 8);
                }
            }
            body.push(parseDirective(parser, context, expr, token, tokenPos, parser.linePos, parser.colPos));
        }
        if (context & 1024) {
            if (firstRestricted) {
                if ((firstRestricted & 537079808) === 537079808) {
                    report(parser, 116);
                }
                if ((firstRestricted & 36864) === 36864) {
                    report(parser, 38);
                }
            }
            if (parser.flags & 512)
                report(parser, 116);
            if (parser.flags & 256)
                report(parser, 115);
        }
        if (context & 64 &&
            scope &&
            scopeError !== void 0 &&
            (prevContext & 1024) === 0 &&
            (context & 8192) === 0) {
            reportScopeError(scopeError);
        }
    }
    parser.flags =
        (parser.flags | 512 | 256 | 64) ^
            (512 | 256 | 64);
    parser.destructible = (parser.destructible | 256) ^ 256;
    while (parser.token !== 1074790415) {
        body.push(parseStatementListItem(parser, context, scope, 4, {}));
    }
    consume(parser, origin & (16 | 8) ? context | 32768 : context, 1074790415);
    parser.flags &= ~(128 | 64);
    if (parser.token === 1077936157)
        report(parser, 24);
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'BlockStatement',
        body
    });
}
function parseSuperExpression(parser, context, start, line, column) {
    nextToken(parser, context);
    switch (parser.token) {
        case 67108991:
            report(parser, 162);
        case 67174411: {
            if ((context & 524288) === 0)
                report(parser, 26);
            if (context & 16384 && !(context & 33554432)) {
                report(parser, 27);
            }
            parser.assignable = 2;
            break;
        }
        case 69271571:
        case 67108877: {
            if ((context & 262144) === 0)
                report(parser, 27);
            if (context & 16384 && !(context & 33554432)) {
                report(parser, 27);
            }
            parser.assignable = 1;
            break;
        }
        default:
            report(parser, 28, 'super');
    }
    return finishNode(parser, context, start, line, column, { type: 'Super' });
}
function parseLeftHandSideExpression(parser, context, canAssign, inGroup, isLHS, start, line, column) {
    const expression = parsePrimaryExpression(parser, context, 2, 0, canAssign, inGroup, isLHS, start, line, column);
    return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
}
function parseUpdateExpression(parser, context, expr, start, line, column) {
    if (parser.assignable & 2)
        report(parser, 53);
    const { token } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: expr,
        operator: KeywordDescTable[token & 255],
        prefix: false
    });
}
function parseMemberOrUpdateExpression(parser, context, expr, inGroup, inChain, start, line, column) {
    if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) === 0) {
        expr = parseUpdateExpression(parser, context, expr, start, line, column);
    }
    else if ((parser.token & 67108864) === 67108864) {
        context = (context | 134217728) ^ 134217728;
        switch (parser.token) {
            case 67108877: {
                nextToken(parser, (context | 268435456 | 8192) ^ 8192);
                if (context & 16384 && parser.token === 131 && parser.tokenValue === 'super') {
                    report(parser, 27);
                }
                parser.assignable = 1;
                const property = parsePropertyOrPrivatePropertyName(parser, context | 65536);
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: false,
                    property
                });
                break;
            }
            case 69271571: {
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                nextToken(parser, context | 32768);
                const { tokenPos, linePos, colPos } = parser;
                const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
                consume(parser, context, 20);
                parser.assignable = 1;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'MemberExpression',
                    object: expr,
                    computed: true,
                    property
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67174411: {
                if ((parser.flags & 1024) === 1024) {
                    parser.flags = (parser.flags | 1024) ^ 1024;
                    return expr;
                }
                let restoreHasOptionalChaining = false;
                if ((parser.flags & 2048) === 2048) {
                    restoreHasOptionalChaining = true;
                    parser.flags = (parser.flags | 2048) ^ 2048;
                }
                const args = parseArguments(parser, context, inGroup);
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'CallExpression',
                    callee: expr,
                    arguments: args
                });
                if (restoreHasOptionalChaining) {
                    parser.flags |= 2048;
                }
                break;
            }
            case 67108991: {
                nextToken(parser, (context | 268435456 | 8192) ^ 8192);
                parser.flags |= 2048;
                parser.assignable = 2;
                expr = parseOptionalChain(parser, context, expr, start, line, column);
                break;
            }
            default:
                if ((parser.flags & 2048) === 2048) {
                    report(parser, 161);
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, start, line, column, {
                    type: 'TaggedTemplateExpression',
                    tag: expr,
                    quasi: parser.token === 67174408
                        ? parseTemplate(parser, context | 65536)
                        : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
                });
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
    }
    if (inChain === 0 && (parser.flags & 2048) === 2048) {
        parser.flags = (parser.flags | 2048) ^ 2048;
        expr = finishNode(parser, context, start, line, column, {
            type: 'ChainExpression',
            expression: expr
        });
    }
    return expr;
}
function parseOptionalChain(parser, context, expr, start, line, column) {
    let restoreHasOptionalChaining = false;
    let node;
    if (parser.token === 69271571 || parser.token === 67174411) {
        if ((parser.flags & 2048) === 2048) {
            restoreHasOptionalChaining = true;
            parser.flags = (parser.flags | 2048) ^ 2048;
        }
    }
    if (parser.token === 69271571) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        const property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
        consume(parser, context, 20);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            optional: true,
            property
        });
    }
    else if (parser.token === 67174411) {
        const args = parseArguments(parser, context, 0);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee: expr,
            arguments: args,
            optional: true
        });
    }
    else {
        if ((parser.token & (143360 | 4096)) === 0)
            report(parser, 155);
        const property = parseIdentifier(parser, context);
        parser.assignable = 2;
        node = finishNode(parser, context, start, line, column, {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            optional: true,
            property
        });
    }
    if (restoreHasOptionalChaining) {
        parser.flags |= 2048;
    }
    return node;
}
function parsePropertyOrPrivatePropertyName(parser, context) {
    if ((parser.token & (143360 | 4096)) === 0 && parser.token !== 131) {
        report(parser, 155);
    }
    return context & 1 && parser.token === 131
        ? parsePrivateIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
        : parseIdentifier(parser, context);
}
function parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column) {
    if (inNew)
        report(parser, 54);
    if (!isLHS)
        report(parser, 0);
    const { token } = parser;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    if (parser.assignable & 2) {
        report(parser, 53);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UpdateExpression',
        argument: arg,
        operator: KeywordDescTable[token & 255],
        prefix: true
    });
}
function parsePrimaryExpression(parser, context, kind, inNew, canAssign, inGroup, isLHS, start, line, column) {
    if ((parser.token & 143360) === 143360) {
        switch (parser.token) {
            case 209008:
                return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
            case 241773:
                return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
            case 209007:
                return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, inNew, start, line, column);
        }
        const { token, tokenValue } = parser;
        const expr = parseIdentifier(parser, context | 65536);
        if (parser.token === 10) {
            if (!isLHS)
                report(parser, 0);
            classifyIdentifier(parser, context, token);
            return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
        }
        if (context & 16384 && token === 537079928)
            report(parser, 127);
        if (token === 241739) {
            if (context & 1024)
                report(parser, 110);
            if (kind & (8 | 16))
                report(parser, 98);
        }
        parser.assignable =
            context & 1024 && (token & 537079808) === 537079808
                ? 2
                : 1;
        return expr;
    }
    if ((parser.token & 134217728) === 134217728) {
        return parseLiteral(parser, context);
    }
    switch (parser.token) {
        case 33619995:
        case 33619996:
            return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
        case 16863278:
        case 16842800:
        case 16842801:
        case 25233970:
        case 25233971:
        case 16863277:
        case 16863279:
            return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
        case 86106:
            return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
        case 2162700:
            return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 69271571:
            return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
        case 67174411:
            return parseParenthesizedExpression(parser, context | 65536, canAssign, 1, 0, start, line, column);
        case 86021:
        case 86022:
        case 86023:
            return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
        case 86113:
            return parseThisExpression(parser, context);
        case 65540:
            return parseRegExpLiteral(parser, context, start, line, column);
        case 133:
        case 86096:
            return parseClassExpression(parser, context, inGroup, start, line, column);
        case 86111:
            return parseSuperExpression(parser, context, start, line, column);
        case 67174409:
            return parseTemplateLiteral(parser, context, start, line, column);
        case 67174408:
            return parseTemplate(parser, context);
        case 86109:
            return parseNewExpression(parser, context, inGroup, start, line, column);
        case 134283389:
            return parseBigIntLiteral(parser, context, start, line, column);
        case 131:
            return parsePrivateIdentifier(parser, context, start, line, column);
        case 86108:
            return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
        case 8456258:
            if (context & 16)
                return parseJSXRootElementOrFragment(parser, context, 1, start, line, column);
        default:
            if (isValidIdentifier(context, parser.token))
                return parseIdentifierOrArrow(parser, context, start, line, column);
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
}
function parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column) {
    let expr = parseIdentifier(parser, context);
    if (parser.token === 67108877) {
        return parseImportMetaExpression(parser, context, expr, start, line, column);
    }
    if (inNew)
        report(parser, 138);
    expr = parseImportExpression(parser, context, inGroup, start, line, column);
    parser.assignable = 2;
    return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
}
function parseImportMetaExpression(parser, context, meta, start, line, column) {
    if ((context & 2048) === 0)
        report(parser, 164);
    nextToken(parser, context);
    if (parser.token !== 143495 && parser.tokenValue !== 'meta')
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property: parseIdentifier(parser, context)
    });
}
function parseImportExpression(parser, context, inGroup, start, line, column) {
    consume(parser, context | 32768, 67174411);
    if (parser.token === 14)
        report(parser, 139);
    const source = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 16);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportExpression',
        source
    });
}
function parseBigIntLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1),
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue,
            bigint: tokenRaw.slice(0, -1)
        });
}
function parseTemplateLiteral(parser, context, start, line, column) {
    parser.assignable = 2;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context, 67174409);
    const quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateLiteral',
        expressions: [],
        quasis
    });
}
function parseTemplate(parser, context) {
    context = (context | 134217728) ^ 134217728;
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 67174408);
    const quasis = [
        parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false)
    ];
    const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];
    if (parser.token !== 1074790415)
        report(parser, 81);
    while ((parser.token = scanTemplateTail(parser, context)) !== 67174409) {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context | 32768, 67174408);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false));
        expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
        if (parser.token !== 1074790415)
            report(parser, 81);
    }
    {
        const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
        consume(parser, context, 67174409);
        quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true));
    }
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'TemplateLiteral',
        expressions,
        quasis
    });
}
function parseTemplateElement(parser, context, cooked, raw, start, line, col, tail) {
    const node = finishNode(parser, context, start, line, col, {
        type: 'TemplateElement',
        value: {
            cooked,
            raw
        },
        tail
    });
    const tailSize = tail ? 1 : 2;
    if (context & 2) {
        node.start += 1;
        node.range[0] += 1;
        node.end -= tailSize;
        node.range[1] -= tailSize;
    }
    if (context & 4) {
        node.loc.start.column += 1;
        node.loc.end.column -= tailSize;
    }
    return node;
}
function parseSpreadElement(parser, context, start, line, column) {
    context = (context | 134217728) ^ 134217728;
    consume(parser, context | 32768, 14);
    const argument = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    parser.assignable = 1;
    return finishNode(parser, context, start, line, column, {
        type: 'SpreadElement',
        argument
    });
}
function parseArguments(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const args = [];
    if (parser.token === 16) {
        nextToken(parser, context | 65536);
        return args;
    }
    while (parser.token !== 16) {
        if (parser.token === 14) {
            args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
        else {
            args.push(parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
        }
        if (parser.token !== 18)
            break;
        nextToken(parser, context | 32768);
        if (parser.token === 16)
            break;
    }
    consume(parser, context, 16);
    return args;
}
function parseIdentifier(parser, context) {
    const { tokenValue, tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'Identifier',
        name: tokenValue
    });
}
function parseLiteral(parser, context) {
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    if (parser.token === 134283389) {
        return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
    }
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue
        });
}
function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
    const raw = KeywordDescTable[parser.token & 255];
    const value = parser.token === 86023 ? null : raw === 'true';
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value,
            raw
        }
        : {
            type: 'Literal',
            value
        });
}
function parseThisExpression(parser, context) {
    const { tokenPos, linePos, colPos } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ThisExpression'
    });
}
function parseFunctionDeclaration(parser, context, scope, origin, allowGen, flags, isAsync, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = allowGen ? optionalBit(parser, context, 8457014) : 0;
    let id = null;
    let firstRestricted;
    let functionScope = scope ? createScope() : void 0;
    if (parser.token === 67174411) {
        if ((flags & 1) === 0)
            report(parser, 37, 'Function');
    }
    else {
        const kind = origin & 4 && ((context & 8192) === 0 || (context & 2048) === 0)
            ? 4
            : 64;
        validateFunctionName(parser, context | ((context & 3072) << 11), parser.token);
        if (scope) {
            if (kind & 4) {
                addVarName(parser, context, scope, parser.tokenValue, kind);
            }
            else {
                addBlockName(parser, context, scope, parser.tokenValue, kind, origin);
            }
            functionScope = addChildScope(functionScope, 256);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, parser.tokenValue);
                }
            }
        }
        firstRestricted = parser.token;
        if (parser.token & 143360) {
            id = parseIdentifier(parser, context);
        }
        else {
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        }
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            ((isAsync * 2 + isGenerator) << 21) |
            (isGenerator ? 0 : 268435456);
    if (scope)
        functionScope = addChildScope(functionScope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, functionScope, 0, 1);
    const body = parseFunctionBody(parser, (context | 8192 | 4096 | 131072) ^
        (8192 | 4096 | 131072), scope ? addChildScope(functionScope, 128) : functionScope, 8, firstRestricted, scope ? functionScope.scopeError : void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionDeclaration',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = optionalBit(parser, context, 8457014);
    const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
    let id = null;
    let firstRestricted;
    let scope = context & 64 ? createScope() : void 0;
    if ((parser.token & (143360 | 4096 | 36864)) > 0) {
        validateFunctionName(parser, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, parser.token);
        if (scope)
            scope = addChildScope(scope, 256);
        firstRestricted = parser.token;
        id = parseIdentifier(parser, context);
    }
    context =
        ((context | 32243712) ^ 32243712) |
            67108864 |
            generatorAndAsyncFlags |
            (isGenerator ? 0 : 268435456);
    if (scope)
        scope = addChildScope(scope, 512);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 1);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384), scope ? addChildScope(scope, 128) : scope, 0, firstRestricted, void 0);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        id,
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1
    });
}
function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseArrayExpressionOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 61);
    }
    if (parser.destructible & 8) {
        report(parser, 60);
    }
    return expr;
}
function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context | 32768);
    const elements = [];
    let destructible = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 20) {
        if (consumeOpt(parser, context | 32768, 18)) {
            elements.push(null);
        }
        else {
            let left;
            const { token, tokenPos, linePos, colPos, tokenValue } = parser;
            if (token & 143360) {
                left = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);
                if (parser.token === 1077936157) {
                    if (parser.assignable & 2)
                        report(parser, 24);
                    nextToken(parser, context | 32768);
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    left = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                        ? {
                            type: 'AssignmentPattern',
                            left,
                            right
                        }
                        : {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left,
                            right
                        });
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                    else if (scope) {
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    }
                    destructible |=
                        parser.destructible & 256
                            ? 256
                            : 0 | (parser.destructible & 128)
                                ? 128
                                : 0;
                }
                else {
                    destructible |=
                        kind & 1
                            ? 32
                            : (kind & 2) === 0
                                ? 16
                                : 0;
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    if (parser.token !== 18 && parser.token !== 20) {
                        if (parser.token !== 1077936157)
                            destructible |= 16;
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token & 2097152) {
                left =
                    parser.token === 2162700
                        ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                        : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                parser.assignable =
                    parser.destructible & 16
                        ? 2
                        : 1;
                if (parser.token === 18 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                }
                else if (parser.destructible & 8) {
                    report(parser, 69);
                }
                else {
                    left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                    destructible = parser.assignable & 2 ? 16 : 0;
                    if (parser.token !== 18 && parser.token !== 20) {
                        left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    }
                    else if (parser.token !== 1077936157) {
                        destructible |=
                            parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 20, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos);
                destructible |= parser.destructible;
                if (parser.token !== 18 && parser.token !== 20)
                    report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            else {
                left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                if (parser.token !== 18 && parser.token !== 20) {
                    left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                    if ((kind & (2 | 1)) === 0 && token === 67174411)
                        destructible |= 16;
                }
                else if (parser.assignable & 2) {
                    destructible |= 16;
                }
                else if (token === 67174411) {
                    destructible |=
                        parser.assignable & 1 && kind & (2 | 1)
                            ? 32
                            : 16;
                }
            }
            elements.push(left);
            if (consumeOpt(parser, context | 32768, 18)) {
                if (parser.token === 20)
                    break;
            }
            else
                break;
        }
    }
    consume(parser, context, 20);
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
        elements
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node) {
    if (parser.token !== 1077936157)
        report(parser, 24);
    nextToken(parser, context | 32768);
    if (destructible & 16)
        report(parser, 24);
    if (!isPattern)
        reinterpretToPattern(parser, node);
    const { tokenPos, linePos, colPos } = parser;
    const right = parseExpression(parser, context, 1, inGroup, tokenPos, linePos, colPos);
    parser.destructible =
        ((destructible | 64 | 8) ^
            (8 | 64)) |
            (parser.destructible & 128 ? 128 : 0) |
            (parser.destructible & 256 ? 256 : 0);
    return finishNode(parser, context, start, line, column, isPattern
        ? {
            type: 'AssignmentPattern',
            left: node,
            right
        }
        : {
            type: 'AssignmentExpression',
            left: node,
            operator: '=',
            right
        });
}
function parseSpreadOrRestElement(parser, context, scope, closingToken, kind, origin, isAsync, inGroup, isPattern, start, line, column) {
    nextToken(parser, context | 32768);
    let argument = null;
    let destructible = 0;
    let { token, tokenValue, tokenPos, linePos, colPos } = parser;
    if (token & (4096 | 143360)) {
        parser.assignable = 1;
        argument = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);
        token = parser.token;
        argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
        if (parser.token !== 18 && parser.token !== closingToken) {
            if (parser.assignable & 2 && parser.token === 1077936157)
                report(parser, 69);
            destructible |= 16;
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
        }
        if (parser.assignable & 2) {
            destructible |= 16;
        }
        else if (token === closingToken || token === 18) {
            if (scope)
                addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
        }
        else {
            destructible |= 32;
        }
        destructible |= parser.destructible & 128 ? 128 : 0;
    }
    else if (token === closingToken) {
        report(parser, 39);
    }
    else if (token & 2097152) {
        argument =
            parser.token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
        token = parser.token;
        if (token !== 1077936157 && token !== closingToken && token !== 18) {
            if (parser.destructible & 8)
                report(parser, 69);
            argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
            destructible |= parser.assignable & 2 ? 16 : 0;
            if ((parser.token & 4194304) === 4194304) {
                if (parser.token !== 1077936157)
                    destructible |= 16;
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            else {
                if ((parser.token & 8454144) === 8454144) {
                    argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    argument = parseConditionalExpression(parser, context, argument, tokenPos, linePos, colPos);
                }
                destructible |=
                    parser.assignable & 2
                        ? 16
                        : 32;
            }
        }
        else {
            destructible |=
                closingToken === 1074790415 && token !== 1077936157
                    ? 16
                    : parser.destructible;
        }
    }
    else {
        destructible |= 32;
        argument = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
        const { token, tokenPos, linePos, colPos } = parser;
        if (token === 1077936157 && token !== closingToken && token !== 18) {
            if (parser.assignable & 2)
                report(parser, 24);
            argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            destructible |= 16;
        }
        else {
            if (token === 18) {
                destructible |= 16;
            }
            else if (token !== closingToken) {
                argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
            }
            destructible |=
                parser.assignable & 1 ? 32 : 16;
        }
        parser.destructible = destructible;
        if (parser.token !== closingToken && parser.token !== 18)
            report(parser, 156);
        return finishNode(parser, context, start, line, column, {
            type: isPattern ? 'RestElement' : 'SpreadElement',
            argument: argument
        });
    }
    if (parser.token !== closingToken) {
        if (kind & 1)
            destructible |= isAsync ? 16 : 32;
        if (consumeOpt(parser, context | 32768, 1077936157)) {
            if (destructible & 16)
                report(parser, 24);
            reinterpretToPattern(parser, argument);
            const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            argument = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                ? {
                    type: 'AssignmentPattern',
                    left: argument,
                    right
                }
                : {
                    type: 'AssignmentExpression',
                    left: argument,
                    operator: '=',
                    right
                });
            destructible = 16;
        }
        else {
            destructible |= 16;
        }
    }
    parser.destructible = destructible;
    return finishNode(parser, context, start, line, column, {
        type: isPattern ? 'RestElement' : 'SpreadElement',
        argument: argument
    });
}
function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
    const modifierFlags = (kind & 64) === 0 ? 31981568 : 14680064;
    context =
        ((context | modifierFlags) ^ modifierFlags) |
            ((kind & 88) << 18) |
            100925440;
    let scope = context & 64 ? addChildScope(createScope(), 512) : void 0;
    const params = parseMethodFormals(parser, context | 8388608, scope, kind, 1, inGroup);
    if (scope)
        scope = addChildScope(scope, 128);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0, void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        params,
        body,
        async: (kind & 16) > 0,
        generator: (kind & 8) > 0,
        id: null
    });
}
function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseObjectLiteralOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 61);
    }
    if (parser.destructible & 8) {
        report(parser, 60);
    }
    return expr;
}
function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
    nextToken(parser, context);
    const properties = [];
    let destructible = 0;
    let prototypeCount = 0;
    context = (context | 134217728) ^ 134217728;
    while (parser.token !== 1074790415) {
        const { token, tokenValue, linePos, colPos, tokenPos } = parser;
        if (token === 14) {
            properties.push(parseSpreadOrRestElement(parser, context, scope, 1074790415, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos));
        }
        else {
            let state = 0;
            let key = null;
            let value;
            const t = parser.token;
            if (parser.token & (143360 | 4096) || parser.token === 121) {
                key = parseIdentifier(parser, context);
                if (parser.token === 18 || parser.token === 1074790415 || parser.token === 1077936157) {
                    state |= 4;
                    if (context & 1024 && (token & 537079808) === 537079808) {
                        destructible |= 16;
                    }
                    else {
                        validateBindingIdentifier(parser, context, kind, token, 0);
                    }
                    if (scope)
                        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                    if (consumeOpt(parser, context | 32768, 1077936157)) {
                        destructible |= 8;
                        const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                        destructible |=
                            parser.destructible & 256
                                ? 256
                                : 0 | (parser.destructible & 128)
                                    ? 128
                                    : 0;
                        value = finishNode(parser, context, tokenPos, linePos, colPos, {
                            type: 'AssignmentPattern',
                            left: context & 536870912 ? Object.assign({}, key) : key,
                            right
                        });
                    }
                    else {
                        destructible |=
                            (token === 209008 ? 128 : 0) |
                                (token === 121 ? 16 : 0);
                        value = context & 536870912 ? Object.assign({}, key) : key;
                    }
                }
                else if (consumeOpt(parser, context | 32768, 21)) {
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        const tokenAfterColon = parser.token;
                        const valueAfterColon = parser.tokenValue;
                        destructible |= t === 121 ? 16 : 0;
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                destructible |= parser.destructible & 128 ? 128 : 0;
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if ((parser.token & 4194304) === 4194304) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                            else if (token !== 1077936157) {
                                destructible |= 32;
                            }
                            else if (scope) {
                                addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                            }
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            if ((parser.token & 8454144) === 8454144) {
                                value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                            }
                            if (consumeOpt(parser, context | 32768, 22)) {
                                value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                            }
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (parser.destructible & 8) {
                            report(parser, 69);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if (parser.token !== 18 && token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    if (token === 209007)
                        state |= 16;
                    state |=
                        (token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1) | 2;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    destructible |= parser.assignable;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token & (143360 | 4096)) {
                    destructible |= 16;
                    if (token === 121)
                        report(parser, 93);
                    if (token === 209007) {
                        if (parser.flags & 1)
                            report(parser, 129);
                        state |= 16;
                    }
                    key = parseIdentifier(parser, context);
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 67174411) {
                    destructible |= 16;
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if (parser.token === 8457014) {
                    destructible |= 16;
                    if (token === 12402) {
                        report(parser, 40);
                    }
                    else if (token === 12403) {
                        report(parser, 41);
                    }
                    else if (token === 143483) {
                        report(parser, 93);
                    }
                    nextToken(parser, context);
                    state |=
                        8 | 1 | (token === 209007 ? 16 : 0);
                    if (parser.token & 143360) {
                        key = parseIdentifier(parser, context);
                    }
                    else if ((parser.token & 134217728) === 134217728) {
                        key = parseLiteral(parser, context);
                    }
                    else if (parser.token === 69271571) {
                        state |= 2;
                        key = parseComputedPropertyName(parser, context, inGroup);
                        destructible |= parser.assignable;
                    }
                    else {
                        report(parser, 28, KeywordDescTable[parser.token & 255]);
                    }
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else if ((parser.token & 134217728) === 134217728) {
                    if (token === 209007)
                        state |= 16;
                    state |=
                        token === 12402
                            ? 256
                            : token === 12403
                                ? 512
                                : 1;
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 130);
                }
            }
            else if ((parser.token & 134217728) === 134217728) {
                key = parseLiteral(parser, context);
                if (parser.token === 21) {
                    consume(parser, context | 32768, 21);
                    const { tokenPos, linePos, colPos } = parser;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);
                        const { token, tokenValue: valueAfterColon } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope) {
                                    addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === 1077936157) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else if ((parser.destructible & 8) !== 8) {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    destructible = parser.assignable | 16;
                }
                else {
                    report(parser, 131);
                }
            }
            else if (parser.token === 69271571) {
                key = parseComputedPropertyName(parser, context, inGroup);
                destructible |= parser.destructible & 256 ? 256 : 0;
                state |= 2;
                if (parser.token === 21) {
                    nextToken(parser, context | 32768);
                    const { tokenPos, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                        if ((parser.token & 4194304) === 4194304) {
                            destructible |=
                                parser.assignable & 2
                                    ? 16
                                    : token === 1077936157
                                        ? 0
                                        : 32;
                            value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                        else if (parser.token === 18 || parser.token === 1074790415) {
                            if (token === 1077936157 || token === 1074790415 || token === 18) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (scope && (tokenAfterColon & 143360) === 143360) {
                                    addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16 ? 2 : 1;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (destructible & 8) {
                            report(parser, 60);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible =
                                parser.assignable & 2 ? destructible | 16 : 0;
                            if ((parser.token & 4194304) === 4194304) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                            else {
                                if ((parser.token & 8454144) === 8454144) {
                                    value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                }
                                if (consumeOpt(parser, context | 32768, 22)) {
                                    value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                }
                                destructible |=
                                    parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === 18 || parser.token === 1074790415) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            if (parser.token !== 18 && parser.token !== 1074790415) {
                                if (parser.token !== 1077936157)
                                    destructible |= 16;
                                value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);
                    destructible = 16;
                }
                else {
                    report(parser, 42);
                }
            }
            else if (token === 8457014) {
                consume(parser, context | 32768, 8457014);
                state |= 8;
                if (parser.token & 143360) {
                    const { token, line, index } = parser;
                    key = parseIdentifier(parser, context);
                    state |= 1;
                    if (parser.token === 67174411) {
                        destructible |= 16;
                        value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                    }
                    else {
                        reportMessageAt(index, line, index, token === 209007
                            ? 44
                            : token === 12402 || parser.token === 12403
                                ? 43
                                : 45, KeywordDescTable[token & 255]);
                    }
                }
                else if ((parser.token & 134217728) === 134217728) {
                    destructible |= 16;
                    key = parseLiteral(parser, context);
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    state |= 2 | 1;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 123);
                }
            }
            else {
                report(parser, 28, KeywordDescTable[token & 255]);
            }
            destructible |= parser.destructible & 128 ? 128 : 0;
            parser.destructible = destructible;
            properties.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'Property',
                key: key,
                value,
                kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
                computed: (state & 2) > 0,
                method: (state & 1) > 0,
                shorthand: (state & 4) > 0
            }));
        }
        destructible |= parser.destructible;
        if (parser.token !== 18)
            break;
        nextToken(parser, context);
    }
    consume(parser, context, 1074790415);
    if (prototypeCount > 1)
        destructible |= 64;
    const node = finishNode(parser, context, start, line, column, {
        type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
        properties
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
    consume(parser, context, 67174411);
    const params = [];
    parser.flags = (parser.flags | 128) ^ 128;
    if (parser.token === 16) {
        if (kind & 512) {
            report(parser, 35, 'Setter', 'one', '');
        }
        nextToken(parser, context);
        return params;
    }
    if (kind & 256) {
        report(parser, 35, 'Getter', 'no', 's');
    }
    if (kind & 512 && parser.token === 14) {
        report(parser, 36);
    }
    context = (context | 134217728) ^ 134217728;
    let setterArgs = 0;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left = null;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, type, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16))
                report(parser, 48);
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left: left,
                right
            });
        }
        setterArgs++;
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (kind & 512 && setterArgs !== 1) {
        report(parser, 35, 'Setter', 'one', '');
    }
    if (scope && scope.scopeError !== void 0)
        reportScopeError(scope.scopeError);
    if (isSimpleParameterList)
        parser.flags |= 128;
    consume(parser, context, 16);
    return params;
}
function parseComputedPropertyName(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 20);
    return key;
}
function parseParenthesizedExpression(parser, context, canAssign, kind, origin, start, line, column) {
    parser.flags = (parser.flags | 128) ^ 128;
    const { tokenPos: piStart, linePos: plStart, colPos: pcStart } = parser;
    nextToken(parser, context | 32768 | 268435456);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
    }
    let destructible = 0;
    parser.destructible &= ~(256 | 128);
    let expr;
    let expressions = [];
    let isSequence = 0;
    let isSimpleParameterList = 0;
    const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;
    parser.assignable = 1;
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, 1, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808 ||
                    (token & 36864) === 36864) {
                    isSimpleParameterList = 1;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if ((token & 2097152) === 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context | 268435456, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context | 268435456, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            parser.assignable = 2;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 119);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 0, 1, 0, tokenPos, linePos, colPos);
            if (parser.destructible & 16)
                report(parser, 72);
            isSimpleParameterList = 1;
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            destructible |= 8;
            break;
        }
        else {
            destructible |= 16;
            expr = parseExpression(parser, context, 1, 1, tokenPos, linePos, colPos);
            if (isSequence && (parser.token === 16 || parser.token === 18)) {
                expressions.push(expr);
            }
            if (parser.token === 18) {
                if (!isSequence) {
                    isSequence = 1;
                    expressions = [expr];
                }
            }
            if (isSequence) {
                while (consumeOpt(parser, context | 32768, 18)) {
                    expressions.push(parseExpression(parser, context, 1, 1, parser.tokenPos, parser.linePos, parser.colPos));
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, iStart, lStart, cStart, {
                    type: 'SequenceExpression',
                    expressions
                });
            }
            consume(parser, context, 16);
            parser.destructible = destructible;
            return expr;
        }
        if (isSequence && (parser.token === 16 || parser.token === 18)) {
            expressions.push(expr);
        }
        if (!consumeOpt(parser, context | 32768, 18))
            break;
        if (!isSequence) {
            isSequence = 1;
            expressions = [expr];
        }
        if (parser.token === 16) {
            destructible |= 8;
            break;
        }
    }
    if (isSequence) {
        parser.assignable = 2;
        expr = finishNode(parser, context, iStart, lStart, cStart, {
            type: 'SequenceExpression',
            expressions
        });
    }
    consume(parser, context, 16);
    if (destructible & 16 && destructible & 8)
        report(parser, 146);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 47);
        if (context & (4194304 | 2048) && destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256) {
            report(parser, 30);
        }
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, isSequence ? expressions : [expr], canAssign, 0, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 140);
    }
    parser.destructible = ((parser.destructible | 256) ^ 256) | destructible;
    return context & 128
        ? finishNode(parser, context, piStart, plStart, pcStart, {
            type: 'ParenthesizedExpression',
            expression: expr
        })
        : expr;
}
function parseIdentifierOrArrow(parser, context, start, line, column) {
    const { tokenValue } = parser;
    const expr = parseIdentifier(parser, context);
    parser.assignable = 1;
    if (parser.token === 10) {
        let scope = void 0;
        if (context & 64)
            scope = createArrowHeadParsingScope(parser, context, tokenValue);
        parser.flags = (parser.flags | 128) ^ 128;
        return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    return expr;
}
function parseArrowFromIdentifier(parser, context, value, expr, inNew, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 55);
    if (inNew)
        report(parser, 49);
    parser.flags &= ~128;
    const scope = context & 64 ? createArrowHeadParsingScope(parser, context, value) : void 0;
    return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
}
function parseParenthesizedArrow(parser, context, scope, params, canAssign, isAsync, start, line, column) {
    if (!canAssign)
        report(parser, 55);
    for (let i = 0; i < params.length; ++i)
        reinterpretToPattern(parser, params[i]);
    return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
}
function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
    if (parser.flags & 1)
        report(parser, 46);
    consume(parser, context | 32768, 10);
    context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
    const expression = parser.token !== 2162700;
    let body;
    if (scope && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    if (expression) {
        body = parseExpression(parser, context & 16384 ? context | 33554432 : context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    }
    else {
        if (scope)
            scope = addChildScope(scope, 128);
        body = parseFunctionBody(parser, (context | 134221824 | 8192 | 16384) ^
            (134221824 | 8192 | 16384), scope, 16, void 0, void 0);
        switch (parser.token) {
            case 69271571:
                if ((parser.flags & 1) === 0) {
                    report(parser, 113);
                }
                break;
            case 67108877:
            case 67174409:
            case 22:
                report(parser, 114);
            case 67174411:
                if ((parser.flags & 1) === 0) {
                    report(parser, 113);
                }
                parser.flags |= 1024;
                break;
        }
        if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) === 0)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
        if ((parser.token & 33619968) === 33619968)
            report(parser, 122);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ArrowFunctionExpression',
        params,
        body,
        async: isAsync === 1,
        expression
    });
}
function parseFormalParametersOrFormalList(parser, context, scope, inGroup, kind) {
    consume(parser, context, 67174411);
    parser.flags = (parser.flags | 128) ^ 128;
    const params = [];
    if (consumeOpt(parser, context, 16))
        return params;
    context = (context | 134217728) ^ 134217728;
    let isSimpleParameterList = 0;
    while (parser.token !== 18) {
        let left;
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0) {
                if ((parser.token & 36864) === 36864) {
                    parser.flags |= 256;
                }
                if ((parser.token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
            }
            left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadOrRestElement(parser, context, scope, 16, kind, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
            }
            else {
                report(parser, 28, KeywordDescTable[parser.token & 255]);
            }
            isSimpleParameterList = 1;
            if (parser.destructible & (32 | 16)) {
                report(parser, 48);
            }
        }
        if (parser.token === 1077936157) {
            nextToken(parser, context | 32768);
            isSimpleParameterList = 1;
            const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenPos, linePos, colPos, {
                type: 'AssignmentPattern',
                left,
                right
            });
        }
        params.push(left);
        if (!consumeOpt(parser, context, 18))
            break;
        if (parser.token === 16) {
            break;
        }
    }
    if (isSimpleParameterList)
        parser.flags |= 128;
    if (scope && (isSimpleParameterList || context & 1024) && scope.scopeError !== void 0) {
        reportScopeError(scope.scopeError);
    }
    consume(parser, context, 16);
    return params;
}
function parseMembeExpressionNoCall(parser, context, expr, inGroup, start, line, column) {
    const { token } = parser;
    if (token & 67108864) {
        if (token === 67108877) {
            nextToken(parser, context | 268435456);
            parser.assignable = 1;
            const property = parsePropertyOrPrivatePropertyName(parser, context);
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: false,
                property
            }), 0, start, line, column);
        }
        else if (token === 69271571) {
            nextToken(parser, context | 32768);
            const { tokenPos, linePos, colPos } = parser;
            const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
            consume(parser, context, 20);
            parser.assignable = 1;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: true,
                property
            }), 0, start, line, column);
        }
        else if (token === 67174408 || token === 67174409) {
            parser.assignable = 2;
            return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                type: 'TaggedTemplateExpression',
                tag: expr,
                quasi: parser.token === 67174408
                    ? parseTemplate(parser, context | 65536)
                    : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
            }), 0, start, line, column);
        }
    }
    return expr;
}
function parseNewExpression(parser, context, inGroup, start, line, column) {
    const id = parseIdentifier(parser, context | 32768);
    const { tokenPos, linePos, colPos } = parser;
    if (consumeOpt(parser, context, 67108877)) {
        if (context & 67108864 && parser.token === 143494) {
            parser.assignable = 2;
            return parseMetaProperty(parser, context, id, start, line, column);
        }
        report(parser, 92);
    }
    parser.assignable = 2;
    if ((parser.token & 16842752) === 16842752) {
        report(parser, 63, KeywordDescTable[parser.token & 255]);
    }
    const expr = parsePrimaryExpression(parser, context, 2, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
    context = (context | 134217728) ^ 134217728;
    if (parser.token === 67108991)
        report(parser, 163);
    const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'NewExpression',
        callee,
        arguments: parser.token === 67174411 ? parseArguments(parser, context, inGroup) : []
    });
}
function parseMetaProperty(parser, context, meta, start, line, column) {
    const property = parseIdentifier(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property
    });
}
function parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column) {
    if (parser.token === 209008)
        report(parser, 29);
    if (context & (1024 | 2097152) && parser.token === 241773) {
        report(parser, 30);
    }
    if ((parser.token & 537079808) === 537079808) {
        parser.flags |= 512;
    }
    return parseArrowFromIdentifier(parser, context, parser.tokenValue, parseIdentifier(parser, context), 0, canAssign, 1, start, line, column);
}
function parseAsyncArrowOrCallExpression(parser, context, callee, canAssign, kind, origin, flags, start, line, column) {
    nextToken(parser, context | 32768);
    const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
    context = (context | 134217728) ^ 134217728;
    if (consumeOpt(parser, context, 16)) {
        if (parser.token === 10) {
            if (flags & 1)
                report(parser, 46);
            return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
        }
        return finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee,
            arguments: []
        });
    }
    let destructible = 0;
    let expr = null;
    let isSimpleParameterList = 0;
    parser.destructible =
        (parser.destructible | 256 | 128) ^
            (256 | 128);
    const params = [];
    while (parser.token !== 16) {
        const { token, tokenPos, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (scope)
                addBlockName(parser, context, scope, parser.tokenValue, kind, 0);
            expr = parsePrimaryExpression(parser, context, kind, 0, 1, 1, 1, tokenPos, linePos, colPos);
            if (parser.token === 16 || parser.token === 18) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isSimpleParameterList = 1;
                }
                else if ((token & 537079808) === 537079808) {
                    parser.flags |= 512;
                }
                else if ((token & 36864) === 36864) {
                    parser.flags |= 256;
                }
            }
            else {
                if (parser.token === 1077936157) {
                    isSimpleParameterList = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                if (parser.token !== 16 && parser.token !== 18) {
                    expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                }
            }
        }
        else if (token & 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
            destructible |= parser.destructible;
            isSimpleParameterList = 1;
            if (parser.token !== 16 && parser.token !== 18) {
                if (destructible & 8)
                    report(parser, 119);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                destructible |= 16;
                if ((parser.token & 8454144) === 8454144) {
                    expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr);
                }
                if (consumeOpt(parser, context | 32768, 22)) {
                    expr = parseConditionalExpression(parser, context, expr, start, line, column);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 1, 1, 0, tokenPos, linePos, colPos);
            destructible |= (parser.token === 16 ? 0 : 16) | parser.destructible;
            isSimpleParameterList = 1;
        }
        else {
            expr = parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos);
            destructible = parser.assignable;
            params.push(expr);
            while (consumeOpt(parser, context | 32768, 18)) {
                params.push(parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos));
            }
            destructible |= parser.assignable;
            consume(parser, context, 16);
            parser.destructible = destructible | 16;
            parser.assignable = 2;
            return finishNode(parser, context, start, line, column, {
                type: 'CallExpression',
                callee,
                arguments: params
            });
        }
        params.push(expr);
        if (!consumeOpt(parser, context | 32768, 18))
            break;
    }
    consume(parser, context, 16);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (destructible & (32 | 16))
            report(parser, 25);
        if (parser.flags & 1 || flags & 1)
            report(parser, 46);
        if (destructible & 128)
            report(parser, 29);
        if (context & (1024 | 2097152) && destructible & 256)
            report(parser, 30);
        if (isSimpleParameterList)
            parser.flags |= 128;
        return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 60);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'CallExpression',
        callee,
        arguments: params
    });
}
function parseRegExpLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenRegExp, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return context & 512
        ? finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp,
            raw: tokenRaw
        })
        : finishNode(parser, context, start, line, column, {
            type: 'Literal',
            value: tokenValue,
            regex: tokenRegExp
        });
}
function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
    context = (context | 16777216 | 1024) ^ 16777216;
    let decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    if (parser.leadingDecorators.length) {
        parser.leadingDecorators.push(...decorators);
        decorators = parser.leadingDecorators;
        parser.leadingDecorators = [];
    }
    nextToken(parser, context);
    let id = null;
    let superClass = null;
    const { tokenValue } = parser;
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token)) {
            report(parser, 115);
        }
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 116);
        }
        if (scope) {
            addBlockName(parser, context, scope, tokenValue, 32, 0);
            if (flags) {
                if (flags & 2) {
                    declareUnboundVariable(parser, tokenValue);
                }
            }
        }
        id = parseIdentifier(parser, context);
    }
    else {
        if ((flags & 1) === 0)
            report(parser, 37, 'Class');
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, scope, 2, 8, 0);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassDeclaration',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassDeclaration',
            id,
            superClass,
            body
        });
}
function parseClassExpression(parser, context, inGroup, start, line, column) {
    let id = null;
    let superClass = null;
    context = (context | 1024 | 16777216) ^ 16777216;
    const decorators = parseDecorators(parser, context);
    if (decorators.length) {
        start = parser.tokenPos;
        line = parser.linePos;
        column = parser.colPos;
    }
    nextToken(parser, context);
    if (parser.token & 4096 && parser.token !== 20567) {
        if (isStrictReservedWord(parser, context, parser.token))
            report(parser, 115);
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 116);
        }
        id = parseIdentifier(parser, context);
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20567)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, 0, parser.tokenPos, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, void 0, 2, 0, inGroup);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'ClassExpression',
            id,
            superClass,
            decorators,
            body
        }
        : {
            type: 'ClassExpression',
            id,
            superClass,
            body
        });
}
function parseDecorators(parser, context) {
    const list = [];
    if (context & 1) {
        while (parser.token === 133) {
            list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
        }
    }
    return list;
}
function parseDecoratorList(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    let expression = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 1, start, line, column);
    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'Decorator',
        expression
    });
}
function parseClassBody(parser, context, inheritedContext, scope, kind, origin, inGroup) {
    const { tokenPos, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    context = (context | 134217728) ^ 134217728;
    let hasConstr = parser.flags & 32;
    parser.flags = (parser.flags | 32) ^ 32;
    const body = [];
    let decorators;
    while (parser.token !== 1074790415) {
        let length = 0;
        decorators = parseDecorators(parser, context);
        length = decorators.length;
        if (length > 0 && parser.tokenValue === 'constructor') {
            report(parser, 107);
        }
        if (parser.token === 1074790415)
            report(parser, 106);
        if (consumeOpt(parser, context, 1074790417)) {
            if (length > 0)
                report(parser, 117);
            continue;
        }
        body.push(parseClassElementList(parser, context, scope, inheritedContext, kind, decorators, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }
    consume(parser, origin & 8 ? context | 32768 : context, 1074790415);
    parser.flags = (parser.flags & ~32) | hasConstr;
    return finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ClassBody',
        body
    });
}
function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
    let kind = isStatic ? 32 : 0;
    let key = null;
    const { token, tokenPos, linePos, colPos } = parser;
    if (token & (143360 | 36864)) {
        key = parseIdentifier(parser, context);
        switch (token) {
            case 36972:
                if (!isStatic &&
                    parser.token !== 67174411 &&
                    (parser.token & 1048576) !== 1048576 &&
                    parser.token !== 1077936157) {
                    return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
                }
                break;
            case 209007:
                if (parser.token !== 67174411 && (parser.flags & 1) === 0) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 16 | (optionalBit(parser, context, 8457014) ? 8 : 0);
                }
                break;
            case 12402:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 256;
                }
                break;
            case 12403:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                    }
                    kind |= 512;
                }
                break;
        }
    }
    else if (token === 69271571) {
        kind |= 2;
        key = parseComputedPropertyName(parser, inheritedContext, inGroup);
    }
    else if ((token & 134217728) === 134217728) {
        key = parseLiteral(parser, context);
    }
    else if (token === 8457014) {
        kind |= 8;
        nextToken(parser, context);
    }
    else if (context & 1 && parser.token === 131) {
        kind |= 4096;
        key = parsePrivateIdentifier(parser, context | 16384, tokenPos, linePos, colPos);
    }
    else if (context & 1 && (parser.token & 1073741824) === 1073741824) {
        kind |= 128;
    }
    else if (isStatic && token === 2162700) {
        return parseStaticBlock(parser, context, scope, tokenPos, linePos, colPos);
    }
    else if (token === 122) {
        key = parseIdentifier(parser, context);
        if (parser.token !== 67174411)
            report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    else {
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    }
    if (kind & (8 | 16 | 768)) {
        if (parser.token & 143360) {
            key = parseIdentifier(parser, context);
        }
        else if ((parser.token & 134217728) === 134217728) {
            key = parseLiteral(parser, context);
        }
        else if (parser.token === 69271571) {
            kind |= 2;
            key = parseComputedPropertyName(parser, context, 0);
        }
        else if (parser.token === 122) {
            key = parseIdentifier(parser, context);
        }
        else if (context & 1 && parser.token === 131) {
            kind |= 4096;
            key = parsePrivateIdentifier(parser, context, tokenPos, linePos, colPos);
        }
        else
            report(parser, 132);
    }
    if ((kind & 2) === 0) {
        if (parser.tokenValue === 'constructor') {
            if ((parser.token & 1073741824) === 1073741824) {
                report(parser, 126);
            }
            else if ((kind & 32) === 0 && parser.token === 67174411) {
                if (kind & (768 | 16 | 128 | 8)) {
                    report(parser, 51, 'accessor');
                }
                else if ((context & 524288) === 0) {
                    if (parser.flags & 32)
                        report(parser, 52);
                    else
                        parser.flags |= 32;
                }
            }
            kind |= 64;
        }
        else if ((kind & 4096) === 0 &&
            kind & (32 | 768 | 8 | 16) &&
            parser.tokenValue === 'prototype') {
            report(parser, 50);
        }
    }
    if (context & 1 && parser.token !== 67174411) {
        return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
    }
    const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            decorators,
            value
        }
        : {
            type: 'MethodDefinition',
            kind: (kind & 32) === 0 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            value
        });
}
function parsePrivateIdentifier(parser, context, start, line, column) {
    nextToken(parser, context);
    const { tokenValue } = parser;
    if (tokenValue === 'constructor')
        report(parser, 125);
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'PrivateIdentifier',
        name: tokenValue
    });
}
function parsePropertyDefinition(parser, context, key, state, decorators, start, line, column) {
    let value = null;
    if (state & 8)
        report(parser, 0);
    if (parser.token === 1077936157) {
        nextToken(parser, context | 32768);
        const { tokenPos, linePos, colPos } = parser;
        if (parser.token === 537079928)
            report(parser, 116);
        const modifierFlags = (state & 64) === 0
            ? 31981568
            : 14680064;
        context =
            ((context | modifierFlags) ^ modifierFlags) |
                ((state & 88) << 18) |
                100925440;
        value = parsePrimaryExpression(parser, context | 16384, 2, 0, 1, 0, 1, tokenPos, linePos, colPos);
        if ((parser.token & 1073741824) !== 1073741824 ||
            (parser.token & 4194304) === 4194304) {
            value = parseMemberOrUpdateExpression(parser, context | 16384, value, 0, 0, tokenPos, linePos, colPos);
            value = parseAssignmentExpression(parser, context | 16384, 0, 0, tokenPos, linePos, colPos, value);
            if (parser.token === 18) {
                value = parseSequenceExpression(parser, context, 0, start, line, column, value);
            }
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'PropertyDefinition',
        key,
        value,
        static: (state & 32) > 0,
        computed: (state & 2) > 0,
        decorators
    });
}
function parseBindingPattern(parser, context, scope, type, origin, start, line, column) {
    if (parser.token & 143360)
        return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);
    if ((parser.token & 2097152) !== 2097152)
        report(parser, 28, KeywordDescTable[parser.token & 255]);
    const left = parser.token === 69271571
        ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column)
        : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);
    if (parser.destructible & 16)
        report(parser, 48);
    if (parser.destructible & 32)
        report(parser, 48);
    return left;
}
function parseAndClassifyIdentifier(parser, context, scope, kind, origin, start, line, column) {
    const { tokenValue, token } = parser;
    if (context & 1024) {
        if ((token & 537079808) === 537079808) {
            report(parser, 116);
        }
        else if ((token & 36864) === 36864) {
            report(parser, 115);
        }
    }
    if ((token & 20480) === 20480) {
        report(parser, 100);
    }
    if (context & (2048 | 2097152) && token === 241773) {
        report(parser, 30);
    }
    if (token === 241739) {
        if (kind & (8 | 16))
            report(parser, 98);
    }
    if (context & (4194304 | 2048) && token === 209008) {
        report(parser, 96);
    }
    nextToken(parser, context);
    if (scope)
        addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
    return finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: tokenValue
    });
}
function parseJSXRootElementOrFragment(parser, context, inJSXChild, start, line, column) {
    nextToken(parser, context);
    if (parser.token === 8456259) {
        return finishNode(parser, context, start, line, column, {
            type: 'JSXFragment',
            openingFragment: parseOpeningFragment(parser, context, start, line, column),
            children: parseJSXChildren(parser, context),
            closingFragment: parseJSXClosingFragment(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos)
        });
    }
    let closingElement = null;
    let children = [];
    const openingElement = parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column);
    if (!openingElement.selfClosing) {
        children = parseJSXChildren(parser, context);
        closingElement = parseJSXClosingElement(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos);
        const close = isEqualTagName(closingElement.name);
        if (isEqualTagName(openingElement.name) !== close)
            report(parser, 150, close);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXElement',
        children,
        openingElement,
        closingElement
    });
}
function parseOpeningFragment(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningFragment'
    });
}
function parseJSXClosingElement(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    const name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        parser.token = scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingElement',
        name
    });
}
function parseJSXClosingFragment(parser, context, inJSXChild, start, line, column) {
    consume(parser, context, 25);
    if (inJSXChild) {
        consume(parser, context, 8456259);
    }
    else {
        consume(parser, context, 8456259);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXClosingFragment'
    });
}
function parseJSXChildren(parser, context) {
    const children = [];
    while (parser.token !== 25) {
        parser.index = parser.tokenPos = parser.startPos;
        parser.column = parser.colPos = parser.startColumn;
        parser.line = parser.linePos = parser.startLine;
        scanJSXToken(parser, context);
        children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return children;
}
function parseJSXChild(parser, context, start, line, column) {
    if (parser.token === 138)
        return parseJSXText(parser, context, start, line, column);
    if (parser.token === 2162700)
        return parseJSXExpressionContainer(parser, context, 0, 0, start, line, column);
    if (parser.token === 8456258)
        return parseJSXRootElementOrFragment(parser, context, 0, start, line, column);
    report(parser, 0);
}
function parseJSXText(parser, context, start, line, column) {
    scanJSXToken(parser, context);
    const node = {
        type: 'JSXText',
        value: parser.tokenValue
    };
    if (context & 512) {
        node.raw = parser.tokenRaw;
    }
    return finishNode(parser, context, start, line, column, node);
}
function parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column) {
    if ((parser.token & 143360) !== 143360 && (parser.token & 4096) !== 4096)
        report(parser, 0);
    const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    const attributes = parseJSXAttributes(parser, context);
    const selfClosing = parser.token === 8457016;
    if (parser.token === 8456259) {
        scanJSXToken(parser, context);
    }
    else {
        consume(parser, context, 8457016);
        if (inJSXChild) {
            consume(parser, context, 8456259);
        }
        else {
            scanJSXToken(parser, context);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXOpeningElement',
        name: tagName,
        attributes,
        selfClosing
    });
}
function parseJSXElementName(parser, context, start, line, column) {
    scanJSXIdentifier(parser);
    let key = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21)
        return parseJSXNamespacedName(parser, context, key, start, line, column);
    while (consumeOpt(parser, context, 67108877)) {
        scanJSXIdentifier(parser);
        key = parseJSXMemberExpression(parser, context, key, start, line, column);
    }
    return key;
}
function parseJSXMemberExpression(parser, context, object, start, line, column) {
    const property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXMemberExpression',
        object,
        property
    });
}
function parseJSXAttributes(parser, context) {
    const attributes = [];
    while (parser.token !== 8457016 && parser.token !== 8456259 && parser.token !== 1048576) {
        attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
    return attributes;
}
function parseJSXSpreadAttribute(parser, context, start, line, column) {
    nextToken(parser, context);
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadAttribute',
        argument: expression
    });
}
function parseJsxAttribute(parser, context, start, line, column) {
    if (parser.token === 2162700)
        return parseJSXSpreadAttribute(parser, context, start, line, column);
    scanJSXIdentifier(parser);
    let value = null;
    let name = parseJSXIdentifier(parser, context, start, line, column);
    if (parser.token === 21) {
        name = parseJSXNamespacedName(parser, context, name, start, line, column);
    }
    if (parser.token === 1077936157) {
        const token = scanJSXAttributeValue(parser, context);
        const { tokenPos, linePos, colPos } = parser;
        switch (token) {
            case 134283267:
                value = parseLiteral(parser, context);
                break;
            case 8456258:
                value = parseJSXRootElementOrFragment(parser, context, 1, tokenPos, linePos, colPos);
                break;
            case 2162700:
                value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
                break;
            default:
                report(parser, 149);
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXAttribute',
        value,
        name
    });
}
function parseJSXNamespacedName(parser, context, namespace, start, line, column) {
    consume(parser, context, 21);
    const name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXNamespacedName',
        namespace,
        name
    });
}
function parseJSXExpressionContainer(parser, context, inJSXChild, isAttr, start, line, column) {
    nextToken(parser, context | 32768);
    const { tokenPos, linePos, colPos } = parser;
    if (parser.token === 14)
        return parseJSXSpreadChild(parser, context, start, line, column);
    let expression = null;
    if (parser.token === 1074790415) {
        if (isAttr)
            report(parser, 152);
        expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
    }
    else {
        expression = parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos);
    }
    if (inJSXChild) {
        consume(parser, context, 1074790415);
    }
    else {
        scanJSXToken(parser, context);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'JSXExpressionContainer',
        expression
    });
}
function parseJSXSpreadChild(parser, context, start, line, column) {
    consume(parser, context, 14);
    const expression = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    consume(parser, context, 1074790415);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXSpreadChild',
        expression
    });
}
function parseJSXEmptyExpression(parser, context, start, line, column) {
    parser.startPos = parser.tokenPos;
    parser.startLine = parser.linePos;
    parser.startColumn = parser.colPos;
    return finishNode(parser, context, start, line, column, {
        type: 'JSXEmptyExpression'
    });
}
function parseJSXIdentifier(parser, context, start, line, column) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'JSXIdentifier',
        name: tokenValue
    });
}

var estree = /*#__PURE__*/Object.freeze({
  __proto__: null
});

var version$1 = "4.5.0";

const version = version$1;
function parseScript(source, options) {
    return parseSource(source, options, 0);
}
function parseModule(source, options) {
    return parseSource(source, options, 1024 | 2048);
}
function parse(source, options) {
    return parseSource(source, options, 0);
}




}),

});
/************************************************************************/
// The module cache
var __webpack_module_cache__ = {};

// The require function
function __webpack_require__(moduleId) {

// Check if module is in cache
var cachedModule = __webpack_module_cache__[moduleId];
if (cachedModule !== undefined) {
return cachedModule.exports;
}
// Create a new module (and put it into the cache)
var module = (__webpack_module_cache__[moduleId] = {
exports: {}
});
// Execute the module function
__webpack_modules__[moduleId](module, module.exports, __webpack_require__);

// Return the exports of the module
return module.exports;

}

/************************************************************************/
// webpack/runtime/async_module
(() => {
var webpackQueues =
	typeof Symbol === "function"
		? Symbol("webpack queues")
		: "__webpack_queues__";
var webpackExports =
	typeof Symbol === "function"
		? Symbol("webpack exports")
		: "__webpack_exports__";
var webpackError =
	typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
var resolveQueue = function (queue) {
	if (queue && queue.d < 1) {
		queue.d = 1;
		queue.forEach(function (fn) { fn.r--; });
		queue.forEach(function (fn) { fn.r-- ? fn.r++ : fn(); });
	}
}
var wrapDeps = function (deps) {
	return deps.map(function (dep) {
		if (dep !== null && typeof dep === "object") {
			if (dep[webpackQueues]) return dep;
			if (dep.then) {
				var queue = [];
				queue.d = 0;
				dep.then(function (r) {
					obj[webpackExports] = r;
					resolveQueue(queue);
				}, function (e) {
					obj[webpackError] = e;
					resolveQueue(queue);
				});
				var obj = {};
				obj[webpackQueues] = function (fn) { fn(queue); };
				return obj;
			}
		}
		var ret = {};
		ret[webpackQueues] = function () { };
		ret[webpackExports] = dep;
		return ret;
	});
};
__webpack_require__.a = function (module, body, hasAwait) {
	var queue;
	hasAwait && ((queue = []).d = -1);
	var depQueues = new Set();
	var exports = module.exports;
	var currentDeps;
	var outerResolve;
	var reject;
	var promise = new Promise(function (resolve, rej) {
		reject = rej;
		outerResolve = resolve;
	});
	promise[webpackExports] = exports;
	promise[webpackQueues] = function (fn) { queue && fn(queue), depQueues.forEach(fn), promise["catch"](function () { }); };
	module.exports = promise;
	body(function (deps) {
		currentDeps = wrapDeps(deps);
		var fn;
		var getResult = function () {
			return currentDeps.map(function (d) {
				if (d[webpackError]) throw d[webpackError];
				return d[webpackExports];
			});
		}
		var promise = new Promise(function (resolve) {
			fn = function () { resolve(getResult); };
			fn.r = 0;
			var fnQueue = function (q) { q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))); };
			currentDeps.map(function (dep) { dep[webpackQueues](fnQueue); });
		});
		return fn.r ? promise : getResult();
	}, function (err) { (err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue); });
	queue && queue.d < 0 && (queue.d = 0);
};
})();
// webpack/runtime/compat_get_default_export
(() => {
// getDefaultExport function for compatibility with non-harmony modules
__webpack_require__.n = function (module) {
	var getter = module && module.__esModule ?
		function () { return module['default']; } :
		function () { return module; };
	__webpack_require__.d(getter, { a: getter });
	return getter;
};




})();
// webpack/runtime/define_property_getters
(() => {
__webpack_require__.d = function(exports, definition) {
	for(var key in definition) {
        if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
    }
};
})();
// webpack/runtime/has_own_property
(() => {
__webpack_require__.o = function (obj, prop) {
	return Object.prototype.hasOwnProperty.call(obj, prop);
};

})();
// webpack/runtime/make_namespace_object
(() => {
// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

})();
/************************************************************************/
// startup
// Load entry module and return exports
// This entry module used 'module' so it can't be inlined
var __webpack_exports__ = __webpack_require__("./src/client/index.ts");
})()
;
//# sourceMappingURL=scramjet.client.js.map