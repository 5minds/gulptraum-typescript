define(["require", "exports", "path", "gulp-tslint"], function (require, exports, path, tslint) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslintDefaultConfiguration = path.resolve(__filename, '../../setup/tslint.json');
    function generate(gulp, config, gulptraum) {
        const sourceFolderPath = path.resolve(config.paths.root, config.paths.source);
        gulptraum.task('lint-typescript', {
            help: 'Performs a style check on your TypeScript source code using TSLint'
        }, function lintTypescript() {
            let tslintConfiguration = tslintDefaultConfiguration;
            if (config.paths.tslintConfig) {
                tslintConfiguration = path.resolve(config.paths.root, config.paths.tslintConfig);
            }
            return gulp.src(sourceFolderPath)
                .pipe(tslint({
                formatter: 'prose',
                summarizeFailureOutput: true,
                configuration: tslintConfiguration,
            }))
                .pipe(tslint.report({
                emitError: !config.suppressErrors,
            }));
        });
    }
    exports.generate = generate;
    module.exports.generate = generate;
});

//# sourceMappingURL=lint.js.map
