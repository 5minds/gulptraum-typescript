"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
exports.getDefaultConfig = function (buildSystemConfig) {
    var tslintConfigPath = path.resolve(buildSystemConfig.paths.root, 'tslint.json');
    var tslintConfigExists = fs.existsSync(tslintConfigPath);
    var paths = Object.assign({}, buildSystemConfig.paths);
    paths.source = path.resolve(buildSystemConfig.paths.root, buildSystemConfig.paths.source) + "/**/*.ts";
    paths.typings = path.resolve(buildSystemConfig.paths.root, 'typings/') + "/**/*.d.ts";
    paths.tslintConfig = tslintConfigExists ? tslintConfigPath : undefined;
    var pluginConfig = {
        pluginName: 'typescript',
        paths: paths,
        useTypeScriptForDTS: true,
        importsToAdd: [],
        compileToModules: ['es2015', 'commonjs', 'amd', 'system'],
        priority: 0
    };
    var baseConfig = Object.assign({}, buildSystemConfig);
    var config = Object.assign(baseConfig, pluginConfig);
    return config;
};

//# sourceMappingURL=config.js.map
