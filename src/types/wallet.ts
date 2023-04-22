export interface WalletInfo {
  address: string;
  privateKey: string;
}

export interface WalletMessage {
  message: string;
  privateKey: string;
}

export interface WalletTransferData {
  fromAddress: string;
  fromPrivateKey: string;
  toAddress: string;
  amount: string;
}
