"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfig = require("./tsconfig");
var typescript = require("typescript");
var yargs = require("yargs");
function initializeTypeScriptOptions(buildStepConfig) {
    var resolvedTsConfig = tsconfig.getTypeScriptConfig(buildStepConfig);
    return function (override) {
        return Object.assign(resolvedTsConfig.compilerOptions, {
            target: override && override.target || 'es2017',
            typescript: typescript,
            isolatedModules: yargs.env('GULPTRAUM').argv.transpileOnly ? true : false,
        }, override || {});
    };
}
exports.initializeTypeScriptOptions = initializeTypeScriptOptions;

//# sourceMappingURL=typescript-options.js.map
