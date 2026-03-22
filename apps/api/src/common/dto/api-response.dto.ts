export interface ApiResponseDto<T> {
  data: T;
  meta?: Record<string, unknown>;
}
