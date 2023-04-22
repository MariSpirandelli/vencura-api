import { Model, snakeCaseMappers } from 'objection';
import { IBaseModel } from './interfaces/iBaseModel';

export default abstract class BaseModel extends Model implements IBaseModel {
  id!: number;
  createdAt!: string;
  updatedAt?: string;

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
