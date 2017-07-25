"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var build_1 = require("./build");
var clean_1 = require("./clean");
var doc_1 = require("./doc");
var lint_1 = require("./lint");
var setup_dev_1 = require("./setup_dev");
var test_1 = require("./test");
var watch_1 = require("./watch");
function initializePluginTasks(gulp, config, gulptraum) {
    build_1.generate(gulp, config, gulptraum);
    clean_1.generate(gulp, config, gulptraum);
    doc_1.generate(gulp, config, gulptraum);
    lint_1.generate(gulp, config, gulptraum);
    setup_dev_1.generate(gulp, config, gulptraum);
    test_1.generate(gulp, config, gulptraum);
    watch_1.generate(gulp, config, gulptraum);
}
exports.initializePluginTasks = initializePluginTasks;

//# sourceMappingURL=index.js.map
