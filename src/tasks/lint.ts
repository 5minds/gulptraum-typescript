import * as path from 'path';
import * as tslint from 'gulp-tslint';

const tslintDefaultConfiguration = path.resolve(__filename, '../../setup/tslint.json');

export function generate(gulp, config, gulptraum): void {

  const sourceFolderPath = path.resolve(config.paths.root, config.paths.source);

  gulptraum.task('lint-typescript', {
    help: 'Performs a style check on your TypeScript source code using TSLint'
  }, function lintTypescript() {

    let tslintConfiguration = tslintDefaultConfiguration;

    if (config.paths.tslintConfig) {
      tslintConfiguration = path.resolve(config.paths.root, config.paths.tslintConfig);
    }
    
    return gulp.src(sourceFolderPath)
      .pipe((<any>tslint)({
        formatter: 'prose',
        summarizeFailureOutput: true,
        configuration: tslintConfiguration,
      }))
      .pipe((<any>tslint).report({
        emitError: !config.suppressErrors,
      }));
  });

}
