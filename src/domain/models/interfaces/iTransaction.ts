import { TransactionStatus } from "../../../types/transaction";
import { IBaseModel } from "./iBaseModel";

export default interface ITransaction extends IBaseModel{
    idempotencyKey: string;
    fromUserWalletId: number;
    toUserWalletId?: number;
    toWalletAddress: string;
    amount: number;
    receipt?: string;
    status: TransactionStatus;
    failReason?: string;
}