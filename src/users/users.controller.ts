import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsuarioAtual } from '../auth/decorators/usuario-atual.decorator';
import {
  ROLE_ADMIN,
  UsuarioAutenticado,
} from '../auth/tipos/usuario-autenticado';
import { ApiAutenticacao } from '../common/decorators/api-autenticacao.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Usuarios')
@Controller('user')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Public()
  @Get()
  @ApiOkResponse({ description: 'Lista de usuarios retornada com sucesso' })
  listar() {
    return this.users.listar();
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ description: 'Usuario encontrado' })
  @ApiNotFoundResponse({ description: 'Usuario nao encontrado' })
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.users.buscarPorId(id);
  }

  @Public()
  @Post()
  @ApiCreatedResponse({ description: 'Usuario criado com sucesso' })
  criar(@Body() dto: CreateUserDto) {
    return this.users.criar(dto);
  }

  @Put(':id')
  @ApiAutenticacao()
  @ApiOkResponse({ description: 'Usuario atualizado com sucesso' })
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @UsuarioAtual() solicitante: UsuarioAutenticado,
  ) {
    return this.users.atualizar(id, dto, solicitante);
  }

  @Roles(ROLE_ADMIN)
  @Delete(':id')
  @ApiAutenticacao()
  @ApiOkResponse({ description: 'Usuario removido com sucesso' })
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.users.remover(id);
  }
}
