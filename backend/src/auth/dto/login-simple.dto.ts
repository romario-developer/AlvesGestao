import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginSimpleDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
