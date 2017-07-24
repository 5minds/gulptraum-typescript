export * from './interfaces';
export * from './config';

import {initializePluginTasks} from './tasks/index';

export function initializePlugin(gulp, config, gulptraum) {
  initializePluginTasks(gulp, config, gulptraum);
}