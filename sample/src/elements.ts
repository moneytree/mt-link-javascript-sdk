export default {
  commonOptionsElms: {
    email: document.getElementById('common-options-email') as HTMLInputElement,
    backTo: document.getElementById('common-options-backTo') as HTMLInputElement,
    authAction: document.getElementById('common-options-authAction') as HTMLSelectElement,
    showAuthToggle: document.getElementById('common-options-showAuthToggle') as HTMLInputElement,
    showRememberMe: document.getElementById('common-options-showRememberMe') as HTMLInputElement,
    isNewTab: document.getElementById('common-options-isNewTab') as HTMLInputElement
  },
  authorizeOptionsElms: {
    scopes: document.getElementById('authorize-options-scopes') as HTMLSelectElement
  },
  onboardOptionsElms: {
    email: document.getElementById('onboard-options-email') as HTMLSelectElement,
    scopes: document.getElementById('onboard-options-scopes') as HTMLSelectElement
  },
  openServiceOptionsElms: {
    serviceId: document.getElementById('open-service-options-serviceId') as HTMLSelectElement,
    vaultView: document.getElementById('open-service-options-vault-view') as HTMLSelectElement,
    myAccountView: document.getElementById('open-service-options-myaccount-view') as HTMLSelectElement,
    type: document.getElementById('open-service-options-type') as HTMLSelectElement,
    group: document.getElementById('open-service-options-group') as HTMLSelectElement,
    search: document.getElementById('open-service-options-search') as HTMLInputElement,
    entityKey: document.getElementById('open-service-options-entityKey') as HTMLInputElement,
    credentialId: document.getElementById('open-service-options-credentialId') as HTMLInputElement
  },
  initializeBtn: document.getElementById('initialize-btn') as HTMLButtonElement,
  authorizeBtn: document.getElementById('authorize-btn') as HTMLButtonElement,
  logoutBtn: document.getElementById('logout-btn') as HTMLButtonElement,
  openServiceBtn: document.getElementById('open-service-btn') as HTMLButtonElement,
  tokenInfoBtn: document.getElementById('token-info-btn') as HTMLButtonElement,
  sendLoginLinkBtn: document.getElementById('send-login-link') as HTMLButtonElement,
  doOnboardBtn: document.getElementById('do-onboard') as HTMLButtonElement,
  tokenElm: document.getElementById('token') as HTMLInputElement,
  loginLinkToElm: document.getElementById('loginLinkTo') as HTMLSelectElement,
  loginLinkEmailElm: document.getElementById('loginLink-email') as HTMLSelectElement,
  tokenInfoLabel: document.getElementById('token-info-text') as HTMLInputElement,
  accessTokenLabel: document.getElementById('access-token-text') as HTMLParagraphElement,
  authorizationSection: document.getElementById('authorization-section') as HTMLDivElement,
  onBoardSection: document.getElementById('onboard-section') as HTMLDivElement,
  loginLinkSection: document.getElementById('login-link-section') as HTMLDivElement,
  openServiceSection: document.getElementById('open-service-section') as HTMLDivElement,
  logoutSection: document.getElementById('logout-section') as HTMLDivElement,
  tokenInfoSection: document.getElementById('token-info-section') as HTMLDivElement,
  pageVaultOptions: document.getElementById('page-vault-options') as HTMLDivElement,
  pageMyAccountOptions: document.getElementById('page-myaccount-options') as HTMLDivElement
};
