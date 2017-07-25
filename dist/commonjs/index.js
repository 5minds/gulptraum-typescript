"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./config"));
const index_1 = require("./tasks/index");
function initializePlugin(gulp, config, gulptraum) {
    index_1.initializePluginTasks(gulp, config, gulptraum);
}
exports.initializePlugin = initializePlugin;

//# sourceMappingURL=index.js.map
