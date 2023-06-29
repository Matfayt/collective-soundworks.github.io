import {
  require_codemirror
} from "./chunk-PDMTOR63.js";
import {
  __commonJS
} from "./chunk-GKWPUQBP.js";

// ../../ircam-ismm/sc-components/node_modules/codemirror/addon/search/searchcursor.js
var require_searchcursor = __commonJS({
  "../../ircam-ismm/sc-components/node_modules/codemirror/addon/search/searchcursor.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror2) {
      "use strict";
      var Pos = CodeMirror2.Pos;
      function regexpFlags(regexp) {
        var flags = regexp.flags;
        return flags != null ? flags : (regexp.ignoreCase ? "i" : "") + (regexp.global ? "g" : "") + (regexp.multiline ? "m" : "");
      }
      function ensureFlags(regexp, flags) {
        var current = regexpFlags(regexp), target = current;
        for (var i = 0; i < flags.length; i++)
          if (target.indexOf(flags.charAt(i)) == -1)
            target += flags.charAt(i);
        return current == target ? regexp : new RegExp(regexp.source, target);
      }
      function maybeMultiline(regexp) {
        return /\\s|\\n|\n|\\W|\\D|\[\^/.test(regexp.source);
      }
      function searchRegexpForward(doc, regexp, start) {
        regexp = ensureFlags(regexp, "g");
        for (var line = start.line, ch = start.ch, last = doc.lastLine(); line <= last; line++, ch = 0) {
          regexp.lastIndex = ch;
          var string = doc.getLine(line), match = regexp.exec(string);
          if (match)
            return {
              from: Pos(line, match.index),
              to: Pos(line, match.index + match[0].length),
              match
            };
        }
      }
      function searchRegexpForwardMultiline(doc, regexp, start) {
        if (!maybeMultiline(regexp))
          return searchRegexpForward(doc, regexp, start);
        regexp = ensureFlags(regexp, "gm");
        var string, chunk = 1;
        for (var line = start.line, last = doc.lastLine(); line <= last; ) {
          for (var i = 0; i < chunk; i++) {
            if (line > last)
              break;
            var curLine = doc.getLine(line++);
            string = string == null ? curLine : string + "\n" + curLine;
          }
          chunk = chunk * 2;
          regexp.lastIndex = start.ch;
          var match = regexp.exec(string);
          if (match) {
            var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n");
            var startLine = start.line + before.length - 1, startCh = before[before.length - 1].length;
            return {
              from: Pos(startLine, startCh),
              to: Pos(
                startLine + inside.length - 1,
                inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length
              ),
              match
            };
          }
        }
      }
      function lastMatchIn(string, regexp, endMargin) {
        var match, from = 0;
        while (from <= string.length) {
          regexp.lastIndex = from;
          var newMatch = regexp.exec(string);
          if (!newMatch)
            break;
          var end = newMatch.index + newMatch[0].length;
          if (end > string.length - endMargin)
            break;
          if (!match || end > match.index + match[0].length)
            match = newMatch;
          from = newMatch.index + 1;
        }
        return match;
      }
      function searchRegexpBackward(doc, regexp, start) {
        regexp = ensureFlags(regexp, "g");
        for (var line = start.line, ch = start.ch, first = doc.firstLine(); line >= first; line--, ch = -1) {
          var string = doc.getLine(line);
          var match = lastMatchIn(string, regexp, ch < 0 ? 0 : string.length - ch);
          if (match)
            return {
              from: Pos(line, match.index),
              to: Pos(line, match.index + match[0].length),
              match
            };
        }
      }
      function searchRegexpBackwardMultiline(doc, regexp, start) {
        if (!maybeMultiline(regexp))
          return searchRegexpBackward(doc, regexp, start);
        regexp = ensureFlags(regexp, "gm");
        var string, chunkSize = 1, endMargin = doc.getLine(start.line).length - start.ch;
        for (var line = start.line, first = doc.firstLine(); line >= first; ) {
          for (var i = 0; i < chunkSize && line >= first; i++) {
            var curLine = doc.getLine(line--);
            string = string == null ? curLine : curLine + "\n" + string;
          }
          chunkSize *= 2;
          var match = lastMatchIn(string, regexp, endMargin);
          if (match) {
            var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n");
            var startLine = line + before.length, startCh = before[before.length - 1].length;
            return {
              from: Pos(startLine, startCh),
              to: Pos(
                startLine + inside.length - 1,
                inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length
              ),
              match
            };
          }
        }
      }
      var doFold, noFold;
      if (String.prototype.normalize) {
        doFold = function(str) {
          return str.normalize("NFD").toLowerCase();
        };
        noFold = function(str) {
          return str.normalize("NFD");
        };
      } else {
        doFold = function(str) {
          return str.toLowerCase();
        };
        noFold = function(str) {
          return str;
        };
      }
      function adjustPos(orig, folded, pos, foldFunc) {
        if (orig.length == folded.length)
          return pos;
        for (var min = 0, max = pos + Math.max(0, orig.length - folded.length); ; ) {
          if (min == max)
            return min;
          var mid = min + max >> 1;
          var len = foldFunc(orig.slice(0, mid)).length;
          if (len == pos)
            return mid;
          else if (len > pos)
            max = mid;
          else
            min = mid + 1;
        }
      }
      function searchStringForward(doc, query, start, caseFold) {
        if (!query.length)
          return null;
        var fold = caseFold ? doFold : noFold;
        var lines = fold(query).split(/\r|\n\r?/);
        search:
          for (var line = start.line, ch = start.ch, last = doc.lastLine() + 1 - lines.length; line <= last; line++, ch = 0) {
            var orig = doc.getLine(line).slice(ch), string = fold(orig);
            if (lines.length == 1) {
              var found = string.indexOf(lines[0]);
              if (found == -1)
                continue search;
              var start = adjustPos(orig, string, found, fold) + ch;
              return {
                from: Pos(line, adjustPos(orig, string, found, fold) + ch),
                to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold) + ch)
              };
            } else {
              var cutFrom = string.length - lines[0].length;
              if (string.slice(cutFrom) != lines[0])
                continue search;
              for (var i = 1; i < lines.length - 1; i++)
                if (fold(doc.getLine(line + i)) != lines[i])
                  continue search;
              var end = doc.getLine(line + lines.length - 1), endString = fold(end), lastLine = lines[lines.length - 1];
              if (endString.slice(0, lastLine.length) != lastLine)
                continue search;
              return {
                from: Pos(line, adjustPos(orig, string, cutFrom, fold) + ch),
                to: Pos(line + lines.length - 1, adjustPos(end, endString, lastLine.length, fold))
              };
            }
          }
      }
      function searchStringBackward(doc, query, start, caseFold) {
        if (!query.length)
          return null;
        var fold = caseFold ? doFold : noFold;
        var lines = fold(query).split(/\r|\n\r?/);
        search:
          for (var line = start.line, ch = start.ch, first = doc.firstLine() - 1 + lines.length; line >= first; line--, ch = -1) {
            var orig = doc.getLine(line);
            if (ch > -1)
              orig = orig.slice(0, ch);
            var string = fold(orig);
            if (lines.length == 1) {
              var found = string.lastIndexOf(lines[0]);
              if (found == -1)
                continue search;
              return {
                from: Pos(line, adjustPos(orig, string, found, fold)),
                to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold))
              };
            } else {
              var lastLine = lines[lines.length - 1];
              if (string.slice(0, lastLine.length) != lastLine)
                continue search;
              for (var i = 1, start = line - lines.length + 1; i < lines.length - 1; i++)
                if (fold(doc.getLine(start + i)) != lines[i])
                  continue search;
              var top = doc.getLine(line + 1 - lines.length), topString = fold(top);
              if (topString.slice(topString.length - lines[0].length) != lines[0])
                continue search;
              return {
                from: Pos(line + 1 - lines.length, adjustPos(top, topString, top.length - lines[0].length, fold)),
                to: Pos(line, adjustPos(orig, string, lastLine.length, fold))
              };
            }
          }
      }
      function SearchCursor(doc, query, pos, options) {
        this.atOccurrence = false;
        this.afterEmptyMatch = false;
        this.doc = doc;
        pos = pos ? doc.clipPos(pos) : Pos(0, 0);
        this.pos = { from: pos, to: pos };
        var caseFold;
        if (typeof options == "object") {
          caseFold = options.caseFold;
        } else {
          caseFold = options;
          options = null;
        }
        if (typeof query == "string") {
          if (caseFold == null)
            caseFold = false;
          this.matches = function(reverse, pos2) {
            return (reverse ? searchStringBackward : searchStringForward)(doc, query, pos2, caseFold);
          };
        } else {
          query = ensureFlags(query, "gm");
          if (!options || options.multiline !== false)
            this.matches = function(reverse, pos2) {
              return (reverse ? searchRegexpBackwardMultiline : searchRegexpForwardMultiline)(doc, query, pos2);
            };
          else
            this.matches = function(reverse, pos2) {
              return (reverse ? searchRegexpBackward : searchRegexpForward)(doc, query, pos2);
            };
        }
      }
      SearchCursor.prototype = {
        findNext: function() {
          return this.find(false);
        },
        findPrevious: function() {
          return this.find(true);
        },
        find: function(reverse) {
          var head = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
          if (this.afterEmptyMatch && this.atOccurrence) {
            head = Pos(head.line, head.ch);
            if (reverse) {
              head.ch--;
              if (head.ch < 0) {
                head.line--;
                head.ch = (this.doc.getLine(head.line) || "").length;
              }
            } else {
              head.ch++;
              if (head.ch > (this.doc.getLine(head.line) || "").length) {
                head.ch = 0;
                head.line++;
              }
            }
            if (CodeMirror2.cmpPos(head, this.doc.clipPos(head)) != 0) {
              return this.atOccurrence = false;
            }
          }
          var result = this.matches(reverse, head);
          this.afterEmptyMatch = result && CodeMirror2.cmpPos(result.from, result.to) == 0;
          if (result) {
            this.pos = result;
            this.atOccurrence = true;
            return this.pos.match || true;
          } else {
            var end = Pos(reverse ? this.doc.firstLine() : this.doc.lastLine() + 1, 0);
            this.pos = { from: end, to: end };
            return this.atOccurrence = false;
          }
        },
        from: function() {
          if (this.atOccurrence)
            return this.pos.from;
        },
        to: function() {
          if (this.atOccurrence)
            return this.pos.to;
        },
        replace: function(newText, origin) {
          if (!this.atOccurrence)
            return;
          var lines = CodeMirror2.splitLines(newText);
          this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin);
          this.pos.to = Pos(
            this.pos.from.line + lines.length - 1,
            lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0)
          );
        }
      };
      CodeMirror2.defineExtension("getSearchCursor", function(query, pos, caseFold) {
        return new SearchCursor(this.doc, query, pos, caseFold);
      });
      CodeMirror2.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
        return new SearchCursor(this, query, pos, caseFold);
      });
      CodeMirror2.defineExtension("selectMatches", function(query, caseFold) {
        var ranges = [];
        var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold);
        while (cur.findNext()) {
          if (CodeMirror2.cmpPos(cur.to(), this.getCursor("to")) > 0)
            break;
          ranges.push({ anchor: cur.from(), head: cur.to() });
        }
        if (ranges.length)
          this.setSelections(ranges, 0);
      });
    });
  }
});

export {
  require_searchcursor
};
//# sourceMappingURL=chunk-DQLCJI4I.js.map
