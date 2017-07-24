import * as tsconfig from './tsconfig';
import * as typescript from 'typescript';

export function initializeTypeScriptOptions(buildStepConfig) {

  const resolvedTsConfig = tsconfig.getTypeScriptConfig(buildStepConfig);

  return (override) => {
    return Object.assign(resolvedTsConfig.compilerOptions, {
      target: override && override.target || 'es5',
      typescript: typescript,
    }, override || {});
  };
}
