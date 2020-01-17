import LinkSDK from '@moneytree/mt-link-javascript-sdk';
import qs from 'qs';

interface ITokenInfo {
  aud: {
    name: string;
  };
  exp: number;
  scopes: string[];
}

const AWESOME_APP_ID = 'af84f08f40970caf17f2e53b31771ceb50d0f32f7d44b826753982e809395290';

const authorizeBtn = document.getElementById('authorize-btn') as HTMLButtonElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
const goToSettingsBtn = document.getElementById('settings-btn') as HTMLButtonElement;
const goToVaultBtn = document.getElementById('vault-btn') as HTMLButtonElement;
const tokenInfoLbl = document.getElementById('access-token-text') as HTMLButtonElement;
const accessTokenLabel = document.getElementById('access-token-text') as HTMLParagraphElement;

if (!authorizeBtn || !logoutBtn || !goToSettingsBtn || !goToVaultBtn) {
  throw new Error('An error occurred');
}

// Launch authorize route when clicked
authorizeBtn.onclick = () => {
  LinkSDK.authorize();
};

// Launch logout route when clicked
logoutBtn.onclick = () => {
  const value = document.getElementById('logout-url').value;

  LinkSDK.logout({
    backTo: value ? value : undefined
  });
};

// Launch settings route when clicked
goToSettingsBtn.onclick = () => {
  LinkSDK.openSettings({ newTab: false });
};

// Launch vault route when clicked
goToVaultBtn.onclick = () => {
  LinkSDK.openVault({ newTab: false });
};

const initializeLinkSDK = () => {
  LinkSDK.init({
    clientId: AWESOME_APP_ID,
    responseType: 'token',
    scope: ['accounts_read', 'points_read'],
    redirectUri: 'https://localhost:9000',
    locale: 'ja-JP',
    isTestEnvironment: true
  });
};

const validateToken = async () => {
  const { hash, search } = location;
  const accessToken =
    qs.parse(hash.slice(1)).access_token || qs.parse(search, { ignoreQueryPrefix: true }).access_token;

  // Disables buttons when a session has not been initialized.
  if (!accessToken) {
    goToSettingsBtn.disabled = true;
    goToVaultBtn.disabled = true;
    // logoutBtn.disabled = true;
    return;
  }

  accessTokenLabel.innerText = `Your access token is ${accessToken}.`;

  const authHeaders = new Headers({
    method: 'GET',
    Authorization: `Bearer ${accessToken}`
  });

  const response = await fetch('https://myaccount-staging.getmoneytree.com/oauth/token/info.json', {
    headers: authHeaders
  });

  const data: ITokenInfo = await response.json();

  tokenInfoLbl.innerText = `
    Your access token is ${accessToken}.
    It was generated for the app: ${data.aud.name}.
    It will expire on ${new Date(data.exp * 1000)}.
    It allows you to: ${data.scopes.join(', ')}
  `;
};

initializeLinkSDK();
// tslint:disable-next-line: no-floating-promises
validateToken();
