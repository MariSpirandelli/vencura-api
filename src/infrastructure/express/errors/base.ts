export abstract class HttpBaseError extends Error {
  constructor(public message: string, public code: number) {
    super();
  }

  resultOutput() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}
