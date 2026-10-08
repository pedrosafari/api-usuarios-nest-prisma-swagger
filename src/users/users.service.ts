import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paraDataUtc } from '../common/helpers/data';
import { ehAdmin, garantirDonoOuAdmin } from '../common/helpers/propriedade';
import { UsuarioAutenticado } from '../auth/tipos/usuario-autenticado';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const CUSTO_BCRYPT = 12;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          nome: dto.nome,
          email: dto.email,
          senha: await bcrypt.hash(dto.senha, CUSTO_BCRYPT),
          dataNascimento: paraDataUtc(dto.dataNascimento),
          rg: dto.rg,
          cpf: dto.cpf,
          nomeMae: dto.nomeMae,
          role: 'user',
        },
      });
    } catch (erro) {
      throw this.traduzirErro(erro);
    }
  }

  listar() {
    return this.prisma.user.findMany({ orderBy: { id: 'asc' } });
  }

  async buscarPorId(id: number) {
    const usuario = await this.prisma.user.findUnique({ where: { id } });
    if (!usuario) throw new NotFoundException(`Usuario ${id} nao encontrado`);
    return usuario;
  }

  buscarPorEmailComSenha(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      omit: { senha: false },
    });
  }

  async atualizar(
    id: number,
    dto: UpdateUserDto,
    solicitante: UsuarioAutenticado,
  ) {
    garantirDonoOuAdmin(solicitante, id);

    if (dto.role !== undefined && !ehAdmin(solicitante)) {
      throw new ForbiddenException(
        'Somente um administrador pode alterar o perfil de acesso',
      );
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.senha !== undefined) data.senha = await bcrypt.hash(dto.senha, CUSTO_BCRYPT);
    if (dto.dataNascimento !== undefined) data.dataNascimento = paraDataUtc(dto.dataNascimento);
    if (dto.rg !== undefined) data.rg = dto.rg;
    if (dto.cpf !== undefined) data.cpf = dto.cpf;
    if (dto.nomeMae !== undefined) data.nomeMae = dto.nomeMae;
    if (dto.role !== undefined) data.role = dto.role;

    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (erro) {
      throw this.traduzirErro(erro, id);
    }
  }

  async remover(id: number) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (erro) {
      throw this.traduzirErro(erro, id);
    }
  }

  private traduzirErro(erro: unknown, id?: number): Error {
    if (erro instanceof Prisma.PrismaClientKnownRequestError) {
      if (erro.code === 'P2002') {
        return new ConflictException('Ja existe um usuario com este email ou cpf');
      }
      if (erro.code === 'P2025') {
        return new NotFoundException(`Usuario ${id ?? ''} nao encontrado`.trim());
      }
    }
    return erro instanceof Error ? erro : new Error(String(erro));
  }
}
