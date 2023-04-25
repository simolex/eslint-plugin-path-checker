/**
 * @fileoverview desc-api-imports
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
    RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const aliasOption = {
    alias: "@",
};

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: "module" },
});
ruleTester.run("public-api-imports", rule, {
    valid: [
        {
            code: "import { ArticleListItem } from '../ArticleListItem/ArticleListItem'",
            errors: [],
        },
        {
            code: "import { ArticleListItem } from '@/entities/ArticleListItem'",
            errors: [],
            options: [aliasOption],
        },
    ],

    invalid: [
        {
            code: "import { Article, ArticleView } from '@/entities/Article/model/types/article'",
            errors: [{ messageId: "publicApiImportsError" }],
            options: [aliasOption],
        },
    ],
});
