define(["require", "exports", "gulp-typescript", "gulp-sourcemaps", "./../setup/typescript-options"], function (require, exports, ts, sourcemaps, typescript_options_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function generate(gulp, config, gulptraum) {
        const jsName = `${config.packageName}.ts`;
        const getTypescriptOptions = typescript_options_1.initializeTypeScriptOptions(config);
        function srcForTypeScript() {
            const allSourceFiles = [config.paths.source, config.paths.typings];
            return gulp
                .src(allSourceFiles);
        }
        config.compileToModules.forEach((moduleType) => {
            gulptraum.task(`build-typescript-${moduleType}`, {
                help: `Builds the TypeScript source code into a ${moduleType} module`,
            }, () => {
                const options = getTypescriptOptions({
                    module: moduleType,
                    target: (config && config.compilerOptions && config.compilerOptions.target) ? config.compilerOptions.target : 'es5'
                });
                const tsProject = ts.createProject(options);
                const tsResult = srcForTypeScript()
                    .pipe(sourcemaps.init())
                    .pipe(tsProject(ts.reporter.fullReporter(true)));
                return tsResult.js
                    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../../src' }))
                    .pipe(gulp.dest(config.paths.output + moduleType));
            });
        });
        gulptraum.task('build-typescript-dts', {
            help: 'Generates the type definitions (.d.ts) file from your TypeScript source code',
        }, () => {
            const tsProject = ts.createProject(getTypescriptOptions({
                removeComments: false,
                target: 'es2015',
                module: 'es2015',
            }));
            const tsResult = srcForTypeScript()
                .pipe(tsProject(ts.reporter.fullReporter(true)));
            return tsResult.dts
                .pipe(gulp.dest(config.paths.output));
        });
        gulptraum.task('build-typescript', {
            help: 'Builds your TypeScript source code and generates the type definitions',
        }, (callback) => {
            const tasks = config.compileToModules
                .filter((moduleType) => {
                return moduleType !== 'native-modules';
            })
                .map((moduleType) => {
                return `build-typescript-${moduleType}`;
            })
                .concat(config.useTypeScriptForDTS ? ['build-typescript-dts'] : []);
            return gulptraum.gulpAdapter.runTasksParallel(tasks, callback);
        });
    }
    exports.generate = generate;
    module.exports.generate = generate;
});

//# sourceMappingURL=build.js.map
