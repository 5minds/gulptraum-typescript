"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var tsJsonSchema = require("typescript-json-schema");
var through = require("through2");
var File = require("vinyl");
var ts = require("typescript");
function generate(gulp, config, gulptraum) {
    var defaultCompilerOptions = {
        lib: ['es2015', 'dom'],
        noEmitOnError: false
    };
    var currentCompilerOptions = Object.assign({}, defaultCompilerOptions);
    if (config.compilerOptions) {
        currentCompilerOptions = Object.assign(currentCompilerOptions, config.compilerOptions);
    }
    else if (config.config && config.config.compilerOptions) {
        currentCompilerOptions = Object.assign(currentCompilerOptions, config.config.compilerOptions);
    }
    currentCompilerOptions.lib = currentCompilerOptions.lib.map(function (libName) {
        return "lib." + libName + ".d.ts";
    });
    var outputFolderPath = path.resolve(config.paths.root, config.paths.schemaOutput);
    gulptraum.task('typescript-schema', {
        help: 'Generates JSON schemas from your TypeScript sources'
    }, function (callback) {
        return gulp.src(['src/**/*.ts'])
            .pipe(generateSchemasHelper(currentCompilerOptions))
            .pipe(gulp.dest(outputFolderPath));
    });
}
exports.generate = generate;
function generateSchemasHelper(compilerOptions) {
    var exportedSymbols = getExportedSymbols(compilerOptions);
    var generatedSchemas = [];
    return through.obj(function (file, enc, cb) {
        var _this = this;
        var program = tsJsonSchema.getProgramFromFiles([file.path], compilerOptions);
        var generator = tsJsonSchema.buildGenerator(program);
        if (!generator) {
            console.log('errors during TypeScript compilation - exiting...');
            return;
        }
        var symbols = generator.getUserSymbols();
        symbols.forEach(function (symbol) {
            var isMatch = exportedSymbols.some(function (exportedSymbol) {
                return symbol == exportedSymbol;
            });
            if (!isMatch) {
                return;
            }
            var schema = generator.getSchemaForSymbol(symbol);
            var schemaString = JSON.stringify(schema, null, 2);
            var base = path.join(file.path, '..');
            var currentFile = new File({
                base: base,
                path: path.join(base, symbol + ".json"),
                contents: new Buffer(schemaString, 'utf8')
            });
            _this.push(currentFile);
            if (generatedSchemas.indexOf(symbol) < 0) {
                generatedSchemas.push(symbol);
            }
        });
        var indexContents = "'use strict';\n\n";
        generatedSchemas.forEach(function (schema) {
            indexContents += "module.exports." + schema + " = require('./" + schema + ".json');\n";
        });
        var heritage = getExportHeritage(compilerOptions);
        indexContents += "module.exports._heritage = ";
        indexContents += JSON.stringify(heritage, null, 2);
        indexContents += ";\n";
        var indexFile = new File({
            path: 'index.js',
            contents: new Buffer(indexContents, 'utf8')
        });
        this.push(indexFile);
        cb();
    });
}
function getExportedSymbols(compilerOptions) {
    var host = ts.createCompilerHost(compilerOptions);
    var program = ts.createProgram(['src/index.ts'], compilerOptions, host);
    ts.getPreEmitDiagnostics(program);
    var checker = program.getTypeChecker();
    var entryFile = program.getSourceFile('src/index.ts');
    var entrySymbol = checker.getSymbolAtLocation(entryFile);
    var entryExports = checker.getExportsOfModule(entrySymbol);
    var exportedSymbols = entryExports.map(function (symbol) {
        if (symbol.getFlags() & ts.SymbolFlags.Alias) {
            symbol = checker.getAliasedSymbol(symbol);
        }
        return symbol.name;
    });
    return exportedSymbols;
}
function getExportHeritage(compilerOptions) {
    var host = ts.createCompilerHost(compilerOptions);
    var program = ts.createProgram(['src/index.ts'], compilerOptions, host);
    ts.getPreEmitDiagnostics(program);
    var checker = program.getTypeChecker();
    var entryFile = program.getSourceFile('src/index.ts');
    var entrySymbol = checker.getSymbolAtLocation(entryFile);
    var entryExports = checker.getExportsOfModule(entrySymbol);
    var heritage = {};
    for (var _i = 0, entryExports_1 = entryExports; _i < entryExports_1.length; _i++) {
        var symbol = entryExports_1[_i];
        if (symbol.getFlags() & ts.SymbolFlags.Alias) {
            symbol = checker.getAliasedSymbol(symbol);
        }
        var name_1 = symbol.name;
        var interfaces = [];
        if (!symbol.declarations || !Array.isArray(symbol.declarations)) {
            continue;
        }
        for (var _a = 0, _b = symbol.declarations; _a < _b.length; _a++) {
            var symbolDeclaration = _b[_a];
            var heritageClauses = symbolDeclaration.heritageClauses;
            if (!heritageClauses || !Array.isArray(heritageClauses)) {
                continue;
            }
            for (var _c = 0, _d = symbolDeclaration.heritageClauses; _c < _d.length; _c++) {
                var heritageClause = _d[_c];
                if (!heritageClause || !Array.isArray(heritageClause.types)) {
                    continue;
                }
                for (var _e = 0, _f = heritageClause.types; _e < _f.length; _e++) {
                    var type = _f[_e];
                    if (!type) {
                        continue;
                    }
                    var interfaceName = type.getText();
                    interfaces.push(interfaceName);
                }
            }
        }
        if (interfaces.length > 0) {
            heritage[name_1] = interfaces;
        }
    }
    ;
    return heritage;
}

//# sourceMappingURL=schema.js.map
