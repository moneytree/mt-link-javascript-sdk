# Moneytree Link JavaScript SDK

This library will help you to simply integrate Moneytree tools such as My Account and the Vault without having to do it yourself.


## Installation

### Browser based
Include the script tag 
```html
<script type="text/javascript" src="https://cdn.rawgit.com/moneytree/mt-link-javascript-sdk/<version>/dist/index.js"></script>
```
Change the `<version>` by the one you need (most likely the latest available).
You can also replace `<version>` by `master` to always get the latest published, at your own risk.

### CommonJS
Using NPM simply install the library
```shell
npm install mt-link-javascript-sdk
```

Then you can use it directly in your code
```js
var mtLinkSdk = require('mt-link-javascript-sdk'); // es5
// or
import mtLinkSdk from 'mt-link-javascript-sdk'; // es-next
```

## API

### Inititalising the API
Call the following method with your desired configuration.  
`init(<config>)`

Config properties:
```js
{
  clientId, // string; // The id of the application that asks for authorization.
  response_type, // string; // Tells the authorization server which grant to execute.
  scope, // string[]; // A list of permissions that the application requires.
  redirectUri, // string; // Holds a URL. A successful response from this endpoint results in a redirect to this URL.
  locale, // string; // [optional] To force the display to a specific language (e.g.: en-AU)
  state, // string; // [optional] An opaque value, used for security purposes. If this request parameter is set in the request, then it is returned to the application as part of the redirect_uri.
  appToken, // string; // [optional] The Access Token granted through oauth
  isTestEnvironment // boolean; // [optional] If you wanna use the staging or production environemnt
}
```

### Open the page for the user to authorize your application
`authorize()`

### Set the access token after init
`setToken()`

### Open the setting page of the user account
`openSettings()`

### Open the vault to let the user add credentials
`openVault()`
