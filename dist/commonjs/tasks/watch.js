"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var yargs = require("yargs");
function generate(gulp, config, gulptraum) {
    var sourceFolderPath = path.resolve(config.paths.root, config.paths.source);
    gulptraum.task('watch-typescript', {
        help: 'Watch TypeScript source code for changes and executes a certain task on change'
    }, function watchTypescript() {
        var argv = yargs.argv;
        var taskArgument = (argv.task || 'build-typescript').toLowerCase();
        return gulp.watch(sourceFolderPath, [taskArgument]);
    });
}
exports.generate = generate;

//# sourceMappingURL=watch.js.map
