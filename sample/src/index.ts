import mtLinkSdk, {
  InitOptions,
  AuthAction,
  AuthorizeOptions,
  OnboardOptions,
  VaultOpenServiceViewServiceList,
  VaultOpenServiceViewServiceConnection,
  VaultOpenServiceViewConnectionSetting,
  MyAccountOpenServiceOptions,
  VaultOpenServiceViewCustomerSupport,
  ServiceId,
  LoginLinkTo,
  VaultViewServiceList
} from '@moneytree/mt-link-javascript-sdk';

import elements from './elements';

interface ITokenInfo {
  aud: {
    name: string;
  };
  exp: number;
  scopes: string[];
}

// Re-initialize when clicked
elements.initializeBtn.onclick = () => {
  const commonOptions: InitOptions = {};
  const { commonOptionsElms } = elements;

  if (commonOptionsElms.backTo.value.length) {
    commonOptions.backTo = commonOptionsElms.backTo.value;
  }

  if (commonOptionsElms.email.value.length) {
    commonOptions.email = commonOptionsElms.email.value;
  }

  commonOptions.authAction =
    (commonOptionsElms.authAction.options[commonOptionsElms.authAction.selectedIndex].value as AuthAction) || 'login';
  commonOptions.showAuthToggle = commonOptionsElms.showAuthToggle.checked;
  commonOptions.showRememberMe = commonOptionsElms.showRememberMe.checked;
  commonOptions.isNewTab = commonOptionsElms.isNewTab.checked;

  initializeLinkSDK(commonOptions);
};

// Launch authorize
elements.authorizeBtn.onclick = () => {
  const authorizeOptions: AuthorizeOptions = {};
  const { authorizeOptionsElms } = elements;

  const scopesSelectedOptions = Array.from(authorizeOptionsElms.scopes.options).filter((x) => x.selected);
  if (scopesSelectedOptions.length) {
    authorizeOptions.scopes = scopesSelectedOptions.map((x) => x.value);
  }

  authorizeOptions.pkce = true;

  mtLinkSdk.authorize(authorizeOptions);
};

// Launch onBoard
elements.doOnboardBtn.onclick = async () => {
  const { doOnboardBtn, onboardOptionsElms } = elements;

  try {
    doOnboardBtn.disabled = true;

    const onBoardOptions: OnboardOptions = {};

    const scopesSelectedOptions = Array.from(onboardOptionsElms.scopes.options).filter((x) => x.selected);
    if (scopesSelectedOptions.length) {
      onBoardOptions.scopes = scopesSelectedOptions.map((x) => x.value);
    }

    onBoardOptions.email = onboardOptionsElms.email.value;
    onBoardOptions.pkce = true;

    mtLinkSdk.onboard(onBoardOptions);
  } catch (error) {
    console.log(error);
  }

  doOnboardBtn.disabled = false;
};

// Retrieve Token information
elements.tokenInfoBtn.onclick = async () => {
  const token = elements.tokenElm.value;

  if (!token) {
    return;
  }

  const { iat, exp, sub, scope, client_id, app, guest } = await mtLinkSdk.tokenInfo(token);

  elements.tokenInfoLabel.innerText = `
      token creation timestamp: ${iat}
      token expiration timestamp: ${exp}
      guest uid: ${sub}
      string with space separated scopes: ${scope}
      application name: ${app?.name || ''}
      app client id: ${client_id}
      guest email: ${guest?.email || ''}
      guest country: ${guest?.country || ''}
      guest currency: ${guest?.currency || ''}
      guest language: ${guest?.lang || ''}
    `;

  elements.tokenInfoLabel.style.display = 'block';
};

// Launch logout
elements.logoutBtn.onclick = () => {
  mtLinkSdk.logout();
};

// Launch open service
elements.openServiceBtn.onclick = () => {
  const { openServiceOptionsElms } = elements;
  const serviceId: ServiceId = openServiceOptionsElms.serviceId.options[openServiceOptionsElms.serviceId.selectedIndex]
    .value as ServiceId;

  if (serviceId === 'vault') {
    type VaultOptions =
      | VaultOpenServiceViewServiceConnection
      | VaultOpenServiceViewConnectionSetting
      | VaultOpenServiceViewServiceList
      | VaultOpenServiceViewCustomerSupport;
    let openServicesOptions: VaultOptions = {} as VaultOptions;
    const view = openServiceOptionsElms.vaultView.options[openServiceOptionsElms.vaultView.selectedIndex].value as
      | 'services-list'
      | 'service-connection'
      | 'connection-setting'
      | 'customer-support';

    switch (view) {
      case 'services-list':
        openServicesOptions = {
          view: 'services-list',
          type:
            (openServiceOptionsElms.type.options[openServiceOptionsElms.type.selectedIndex].value as Pick<
              VaultViewServiceList,
              'type'
            >['type']) || undefined,
          group:
            (openServiceOptionsElms.group.options[openServiceOptionsElms.group.selectedIndex].value as Pick<
              VaultViewServiceList,
              'group'
            >['group']) || undefined,
          search: openServiceOptionsElms.search.value || undefined
        };
        break;
      case 'service-connection':
        openServicesOptions = {
          view: 'service-connection',
          entityKey: openServiceOptionsElms.entityKey.value
        };
        break;
      case 'connection-setting':
        openServicesOptions = {
          view: 'connection-setting',
          credentialId: openServiceOptionsElms.credentialId.value
        };
        break;
      case 'customer-support':
      default:
        openServicesOptions = { view };
    }
    mtLinkSdk.openService(serviceId, openServicesOptions);
  }

  if (serviceId === 'myaccount') {
    const view = openServiceOptionsElms.myAccountView.options[openServiceOptionsElms.myAccountView.selectedIndex]
      .value as
      | 'settings'
      | 'settings/authorized-applications'
      | 'settings/change-language'
      | 'settings/email-preferences'
      | 'settings/delete-account'
      | 'settings/update-email'
      | 'settings/update-password';

    mtLinkSdk.openService(serviceId, { view });
  }
};

// Launch open login link
elements.sendLoginLinkBtn.onclick = async () => {
  const { sendLoginLinkBtn, loginLinkToElm, loginLinkEmailElm } = elements;

  try {
    sendLoginLinkBtn.disabled = true;

    await mtLinkSdk.requestLoginLink({
      loginLinkTo: loginLinkToElm.options[loginLinkToElm.selectedIndex].value as LoginLinkTo,
      email: loginLinkEmailElm.value
    });
    window.alert('Success, loginLink sent out.');
  } catch (error) {
    console.log(error);
  }

  sendLoginLinkBtn.disabled = false;
};

// Helper, to switch the options, depends on openService's serviceId value
elements.openServiceOptionsElms.serviceId.onchange = () => {
  const { openServiceOptionsElms, pageVaultOptions, pageMyAccountOptions } = elements;
  const selectedValue = openServiceOptionsElms.serviceId.options[openServiceOptionsElms.serviceId.selectedIndex].value;

  pageVaultOptions.style.display = 'none';
  pageMyAccountOptions.style.display = 'none';

  if (selectedValue === 'vault') {
    pageVaultOptions.style.display = 'block';
    return;
  }
  if (selectedValue === 'myaccount') {
    pageMyAccountOptions.style.display = 'block';
    return;
  }
};

// Helper, To switch the options, depends on openService's view value for vault
elements.openServiceOptionsElms.vaultView.onchange = () => {
  const { openServiceOptionsElms } = elements;
  const selectedValue = openServiceOptionsElms.vaultView.options[openServiceOptionsElms.vaultView.selectedIndex].value;

  const vaultServicesElms = document.getElementsByClassName('vault-services');
  for (let indx = 0; indx < vaultServicesElms.length; indx++) {
    vaultServicesElms[indx].setAttribute('style', 'display: none');
  }

  const optionsBlockElm = document.getElementById(`${selectedValue}-options`);
  if (optionsBlockElm) {
    optionsBlockElm.style.display = 'block';
  }
};

const initializeLinkSDK = (options: InitOptions = {}) => {
  mtLinkSdk.init('af84f08f40970caf17f2e53b31771ceb50d0f32f7d44b826753982e809395290', {
    sdkPlatform: 'js',
    redirectUri: 'https://localhost:9000',
    locale: 'en',
    mode: 'staging',
    ...options
  });
};

const switchAuthorizeFunctions = (value: string) => {
  elements.authorizationSection.style.display = value;
  elements.onBoardSection.style.display = value;
  elements.loginLinkSection.style.display = value;
};

const disabledFunctions = () => {
  elements.openServiceSection.style.display = 'none';
  elements.logoutSection.style.display = 'none';
  elements.tokenInfoSection.style.display = 'none';
};

const validateToken = async () => {
  try {
    const token = await mtLinkSdk.exchangeToken();
    elements.accessTokenLabel.innerText = `Your access token is ${token.access_token}.`;
    const authHeaders = new Headers({
      method: 'GET',
      Authorization: `Bearer ${token.access_token}`
    });
    const response = await fetch('https://myaccount-staging.getmoneytree.com/oauth/token/info.json', {
      headers: authHeaders
    });
    const data: ITokenInfo = await response.json();
    elements.accessTokenLabel.innerText = `Your access token is ${token.access_token}
      It was generated for the app: ${data.aud.name}.
      It will expire on ${new Date(data.exp * 1000)}.
      It allows you to: ${data.scopes.join(', ')}
    `;

    switchAuthorizeFunctions('none');
  } catch (error) {
    // Disables buttons when a session has not been initialized.
    disabledFunctions();
  }

  window.history.replaceState({}, document.title, '/');
};

initializeLinkSDK();
// tslint:disable-next-line: no-floating-promises
validateToken();
