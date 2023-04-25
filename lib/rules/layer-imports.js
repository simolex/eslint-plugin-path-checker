/**
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const path = require("node:path");
const { isPathRelative } = require("../common");
const micromatch = require("micromatch");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
    meta: {
        type: "suggestion", // `problem`, `suggestion`, or `layout`
        docs: {
            description: "-",
            recommended: false,
            url: null // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [
            {
                type: "object",
                properties: {
                    alias: {
                        type: "string"
                    },
                    ignoreImportPatterns: {
                        type: "array"
                    }
                }
            }
        ],
        messages: {
            layerImportsError:
                "Слой может импортировать в себя только нижележащие слои ( Shared, Entities, Features, Widgets, Pages, App )"
        }
    },

    create(context) {
        const { alias = "", ignoreImportPatterns = [] } = context.options[0] ?? {};

        const layers = {
            app: ["pages", "widgets", "features", "entities", "shared"],
            pages: ["widgets", "features", "entities", "shared"],
            widgets: ["features", "entities", "shared"],
            features: ["shared", "entities"],
            entities: ["shared", "entities"],
            shared: ["shared"]
        };

        const allowLayers = {
            app: "app",
            pages: "pages",
            widgets: "widgets",
            features: "features",
            entities: "entities",
            shared: "shared"
        };

        const getCurrentFileLayer = () => {
            const currentFilePath = context.getFilename();
            const resolveRootPath = path.resolve("src");
            const projectPath = path.relative(resolveRootPath, currentFilePath);
            const partsPath = projectPath.split(path.sep);

            return partsPath?.[0];
        };

        const getImportLayer = (value) => {
            const importPath = alias ? value.replace(`${alias}/`, "") : value;
            const partsPath = importPath.split("/");

            return partsPath?.[0];
        };

        return {
            ImportDeclaration(node) {
                const importPath = node.source.value;
                const currentFileLayer = getCurrentFileLayer();
                const importLayer = getImportLayer(importPath);

                if (isPathRelative(importPath)) {
                    return;
                }

                if (!allowLayers[importLayer] || !allowLayers[currentFileLayer]) {
                    return;
                }

                const isIgnored = ignoreImportPatterns.some((pattern) => micromatch.isMatch(importPath, pattern));
                if (isIgnored) {
                    return;
                }

                if (!layers[currentFileLayer]?.includes(importLayer)) {
                    context.report({ node, messageId: "layerImportsError" });
                }
            }
        };
    }
};
