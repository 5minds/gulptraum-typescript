define(["require", "exports", "fs", "del", "vinyl-paths", "path", "gulp-typescript", "gulp-mocha", "./../setup/typescript-options"], function (require, exports, fs, del, vinylPaths, path, ts, mocha, typescript_options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function generate(gulp, config, gulptraum) {
        const getTypeScriptOptions = typescript_options_1.initializeTypeScriptOptions(config);
        const testsFolderPath = path.resolve(config.paths.root, config.paths.tests);
        const sourceOutputFolderPath = path.resolve(config.paths.root, config.paths.output);
        const testsOutputFolderPath = path.resolve(config.paths.root, config.paths.testOutput);
        const typingsGlobPath = path.resolve(config.paths.root, config.paths.typings);
        gulptraum.task('test-typescript-build', {
            help: 'Builds your TypeScript test source code'
        }, () => {
            const currentPath = path.resolve(config.paths.root);
            const symlinkTargetPath = path.resolve(`${config.paths.root}/node_modules/${config.packageName}`);
            const symlinkExists = fs.existsSync(symlinkTargetPath);
            if (!symlinkExists) {
                fs.symlinkSync(currentPath, symlinkTargetPath, 'junction');
            }
            const tsProject = ts.createProject(getTypeScriptOptions({
                target: 'es5',
                sourceMap: true,
                module: 'commonjs',
                moduleResolution: 'node',
                listFiles: true,
                listEmittedFiles: true,
            }));
            const allTestFiles = [
                `${testsFolderPath}/**/*.ts`,
                `${testsFolderPath}/**/*.d.ts`,
                `${sourceOutputFolderPath}/**/*.d.ts`,
                `${typingsGlobPath}`,
            ];
            const tsResult = gulp.src(allTestFiles)
                .pipe(tsProject(ts.reporter.fullReporter(true)));
            return tsResult.js
                .pipe(gulp.dest(`${testsOutputFolderPath}`));
        });
        gulptraum.task('test-typescript-run', {
            help: 'Runs all TypeScript tests built be the TypeScript plugin'
        }, () => {
            return gulp.src(`${testsOutputFolderPath}/**/*.js`)
                .pipe(mocha())
                .once('error', (error) => {
                console.error(error);
                process.exit(1);
            });
        });
        gulptraum.task('test-typescript-clean', {
            help: 'Cleans all test files built by the TypeScript plugin'
        }, () => {
            return gulp.src(`${testsOutputFolderPath}`)
                .pipe(vinylPaths(del));
        });
        gulptraum.task('test-typescript', {
            help: 'Runs all TypeScript tests'
        }, (callback) => {
            const tasks = [
                'test-typescript-build',
                'test-typescript-run',
                'test-typescript-clean',
            ];
            return gulptraum.gulpAdapter.runTasksSequential(tasks, callback);
        });
    }
    exports.generate = generate;
    module.exports.generate = generate;
});

//# sourceMappingURL=test.js.map
