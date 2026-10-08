import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

export function ApiAutenticacao() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiResponse({ status: 401, description: 'Token ausente, invalido ou expirado' }),
    ApiResponse({ status: 403, description: 'Autenticado, mas sem permissao para este recurso' }),
  );
}
