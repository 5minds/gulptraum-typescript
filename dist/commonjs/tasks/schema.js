"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var tsJsonSchema = require("typescript-json-schema");
var through = require("through2");
var File = require("vinyl");
var ts = require("typescript");
function generate(gulp, config, gulptraum) {
    var outputFolderPath = path.resolve(config.paths.root, config.paths.schemaOutput);
    gulptraum.task('typescript-schema', {
        help: 'Generates JSON schemas from your TypeScript sources'
    }, function (callback) {
        return gulp.src(['src/**/*.ts'])
            .pipe(generateSchemasHelper())
            .pipe(gulp.dest(outputFolderPath));
    });
}
exports.generate = generate;
function generateSchemasHelper() {
    var compilerOptions = {
        lib: [
            'lib.es2015.d.ts',
            'lib.dom.d.ts'
        ],
        noEmitOnError: false
    };
    var exportedSymbols = getExportedSymbols();
    var generatedSchemas = [];
    return through.obj(function (file, enc, cb) {
        var _this = this;
        var program = tsJsonSchema.getProgramFromFiles([file.path], compilerOptions);
        var generator = tsJsonSchema.buildGenerator(program);
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
        var heritage = getExportHeritage();
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
function getExportedSymbols() {
    var compilerOptions = {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
        lib: [
            "es2017",
            "dom"
        ]
    };
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
function getExportHeritage() {
    var compilerOptions = {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2017,
        lib: [
            "es2017",
            "dom"
        ]
    };
    var host = ts.createCompilerHost(compilerOptions);
    var program = ts.createProgram(['src/index.ts'], compilerOptions, host);
    ts.getPreEmitDiagnostics(program);
    var checker = program.getTypeChecker();
    var entryFile = program.getSourceFile('src/index.ts');
    var entrySymbol = checker.getSymbolAtLocation(entryFile);
    var entryExports = checker.getExportsOfModule(entrySymbol);
    var heritage = {};
    var exportedSymbols = entryExports.map(function (symbol) {
        if (symbol.getFlags() & ts.SymbolFlags.Alias) {
            symbol = checker.getAliasedSymbol(symbol);
        }
        var name = symbol.name;
        var interfaces = [];
        var declaration = symbol.valueDeclaration;
        if (!declaration) {
            return;
        }
        if (!Array.isArray(declaration.heritageClauses)) {
            return;
        }
        for (var _i = 0, _a = declaration.heritageClauses; _i < _a.length; _i++) {
            var heritageClause = _a[_i];
            if (!heritageClause) {
                return;
            }
            if (!Array.isArray(heritageClause.types)) {
                return;
            }
            for (var _b = 0, _c = heritageClause.types; _b < _c.length; _b++) {
                var type = _c[_b];
                if (!type) {
                    return;
                }
                var interfaceName = type.getText();
                interfaces.push(interfaceName);
            }
        }
        heritage[name] = interfaces;
    });
    return heritage;
}

//# sourceMappingURL=schema.js.map
