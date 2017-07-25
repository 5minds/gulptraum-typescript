"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsconfig = require("./tsconfig");
var typescript = require("typescript");
function initializeTypeScriptOptions(buildStepConfig) {
    var resolvedTsConfig = tsconfig.getTypeScriptConfig(buildStepConfig);
    return function (override) {
        return Object.assign(resolvedTsConfig.compilerOptions, {
            target: override && override.target || 'es5',
            typescript: typescript,
        }, override || {});
    };
}
exports.initializeTypeScriptOptions = initializeTypeScriptOptions;

//# sourceMappingURL=typescript-options.js.map
