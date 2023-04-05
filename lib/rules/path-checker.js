/**
 * @fileoverview feature sliced relative path checker
 * @author simolex
 */
"use strict";

const path = require("path");
const process = require("process");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "feature sliced relative path checker",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            onceSliceImportError: "В рамках одного слайса все пути должны быть относительными",
        },
    },

    create(context) {
        return {
            ImportDeclaration(node) {
                const importTo = node.source.value;

                const fromFilename = context.getFilename();
                if (shouldBeRelative(fromFilename, importTo)) {
                    context.report({ node, messageId: "onceSliceImportError" });
                }
            },
        };
    },
};

function isPathRelative(path) {
    return path === "." || path.startsWith("./") || path.startsWith("../");
}

const layers = {
    entities: "entities",
    features: "features",
    shared: "shared",
    pages: "pages",
    widgets: "widgets",
};

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

    const normalizedPath = path.toNamespacedPath(from);
    const projectFrom = normalizedPath.split("src")[1];
    const fromArray = projectFrom.split("\\");
    //process.cwd();

    const fromLayer = fromArray[1];
    const fromSlice = fromArray[2];

    if (!fromLayer || !fromSlice || !layers[fromLayer]) {
        return false;
    }
    if (toLayer === fromLayer && fromLayer === layers.shared) {
        return false;
    }
    return fromSlice === toSlice && toLayer === fromLayer && toLayer;
}

// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
//         "entities/Article/fasfasfas"
//     )
// );
// console.log(
//     shouldBeRelative(
//         "C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article",
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
