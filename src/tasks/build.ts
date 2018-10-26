import * as del from 'del';
import * as path from 'path';
import * as sourcemaps from 'gulp-sourcemaps';
import * as ts from 'gulp-typescript';
import * as vinylPaths from 'vinyl-paths';

import {initializeTypeScriptOptions} from './../setup/typescript-options';

export function generate(gulp, config, gulptraum): void {

  const getTypescriptOptions: any = initializeTypeScriptOptions(config);

  function srcForTypeScript() {
    const allSourceFiles = [config.paths.source, config.paths.typings];
    return gulp
      .src(allSourceFiles);
  }

  const buildOutputFolderPath = path.resolve(config.paths.root, config.paths.output);

  gulptraum.task('build-typescript-clean', {
    help: 'Cleans the files compiled from your TypeScript source code'
  }, () => {
    // NOTE: Glob.js now throws an error by default, if a directly was not found.
    // We must pass a config to "del", telling glob.js not to do that.
    const deleteFiles: any = (patterns) => {
      return del(patterns, {
        nonull: false,
      })
    };

    return gulp
      .src(`${buildOutputFolderPath}`)
      .pipe(vinylPaths(deleteFiles));
  });

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
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../src'}))
        .pipe(gulp.dest(config.paths.output + moduleType));
    });
  });

  gulptraum.task('build-typescript-dts', {
    help: 'Generates the type definitions (.d.ts) file from your TypeScript source code',
  }, () => {
    const tsProject = ts.createProject(
      getTypescriptOptions({
        removeComments: false,
        target: 'es2015',
        module: 'esnext',
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
