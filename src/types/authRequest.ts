import { Request } from 'express';

export type AuthRequest = Request & { dynamicInfo: DynamicInfo };

export interface DynamicInfo {
  verifiedCredentials: Credential[];
  email?: string;
  environmentId: string;
  isNewUser: boolean;
}

export type CredentialFormat = 'blockchain' | 'email';

export interface Credential {
  address?: string;
  chain?: string;
  userId: string;
  publicIdentifier: string;
  walletName?: string;
  walletProvider?: string;
  format: CredentialFormat;
  email?: string;
}
