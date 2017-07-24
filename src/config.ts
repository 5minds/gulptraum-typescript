import {ITypeScriptPluginConfiguration, ITypeScriptPluginPathsConfiguration} from './index';
import {IConfigurationHook, IBuildSystemConfiguration } from 'gulptraum';

import * as fs from 'fs';
import * as path from 'path';

export const getDefaultConfig: IConfigurationHook
= function (buildSystemConfig: IBuildSystemConfiguration): ITypeScriptPluginConfiguration {

  const tslintConfigPath = path.resolve(buildSystemConfig.paths.root, 'tslint.json');
  const tslintConfigExists = fs.existsSync(tslintConfigPath);

  let paths: ITypeScriptPluginPathsConfiguration = Object.assign({}, buildSystemConfig.paths);
  
  paths.source = `${path.resolve(buildSystemConfig.paths.root, buildSystemConfig.paths.source)}/**/*.ts`;
  paths.typings = `${path.resolve(buildSystemConfig.paths.root, 'typings/')}/**/*.d.ts`;
  paths.tslintConfig = tslintConfigExists ? tslintConfigPath : undefined;

  let config: ITypeScriptPluginConfiguration = Object.assign({}, buildSystemConfig);

  config.pluginName = 'typescript';
  config.paths = paths;
  config.useTypeScriptForDTS = true;
  config.importsToAdd = [];
  config.compileToModules = buildSystemConfig.compileToModules || ['es2015', 'commonjs', 'amd', 'system'];

  return config;
}