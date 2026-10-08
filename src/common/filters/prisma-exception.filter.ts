import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(erro: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const resposta = host.switchToHttp().getResponse<Response>();
    const { status, mensagem } = this.traduzir(erro);

    this.logger.warn(`Prisma ${erro.code}: ${erro.message.split('\n').pop()}`);
    resposta.status(status).json({
      statusCode: status,
      message: mensagem,
      error: erro.code,
    });
  }

  private traduzir(erro: Prisma.PrismaClientKnownRequestError) {
    switch (erro.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          mensagem: 'Registro duplicado em campo unico',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          mensagem: 'Relacionamento invalido',
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          mensagem: 'Registro nao encontrado',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          mensagem: 'Erro interno de persistencia',
        };
    }
  }
}
