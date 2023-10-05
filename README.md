# Moneytree Link JavaScript SDK

[![NPM Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.npmjs.org%2F%40moneytree%2Fmt-link-javascript-sdk&query=%24%5B'dist-tags'%5D%5B'latest'%5D&logo=npm&label=%40moneytree%2Fmt-link-javascript-sdk&color=14BF31)](https://www.npmjs.com/package/@moneytree/mt-link-javascript-sdk)

This is a library for browser client to help you integrate Moneytree tools such as My Account and the Vault without having to do worry about the complex configurations.

## For SDK Users

Read the [documentation](https://moneytree.github.io/mt-link-javascript-sdk/) for more information.

## For SDK Maintainers

```bash
yarn install
yarn lint       # runs eslint
yarn test       # runs all the tests
yarn build      # bundles the library
```

There is a minimal sample application in the `sample` directory.

### Documentation

```bash
yarn build:docs # bundles the documentation
yarn start:docs # Serves the documentation
```

We use [docsify](https://docsify.js.org/) to serve the documentation landing page (`docs/README.md`) and [typedoc](https://typedoc.org/) to generate the API documentation (`docs/types`).

### Publishing

```bash
npm version
# after merging the new version to master
npm login
npm publish
```
