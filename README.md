# eslint-plugin-simolex-plugin-lint

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-simolex-plugin-lint`:

```sh
npm install eslint-plugin-simolex-plugin-lint --save-dev
```

## Usage

Add `simolex-plugin-lint` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": ["simolex-plugin-lint"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "simolex-plugin-lint/path-checker": 2
    }
}
```

## Rules

<!-- begin auto-generated rules list -->

TODO: Run eslint-doc-generator to generate the rules list.

<!-- end auto-generated rules list -->
