
![logo](logo.png)

You can find the main project here: [Gulptraum on GitHub](https://github.com/5minds/gulptraum)

# TypeScript Plugin for Gulptraum

The TypeScript plugin provides build tasks for the latest TypeScript-Version `(currently 2.4)`.

## Tasks

* build
  * build-typescript
  * build-typescript-dts
  * build-typescript-commonjs
  * build-typescript-system
  * build-typescript-es2015
* clean
  * clean-typescript
  * build-typescript-clean
* doc
  * doc-typescript
  * doc-typescript-clean
  * doc-typescript-shape
  * doc-typescript-generate
* lint
  * lint-typescript
* setup-dev
  * setup-dev-typescript
  * setup-dev-typescript-clean
  * setup-dev-typescript-build
* test
  * test-typescript
  * test-typescript-build
  * test-typescript-run
  * test-typescript-clean
* watch
  * watch-typescript

## Configuration

| Setting | Type | Description |
|---|---|---|
|paths.typings|String|Glob pattern for your type definition files|
|paths.excludes|Array of Strings |Glob patterns to exclude from sources|
|sort|Boolean|True if contents should be merged in alphabetical order|
|useTypeScriptForDTS|Boolean|True if type definitions should be generated from your TypeScript files|
|importsToAdd|Array of Strings|Resources you additionally want to require in your built code|
|paths.tslintConfig|String|Path to your `tslint.json` file|
|paths.compileToModules|Array of Strings|The module types generated from your TypeScript sources|
