import { Model } from 'objection';

export interface IBaseRepository<M extends Model> {
  persist: (user: Partial<M>) => Promise<M>;
  update: (userId: number, user: Partial<M>) => Promise<M | undefined>;
  fetch: (id: number) => Promise<M | undefined>;
  findAll: () => Promise<M[]>;
}
