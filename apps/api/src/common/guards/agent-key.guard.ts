import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AgentKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return Boolean(request.agent);
  }
}
