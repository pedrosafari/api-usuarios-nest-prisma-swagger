import { SetMetadata } from '@nestjs/common';

export const CHAVE_PUBLICA = 'rotaPublica';
export const Public = () => SetMetadata(CHAVE_PUBLICA, true);
