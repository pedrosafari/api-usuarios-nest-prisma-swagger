import { ForbiddenException } from '@nestjs/common';
import {
  ROLE_ADMIN,
  UsuarioAutenticado,
} from '../../auth/tipos/usuario-autenticado';

export function garantirDonoOuAdmin(
  usuario: UsuarioAutenticado,
  idDoDono: number,
): void {
  if (usuario.role === ROLE_ADMIN) return;
  if (usuario.sub === idDoDono) return;
  throw new ForbiddenException('Voce so pode acessar os seus proprios registros');
}

export function ehAdmin(usuario: UsuarioAutenticado): boolean {
  return usuario.role === ROLE_ADMIN;
}
