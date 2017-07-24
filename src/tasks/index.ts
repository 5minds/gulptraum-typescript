import {generate as build} from './build';

export function initializePluginTasks(gulp, config, gulptraum) {
  build(gulp, config, gulptraum);
}