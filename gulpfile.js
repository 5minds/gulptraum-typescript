'use strict';

const gulp = require('gulp');
const gulptraum = require('gulptraum');
const gulptraumTypescriptPlugin = require('gulptraum-typescript');

const buildSystemConfig = {
};

const buildSystem = new gulptraum.BuildSystem(buildSystemConfig);

buildSystem.config = buildSystemConfig;

const typeScriptConfig = {
  compileToModules: ['commonjs'],
};

buildSystem
  .registerPlugin('typescript', gulptraumTypescriptPlugin, typeScriptConfig)
  .registerTasks(gulp);
