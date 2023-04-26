/**
 * @fileoverview desc-api-imports
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { isPathRelative } = require("../common");
const micromatch = require("micromatch");

const PUBLIC_ERROR = "publicApiImportsError";
const TESTING_ERROR = "testingPublicApiImportsError";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: "desc-api-imports",
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
                    },
                    testFilesPatterns: {
                        type: "array"
                    }
                }
            }
        ],
        messages: {
            [PUBLIC_ERROR]: "Абсолютный импорт разрешен только из Public API (index.ts)",
            [TESTING_ERROR]: "Тестовые данные необходимо импортировать из Public API (testing.ts)"
        }
    },

    create(context) {
        const { alias = "", testFilesPatterns = [] } = context.options[0] ?? {};

        const allowLayers = {
            pages: "pages",
            widgets: "widgets",
            features: "features",
            entities: "entities"
        };

        return {
            ImportDeclaration(node) {
                const value = node.source.value;
                const importTo = alias ? value.replace(`${alias}/`, "") : value;

                if (isPathRelative(importTo)) {
                    return;
                }

                //pathParts: Layer, Slice, Segments
                const pathParts = importTo.split("/");

                const layer = pathParts[0];
                const slice = pathParts[1];
                if (!allowLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = pathParts.length > 2;
                const isTestingPublicApi = pathParts[2] === "testing" && pathParts.length < 4;

                if (isImportNotFromPublicApi && !isTestingPublicApi) {
                    context.report({
                        node,
                        messageId: "publicApiImportsError",
                        fix: (fixer) => {
                            return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}'`);
                        }
                    });
                }

                if (isTestingPublicApi) {
                    const currentFilePath = context.getFilename();

                    const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
                        micromatch.isMatch(currentFilePath, pattern)
                    );
                    if (!isCurrentFileTesting) {
                        context.report({ node, messageId: "testingPublicApiImportsError" });
                    }
                }
            }
        };
    }
};
