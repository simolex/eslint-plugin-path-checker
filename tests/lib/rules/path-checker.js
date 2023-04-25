/**
 * @fileoverview feature sliced relative path checker
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
    RuleTester = require("eslint").RuleTester;

const path = require("node:path");
//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOption = {
    alias: "@",
};

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("path-checker", rule, {
    valid: [
        {
            filename: path.resolve("src", "pages\\ArticlesPage\\ui\\ArticlesPage\\ArticlesPage"),
            code: "import { articlePageReducer, getArticles } from '../../model/slices/articlePageSlice'",
            errors: [],
        },
    ],

    invalid: [
        {
            filename: path.resolve("src", "pages\\ArticlesPage\\ui\\ArticlesPage\\ArticlesPage"),
            code: "import { articlePageReducer, getArticles } from '@/pages/ArticlesPage/model/slices/articlePageSlice'",
            errors: [
                {
                    messageId: "onceSliceImportError",
                },
            ],
            options: [aliasOption],
        },
    ],
});
