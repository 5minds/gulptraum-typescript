"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_1 = require("./build");
var clean_1 = require("./clean");
var lint_1 = require("./lint");
function initializePluginTasks(gulp, config, gulptraum) {
    build_1.generate(gulp, config, gulptraum);
    clean_1.generate(gulp, config, gulptraum);
    lint_1.generate(gulp, config, gulptraum);
}
exports.initializePluginTasks = initializePluginTasks;

//# sourceMappingURL=index.js.map
