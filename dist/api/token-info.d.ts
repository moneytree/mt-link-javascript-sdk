import { StoredOptions, TokenInfoOptions, TokenInfo } from '../typings';
export default function tokenInfo(storedOptions: StoredOptions, token: string, options?: TokenInfoOptions): Promise<TokenInfo>;
