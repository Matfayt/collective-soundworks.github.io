import {
  Directive,
  PartType,
  directive
} from "./chunk-HY4YQS7H.js";
import {
  noChange
} from "./chunk-PE6LRBOZ.js";

// ../../ircam-ismm/sc-components/node_modules/lit-html/development/directives/class-map.js
var ClassMapDirective = class extends Directive {
  constructor(partInfo) {
    var _a;
    super(partInfo);
    if (partInfo.type !== PartType.ATTRIBUTE || partInfo.name !== "class" || ((_a = partInfo.strings) === null || _a === void 0 ? void 0 : _a.length) > 2) {
      throw new Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
  }
  render(classInfo) {
    return " " + Object.keys(classInfo).filter((key) => classInfo[key]).join(" ") + " ";
  }
  update(part, [classInfo]) {
    var _a, _b;
    if (this._previousClasses === void 0) {
      this._previousClasses = /* @__PURE__ */ new Set();
      if (part.strings !== void 0) {
        this._staticClasses = new Set(part.strings.join(" ").split(/\s/).filter((s) => s !== ""));
      }
      for (const name in classInfo) {
        if (classInfo[name] && !((_a = this._staticClasses) === null || _a === void 0 ? void 0 : _a.has(name))) {
          this._previousClasses.add(name);
        }
      }
      return this.render(classInfo);
    }
    const classList = part.element.classList;
    this._previousClasses.forEach((name) => {
      if (!(name in classInfo)) {
        classList.remove(name);
        this._previousClasses.delete(name);
      }
    });
    for (const name in classInfo) {
      const value = !!classInfo[name];
      if (value !== this._previousClasses.has(name) && !((_b = this._staticClasses) === null || _b === void 0 ? void 0 : _b.has(name))) {
        if (value) {
          classList.add(name);
          this._previousClasses.add(name);
        } else {
          classList.remove(name);
          this._previousClasses.delete(name);
        }
      }
    }
    return noChange;
  }
};
var classMap = directive(ClassMapDirective);

export {
  classMap
};
/*! Bundled license information:

lit-html/development/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-WJWTNJAW.js.map
