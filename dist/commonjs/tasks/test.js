"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("gulp-typescript");
var mocha = require("gulp-mocha");
var shelljs = require("shelljs");
var typescript_options_1 = require("./../setup/typescript-options");
function generate(gulp, config, gulptraum) {
    var getTypeScriptOptions = typescript_options_1.initializeTypeScriptOptions(config);
    var testsFolderPath = path.resolve(config.paths.root, config.paths.tests);
    var sourceOutputFolderPath = path.resolve(config.paths.root, config.paths.output);
    var testsOutputFolderPath = path.resolve(config.paths.root, config.paths.testOutput);
    var typingsGlobPath = path.resolve(config.paths.root, config.paths.typings);
    if (!fs.existsSync(testsFolderPath)) {
        return;
    }
    gulptraum.task('test-typescript-build', {
        help: 'Builds your TypeScript test source code'
    }, function () {
        var currentPath = path.resolve(config.paths.root);
        var symlinkFolderPath = path.resolve(config.paths.root + "/node_modules");
        var symlinkTargetPath = path.resolve(symlinkFolderPath + "/" + config.fullPackageName);
        if (config.fullPackageName[0] === '@') {
            var packageScopeFolder = config.fullPackageName.split('/')[0];
            symlinkFolderPath = path.resolve(symlinkFolderPath + "/" + packageScopeFolder);
        }
        var symlinkExists = fs.existsSync(symlinkTargetPath);
        if (!symlinkExists) {
            if (!fs.existsSync(symlinkFolderPath)) {
                shelljs.mkdir('-p', symlinkFolderPath);
            }
            fs.symlinkSync(currentPath, symlinkTargetPath, 'junction');
        }
        var tsProject = ts.createProject(getTypeScriptOptions({
            target: 'es5',
            sourceMap: true,
            module: 'commonjs',
            moduleResolution: 'node',
            listFiles: true,
            listEmittedFiles: true,
        }));
        var allTestFiles = [
            testsFolderPath + "/**/*.ts",
            testsFolderPath + "/**/*.d.ts",
            sourceOutputFolderPath + "/**/*.d.ts",
            "" + typingsGlobPath,
        ];
        var tsResult = gulp.src(allTestFiles)
            .pipe(tsProject(ts.reporter.fullReporter(true)));
        return tsResult.js
            .pipe(gulp.dest("" + testsOutputFolderPath));
    });
    gulptraum.task('test-typescript-run', {
        help: 'Runs all TypeScript tests built be the TypeScript plugin'
    }, function () {
        return gulp.src(testsOutputFolderPath + "/**/*.js")
            .pipe(mocha())
            .once('error', function (error) {
            console.error(error);
            process.exit(1);
        });
    });
    gulptraum.task('test-typescript', {
        help: 'Runs all TypeScript tests'
    }, function (callback) {
        var tasks = [
            'test-typescript-build',
            'test-typescript-run',
            'test-typescript-clean',
        ];
        return gulptraum.gulpAdapter.runTasksSequential(tasks, callback);
    });
}
exports.generate = generate;

//# sourceMappingURL=test.js.map
