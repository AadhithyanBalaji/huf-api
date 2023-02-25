export default class Helper {
  public static isTruthy(value: any) {
    return value !== null && value !== undefined;
  }

  public static nameof = <T>(name: keyof T) => name;
}
