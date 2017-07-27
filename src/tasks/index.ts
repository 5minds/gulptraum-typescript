import {generate as build} from './build';
import {generate as clean} from './clean';
import {generate as doc} from './doc';
import {generate as lint} from './lint';
import {generate as schema} from './schema';
import {generate as setup_dev} from './setup_dev';
import {generate as test} from './test';
import {generate as watch} from './watch';

export function initializePluginTasks(gulp, config, gulptraum) {
  build(gulp, config, gulptraum);
  clean(gulp, config, gulptraum);
  doc(gulp, config, gulptraum);
  lint(gulp, config, gulptraum);
  schema(gulp, config, gulptraum);
  setup_dev(gulp, config, gulptraum);
  test(gulp, config, gulptraum);
  watch(gulp, config, gulptraum);
}
