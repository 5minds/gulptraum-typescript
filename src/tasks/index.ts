import {generate as build} from './build';
import {generate as clean} from './clean';
import {generate as lint} from './lint';

export function initializePluginTasks(gulp, config, gulptraum) {
  build(gulp, config, gulptraum);
  clean(gulp, config, gulptraum);
  lint(gulp, config, gulptraum);
}
