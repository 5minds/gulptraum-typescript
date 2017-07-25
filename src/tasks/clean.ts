import * as del from 'del';
import * as vinylPaths from 'vinyl-paths';
import * as path from 'path';

export function generate(gulp, config, gulptraum): void {

  const outputFolderPath = path.resolve(config.paths.root, config.paths.output);

  gulptraum.task('build-typescript-clean', {
    help: 'Cleans the files compiled from your TypeScript source code'
  }, () => {
    // TODO: make use of excludes provided in the config
    return gulp.src(`${outputFolderPath}`)
      .pipe(vinylPaths(del));
  });

  gulptraum.task('clean-typescript', {
    help: 'Cleans all files generated by the TypeScript plugin'
  }, (callback) => {

    const tasks = [
      'build-typescript-clean',
      'test-typescript-clean',
      'doc-typescript-clean',
    ];

    return gulptraum.gulpAdapter.runTasksSequential(tasks, callback);
  });

}

module.exports.generate = generate;
