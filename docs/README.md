## Installation

Install the SDK using `npm` or `yarn`.

```bash
npm install @moneytree/mt-link-javascript-sdk

# or

yarn add @moneytree/mt-link-javascript-sdk
```

Then you can use it directly in your code:

<h6>Usage:</h6>

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

### Typscript

The source also includes Typescript definition out of the box.

### Polyfills
We use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally, if you wish to support old browsers (e.g: IE11), make sure to add the necessary polyfills.

## API

SDK offers various APIs below to help from getting guest consent via authorization to exchange for a token to access guest financial data.

### init

SDK initialization method, it is not necessary to call `init` to use some of the APIs.<br /><br />
APIs that requires beforehand `init` call are usually related to OAuth and requires a client id which can only be set via the `init` parameter. These APIs are listed below:
- authorize
- onboard
- exchangeToken
- tokenInfo

<h6>Usage:</h6>

```javascript
mtLinkSdk.init(clientId, options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| clientId | string | true | | <p>OAuth `clientId` of the app (please request this from your Moneytree representative if you need one).<p><p><strong>NOTE:</strong> SDK will throw an error if none was provided.</p> |
| <span id="api-init_options">options</span> | object | false | | <p>This options includes all the value below and also every `options` parameters of the other APIs, options values passed here during initialization will be used as the default value of other APIs in cases where no value was passed when calling the other APIs.</p><p>The options are [authorize options](#api-authorize_options) and [common options](#common-api-options); refer to each individual links for more details.</p> |
| options.mode | `production`, ` staging`, ` develop`, ` local` | false | `production` | <p>Environment for the SDK to connect to, the SDK will connect to Moneytree production server by default.<li>For Moneytree client, please use `staging` for development as `develop` will contain unstable features.</li><li>`local` should only be used for SDK development as it requires various setup locally.</li></p> |
| options.locale | string | false | Auto detect. | Force Moneytree to load content in this specific locale. A default value will be auto detected based on guest langauges configurations and location if available. Check this [spec](https://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1) for more information.<br /><br />Currently supported values are:<br />`en`, `en-AU`, `ja`. |
| options.cobrandClientId (private) | string | false | | <strong>NOTE: this is for Moneytree internal use, please do not use it to avoid unintended behavior!</strong><br /><br />Brand Moneytree apps with client's branding. E.g: logo or theme.

### authorize

OAuth authorization method to request guest permission to allow data access via [Link API](https://getmoneytree.com/au/link/about).<br /><br />
Guest login are required for this to work, by default we will show the login screen and redirect the guest to the consent screen after they login (Redirection happened immediately if their existing session exists, you can refer [this](#authorize_option_force_logout) option below to force logout an existing guest session).<br /><br />
You can also change to display sign up instead of login screen as default by setting [this](#authorize_option_auth_action) option.

<strong>NOTE:</strong> Please remember to call `init` beforehand.

<h6>Usage:</h6>

```javascript
mtLinkSdk.authorize(options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| <span id="api-authorize_options">options</span> | object | false | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options). |
| options.scopes | string <p><strong>OR</strong></p> string[] | false | Value set during `init`.<p><strong>OR</strong></p>`guest_read` | Scopes of access permissions, can be one or an array of the below scopes.<br /><br />Currently supported scopes are:<br />`guest_read`, `accounts_read`, `points_read`, `point_transactions_read`, `transactions_read`, `transactions_write`, `expense_claims_read`, `categories_read`, `investment_accounts_read`, `investment_transactions_read`, `notifications_read`, `request_refresh`, `life_insurance_read`. |
| options.redirectUri | string | false | Value set during `init`. | OAuth redirection uri, refer [here](https://www.oauth.com/oauth2-servers/redirect-uris/) for more details.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |
| options.state | string | false | Value set during `init`.<p><strong>OR</strong></p>Randomly generated [uuid](<https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)>). | Refer [here](https://auth0.com/docs/protocols/oauth2/oauth-state) for more details.<br /><br /><strong>NOTE:</strong> Make sure to set this value if your server are generating the value from the server and is redirecting back to your server so that your server can use it to exchange for a token. |
| options.codeVerifier | string | false | Value set during `init`.<p><strong>OR</strong></p>Randomly generated [uuid](<https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)>). | For [security reasons](https://developer.okta.com/blog/2019/08/22/okta-authjs-pkce#why-you-should-never-use-the-implicit-flow-again) we removed support of using implicit flow instead opting to use [PKCE](https://auth0.com/docs/flows/concepts/auth-code-pkce)/[code grant](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/).<p>We only support SHA256, hence this `codeVerifier` will be used to generate the `code_challenge` using SHA256 encoding method. Refer [here](https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce) for more details.</p><strong>NOTE:</strong> Make sure to set this value if your server are generating the value from the server and is redirecting back to your server so that your server can use it to exchange for a token. |
| <span id="authorize_option_force_logout">options.forceLogout</span> | boolean | false | `false` | Force existing guest session to logout and call authorize with a clean state. |
| options.country | `AU`, ` JP` | false | Value set during `init`. | Server location for the guest to login or sign up. If you wish to restrict your guest to only one country, make sure to set this value.<br /><br /><strong>NOTE:</strong> For app created after 2020-07-08, the sign up form will display a country selection dropdown for the guest to choose when this value is undefined or invalid. |

### onboard

Onboard allows a new guest to get onboard faster to use an app without having to go through the registration process. All you have to do is provide an email with all the same configuration as [authorize](#authorize) method options, we will then show them a consent screen explaining all the details, the moment a guest gave their approval, a new Moneytree account will be created on their behalf and authorization is completed. Resulting behavior will be the same as [authorize](#authorize) redirection flow.

Onboard will force all current guest session to logout, hence you do not have to call [logout](#logout) manually to ensure a clean state.

If an account with this email existed, we will redirect the guest to the login screen.

<strong>NOTE:</strong>
<li>Please remember to call `init` beforehand.</li>
<li>For legal reason, you will have to setup your app's terms and condition link to use the onboard feature (please consult your Moneytree representative).</li>

<h6>Usage:</h6>

```javascript
mtLinkSdk.onboard(options)
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| options | object | false | Value set during `init`. | Optional parameters.<br /><br />All the supported options are the same as [authorize](#authorize) method options and [common options](#common-api-options) except the options in the following list.<br /><br />Not supported options from [authorize](#authorize) and [common options](#common-api-options) are:<li>forceLogout</li><li>authAction</li><li>showAuthToggle</li><li>showRememberMe</li> |
| options.country | `AU`, ` JP` | true | Value set during `init`. | Server location for the guest to login or sign up.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |
| options.email | string | true | Value set during `init`. | A new Moneytree account will be created with this email, if an existing account with this email exists, the guest will be redirected to login screen.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |

### exchangeToken

Since we are using PKCE/Code grant, we will have to exchange the `code` for a token. You can optionally pass `code` via options parameter or it will fallback to automatically extract it from the browser URL.

By default options values for `state`, `codeVerifier` and `onboard` will used the default value from `init`, however if you explicitly passed a new value when calling `authorize` or `onboard` via the options parameter, make sure to reuse the same value when calling this API or else authentication server will throw an error because the values does not matched.

If there is a `state` passed via this API option (or it exists in the URL), it will be used internally to compared to the `state` used in the previous `authorize` or `onboard` call during the same session, this API will throw an error when both states does not matched. Refer [here](https://auth0.com/docs/protocols/oauth2/oauth-state) for more details.

`code` will be invalidated (can be used only once) after exchanged for a token, it is your responsibility to store the token yourself as the SDK do not store it internally.

Refer [here](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange/) for more details.

<h6>Usage:</h6>

One way to use this API is by calling it in the redirected page script. For example, if `authorize` redirect to `https://yourapp.com/callback?code=somecode`, you can call this API in the script loaded by the redirected URL and the API will automatically extract the code to exchange for a token.

Alternatively, you can extract the `code` manually from the redirected URL and pass it to this API as options anywhere in your codebase as you wish.


```javascript
const token = await mtLinkSdk.exchangeToken(options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| options | object | false | Value set during `init`. | Optional parameters. |
| options.code | string | false | Value from browser URL | Code from OAuth redirection used to exchange for a token, SDK will try to extract it from the browser URL if none was provided.<br /><br /><strong>NOTE:</strong> SDK will throw an error if no value was provided here or failed to extract from browser URL. |
| options.state | string | false | Value set during `init`. | Make sure the value of `state` here is the same state value used during `authorize` or `onboard` call. |
| options.codeVerifier | string | false | Value set during `init`. | Make sure the value of `codeVerifier` here is the same state value used during `authorize` or `onboard` call. |
| options.redirectUri | string | false | Value set during `init`. | Make sure the value of `redirectUri` here is the same state value used during `authorize` or `onboard` call.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |

### tokenInfo

You can validate a token or get guest or resource server information related to the token by calling this API.

<strong>NOTE:</strong> this API will throw an error if the token was expired.

<h6>Usage:</h6>

```javascript
const tokenInfo = await mtLinkSdk.tokenInfo(token, options);
tokenInfo.guestUid // guest's uid
tokenInfo.country // guest's country
tokenInfo.currency // guest's currency
tokenInfo.language // guest's language
tokenInfo.resourceServer // resource server domain
tokenInfo.clientId // app client id
tokenInfo.clientName // app name
tokenInfo.expTimestamp // token expiration timestamp
tokenInfo.scopes // token access scopes
tokenInfo.isMtClient // for internal use
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| token | string | true | | Token you wish to get info of. |
| options | object | false | Value set during `init`. | Optional parameters. |
| options.redirectUri | string | false | Value set during `init`. | Make sure the value of `redirectUri` here is the same state value used during `authorize` or `onboard` call.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |

### logout

Logout current guest from Moneytree.

<h6>Usage:</h6>

```javascript
mtLinkSdk.logout(options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| options | object | false | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options). |

### openService

This is a method to open various services provided by Moneytree such as Moneytree account settings and Vault etc.

<strong>NOTE:</strong> calling this API before calling `init` will open the services without branding (no company logo etc.).

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService(serviceId, options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| serviceId | `vault`, `myaccount-settings`, `link-kit` | true | | Open a service by Id, current supported services are:<br /><li>`vault` - A service to set your banks credentials.</li><li>`myaccount-settings` - Display screens too change your Moneytree account settings.</li><li>`link-kit` - A service to view all your financial data.<br /><br /><strong>NOTE:</strong> SDK will throw an error if none was provided. |
| options | object | false | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options). |

### requestMagicLink

Request for a magic link (password-less link) sent to guest email, clicking on the link in the email will log a guest in directly to the screen as indicated by the parameter.

<h6>Usage:</h6>

```javascript
mtLinkSdk.requestMagicLink(options);
```

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| options | object | false | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options). |
| options.magicLinkTo | string | true | `settings` (for mobile view)<p><strong>OR</strong></p>`settings/update-email` (for desktop view) | Redirection to location after login, current supported location are:<li>`settings` - Root Moneytree account settings screen.</li><li>`settings/authorized-applications` - List of apps currently connected to Moneytree screen.</li><li>`settings/change-language` - Change Moneytree account language screen.<li>`settings/email-preferences` - Change Moneytree email preferences screen</li><li>`settings/delete-account` - Delete Moneytree account screen</li><li>`settings/update-email` - Change Moneytree account email screen</li><li>`settings/update-password` - Change Moneytree account password</li> |
| options.email | string | true | Value set during `init`. | Magic link will be sent to this email.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined. |

## Common API options

Common options are options that is used by multiple APIs. Instead of repeating the same documentation in every APIs, we will link refer them to here.

<strong>NOTE:</strong> Since `options` are optional, SDK will read from [init options](?id=api-init_options) by default if none was provided.

| Parameter | Type | Required | Default Value | Description |
| - | - | - | - | - |
| options.email | string | false | Value set during `init`. | Email used to pre-fill the email field in login or sign up or form. |
| options.backTo | string | false | Value set during `init`. | A redirection URL for redirecting a guest back to during the following condition: <li>Guest click on `Back to [App Name]` button in any Moneytree screens.</li><li>Refuse to give consent to access permission in the consent screen.</li><li>Logout from Moneytree via an app with this client id</li><li>Revoke an app from settings screen opened via an app with this client id</li><br /><br /><strong>NOTE:</strong> No `Back to [App Name]` button will be shown if this value is not set, and any of the actions mentioned above will redirect the guest back to login screen by default. |
| <span id="authorize_option_auth_action">options.authAction</span> | `login`, ` signup` | false | Value set during `init`.<p><strong>OR</strong></p>`login` | Show login or sign up screen when a session do not exists during an `authorize` call. |
| options.showAuthToggle | boolean | false | Value set during `init`.<p><strong>OR</strong></p>`true` | If you wish to disable the login to sign up form toggle button and vice-versa in the auth screen, set this to `false`.
| options.showRememberMe | boolean | false | Value set during `init`.<p><strong>OR</strong></p>`true` | If you wish to disable the `Stayed login for 30 days` checkbox in the login screen, set this to `false`.
| options.isNewTab | boolean | false | Value set during `init`.<p><strong>OR</strong></p>`false` | Call method and open/render in a new browser tab, default to same tab.
| options.sdk_platform (private) | string | false | Generated by the SDK. | <strong>NOTE: this is for Moneytree internal use, please do not use it to avoid unintended behavior!</strong><br /><br />Indicating sdk platform.
| options.sdk_version (private) | semver | false | Generated by the SDK. | <strong>NOTE: this is for Moneytree internal use, please do not use it to avoid unintended behavior!</strong><br /><br />Indicating sdk version.

## Theming

We support gray labelling some of the services offered by Moneytree, please contact your Moneytree representative for more information.

Currently supported services:
- onboard API
- Vault service
- Link-Kit service
