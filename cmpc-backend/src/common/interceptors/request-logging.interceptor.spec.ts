import { RequestLoggingInterceptor } from './request-logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';

describe('RequestLoggingInterceptor', () => {
  let interceptor: RequestLoggingInterceptor;

  beforeEach(() => {
    interceptor = new RequestLoggingInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log request and response', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
          body: {},
          user: { email: 'test@cmpc.com' },
        }),
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of({ data: 'test' }),
    };

    const logSpy = jest.spyOn(interceptor['logger'], 'log');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(logSpy).toHaveBeenCalledTimes(2);
        done();
      },
    });
  });

  it('should log errors', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'POST',
          url: '/test',
          body: {},
          user: { email: 'test@cmpc.com' },
        }),
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => throwError(() => new Error('Test error')),
    };

    const errorSpy = jest.spyOn(interceptor['logger'], 'error');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: () => {
        expect(errorSpy).toHaveBeenCalled();
        done();
      },
    });
  });
});
