/**
 * @fileoverview desc-api-imports
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { isPathRelative } = require("../common");

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
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [
            {
                type: "object",
                properties: {
                    alias: {
                        type: "string",
                    },
                },
            },
        ],
        messages: {
            publicApiImportsError: "Абсолютный импорт разрешен только из Public API (index.ts)",
        },
    },

    create(context) {
        const alias = context.options[0]?.alias || "";

        const allowLayers = {
            widgets: "widgets",
            pages: "pages",
            features: "features",
            entities: "entities",
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
                if (!allowLayers[layer]) {
                    return;
                }

                const isImportNotFromPublicApi = pathParts.length > 2;
                if (isImportNotFromPublicApi) {
                    context.report({ node, messageId: "publicApiImportsError" });
                }
            },
        };
    },
};
