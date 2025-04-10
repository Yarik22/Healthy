export interface BaseState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
