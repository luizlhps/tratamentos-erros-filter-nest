import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from './BusinessException';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Se a exceção não for uma BusinessException, encapsule-a
    let businessException: BusinessException;
    if (!(exception instanceof BusinessException)) {
      const message = exception.message || 'Erro de Negócio Genérico';
      businessException = new BusinessException(
        message,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      businessException = exception;
    }

    const status = businessException.getStatus();
    const errorResponse = businessException.getResponse();

    if (typeof errorResponse === 'object') {
      response.status(status).json({
        ...errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
        // Mensagem personalizada para a resposta de erro
        deuRuim: 'opa',
      });
    } else {
      response.status(status).json({
        errorResponse,
        timestamp: new Date().toISOString(),
        path: request.url,
        // Mensagem personalizada para a resposta de erro
        deuRuim: 'opa',
      });
    }
  }
}
