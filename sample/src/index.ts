import mtLinkSdk, {
  InitOptions,
  AuthAction,
  AuthorizeOptions,
  OnboardOptions,
  OpenServicesConfigsOptions,
  ServiceId,
  MagicLinkTo,
  ServicesListType,
} from '@moneytree/mt-link-javascript-sdk';

import elements from './elements';

interface ITokenInfo {
  aud: {
    name: string;
  };
  exp: number;
  scopes: string[];
}

const AWESOME_APP_ID = 'af84f08f40970caf17f2e53b31771ceb50d0f32f7d44b826753982e809395290';

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
    (commonOptionsElms.authAction.options[commonOptionsElms.authAction.selectedIndex]
      .value as AuthAction) || 'login';
  commonOptions.showAuthToggle = commonOptionsElms.showAuthToggle.checked;
  commonOptions.showRememberMe = commonOptionsElms.showRememberMe.checked;
  commonOptions.isNewTab = commonOptionsElms.isNewTab.checked;

  initializeLinkSDK(commonOptions);
};

// Launch authorize
elements.authorizeBtn.onclick = () => {
  const authorizeOptions: AuthorizeOptions = {};
  const { authorizeOptionsElms } = elements;

  const scopesSelectedOptions = Array.from(authorizeOptionsElms.scopes.options).filter(
    (x) => x.selected
  );
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

    const scopesSelectedOptions = Array.from(onboardOptionsElms.scopes.options).filter(
      (x) => x.selected
    );
    if (scopesSelectedOptions.length) {
      onBoardOptions.scopes = scopesSelectedOptions.map((x) => x.value);
    }

    onBoardOptions.email = onboardOptionsElms.email.value;
    onBoardOptions.country =
      onboardOptionsElms.country.options[onboardOptionsElms.country.selectedIndex].value;

    onBoardOptions.pkce = true;

    await mtLinkSdk.onboard(onBoardOptions);
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
  let OpenServicesConfigsOptions: OpenServicesConfigsOptions = {};
  const serviceId = openServiceOptionsElms.serviceId.options[
    openServiceOptionsElms.serviceId.selectedIndex
  ].value as ServiceId;

  if (serviceId === 'vault') {
    const view = openServiceOptionsElms.view.options[openServiceOptionsElms.view.selectedIndex]
      .value as 'services-list' | 'service-connection' | 'connection-setting' | 'customer-support';

    switch (view) {
      case 'services-list':
        OpenServicesConfigsOptions = {
          view: 'services-list',
          type:
            (openServiceOptionsElms.type.options[openServiceOptionsElms.type.selectedIndex]
              .value as Pick<ServicesListType, 'type'>['type']) || undefined,
          group:
            (openServiceOptionsElms.group.options[openServiceOptionsElms.group.selectedIndex]
              .value as Pick<ServicesListType, 'group'>['group']) || undefined,
          search: openServiceOptionsElms.search.value || undefined,
        };
        break;
      case 'service-connection':
        OpenServicesConfigsOptions = {
          view: 'service-connection',
          entityKey: openServiceOptionsElms.entityKey.value,
        };
        break;
      case 'connection-setting':
        OpenServicesConfigsOptions = {
          view: 'connection-setting',
          credentialId: openServiceOptionsElms.credentialId.value,
        };
        break;
      case 'customer-support':
      default:
        OpenServicesConfigsOptions = { view };
    }
  }

  if (serviceId === 'myaccount-settings') {
    const view = openServiceOptionsElms.view.options[openServiceOptionsElms.view.selectedIndex]
      .value as
      | 'authorized-applications'
      | 'change-language'
      | 'email-preferences'
      | 'delete-account'
      | 'update-email'
      | 'update-password';

    OpenServicesConfigsOptions = { view };
  }

  mtLinkSdk.openService(serviceId, OpenServicesConfigsOptions);
};

// Launch open magic link
elements.sendMagicLinkBtn.onclick = async () => {
  const { sendMagicLinkBtn, magicLinkToElm, magicLinkEmailElm } = elements;

  try {
    sendMagicLinkBtn.disabled = true;

    await mtLinkSdk.requestMagicLink({
      magicLinkTo: magicLinkToElm.options[magicLinkToElm.selectedIndex].value as MagicLinkTo,
      email: magicLinkEmailElm.value,
    });
    window.alert('Success, magicLink sent out.');
  } catch (error) {
    console.log(error);
  }

  sendMagicLinkBtn.disabled = false;
};

// Helper, to switch the vault options, depends on openService's serviceId value
elements.openServiceOptionsElms.serviceId.onchange = () => {
  const { openServiceOptionsElms, vaultOptions } = elements;
  const selectedValue =
    openServiceOptionsElms.serviceId.options[openServiceOptionsElms.serviceId.selectedIndex].value;

  if (selectedValue === 'vault' || selectedValue === 'myaccount-settings') {
    vaultOptions.style.display = 'block';
    return;
  }

  vaultOptions.style.display = 'none';
};

// Helper, To switch the options, depends on openService's view value for vault
elements.openServiceOptionsElms.view.onchange = () => {
  const { openServiceOptionsElms } = elements;
  const selectedValue =
    openServiceOptionsElms.view.options[openServiceOptionsElms.view.selectedIndex].value;

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
  mtLinkSdk.init(AWESOME_APP_ID, {
    sdkPlatform: 'js',
    redirectUri: 'https://localhost:9000',
    locale: 'en',
    mode: 'develop',
    ...options,
  });
};

const switchAuthorizeFunctions = (value: string) => {
  elements.authorizationSection.style.display = value;
  elements.onBoardSection.style.display = value;
  elements.magicLinkSection.style.display = value;
};

const disabledFunctions = () => {
  elements.openServiceSection.style.display = 'none';
  elements.logoutSection.style.display = 'none';
  elements.tokenInfoSection.style.display = 'none';
};

const validateToken = async () => {
  try {
    const accessToken = await mtLinkSdk.exchangeToken();
    elements.accessTokenLabel.innerText = `Your access token is ${accessToken}.`;
    const authHeaders = new Headers({
      method: 'GET',
      Authorization: `Bearer ${accessToken}`,
    });
    const response = await fetch(
      'https://myaccount-staging.getmoneytree.com/oauth/token/info.json',
      {
        headers: authHeaders,
      }
    );
    const data: ITokenInfo = await response.json();
    elements.accessTokenLabel.innerText = `Your access token is ${accessToken}
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
