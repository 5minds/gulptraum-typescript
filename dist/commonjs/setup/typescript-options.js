"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsconfig = require("./tsconfig");
const typescript = require("typescript");
function initializeTypeScriptOptions(buildStepConfig) {
    const resolvedTsConfig = tsconfig.getTypeScriptConfig(buildStepConfig);
    return (override) => {
        return Object.assign(resolvedTsConfig.compilerOptions, {
            target: override && override.target || 'es5',
            typescript: typescript,
        }, override || {});
    };
}
exports.initializeTypeScriptOptions = initializeTypeScriptOptions;

//# sourceMappingURL=typescript-options.js.map
