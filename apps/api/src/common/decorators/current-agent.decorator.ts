import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAgent = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.agent;
});
