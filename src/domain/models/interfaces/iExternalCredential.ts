import { CredentialFormat } from '../../../types/authRequest';
import { IBaseModel } from './iBaseModel';

export default interface IExternalCredential extends IBaseModel{
    userId: number,
    externalUserId: string,
    format: CredentialFormat
    value: string;
    chain?: string;
    origin: 'Dynamic'
}