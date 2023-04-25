/**
 * @fileoverview -
 * @author simolex
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
    RuleTester = require("eslint").RuleTester;

const path = require("node:path");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const schemaOptions = {
    alias: "@",
    ignoreImportPatterns: []
};

const ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: "module" }
});
ruleTester.run("layer-imports", rule, {
    valid: [
        {
            filename: path.resolve("src", "features\\Article"),
            code: "import { Button, ButtonTheme } from '@/shared/Button'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "features\\Article"),
            code: "import { Button, ButtonTheme } from '@/entities/Article'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "app\\providers"),
            code: "import { Button, ButtonTheme } from '@/widgets/Article'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "widgets\\Page"),
            code: "import { memo, ReactNode, useCallback } from 'react'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "app\\providers"),
            code: "import { AxiosInstance } from 'axios'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "index.tsx"),
            code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
            errors: [],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "entities\\Article.tsx"),
            code: "import { StateSchema } from '@/app/provider/StoreProvider'",
            errors: [],
            options: [
                {
                    alias: "@",
                    ignoreImportPatterns: ["**/StoreProvider"]
                }
            ]
        }
    ],

    invalid: [
        {
            filename: path.resolve("src", "entities\\providers"),
            code: "import { Button, ButtonTheme } from '@/features/Article'",
            errors: [{ messageId: "layerImportsError" }],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "features\\providers"),
            code: "import { Button, ButtonTheme } from '@/widgets/Article'",
            errors: [{ messageId: "layerImportsError" }],
            options: [schemaOptions]
        },
        {
            filename: path.resolve("src", "entities\\providers"),
            code: "import { Button, ButtonTheme } from '@/widgets/Article'",
            errors: [{ messageId: "layerImportsError" }],
            options: [schemaOptions]
        }
    ]
});
