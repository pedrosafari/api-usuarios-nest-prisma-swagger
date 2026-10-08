import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import {
  ROLE_USER,
  UsuarioAutenticado,
} from './tipos/usuario-autenticado';

const HASH_FALSO = '$2b$12$C6UzMDM.H6dfI/f/IKcEe.7g3KJx1lqPpVQZVZ4YJ0sOZ4Zq0ZqZq';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.users.buscarPorEmailComSenha(dto.email);
    const hash = usuario?.senha ?? HASH_FALSO;
    const senhaConfere = await bcrypt.compare(dto.senha, hash);

    if (!usuario || !senhaConfere) {
      throw new UnauthorizedException('Email ou senha invalidos');
    }

    const payload: UsuarioAutenticado = {
      sub: usuario.id,
      email: usuario.email,
      role: usuario.role ?? ROLE_USER,
    };

    return {
      access_token: await this.jwt.signAsync(payload),
      token_type: 'Bearer',
      expires_in: this.config.getOrThrow<string>('JWT_EXPIRES_IN'),
    };
  }
}
