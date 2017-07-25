define(["require", "exports", "./build", "./clean", "./doc", "./lint", "./setup_dev", "./test", "./watch"], function (require, exports, build_1, clean_1, doc_1, lint_1, setup_dev_1, test_1, watch_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});

//# sourceMappingURL=index.js.map
