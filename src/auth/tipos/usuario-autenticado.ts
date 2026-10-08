export interface UsuarioAutenticado {
  sub: number;
  email: string;
  role: string;
}

export const ROLE_ADMIN = 'admin';
export const ROLE_USER = 'user';
