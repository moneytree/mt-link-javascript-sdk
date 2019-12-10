import LinkSDK from '@moneytree/mt-link-javascript-sdk';
import qs from 'qs';

const CLIENT_ID = 'client_id';
const TOKEN = 'access_token';
const AWESOME_APP_ID = 'af84f08f40970caf17f2e53b31771ceb50d0f32f7d44b826753982e809395290';

// Capture access token hash in URL
window.onload = () => {
  let accessToken;

  const authorizeBtn = document.getElementById('authorize-btn');
  const goToSettingsBtn = document.getElementById('settings-btn');
  const goToVaultBtn = document.getElementById('vault-btn');
  const tokenInfoLbl = document.getElementById('access-token-text');

  const appInit = (clientId) => {
    LinkSDK.init({
      clientId,
      response_type: 'token',
      scope: ['accounts_read', 'points_read'],
      redirectUri: 'https://localhost:9000',
      locale: 'ja-JP',
      isTestEnvironment: true
    });

    // Launch authorize route when clicked
    authorizeBtn.onclick = () => {
      LinkSDK.authorize();
    };

    // Launch settings route when clicked
    goToSettingsBtn.onclick = () => {
      console.log('Settings');
      LinkSDK.openSettings({ newTab: false });
    };

    // Launch vault route when clicked
    goToVaultBtn.onclick = () => {
      LinkSDK.openVault({ newTab: false });
    };
  };

  console.log(Boolean(location.hash));
  let clientId = AWESOME_APP_ID;

  const path = location.pathname;

  if (location.hash) {
    const hash = qs.parse(location.hash.slice(1));
    accessToken = hash[TOKEN];
    clientId = hash[CLIENT_ID];
    document.getElementById('access-token-text').innerText = `Your access token is ${accessToken}.`;
    const authHeaders = new Headers({
      method: 'GET',
      Authorization: `Bearer ${accessToken}`
    });
    fetch('https://myaccount-staging.getmoneytree.com/oauth/token/info.json', {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        tokenInfoLbl.innerText = `
                Your access token is ${accessToken}.
                It was generated for the app: ${data.aud.name}.
                It will expire on ${new Date(data.exp * 1000)}.
                It allows you to: ${data.scopes.join(', ')}
            `;
      });
  }

  if (location.search) {
    const query = qs.parse(location.search.slice(1));
    clientId = query[CLIENT_ID];
  }

  if (!accessToken) {
    goToSettingsBtn.disabled = true;
    goToVaultBtn.disabled = true;
  }

  appInit(clientId);
};
