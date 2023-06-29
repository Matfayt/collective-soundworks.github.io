import {
  Directive,
  PartType,
  directive
} from "./chunk-HY4YQS7H.js";
import {
  noChange,
  nothing
} from "./chunk-PE6LRBOZ.js";

// ../../ircam-ismm/sc-components/node_modules/lit-html/development/directives/unsafe-html.js
var HTML_RESULT = 1;
var UnsafeHTMLDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    this._value = nothing;
    if (partInfo.type !== PartType.CHILD) {
      throw new Error(`${this.constructor.directiveName}() can only be used in child bindings`);
    }
  }
  render(value) {
    if (value === nothing || value == null) {
      this._templateResult = void 0;
      return this._value = value;
    }
    if (value === noChange) {
      return value;
    }
    if (typeof value != "string") {
      throw new Error(`${this.constructor.directiveName}() called with a non-string value`);
    }
    if (value === this._value) {
      return this._templateResult;
    }
    this._value = value;
    const strings = [value];
    strings.raw = strings;
    return this._templateResult = {
      // Cast to a known set of integers that satisfy ResultType so that we
      // don't have to export ResultType and possibly encourage this pattern.
      // This property needs to remain unminified.
      ["_$litType$"]: this.constructor.resultType,
      strings,
      values: []
    };
  }
};
UnsafeHTMLDirective.directiveName = "unsafeHTML";
UnsafeHTMLDirective.resultType = HTML_RESULT;
var unsafeHTML = directive(UnsafeHTMLDirective);

export {
  UnsafeHTMLDirective,
  unsafeHTML
};
/*! Bundled license information:

lit-html/development/directives/unsafe-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-UECXVOBK.js.map
