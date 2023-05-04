/**
 * @fileoverview feature sliced relative path checker
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("node:path");
const { isPathRelative } = require("../common");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion", // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature sliced relative path checker",
            recommended: false,
            url: null // URL to the documentation page for this rule
        },
        fixable: "code", // Or `code` or `whitespace`
        schema: [
            {
                type: "object",
                properties: {
                    alias: {
                        type: "string"
                    }
                }
            }
        ],
        messages: {
            onceSliceImportError: "В рамках одного слайса все пути должны быть относительными"
        }
    },

    create(context) {
        const alias = context.options[0]?.alias || "";
        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, "") : value;

                const fromFilename = context.getFilename();

                if (shouldBeRelative(fromFilename, importTo)) {
                    context.report({
                        node,
                        messageId: "onceSliceImportError",
                        fix: (fixer) => {
                            const absolutePath = getAbsolutePath(fromFilename);
                            const absolutePathDir = path.parse(absolutePath).dir;
                            let relativePath = path.relative(absolutePathDir, importTo).replaceAll(path.sep, "/");
                            if (!isPathRelative(relativePath)) {
                                relativePath = "./" + relativePath;
                            }
                            return fixer.replaceText(node.source, `'${relativePath}'`);
                        }
                    });
                }
            }
        };
    }
};

const layers = {
    pages: "pages",
    widgets: "widgets",
    features: "features",
    entities: "entities",
    shared: "shared"
};

function getAbsolutePath(pathImport) {
    const resolveRootSrc = path.resolve("src");
    return path.relative(resolveRootSrc, pathImport);
}

function shouldBeRelative(from, to) {
    if (isPathRelative(to)) {
        return false;
    }
    const toArray = to.split("/");
    const toLayer = toArray[0];
    const toSlice = toArray[1];

    if (!toLayer || !toSlice || !layers[toLayer]) {
        return false;
    }

    const projectFrom = getAbsolutePath(from);
    const fromArray = projectFrom.split(path.sep);

    const fromLayer = fromArray[0];
    const fromSlice = fromArray[1];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }
    if (toLayer === fromLayer && fromLayer === layers.shared) {
        return false;
    }
    return fromSlice === toSlice && toLayer === fromLayer;
}

// console.log(
//     shouldBeRelative(
//         "D:\\work\\ulbi-path-checker\\src\\entities\\Article\\asc\\ewrt\\awer.tsx",
//         "entities/Article/fasfasfas"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "D:\\work\\ulbi-wpack-module-1\\src\\entities\\Article",
//         "entities/ASdasd/fasfasfas"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//         "features/Article/fasfasfas"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article",
//         "features/Article/fasfasfas"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//         "app/index.tsx"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/entities/Article",
//         "entities/Article/asfasf/asfasf"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//         "../../model/selectors/getSidebarItems"
//     )
// );

// console.log(
//     path.toNamespacedPath(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article"
//     )
// );
// console.log(
//     path.toNamespacedPath("C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/entities/Article")
// );
