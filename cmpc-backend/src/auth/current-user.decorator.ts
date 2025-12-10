import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type UserRequest = {
  user: {
    id: string;
    email: string;
  };
};

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): { id: string; email: string } => {
    const request = ctx.switchToHttp().getRequest<UserRequest>();

    return request.user;
  },
);
