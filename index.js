// babel 简单的理解他是一个语法转换器 
// Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）
// Babel 项目是作为一个 monorepo 来进行管理的，它由无数 npm 包组成 其中babel-core为其核心库
// babel 解析代码的过程大致为
// 1，对输入的源代码字符串进行解析并生成初始 抽象语法树（AST）
// 2，对 AST 进行遍历，解析出整个树的 path，
// 3，遍历 AST 树并应用各个插件 生成变换后的 AST 树
// 4， 用 babel-generator 将 AST 输出为转码后的代码字符串

const babel = require('@babel/core');
const types = require('@babel/types');

//Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。

module.exports = function (api, options, dirname) {
	return {
		// 访问者中 获取抽象语法树的 函数会在解析和转换时分别进入一次
		visitor: {
			// 对import转码
			ImportDeclaration(path, ref = {}) {
				let { opts } = ref;
				let node = path.node;
				let specifiers = node.specifiers;
				// 只有libraryName满足才会转码 -- library为字符串
				if (typeof opts.library === "string" && opts.library == node.source.value && !types.isImportDeclaration(specifiers[0])) { // opts是传进来的参数
					let newImport = specifiers.map((specifier) => ( //遍历 所有通过{ isEqual } 这种方式引入声明
						types.importDeclaration( // 创建import ImportDeclaration节点
							[types.ImportDefaultSpecifier(specifier.local)],
							types.stringLiteral(`${node.source.value}/lib/${specifier.local.name}`))
					));
					path.replaceWithMultiple(newImport) //转换AST（抽象语法树）
				} else if (opts.library instanceof Array && !types.isImportDeclaration(specifiers[0])) { // library为数组
					opts.library.forEach(item => {
						if (item === node.source.value) {
							let newImport = specifiers.map((specifier) => (
								types.importDeclaration(
									[types.ImportDefaultSpecifier(specifier.local)],
									types.stringLiteral(`${node.source.value}/lib/${specifier.local.name}`))
							));
							path.replaceWithMultiple(newImport)
						}
					});
				}
			}
		}
	}
};