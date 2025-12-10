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
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      body: unknown;
      user?: { email: string };
    }>();
    const { method, url, body } = request;
    const userEmail = request.user?.email || 'anonymous';
    const now = Date.now();

    this.logger.log(
      `[${method}] ${url} - Usuario: ${userEmail} - Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          this.logger.log(
            `[${method}] ${url} - Completado en ${duration}ms - Usuario: ${userEmail}`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - now;
          this.logger.error(
            `[${method}] ${url} - Error en ${duration}ms - Usuario: ${userEmail} - ${error.message}`,
          );
        },
      }),
    );
  }
}
