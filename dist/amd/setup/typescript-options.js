define(["require", "exports", "./tsconfig", "typescript"], function (require, exports, tsconfig, typescript) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});

//# sourceMappingURL=typescript-options.js.map
