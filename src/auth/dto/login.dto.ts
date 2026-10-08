import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email deve ser um endereco valido' })
  @MaxLength(150)
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  senha!: string;
}
