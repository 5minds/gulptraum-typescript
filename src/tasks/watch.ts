import * as path from 'path';
import * as yargs from 'yargs';

export function generate(gulp, config, gulptraum): void {

  const sourceFolderPath = path.resolve(config.paths.root, config.paths.source);

  gulptraum.task('watch-typescript', {
    help: 'Watch TypeScript source code for changes and executes a certain task on change'
  }, function watchTypescript() {

    const argv = yargs.argv;
    const taskArgument = (argv.task || 'build-typescript').toLowerCase();

    return gulp.watch(sourceFolderPath, [taskArgument]);
  });

}
