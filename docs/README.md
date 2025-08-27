## Installation

Install the SDK using `npm` or `yarn`.

```bash
npm install @moneytree/mt-link-javascript-sdk
# or
yarn add @moneytree/mt-link-javascript-sdk
```

Then you can use it directly in your code:

```javascript
// using import
import mtLinkSdk, { MtLinkSdk } from '@moneytree/mt-link-javascript-sdk';

// or using require
const { default: mtLinkSdk, MtLinkSdk } = require('@moneytree/mt-link-javascript-sdk');

// or via window object
const instance = window.mtLinkSdk;
const newInstance = new window.MtLinkSdk();

// mtLinkSdk - an instance of the SDK.
// MtLinkSdk - in case you need to create a new instance of the SDK for whatever reason,
//             e.g: const newInstance = new MtLinkSdk();
```

### `localStorage`

Ensure your App enables access to `localStorage` otherwise magic link login will not work.
Since `sessionStorage` is not shared between browser tabs.

### Polyfills

We use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally, if you wish to support old browsers (e.g: IE11), make sure to add the necessary polyfills.

### Typescript

The source also includes Typescript definitions out of the box.

## [API](types/classes/MtLinkSdk.html ':ignore')

The Moneytree LINK Javascript SDK exposes APIs to get guest consent to access financial data, and exchange an authorization grant for an access token.

The complete list of SDK functions is:

- [`init`](types/classes/MtLinkSdk.html#init ':ignore')
- [`setSamlSubjectId`](types/classes/MtLinkSdk.html#setSamlSubjectId ':ignore')
- [`authorize`](types/classes/MtLinkSdk.html#authorize ':ignore')
- [`authorizeUrl`](types/classes/MtLinkSdk.html#authorizeUrl ':ignore')
- [`onboard`](types/classes/MtLinkSdk.html#onboard ':ignore')
- [`onboardUrl`](types/classes/MtLinkSdk.html#onboardUrl ':ignore')
- [`exchangeToken`](types/classes/MtLinkSdk.html#exchangeToken ':ignore')
- [`tokenInfo`](types/classes/MtLinkSdk.html#tokenInfo ':ignore')
- [`logout`](types/classes/MtLinkSdk.html#logout ':ignore')
- [`logoutUrl`](types/classes/MtLinkSdk.html#logoutUrl ':ignore')
- [`openService`](types/classes/MtLinkSdk.html#openService ':ignore')
- [`openServiceUrl`](types/classes/MtLinkSdk.html#openServiceUrl ':ignore')
- [`requestLoginLink`](types/classes/MtLinkSdk.html#requestLoginLink ':ignore')

Below are examples of common use cases.

### Authorize user & get access token

```javascript
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk';

// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read']
});
// start authorization flow
// If the user is not logged in yet this will prompt them to login
// If the user has not granted consent yet this will prompt them to grant consent
// if the user is logged in and has already granted consent this redirects immediately with an authorization code
mtLinkSdk.authorize();
// after redirect from moneytree back to your app's redirectUri
const token = mtLinkSdk.exchangeToken();
const tokenInfo = mtLinkSdk.tokenInfo(token.access_token);
```

You can also use the [authorizeUrl](types/classes/MtLinkSdk.html#authorizeUrl ':ignore') method to generate the authorization url without opening it immediately.

### Passwordless Onboarding

```javascript
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk';

// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read']
});
// Start onboarding flow for a new user
// After the user completes onboarding this redirects with an authorization code
// If a Monetyree user with this email already exists this prompts the user to login & grant consent (similar to authorize)
mtLinkSdk.onboard({ email: 'user@test.com' });
// after redirect from moneytree back to your app's redirectUri
const token = mtLinkSdk.exchangeToken();
```

You can also use the [onboardUrl](types/classes/MtLinkSdk.html#onboardUrl ':ignore') method to generate the onboard url without opening it immediately.

### Logout

```javascript
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk';

// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read']
});

// logout the user
mtLinkSdk.logout();
```

You can also use the [logoutUrl](types/classes/MtLinkSdk.html#logoutUrl ':ignore') method to generate the logout url without redirecting the user.

### Open Services

With the [openService](types/classes/MtLinkSdk.html#openService ':ignore') function you can open Moneytree services directly from your app.
Alternatively, you can also use [openServiceUrl](types/classes/MtLinkSdk.html#openServiceUrl ':ignore') to generate the url without opening it immediately.

#### Open Vault

```javascript
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk';

// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read']
});
// Open Vault on the services list page
// If the user is not logged in yet this will prompt them to login
// If the user has not granted consent yet this will prompt them to grant consent
mtLinkSdk.openService('vault', { view: 'services-list' });
```

Vault has several different views with different options for each, view the full documentation [here](types/classes/MtLinkSdk.html#openService.openService-3 ':ignore').

#### Open MyAccount

```javascript
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk';

// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read']
});
// Open MyAccount on the settings page
// If the user is not logged in yet this will prompt them to login
mtLinkSdk.openService('myaccount', { view: 'settings' });
```

MyAccount has several different views with different options for each, view the full documentation [here](types/classes/MtLinkSdk.html#openService.openService-2 ':ignore').

### Set identifier for SSO login flow

```javascript
// initialize SDK with application information
mtLinkSdk.init('my-client-id', {
  redirectUri: 'https://localhost:9000',
  scopes: ['guest_read', 'accounts_read', 'transactions_read'],
  authnMethod: 'sso' // configure SDK to use SSO for login
});
// set application specific identifier for SSO login flow
// this identifier will be passed back to your SAML Identity Provider in the SAML AuthnRequest
mtLinkSdk.setSamlSubjectId('my-saml-subject-id');
// Opens Vault, if the user is not logged in it will trigger the SAML SSO login flow and pass the SAML subject ID to the IdP
mtLinkSdk.openService('vault', { view: 'services-list' });
```

## Theming

We support gray labelling some of the services offered by Moneytree, please contact your Moneytree representative for more information.

Currently supported services:

- onboard API
- Vault service
- Link-Kit service
