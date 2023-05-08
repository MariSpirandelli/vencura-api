import Objection, { Model } from 'objection';
import { IBaseRepository } from './interfaces/iBaseRepository';

export default class BaseRepository<M extends Model> implements IBaseRepository<M> {
  constructor(protected model: Objection.ModelClass<M>) {}

  fetch(id: number): Promise<M> {
    return this.model
      .query()
      .findById(id)
      .first()
      .then((result: any) => result as any);
  }

  findAll(): Promise<M[]> {
    return this.model
      .query()
      .select()
      .then((result: any[]) => result);
  }

  persist(entity: Partial<M>): Promise<M> {
    return this.model
      .query()
      .insert(entity)
      .returning('*')
      .then((result: any) => result);
  }

  update(id: number, entity: Partial<M>): Promise<M> {
    return this.model
      .query()
      .update(entity)
      .where({ id })
      .returning('*')
      .first()
      .then((result: any) => result);
  }
}
