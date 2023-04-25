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

const path = require("node:path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const schemaOptions = {
    alias: "@",
    testFilesPatterns: ["**/*.test.*", "**/*.story.*", "**/StoreDecorator.tsx"],
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
            options: [schemaOptions],
        },
        {
            filename: path.resolve("src", "entities\\file.test.ts"),
            code: "import { ArticleListItem } from '@/entities/Article/testing'",
            errors: [],
            options: [schemaOptions],
        },
        {
            filename: path.resolve("src", "entities\\StoreDecorator.tsx"),
            code: "import { ArticleListItem } from '@/entities/Article/testing'",
            errors: [],
            options: [schemaOptions],
        },
    ],

    invalid: [
        {
            code: "import { Article, ArticleView } from '@/entities/Article/model/types/article'",
            errors: [{ messageId: "publicApiImportsError" }],
            options: [schemaOptions],
        },
        {
            filename: path.resolve("src", "entities\\StoreDecorator.tsx"),
            code: "import { Article, ArticleView } from '@/entities/Article/testing/file.test'",
            errors: [{ messageId: "publicApiImportsError" }],
            options: [schemaOptions],
        },
        {
            filename: path.resolve("src", "entities\\forbidden.ts"),
            code: "import { Article, ArticleView } from '@/entities/Article/testing'",
            errors: [{ messageId: "TestingPublicApiImportsError" }], //
            options: [schemaOptions],
        },
    ],
});
