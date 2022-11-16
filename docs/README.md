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

The source also includes Typescript definitions out of the box.

### Polyfills

We use [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally, if you wish to support old browsers (e.g: IE11), make sure to add the necessary polyfills.

## API

The Moneytree LINK Javascript SDK exposes APIs to get guest consent to access financial data, and exchange an authorization grant for an access token.

### init

The `init` call is used to initialize the SDK and set default options for API calls. Some LINK APIs can be used without calling `init`.<br /><br />
Calls related to OAuth require a client id which can only be set via the `init` function. These APIs include:

- authorize
- onboard
- exchangeToken
- tokenInfo

<h6>Usage:</h6>

```javascript
mtLinkSdk.init(clientId, options);
```

| Parameter                                  | Type                                        | Required | Default Value | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------ | ------------------------------------------- | -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientId                                   | string                                      | true     |               | <p>OAuth `clientId` of the app (please request this from your Moneytree representative if you need one).<p><p><strong>NOTE:</strong> This function will throw an error if this parameter isn't provided.</p>                                                                                                                                                                                                                 |
| <span id="api-init_options">options</span> | object                                      | false    |               | <p>These options include all of the values below and also all `options` parameters of the other APIs. Options values passed here during initialization will be used by default if no options are passed when calling a specific API.</p><p>Available options are documented under [authorize options](#api-authorize_options) and [common options](#common-api-options); refer to each individual link for more details.</p> |
| options.mode                               | `production`, `staging`, `develop`, `local` | false    | `production`  | <p>Environment for the SDK to connect to, the SDK will connect to the Moneytree production server by default.<ul><li>Moneytree clients should use `staging` for development as `develop` may contain unstable features.</li><li>`local` should only be used for SDK development as it has local dependencies.</li></ul></p>                                                                                                  |
| options.locale                             | string                                      | false    | Auto detect.  | Force Moneytree to load content in this specific locale. A default value will be auto detected based on guest langauges configurations and location if available. Check this [spec](https://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1) for more information.<br /><br />Currently supported values are:<br />`en`, `en-AU`, `ja`.                                                                                    |
| options.cobrandClientId (private)          | string                                      | false    |               | <strong>NOTE: This is an internal attribute. Please do not use it unless instructed by your integration representative.</strong><br /><br />Brand Moneytree apps with client's branding. E.g: logo or theme.                                                                                                                                                                                                                 |

### authorize

OAuth authorization method to request guest consent to access data via the [Link API](https://getmoneytree.com/au/link/about).<br /><br />
For [security reasons](https://developer.okta.com/blog/2019/08/22/okta-authjs-pkce#why-you-should-never-use-the-implicit-flow-again) we removed support for implicit flow. We have opted for the [PKCE](https://auth0.com/docs/flows/concepts/auth-code-pkce)/[code grant](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/) flow.<br /><br />
Guest login is required for this SDK to work, by default we will show the login screen and redirect the guest to the consent screen after they log in (Redirection happens immediately if they are currently logged in; you may pass the [forceLogout option](#authorize_option_force_logout) to force the guest to log in, even if they have an active session.)<br /><br />
You may also choose to display the sign up form by default by passing the [authAction option](#authorize_option_auth_action).

<strong>NOTE:</strong> You must initialize the SDK (via the `init` method) before calling this API.

<h6>Usage:</h6>

```javascript
mtLinkSdk.authorize(options);
```

| Parameter                                                           | Type                                       | Required | Default Value                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span id="api-authorize_options">options</span>                     | object                                     | false    | Value set during `init`.                                                                                                                                       | Optional parameters as described in [common options](#common-api-options).                                                                                                                                                                                                                                                                                                                                                    |
| options.scopes                                                      | string <p><strong>OR</strong></p> string[] | false    | Value set during `init`.<p><strong>OR</strong></p>`guest_read`                                                                                                 | Access scopes you're requesting. This can be a single scope, or an array of scopes.<br /><br />Currently supported scopes are:<br />`guest_read`, `accounts_read`, `points_read`, `point_transactions_read`, `transactions_read`, `transactions_write`, `expense_claims_read`, `categories_read`, `investment_accounts_read`, `investment_transactions_read`, `notifications_read`, `request_refresh`, `life_insurance_read`. |
| options.redirectUri                                                 | string                                     | false    | Value set during `init`.                                                                                                                                       | OAuth redirection URI, refer [here](https://www.oauth.com/oauth2-servers/redirect-uris/) for more details.<br /><br /><strong>NOTE:</strong> This function will throw an error if this value is undefined <strong>and</strong> no default value was provided in the [init options](?id=api-init_options).                                                                                                                     |
| options.state                                                       | string                                     | false    | Value set during `init`.<p><strong>OR</strong></p>Randomly generated [uuid](<https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_(random)>). | Refer [here](https://auth0.com/docs/protocols/oauth2/oauth-state) for more details.<br /><br /><strong>NOTE:</strong> Make sure to set this value explicitly if your server generates an identifier for the OAuth authorization request so that you can use to acquire the access token after the OAuth redirect occurs.                                                                                                      |
| options.codeChallenge                                               | string                                     | false    |                                                                                                                                                                | We only support SHA256 as code challenge method, therefore please ensure the `code_challenge` was generated using the SHA256 hash algorithm. [Click here](https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce) for more details.</p><strong>NOTE:</strong> Set this value only if your server wish to use PKCE flow.                                                                                      |
| options.pkce                                                        | boolean                                    | false    | false                                                                                                                                                          | Set to `true` if you wish to use PKCE flow on the client side, SDK will automatically generate the code challenge from a locally generated code verifier and use the code verifier in [exchangeToken](#exchangetoken).                                                                                                                                                                                                        |
| <span id="authorize_option_force_logout">options.forceLogout</span> | boolean                                    | false    | `false`                                                                                                                                                        | Force existing guest session to logout and call authorize with a clean state.                                                                                                                                                                                                                                                                                                                                                 |

### onboard

The onboard API allows a new guest to get onboard faster without having to go through the registration process. All you have to do is provide an emai address and pass the same options parameter as the [authorize](#authorize) function. We will display a consent screen explaining the access requests and applicable scopes. Once the guest consents, a new Moneytree account will be created on their behalf and authorization is completed. Resulting behavior will be the same as the [authorize](#authorize) redirection flow.

Onboard will force any current guest session to logout, hence you do not have to call [logout](#logout) manually to ensure a clean state.

If an account with this email address already exists we will redirect the guest to the login screen.

<strong>NOTE:</strong>

<li>You must call `init` before using this API.</li>
<li>For legal reasons, you will have to set up your app's terms and conditions link to use the onboard API. Please ask your Moneytree representative for more details.</li>

<h6>Usage:</h6>

```javascript
mtLinkSdk.onboard(options);
```

| Parameter     | Type   | Required | Default Value            | Description                                                                                                                                                                                                                                                                                                                                                              |
| ------------- | ------ | -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| options       | object | false    | Value set during `init`. | Optional parameters.<br /><br />Most options are the same as the [authorize method](#authorize) options and [common options](#common-api-options) with a few exceptions.<br /><br />Unsupported options from [authorize](#authorize) and [common options](#common-api-options) are:<li>forceLogout</li><li>authAction</li><li>showAuthToggle</li><li>showRememberMe</li> |
| options.email | string | true     | Value set during `init`. | A new Moneytree account will be created with this email address. If an existing account with this email exists, the guest will be redirected to the login screen.<br /><br /><strong>NOTE:</strong> SDK will throw an error if both values here and from the [init options](?id=api-init_options) are undefined.                                                         |

### exchangeToken

Since we are using PKCE/Code grant, we will have to exchange the `code` for a token. You can optionally pass `code` via options parameter or it will fallback to automatically extract it from the browser URL.

`code` will be invalidated (can be used only once) after exchanged for a token, it is your responsibility to store the token yourself as the SDK does not store it internally.

Refer [here](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange/) for more details.

<h6>Usage:</h6>

One way to use this API is by calling it in the script on your redirection page. For example, if `authorize` redirects to `https://yourapp.com/callback?code=somecode`, you can call this function in the script loaded on that redirection page and the client library will automatically extract the code to exchange for a token.

Alternatively, you can extract the `code` manually from the redirect URL and pass it to this function via the options object yourself.

```javascript
const token = await mtLinkSdk.exchangeToken(options);
```

| Parameter            | Type   | Required | Default Value            | Description                                                                                                                                                                                                                                                                                    |
| -------------------- | ------ | -------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options              | object | false    | Value set during `init`. | Optional parameters.                                                                                                                                                                                                                                                                           |
| options.code         | string | false    | Value from browser URL   | Code from OAuth redirection used to exchange for a token, SDK will try to extract it from the browser URL if none is provided.<br /><br /><strong>NOTE:</strong> SDK will throw an error if no value is provided here and the client library failed to extract it from browser URL.            |
| options.codeVerifier | string | false    |                          | If you pass a `codeChallenge` option during the `authorize` or `onboard` call and wish to exchange the token on the client side application, make sure to set the code verifier used to generate the said `codeChallenge` here.                                                                |
| options.redirectUri  | string | false    | Value set during `init`. | Make sure the value of `redirectUri` here is the same redirectUri value used during the `authorize` or `onboard` call.<br /><br /><strong>NOTE:</strong> The SDK will throw an error if both this parameter and the default value from the [init options](?id=api-init_options) are undefined. |

### tokenInfo

You can validate a token or get guest or resource server information related to the token by calling this API.

<strong>NOTE:</strong> This function will throw an error if the token has expired.

<h6>Usage:</h6>

```javascript
const tokenInfo = await mtLinkSdk.tokenInfo(token);
tokenInfo.iat; // token creation timestamp,
tokenInfo.exp; // token expiration timestamp,
tokenInfo.sub; // guest uid or null,
tokenInfo.scope; // string with space separated scopes
tokenInfo.client_id; // application client id or null
tokenInfo.app; // application related information or null
tokenInfo.app.name; // application name
tokenInfo.app.is_mt; // is moneytree client (internal usage)
tokenInfo.guest; // guest related information or null
tokenInfo.guest.email; // guest email if available
tokenInfo.guest.country; // guest country
tokenInfo.guest.currency; // guest currency,
tokenInfo.guest.lang; // guest language
```

| Parameter | Type   | Required | Default Value | Description                     |
| --------- | ------ | -------- | ------------- | ------------------------------- |
| token     | string | true     |               | Token you wish to get info for. |

### logout

Logout current guest from Moneytree.

<h6>Usage:</h6>

```javascript
mtLinkSdk.logout(options);
```

| Parameter | Type   | Required | Default Value            | Description                                                                         |
| --------- | ------ | -------- | ------------------------ | ----------------------------------------------------------------------------------- |
| options   | object | false    | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options). |

### openService

This is a method to open various services provided by Moneytree such as Moneytree account settings, Vault etc.

<strong>NOTE:</strong> calling this API before calling `init` will open the services view without branding (company logo etc.)

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService(serviceId, options);
```

| Parameter                  | Type                                                                                                                   | Required | Default Value            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| serviceId                  | `vault`, `myaccount`, `link-kit`                                                                                       | true     |                          | Open a service by Id, current supported services are:<br /><li>`vault` - Manage your financial institution credentials.</li><li>`myaccount` - Manage your Moneytree account settings.</li><li>`link-kit` - View all your financial data.<br /><br /><strong>NOTE:</strong> This function will throw an error if you do not specify a valid service ID.                                                                                                                                                              |
| options                    | object                                                                                                                 | false    | Value set during `init`. | Optional parameters. Includes all options in [common options](#common-api-options).                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| options.view for Vault     | `services-list`, `service-connection`, `connection-setting`, `customer-support`                                        | false    |                          | We provide options for opening a specific page on Vault and MyAccount. Please check the following sessions:<br /> <li>[Open Vault Services Page](#open-vault-services-page)</li><li>[Open Vault Service Connection Page](#open-vault-service-connection-page)</li><li>[Open Vault Service Setting Page](#open-vault-service-setting-page)</li><li>[Open Vault Customer Support Page](#open-vault-customer-support-page)</li><br /><br /><strong>NOTE:</strong> The serviceId must be `vault` to enable this option. |
| options.view for MyAccount | `authorized-applications`, `change-language`, `email-preferences`, `delete-account`, `update-email`, `update-password` | false    |                          | We provide options for opening a specific page on MyAccount. Please check the following sessions:<br /> <li>[Open MyAccount Page](#open-myaccount-page)</li> <br /><br /><strong>NOTE:</strong> The serviceId must be `myaccount` to enable this option.                                                                                                                                                                                                                                                            |

#### Open Vault Services Page

It has to include these properties of `options` below when calling [openService](#openservice) API.

<strong>NOTE:</strong> This scenario only works when serviceId is `vault`.

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService('vault', { view: 'services-list', type: 'bank', group: 'grouping_bank', search: 'japan' });
```

| Parameter      | Type                                                                                                                                                                                                                                                                                                                                                                                           | Required | Default Value | Description                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------- | --------------------------------------- |
| serviceId      | `vault`                                                                                                                                                                                                                                                                                                                                                                                        | true     |               | Open a Vault service.                   |
| options.view   | `services-list`                                                                                                                                                                                                                                                                                                                                                                                | true     |               | Assign to open services page.           |
| options.type   | `bank` (personal bank), <br />`credit_card` (personal credit card), <br />`stored_value` (electronic money), `point` (loyalty point), <br />`corporate` (corporate bank or card)                                                                                                                                                                                                               | false    |               | Filter the services by type.            |
| options.group  | `grouping_bank`, `grouping_bank_credit_card`, `grouping_bank_dc_card`, `grouping_corporate_credit_card`, `grouping_credit_card`, `grouping_credit_coop`, `grouping_credit_union`, `grouping_dc_pension_plan`, `grouping_debit_card`, `grouping_digital_money`, `grouping_ja_bank`, `grouping_life_insurance`, `grouping_point`, `grouping_regional_bank`, `grouping_stock`, `grouping_testing` | false    |               | Filter the services by group.           |
| options.search | string                                                                                                                                                                                                                                                                                                                                                                                         | false    |               | Filter the services by the search term. |

#### Open Vault Service Connection Page

It has to include these properties of `options` below when calling [openService](#openservice) API.

<strong>NOTE:</strong> This scenario only works when serviceId is `vault`.

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService('vault', { view: 'service-connection', entityKey: 'yucho_bank' });
```

| Parameter         | Type                 | Required | Default Value | Description                                                                                                           |
| ----------------- | -------------------- | -------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| serviceId         | `vault`              | true     |               | Open a Vault service                                                                                                  |
| options.view      | `service-connection` | true     |               | Assign to open service connection page                                                                                |
| options.entityKey | string               | true     |               | Service entity key <br /><br /><strong>NOTE:</strong> Top page of the Vault would be shown if `entityKey` is invalid. |

#### Open Vault Service Setting Page

It has to include these properties of `options` below when calling [openService](#openservice) API.

<strong>NOTE:</strong> This scenario only works when serviceId is `vault`.

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService('vault', { view: 'connection-setting', credentialId: '123456' });
```

| Parameter            | Type                 | Required | Default Value | Description                                                                                                                     |
| -------------------- | -------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| serviceId            | `vault`              | true     |               | Open a Vault service                                                                                                            |
| options.view         | `connection-setting` | true     |               | Assign to open connection setting page                                                                                          |
| options.credentialId | string               | true     |               | Service credential Id <br /><br /><strong>NOTE:</strong> Top page of the Vault would be shown if the `credentialId` is invalid. |

#### Open Vault Customer Support Page

It has to include these properties of `options` below when calling [openService](#openservice) API.

<strong>NOTE:</strong> This scenario only works when serviceId is `vault`.

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService('vault', { view: 'customer-support' });
```

| Parameter    | Type               | Required | Default Value | Description                          |
| ------------ | ------------------ | -------- | ------------- | ------------------------------------ |
| serviceId    | `vault`            | true     |               | Open a Vault service                 |
| options.view | `customer-support` | true     |               | Assign to open customer support page |

#### Open MyAccount Page

It has to include these properties of `options` below when calling [openService](#openservice) API.

<strong>NOTE:</strong> This scenario only works when serviceId is `myaccount`.

<h6>Usage:</h6>

```javascript
mtLinkSdk.openService('myaccount', { view: 'settings/update-email' });
```

| Parameter    | Type        | Required | Default Value                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| serviceId    | `myaccount` | true     |                                                                                                  | Open MyAccount                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| options.view | string      | false    | `settings` (for mobile view)<p><strong>OR</strong></p>`settings/update-email` (for desktop view) | Directly go to the chosen page. Currently supported locations include:<li>`settings` - Main Moneytree account settings screen.</li><li>`settings/authorized-applications` - List of apps currently connected to Moneytree.</li><li>`settings/change-language` - Change Moneytree account language screen.<li>`settings/email-preferences` - Change Moneytree email preferences screen</li><li>`settings/delete-account` - Delete Moneytree account screen.</li><li>`settings/update-email` - Change Moneytree account email screen.</li><li>`settings/update-password` - Change Moneytree account password screen.</li><br> If no value is provided, it goes to the top page of MyAccount. |

### requestLoginLink

Request for a password-less login link to be sent to the guest's email address. Clicking on the link in the email will log a guest in directly to the screen specified by the `loginLinkTo` parameter.

<h6>Usage:</h6>

```javascript
mtLinkSdk.requestLoginLink(options);
```

| Parameter           | Type   | Required | Default Value                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options             | object | false    | Value set during `init`.                                                                         | Optional parameters. Includes all options in [common options](#common-api-options).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| options.loginLinkTo | string | true     | `settings` (for mobile view)<p><strong>OR</strong></p>`settings/update-email` (for desktop view) | Redirection to location after login, currently supported locations include:<li>`settings` - Main Moneytree account settings screen.</li><li>`settings/authorized-applications` - List of apps currently connected to Moneytree.</li><li>`settings/change-language` - Change Moneytree account language screen.<li>`settings/email-preferences` - Change Moneytree email preferences screen</li><li>`settings/delete-account` - Delete Moneytree account screen.</li><li>`settings/update-email` - Change Moneytree account email screen.</li><li>`settings/update-password` - Change Moneytree account password screen.</li> |
| options.email       | string | true     | Value set during `init`.                                                                         | Login Link will be sent to this email.<br /><br /><strong>NOTE:</strong> This function will throw an error if both values here and from the [init options](?id=api-init_options) are undefined.                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Common API options

These common options are used in multiple APIs. Instead of repeating the same options in every definition, they are documented here.

<strong>NOTE:</strong> Since `options` are optional for each function call in the SDK, they will be read from the [init options](?id=api-init_options) by default if none are provided.

| Parameter                                                         | Type                                                                                             | Required    | Default Value                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| options.email                                                     | string                                                                                           | false       | Value set during `init`.                                      | Email used to pre-fill the email field in login or sign up or form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| options.backTo                                                    | string                                                                                           | false       | Value set during `init`.                                      | A redirection URL for redirecting a guest back to in the following condition: <li>Guest clicks on `Back to [App Name]` button in any Moneytree screen.</li><li>Guest refuses to give consent to access permission in the consent screen.</li><li>Guest logs out from Moneytree via an app with this client id</li><li>Revoke an app's consent from settings screen opened via an app with this client id</li><br /><br /><strong>NOTE:</strong> No `Back to [App Name]` button will be shown if this value is not set, and any of the actions mentioned above will redirect the guest back to login screen by default. |
| <span id="authorize_option_auth_action">options.authAction</span> | `login`, `signup`                                                                                | false       | Value set during `init`.<p><strong>OR</strong></p>`login`     | Show login or sign up screen when a session does not exist during an `authorize` call.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| options.showAuthToggle                                            | boolean                                                                                          | false       | Value set during `init`.<p><strong>OR</strong></p>`true`      | If you wish to disable the login to sign up form toggle button and vice-versa in the auth screen, set this to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| options.showRememberMe                                            | boolean                                                                                          | false       | Value set during `init`.<p><strong>OR</strong></p>`true`      | If you wish to disable the `Stay logged in for 30 days` checkbox in the login screen, set this to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| options.isNewTab                                                  | boolean                                                                                          | false       | Value set during `init`.<p><strong>OR</strong></p>`false`     | Call method and open/render in a new browser tab, by default all views open in the same tab.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| options.authnMethod                                               | array of string with values `passwordless` or `sso` or string with value `passwordless` or `sso` | `undefined` | Value set during `init`.<p><strong>OR</strong></p>`undefined` | Switch between authentication methods version.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| options.samlSubjectId                                             | string                                                                                           | `undefined` | Value set during `init`.<p><strong>OR</strong></p>`undefined` | Set subject Id for saml session version.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| options.sdkPlatform (private)                                     | string                                                                                           | false       | Generated by the SDK.                                         | <strong>NOTE: this is for Moneytree internal use, please do not use it to avoid unintended behavior!</strong><br /><br />Indicating sdk platform.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| options.sdkVersion (private)                                      | semver                                                                                           | false       | Generated by the SDK.                                         | <strong>NOTE: this is for Moneytree internal use, please do not use it to avoid unintended behavior!</strong><br /><br />Indicating sdk version.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Theming

We support gray labelling some of the services offered by Moneytree, please contact your Moneytree representative for more information.

Currently supported services:

- onboard API
- Vault service
- Link-Kit service
