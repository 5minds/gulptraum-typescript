define(["require", "exports", "./build"], function (require, exports, build_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initializePluginTasks(gulp, config, gulptraum) {
        build_1.generate(gulp, config, gulptraum);
    }
    exports.initializePluginTasks = initializePluginTasks;
});

//# sourceMappingURL=index.js.map
