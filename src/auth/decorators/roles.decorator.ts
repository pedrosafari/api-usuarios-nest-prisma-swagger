import { SetMetadata } from '@nestjs/common';

export const CHAVE_ROLES = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(CHAVE_ROLES, roles);
