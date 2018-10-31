"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var typedoc = require("gulp-typedoc");
var through2 = require("through2");
function generate(gulp, config, gulptraum) {
    var docsOutputFolderPath = path.resolve(config.paths.root, config.paths.doc);
    var defaultCompilerOptions = {
        target: 'es6',
        includeDeclarations: true,
        moduleResolution: 'node',
        json: config.paths.doc + "/api.json",
        out: config.paths.doc + "/",
        name: config.packageName + "-docs",
        mode: 'modules',
        excludeExternals: true,
        ignoreCompilerErrors: false,
        version: true,
    };
    var currentCompilerOptions = Object.assign({}, defaultCompilerOptions);
    if (config.compilerOptions) {
        currentCompilerOptions = Object.assign(currentCompilerOptions, config.compilerOptions);
    }
    else if (config.config && config.config.compilerOptions) {
        currentCompilerOptions = Object.assign(currentCompilerOptions, config.config.compilerOptions);
    }
    if (currentCompilerOptions.lib) {
        currentCompilerOptions.lib = currentCompilerOptions.lib.map(function (libName) {
            return "lib." + libName + ".d.ts";
        });
    }
    gulptraum.task('doc-typescript-generate', {
        help: 'Generates the documentation from your TypeScript source code using TypeDoc'
    }, function docTypescriptGenerate() {
        return gulp.src([config.paths.source])
            .pipe(typedoc(currentCompilerOptions));
    });
    gulptraum.task('doc-typescript-shape', {
        help: 'Formats the generated api.json'
    }, function docTypescriptShape() {
        return gulp.src([docsOutputFolderPath + "/api.json"])
            .pipe(through2.obj(function (file, enc, callback) {
            var originalApiContent = JSON.parse(file.contents.toString('utf8')).children[0];
            originalApiContent = {
                name: config.packageName,
                children: originalApiContent.children,
                groups: originalApiContent.groups,
            };
            file.contents = new Buffer(JSON.stringify(originalApiContent));
            this.push(file);
            return callback();
        }))
            .pipe(gulp.dest(docsOutputFolderPath));
    });
    gulptraum.task('doc-typescript', {
        help: 'Generates the documentation from your TypeScript source code'
    }, function docTypescript(callback) {
        var tasks = [
            'doc-typescript-clean',
            'doc-typescript-generate',
            'doc-typescript-shape',
        ];
        return gulptraum.gulpAdapter.runTasksSequential(tasks, callback);
    });
}
exports.generate = generate;

//# sourceMappingURL=doc.js.map
