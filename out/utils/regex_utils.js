"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findImportRegex = exports.findSuperClassRegex = exports.findClassRegex = exports.findSubClassRegex = void 0;
///这个正则表达式的含义是：以 class 开头，后面可以跟任意数量的空格（\s+），
///然后是一个以字母开头的单词（[a-zA-Z]\w*）表示类名，
///然后是 extends 和一个单词（\w+），表示类的继承关系
///这个正则表达式会匹配整个 class 声明语句，而类名会匹配为第一个捕获组。
exports.findSubClassRegex = /class\s+([a-zA-Z]\w*)\s+extends\s+\w*/;
exports.findClassRegex = /class\s+([a-zA-Z]\w*)\s+/;
exports.findSuperClassRegex = /extends\s+([a-zA-Z]\w*)/;
exports.findImportRegex = /import\s+/;
//# sourceMappingURL=regex_utils.js.map