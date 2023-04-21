export interface ORM {
  connect: (runSeed: boolean) => Promise<any>;
  disconnect: () => Promise<any>;
}

export class DBConnection<T extends ORM> {
  orm: T;

  constructor(t: T) {
    this.orm = t;
  }

  connect(runSeed: boolean = false) {
    return this.orm.connect(runSeed);
  }

  disconnect() {
    return this.orm.disconnect();
  }
}
