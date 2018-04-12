import * as tsconfig from './tsconfig';
import * as typescript from 'typescript';
import * as yargs from 'yargs';

export function initializeTypeScriptOptions(buildStepConfig) {

  const resolvedTsConfig = tsconfig.getTypeScriptConfig(buildStepConfig);

  return (override) => {
    return Object.assign(resolvedTsConfig.compilerOptions, {
      target: override && override.target || 'es5',
      typescript: typescript,
      isolatedModules: yargs.env('GULPTRAUM').argv.transpileOnly ? true : false,
    }, override || {});
  };
}
