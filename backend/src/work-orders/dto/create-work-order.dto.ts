import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, WorkOrderStatus } from '@prisma/client';

export class WorkOrderItemDto {
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  precoUnitario: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  desconto?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  acrescimo?: number;

  @IsOptional()
  @IsNumber()
  quantidade?: number;
}

export class PaymentDto {
  @IsEnum(PaymentMethod)
  metodo: PaymentMethod;

  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsOptional()
  @IsDateString()
  dataPagamento?: string;

  @IsOptional()
  @IsNumber()
  numeroParcela?: number;

  @IsOptional()
  @IsNumber()
  totalParcelas?: number;
}

export class ReceivableProjectionDto {
  @IsNotEmpty()
  @IsDateString()
  dataPrevista: string;
}

export class CreateWorkOrderDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  @IsOptional()
  @IsString()
  formaRecebimento?: string;

  @IsOptional()
  @IsString()
  agendamentoId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderItemDto)
  items: WorkOrderItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments?: PaymentDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ReceivableProjectionDto)
  receivableProjection?: ReceivableProjectionDto;
}
