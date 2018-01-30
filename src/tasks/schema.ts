import * as path from 'path';
import * as fs from 'fs';
import * as tsJsonSchema from 'typescript-json-schema';
import * as through from 'through2';
import * as File from 'vinyl';
import * as ts from 'typescript';

export function generate(gulp, config, gulptraum): void {

  const defaultCompilerOptions = {
    lib: ['es2015', 'dom'],
    noEmitOnError: false
  };

  let currentCompilerOptions = Object.assign({}, defaultCompilerOptions);
  if (config.compilerOptions) {
    currentCompilerOptions = Object.assign(currentCompilerOptions, config.compilerOptions);
  } else if (config.config && config.config.compilerOptions) {
    currentCompilerOptions = Object.assign(currentCompilerOptions, config.config.compilerOptions);
  }

  currentCompilerOptions.lib = currentCompilerOptions.lib.map((libName: string) => {
    return `lib.${libName}.d.ts`;
  })
  const outputFolderPath = path.resolve(config.paths.root, config.paths.schemaOutput);

  gulptraum.task('typescript-schema', {
    help: 'Generates JSON schemas from your TypeScript sources'
  }, (callback) => {

    return gulp.src(['src/**/*.ts'])
      .pipe(generateSchemasHelper(currentCompilerOptions))
      .pipe(gulp.dest(outputFolderPath));

  });

}

function generateSchemasHelper(compilerOptions: any) {

  const exportedSymbols = getExportedSymbols(compilerOptions);

  const heritage = JSON.stringify(getExportHeritage(compilerOptions), null, 2);

  const generatedSchemas = [];

  return through.obj(function (file, enc, cb) {

    const program = tsJsonSchema.getProgramFromFiles([file.path], compilerOptions);

    const generator = tsJsonSchema.buildGenerator(program);

    if (!generator) {
      console.log('errors during TypeScript compilation - exiting...');
      return;
    }

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

    indexContents += `module.exports._heritage = ${heritage};\n`;

    const indexFile = new File({
      path: 'index.js',
      contents: new Buffer(indexContents, 'utf8')
    })

    this.push(indexFile);

    cb();
  });
}

function getExportedSymbols(compilerOptions: any) {

  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram(['src/index.ts'], compilerOptions, host);

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

function getExportHeritage(compilerOptions: any): any {

  const host = ts.createCompilerHost(compilerOptions);
  const program = ts.createProgram(['src/index.ts'], compilerOptions, host);

  ts.getPreEmitDiagnostics(program);

  const checker = program.getTypeChecker();
  const entryFile = program.getSourceFile('src/index.ts');
  const entrySymbol = checker.getSymbolAtLocation(entryFile);
  const entryExports = checker.getExportsOfModule(entrySymbol);

  const heritage = {};

  for (let symbol of entryExports) {
    
    if (symbol.getFlags() & ts.SymbolFlags.Alias) {
      symbol = checker.getAliasedSymbol(symbol);
    }

    const name = symbol.name;
    
    const interfaces = [];

    if (!symbol.declarations || !Array.isArray(symbol.declarations)) {
      continue;
    }
  
    for (const symbolDeclaration of symbol.declarations) {

      const heritageClauses = (<ts.ClassLikeDeclaration>symbolDeclaration).heritageClauses;

      if (!heritageClauses || !Array.isArray(heritageClauses)) {
        continue;
      }
    
      for (const heritageClause of (<ts.ClassLikeDeclaration>symbolDeclaration).heritageClauses) {
        
        if (!heritageClause || !Array.isArray(heritageClause.types)) {
          continue;
        }
        
        for (const type of heritageClause.types) {
          
          if (!type) {
            continue;
          }
  
          const interfaceName = type.getText();

          interfaces.push(interfaceName);
        }

      }
    }

    if (interfaces.length > 0) {
      heritage[name] = interfaces;
    }
  };

  return heritage;
}
