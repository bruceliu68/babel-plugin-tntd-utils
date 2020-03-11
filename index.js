const babel = require('@babel/core');
const types = require('@babel/types');

module.exports = function (api, options, dirname) {
  return {
    visitor: {
      ImportDeclaration(path, ref = {}) {
        let { opts } = ref;
        let node = path.node;
        let specifiers = node.specifiers;
        if (opts.library == node.source.value && !types.isImportDeclaration(specifiers[0])) {
          let newImport = specifiers.map((specifier) => (
            types.importDeclaration([types.ImportDefaultSpecifier(specifier.local)], types.stringLiteral(`${node.source.value}/lib/${specifier.local.name}`))
          ));
          path.replaceWithMultiple(newImport)
        }
      }
    }
  }
};