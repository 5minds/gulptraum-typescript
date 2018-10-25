"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var typescript_options_1 = require("./../setup/typescript-options");
function generate(gulp, config, gulptraum) {
    var getTypescriptOptions = typescript_options_1.initializeTypeScriptOptions(config);
    function srcForTypeScript() {
        var allSourceFiles = [config.paths.source, config.paths.typings];
        return gulp
            .src(allSourceFiles);
    }
    config.compileToModules.forEach(function (moduleType) {
        gulptraum.task("build-typescript-" + moduleType, {
            help: "Builds the TypeScript source code into a " + moduleType + " module",
        }, function () {
            var options = getTypescriptOptions({
                module: moduleType,
                target: (config && config.compilerOptions && config.compilerOptions.target) ? config.compilerOptions.target : 'es5'
            });
            var tsProject = ts.createProject(options);
            var tsResult = srcForTypeScript()
                .pipe(sourcemaps.init())
                .pipe(tsProject(ts.reporter.fullReporter(true)));
            return tsResult.js
                .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../../src' }))
                .pipe(gulp.dest(config.paths.output + moduleType));
        });
    });
    console.log('REGISTER BUILD TASK');
    console.log(gulptraum);
    gulptraum.task('build-typescript-dts', {
        help: 'Generates the type definitions (.d.ts) file from your TypeScript source code',
    }, function () {
        var tsProject = ts.createProject(getTypescriptOptions({
            removeComments: false,
            target: 'es2015',
            module: 'esnext',
        }));
        var tsResult = srcForTypeScript()
            .pipe(tsProject(ts.reporter.fullReporter(true)));
        return tsResult.dts
            .pipe(gulp.dest(config.paths.output));
    });
    gulptraum.task('build-typescript', {
        help: 'Builds your TypeScript source code and generates the type definitions',
    }, function (callback) {
        var tasks = config.compileToModules
            .filter(function (moduleType) {
            return moduleType !== 'native-modules';
        })
            .map(function (moduleType) {
            return "build-typescript-" + moduleType;
        })
            .concat(config.useTypeScriptForDTS ? ['build-typescript-dts'] : []);
        return gulptraum.gulpAdapter.runTasksParallel(tasks, callback);
    });
}
exports.generate = generate;

//# sourceMappingURL=build.js.map
