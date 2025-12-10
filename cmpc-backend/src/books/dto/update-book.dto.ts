import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ example: 'Cien años de soledad', required: false })
  @IsString()
  @IsOptional()
  titulo?: string;

  @ApiProperty({ example: 'Gabriel García Márquez', required: false })
  @IsString()
  @IsOptional()
  autor?: string;

  @ApiProperty({ example: 'Sudamericana', required: false })
  @IsString()
  @IsOptional()
  editorial?: string;

  @ApiProperty({ example: 15000, required: false })
  @IsNumber()
  @IsOptional()
  precio?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  disponibilidad?: boolean;

  @ApiProperty({ example: 'Ficción', required: false })
  @IsString()
  @IsOptional()
  genero?: string;
}
