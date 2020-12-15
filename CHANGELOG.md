## [2.1.1](https://github.com/moneytree/mt-link-javascript-sdk/compare/2.1.0...2.1.1) (2020-12-15)

### Bug Fixes
* fix window.open didn't work on Safari 14 ([882c23c](https://github.com/moneytree/mt-link-javascript-sdk/commit/882c23c1abdc467a964b918ea7502f4f70e7da8d))
* fix forceLogout didn't work ([fa3055a](https://github.com/moneytree/mt-link-javascript-sdk/commit/fa3055a100f2bd4b7c5a4660b9dfeba45c601078))

# [2.1.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/2.0.0...2.1.0) (2020-12-09)

### Bug Fixes

* **authorize-api:** fix for Safari 14 issue ([9fb69d0](https://github.com/moneytree/mt-link-javascript-sdk/commit/9fb69d014752698df1897527ff27d60ffd116843))
* update for lint error and test failed ([362f0b7](https://github.com/moneytree/mt-link-javascript-sdk/commit/362f0b749797a438ac8c0024616e7072dbc641ee))


### Features

* **headers:** set sdk info as additional headers parameter ([1a55579](https://github.com/moneytree/mt-link-javascript-sdk/commit/1a5557919ee9844409848154ba22ec863c4d1a58))
* **sample-app:** add example ([89edfcf](https://github.com/moneytree/mt-link-javascript-sdk/commit/89edfcf2e6bc961842f9721345a074779e0549be))
* add del to storage ([c5f2bda](https://github.com/moneytree/mt-link-javascript-sdk/commit/c5f2bdaf597909f71a3ee551966daa0e47367baf))
* authorize & onboard accepts `pkce` & `codeChallenge` options ([bc6bfe5](https://github.com/moneytree/mt-link-javascript-sdk/commit/bc6bfe5da725493fb3046dabab57824fe09fa501))
* **open-services:** deeplink support ([c179072](https://github.com/moneytree/mt-link-javascript-sdk/commit/c179072ba008e8f6be3f94bf4ced88e314485544))


* refactor!: remove auto generate state logic ([c68d223](https://github.com/moneytree/mt-link-javascript-sdk/commit/c68d22331c1783a3c859af0b4cb3ddecfcfbf8b4))
* refactor!: standardize tokenInfo response ([491dda8](https://github.com/moneytree/mt-link-javascript-sdk/commit/491dda82dc1c2982f5ea5d95d4a8ff4fb121d91d))
* refactor!: remove options from tokenInfo ([c918b9d](https://github.com/moneytree/mt-link-javascript-sdk/commit/c918b9d584e412616d02996516b2bfad8b28c74b))


### BREAKING CHANGES

* No more auto generate state on init to be used in `authorize`
and `onboard` API. There will be no default `state` and you will have to pass
one via the APIs' options parameter if you need one.
* change `tokenInfo` API response to standard format.
* `tokenInfo` API no longer accept options parameter as it provide no benefit.

# [2.0.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.4.0...2.0.0) (2020-10-19)


### Features

- Support OAuth 2.0 Authorization Code with PKCE Flow.
- Enable to onboard a guest faster.
- Support Magic link(password-less login link).


# [1.4.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.3.1...1.4.0) (2020-01-17)


# [1.3.1](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.3.0...1.3.1) (2020-01-17)


### Bug Fixes

* **logout:** add optional backTo parameter ([9b9da89](https://github.com/moneytree/mt-link-javascript-sdk/commit/9b9da8941ff58049ed200d6dd6324bc5918adca0))


# [1.3.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.2.3...1.3.0) (2019-12-11)


### Features

* **index:** new logout endpoint ([64156ca](https://github.com/moneytree/mt-link-javascript-sdk/commit/64156caba35f251f6a501edba60f736ab13da57c))
* **sample_app:** add a very basic sample app to test the SDK ([84a4d18](https://github.com/moneytree/mt-link-javascript-sdk/commit/84a4d187506960f44dffd102b62ce4732bec3301))



## [1.2.3](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.2.2...1.2.3) (2019-05-23)



## [1.2.2](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.2.1...1.2.2) (2019-05-23)


### Bug Fixes

* **continue:** rename param to "continue" as intended ([b9dc043](https://github.com/moneytree/mt-link-javascript-sdk/commit/b9dc0437ab91d2378ade516f3f178606ae38f1ae))



## [1.2.1](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.2.0...1.2.1) (2019-05-22)


### Bug Fixes

* **continueTo:** resupport continueTo ([c71c280](https://github.com/moneytree/mt-link-javascript-sdk/commit/c71c28079ce31ead8b16ef124adef735cc23f146))


### Features

* **lint:** add lint support ([1d1a302](https://github.com/moneytree/mt-link-javascript-sdk/commit/1d1a3028c3ca512526efe1ec1634f8d6adbc9665))



# [1.2.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.1.2...1.2.0) (2019-05-17)


### Bug Fixes

* **configs:** separate configs option by semicolon ([db2bed4](https://github.com/moneytree/mt-link-javascript-sdk/commit/db2bed4cc205d01e88c3fe7f2d6f2802e2c54a4e))
* **encoding:** fix enconding issue and some typecript typing tweaks ([239704f](https://github.com/moneytree/mt-link-javascript-sdk/commit/239704f4819c68c4d682e28511e5ee3b26d8fe0b))


### Features

* **sdkVersion:** add sdk version ([bbc9a87](https://github.com/moneytree/mt-link-javascript-sdk/commit/bbc9a8724a96ea548f93165f101a237ed8a1e157))



## [1.1.2](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.1.1...1.1.2) (2019-04-04)


### Bug Fixes

* **configs:** encode configs parameter value ([448383a](https://github.com/moneytree/mt-link-javascript-sdk/commit/448383a94b96beeeafd79a9ec5e15732b8d1866d))



## [1.1.1](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.1.0...1.1.1) (2018-12-04)



# [1.1.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/1.0.0...1.1.0) (2018-09-07)


### Features

* **link2app:** adding an option to go back to caller ([f67ac97](https://github.com/moneytree/mt-link-javascript-sdk/commit/f67ac9739b2685db54e6ef792ecccc8f7802bef7))



# [1.0.0](https://github.com/moneytree/mt-link-javascript-sdk/compare/333cf8c36f7a8299c2bccf441454b04d31e7d907...1.0.0) (2018-08-01)


### Features

* creating a JS SDK ([333cf8c](https://github.com/moneytree/mt-link-javascript-sdk/commit/333cf8c36f7a8299c2bccf441454b04d31e7d907))
