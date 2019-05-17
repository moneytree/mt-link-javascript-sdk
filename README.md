# Moneytree Link JavaScript SDK

This is a library for browser client to help you integrate Moneytree tools such as My Account and the Vault without having to do it yourself.

## Installation

### Browser based

Include the script tag

```html
<script
  type="text/javascript"
  src="https://cdn.jsdelivr.net/npm/@moneytree/mt-link-javascript-sdk@<version>/dist/index.js"
></script>
```

Change the `<version>` by the one you need (most likely the latest available).
You can also replace `<version>` by `latest` to always get the latest published, at your own risk.

You will find the library under `window.mtLinkSdk`.

### CommonJS

Using NPM simply install the library

```shell
npm install @moneytree/mt-link-javascript-sdk
```

Then you can use it directly in your code:

```js
var mtLinkSdk = require('@moneytree/mt-link-javascript-sdk'); // es5
// or
import mtLinkSdk from '@moneytree/mt-link-javascript-sdk'; // es-next
```

The source also include a Typescript definition.

## API

### Initialization
`mtLinkSdk.init(config);`

Always call the `init` method to initialize before using any other API, calling any other methods before initialization will failed.
`init` method receives a config parameter. The structure of the config parameter is as below:

```js
{
  clientId: string; // The ID of the application.
  redirectUri?: string; // Redirect the user to this URI after the application has been authorized successfully.
  scope?: string[]; // An arrays of permissions that the application requires.
  responseType?: 'code' | 'token'; // Tells the authorization server to use either 'code' or 'token' grant.

  state?: string; // To hold a string (can be encoded), the same string will be appended to the redirected URI after a request. Can be use for validation or keep track of an application previous state before the request.

  newTab?: boolean; // When set to "true", always API call will execute the request in a new browser tab.
  isTestEnvironment?: boolean; // When set to "true", staging domain will be used for all requests.
  locale?: string; // E.g: "en", "en-AU". Will inform the authorization server to use this locale if it is supported.

  authPage?: 'login' | 'signup'; // Type of screen to display if the guest is not logged in (no valid session) while calling the API.
  email?: string; // Prefill the login or sign up form with this email value.
  backTo?: string; // Revoking the application access, logout, delete guest account or clicking on a "go back" header will redirect the guest to the URI set in this value. After a redirection the URI will appended with either (revoke_app, delete_account, open_vault, logout). E.g: http://google.com?action=revoke
  showAuthToggle?: boolean; // Sign up and login sceens can toggle between each other with a button, setting this value to "false" will hide the button.
}
```

Apart from `clientId` which is mandatory for initialization, everything else with a `?` is optional and have a default value as below.

```js
{
  redirectUri: `${location.protocol}//${location.host}/callback`
  responseType: 'token',

  newTab: false,
  isTestEnvironment: false,

  authPage: 'login',
  showAuthToggle: true,

  // everything below will not be set and used
  scope: undefined, // authorization server will default to "guest_read"
  state: undefined,

  locale: undefined,

  email: undefined,
  backTo: undefined
}
```

### Open the page for the user to authorize your application

`mtLinkSdk.authorize(options);`
All the acceptable options value are the same as initilization config object exclude the `clientId`.
Options passed via this API will override the config passed during initialization.

Calling this method before `init` will throw an `Error`.

### Open the setting page of the user account

`mtLinkSdk.openSettings(options);`
All the acceptable options value are the same as initilization config object excluding the follwing:
- `clientId`
- `redirectUri`
- `scope`
- `responseType`
Options passed via this API will override the config passed during initialization.

Calling this method before `init` will throw an `Error`.

### Open the vault to let the user add credentials

`mtLinkSdk.openVault(options);`
All the acceptable options are exactly the same as the `openSettings`.
