import { ResponseLoggingInterceptor } from './response-logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('ResponseLoggingInterceptor', () => {
  let interceptor: ResponseLoggingInterceptor;

  beforeEach(() => {
    interceptor = new ResponseLoggingInterceptor();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should log response data', (done) => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          method: 'GET',
          url: '/test',
        }),
        getResponse: () => ({
          statusCode: 200,
        }),
      }),
    } as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of({ data: 'test response' }),
    };

    const logSpy = jest.spyOn(interceptor['logger'], 'log');

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      next: () => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('Status: 200'),
        );
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('test response'),
        );
        done();
      },
    });
  });
});
