import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duracaoMinutos?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  precoBase: number;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsBoolean()
  geraPosVenda?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  diasFollowUp?: number;
}
