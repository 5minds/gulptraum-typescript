import * as path from 'path';
import * as fs from 'fs';
import * as tsJsonSchema from 'typescript-json-schema';
import * as through from 'through2';
import * as File from 'vinyl';

export function generate(gulp, config, gulptraum): void {

  const outputFolderPath = path.resolve(config.paths.root, config.paths.schemaOutput);

  gulptraum.task('typescript-schema', {
    help: 'Generates JSON schemas from your TypeScript sources'
  }, (callback) => {

    return gulp.src(['src/**/*.ts'])
      .pipe(generateSchemasHelper())
      .pipe(gulp.dest(outputFolderPath));

  });

}

function generateSchemasHelper() {
  
  const compilerOptions = {
    lib: [
      'lib.es2015.d.ts',
      'lib.dom.d.ts'
    ],
    noEmitOnError: false
  };

  const exportedSymbols = getExportedSymbols();

  const generatedSchemas = [];

  return through.obj(function (file, enc, cb) {

    const program = tsJsonSchema.getProgramFromFiles([file.path], compilerOptions);

    const generator = tsJsonSchema.buildGenerator(program);
    const symbols = generator.getUserSymbols();

    symbols.forEach((symbol) => {

      const isMatch = exportedSymbols.some((exportedSymbol) => {
        return symbol == exportedSymbol;
      });

      if (!isMatch) {
        return;
      }

      const schema = generator.getSchemaForSymbol(symbol);
      const schemaString = JSON.stringify(schema, null, 2);

      const base = path.join(file.path, '..');

      const currentFile = new File({
        base: base,
        path: path.join(base, `${symbol}.json`),
        contents: new Buffer(schemaString, 'utf8')
      });

      this.push(currentFile);

      if (generatedSchemas.indexOf(symbol) < 0) {
        generatedSchemas.push(symbol);
      }
    });

    let indexContents = `'use strict';\n\n`;

    generatedSchemas.forEach((schema) => {
      indexContents += `module.exports.${schema} = require('./${schema}.json');\n`;
    });

    const indexFile = new File({
      path: 'index.js',
      contents: new Buffer(indexContents, 'utf8')
    })

    this.push(indexFile);

    cb();
  });
}

function getExportedSymbols() {

  const ts = require('typescript');
  const tsconfig = require('./tsconfig.json');

  const host = ts.createCompilerHost(tsconfig.compilerOptions);
  const program = ts.createProgram(['src/index.ts'], tsconfig.compilerOptions, host);

  ts.getPreEmitDiagnostics(program);

  const checker = program.getTypeChecker();
  const entryFile = program.getSourceFile('src/index.ts');
  const entrySymbol = checker.getSymbolAtLocation(entryFile);
  const entryExports = checker.getExportsOfModule(entrySymbol);

  const exportedSymbols = entryExports.map((symbol) => {

    if (symbol.getFlags() & ts.SymbolFlags.Alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    return symbol.name;
  });

  return exportedSymbols;
}