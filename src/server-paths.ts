interface ServerPaths {
  [key: string]: string;
}

export const MY_ACCOUNT_DOMAINS: ServerPaths = {
  production: 'https://myaccount.getmoneytree.com',
  staging: 'https://myaccount-staging.getmoneytree.com',
  develop: 'https://myaccount-develop.getmoneytree.com',
  local: 'http://localhost:3002'
};

export const VAULT_DOMAINS: ServerPaths = {
  production: 'https://vault.getmoneytree.com',
  staging: 'https://vault-staging.getmoneytree.com',
  develop: 'https://vault-develop.getmoneytree.com',
  local: 'http://localhost:9000'
};

export const LINK_KIT_DOMAINS: ServerPaths = {
  production: 'https://linkkit.getmoneytree.com',
  staging: 'https://linkkit-staging.getmoneytree.com',
  develop: 'https://linkkit-develop.getmoneytree.com',
  local: 'http://localhost:9000'
};
