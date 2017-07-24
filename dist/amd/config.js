define(["require", "exports", "fs", "path"], function (require, exports, fs, path) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getDefaultConfig = function (buildSystemConfig) {
        var tslintConfigPath = path.resolve(buildSystemConfig.paths.root, 'tslint.json');
        var tslintConfigExists = fs.existsSync(tslintConfigPath);
        var paths = Object.assign({}, buildSystemConfig.paths);
        paths.source = path.resolve(buildSystemConfig.paths.root, buildSystemConfig.paths.source) + "/**/*.ts";
        paths.typings = path.resolve(buildSystemConfig.paths.root, 'typings/') + "/**/*.d.ts";
        paths.tslintConfig = tslintConfigExists ? tslintConfigPath : undefined;
        var config = Object.assign({}, buildSystemConfig);
        config.pluginName = 'typescript';
        config.paths = paths;
        config.useTypeScriptForDTS = true;
        config.importsToAdd = [];
        config.compileToModules = buildSystemConfig.compileToModules || ['es2015', 'commonjs', 'amd', 'system'];
        return config;
    };
});

//# sourceMappingURL=config.js.map
