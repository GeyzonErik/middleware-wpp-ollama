export abstract class UseCase<T, R> {
  abstract execute(data: T): Promise<R>;
}
