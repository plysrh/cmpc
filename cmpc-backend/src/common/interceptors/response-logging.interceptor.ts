import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Response');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
    }>();
    const response = context.switchToHttp().getResponse<{
      statusCode: number;
    }>();

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          this.logger.log(
            `[${request.method}] ${request.url} - Status: ${response.statusCode} - Response: ${JSON.stringify(data)}`,
          );
        },
      }),
    );
  }
}
