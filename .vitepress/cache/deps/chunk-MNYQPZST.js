import {
  Directive,
  PartType,
  directive
} from "./chunk-HY4YQS7H.js";
import {
  _$LH,
  noChange
} from "./chunk-PE6LRBOZ.js";

// ../../ircam-ismm/sc-components/node_modules/lit-html/development/directive-helpers.js
var _a;
var _b;
var { _ChildPart: ChildPart } = _$LH;
var ENABLE_SHADYDOM_NOPATCH = true;
var wrap = ENABLE_SHADYDOM_NOPATCH && ((_a = window.ShadyDOM) === null || _a === void 0 ? void 0 : _a.inUse) && ((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.noPatch) === true ? window.ShadyDOM.wrap : (node) => node;
var createMarker = () => document.createComment("");
var insertPart = (containerPart, refPart, part) => {
  var _a2;
  const container = wrap(containerPart._$startNode).parentNode;
  const refNode = refPart === void 0 ? containerPart._$endNode : refPart._$startNode;
  if (part === void 0) {
    const startNode = wrap(container).insertBefore(createMarker(), refNode);
    const endNode = wrap(container).insertBefore(createMarker(), refNode);
    part = new ChildPart(startNode, endNode, containerPart, containerPart.options);
  } else {
    const endNode = wrap(part._$endNode).nextSibling;
    const oldParent = part._$parent;
    const parentChanged = oldParent !== containerPart;
    if (parentChanged) {
      (_a2 = part._$reparentDisconnectables) === null || _a2 === void 0 ? void 0 : _a2.call(part, containerPart);
      part._$parent = containerPart;
      let newConnectionState;
      if (part._$notifyConnectionChanged !== void 0 && (newConnectionState = containerPart._$isConnected) !== oldParent._$isConnected) {
        part._$notifyConnectionChanged(newConnectionState);
      }
    }
    if (endNode !== refNode || parentChanged) {
      let start = part._$startNode;
      while (start !== endNode) {
        const n = wrap(start).nextSibling;
        wrap(container).insertBefore(start, refNode);
        start = n;
      }
    }
  }
  return part;
};
var setChildPartValue = (part, value, directiveParent = part) => {
  part._$setValue(value, directiveParent);
  return part;
};
var RESET_VALUE = {};
var setCommittedValue = (part, value = RESET_VALUE) => part._$committedValue = value;
var getCommittedValue = (part) => part._$committedValue;
var removePart = (part) => {
  var _a2;
  (_a2 = part._$notifyConnectionChanged) === null || _a2 === void 0 ? void 0 : _a2.call(part, false, true);
  let start = part._$startNode;
  const end = wrap(part._$endNode).nextSibling;
  while (start !== end) {
    const n = wrap(start).nextSibling;
    wrap(start).remove();
    start = n;
  }
};

// ../../ircam-ismm/sc-components/node_modules/lit-html/development/directives/repeat.js
var generateMap = (list, start, end) => {
  const map = /* @__PURE__ */ new Map();
  for (let i = start; i <= end; i++) {
    map.set(list[i], i);
  }
  return map;
};
var RepeatDirective = class extends Directive {
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.CHILD) {
      throw new Error("repeat() can only be used in text expressions");
    }
  }
  _getValuesAndKeys(items, keyFnOrTemplate, template) {
    let keyFn;
    if (template === void 0) {
      template = keyFnOrTemplate;
    } else if (keyFnOrTemplate !== void 0) {
      keyFn = keyFnOrTemplate;
    }
    const keys = [];
    const values = [];
    let index = 0;
    for (const item of items) {
      keys[index] = keyFn ? keyFn(item, index) : index;
      values[index] = template(item, index);
      index++;
    }
    return {
      values,
      keys
    };
  }
  render(items, keyFnOrTemplate, template) {
    return this._getValuesAndKeys(items, keyFnOrTemplate, template).values;
  }
  update(containerPart, [items, keyFnOrTemplate, template]) {
    var _a2;
    const oldParts = getCommittedValue(containerPart);
    const { values: newValues, keys: newKeys } = this._getValuesAndKeys(items, keyFnOrTemplate, template);
    if (!Array.isArray(oldParts)) {
      this._itemKeys = newKeys;
      return newValues;
    }
    const oldKeys = (_a2 = this._itemKeys) !== null && _a2 !== void 0 ? _a2 : this._itemKeys = [];
    const newParts = [];
    let newKeyToIndexMap;
    let oldKeyToIndexMap;
    let oldHead = 0;
    let oldTail = oldParts.length - 1;
    let newHead = 0;
    let newTail = newValues.length - 1;
    while (oldHead <= oldTail && newHead <= newTail) {
      if (oldParts[oldHead] === null) {
        oldHead++;
      } else if (oldParts[oldTail] === null) {
        oldTail--;
      } else if (oldKeys[oldHead] === newKeys[newHead]) {
        newParts[newHead] = setChildPartValue(oldParts[oldHead], newValues[newHead]);
        oldHead++;
        newHead++;
      } else if (oldKeys[oldTail] === newKeys[newTail]) {
        newParts[newTail] = setChildPartValue(oldParts[oldTail], newValues[newTail]);
        oldTail--;
        newTail--;
      } else if (oldKeys[oldHead] === newKeys[newTail]) {
        newParts[newTail] = setChildPartValue(oldParts[oldHead], newValues[newTail]);
        insertPart(containerPart, newParts[newTail + 1], oldParts[oldHead]);
        oldHead++;
        newTail--;
      } else if (oldKeys[oldTail] === newKeys[newHead]) {
        newParts[newHead] = setChildPartValue(oldParts[oldTail], newValues[newHead]);
        insertPart(containerPart, oldParts[oldHead], oldParts[oldTail]);
        oldTail--;
        newHead++;
      } else {
        if (newKeyToIndexMap === void 0) {
          newKeyToIndexMap = generateMap(newKeys, newHead, newTail);
          oldKeyToIndexMap = generateMap(oldKeys, oldHead, oldTail);
        }
        if (!newKeyToIndexMap.has(oldKeys[oldHead])) {
          removePart(oldParts[oldHead]);
          oldHead++;
        } else if (!newKeyToIndexMap.has(oldKeys[oldTail])) {
          removePart(oldParts[oldTail]);
          oldTail--;
        } else {
          const oldIndex = oldKeyToIndexMap.get(newKeys[newHead]);
          const oldPart = oldIndex !== void 0 ? oldParts[oldIndex] : null;
          if (oldPart === null) {
            const newPart = insertPart(containerPart, oldParts[oldHead]);
            setChildPartValue(newPart, newValues[newHead]);
            newParts[newHead] = newPart;
          } else {
            newParts[newHead] = setChildPartValue(oldPart, newValues[newHead]);
            insertPart(containerPart, oldParts[oldHead], oldPart);
            oldParts[oldIndex] = null;
          }
          newHead++;
        }
      }
    }
    while (newHead <= newTail) {
      const newPart = insertPart(containerPart, newParts[newTail + 1]);
      setChildPartValue(newPart, newValues[newHead]);
      newParts[newHead++] = newPart;
    }
    while (oldHead <= oldTail) {
      const oldPart = oldParts[oldHead++];
      if (oldPart !== null) {
        removePart(oldPart);
      }
    }
    this._itemKeys = newKeys;
    setCommittedValue(containerPart, newParts);
    return noChange;
  }
};
var repeat = directive(RepeatDirective);

export {
  repeat
};
/*! Bundled license information:

lit-html/development/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/development/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
//# sourceMappingURL=chunk-MNYQPZST.js.map
