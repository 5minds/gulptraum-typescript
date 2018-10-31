export function getTypeScriptConfig(buildStepConfig: any): any {

  const config = {
    compilerOptions: {
      target: 'es2017',
      module: 'es2017',
      experimentalDecorators: true,
      emitDecoratorMetadata: false,
      moduleResolution: 'node',
      stripInternal: true,
      isolatedModules: false,
      preserveConstEnums: true,
      listFiles: true,
      declaration: true,
      removeComments: true,
      lib: ['esnext', 'dom'],
    },
    exclude: [
      'node_modules',
      'test',
      'gulpfile.js',
    ],
  };

  if (buildStepConfig.compilerOptions) {
    Object.assign(config.compilerOptions, buildStepConfig.compilerOptions);
  }

  config.exclude.concat(buildStepConfig.paths.excludes);
  config.exclude.push(buildStepConfig.paths.output);

  return config;
}
