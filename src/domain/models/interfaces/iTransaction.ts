import { TransactionStatus } from "../../../types/transaction";
import { IBaseModel } from "./iBaseModel";

export default interface ITransaction extends IBaseModel{
    fromUserWalletId: number;
    toUserWalletId?: number;
    toWalletAddress: string;
    amount: number;
    status: TransactionStatus;
    failReason?: string;
}