import { IPluginConfiguration, IBuildSystemPathsConfiguration } from 'new_gulptraum';
export interface ITypeScriptPluginPathsConfiguration extends IBuildSystemPathsConfiguration {
    typings?: string;
    tslintConfig?: string;
    schemaOutput?: string;
    sourceIndex?: string;
}
export interface ITypeScriptPluginConfiguration extends IPluginConfiguration<ITypeScriptPluginPathsConfiguration> {
    useTypeScriptForDTS?: boolean;
    importsToAdd?: Array<string>;
    compileToModules?: Array<string>;
}
