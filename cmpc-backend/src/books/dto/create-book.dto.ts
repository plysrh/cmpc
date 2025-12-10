import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  titulo!: string;

  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsString()
  autor!: string;

  @ApiProperty({ example: 'Sudamericana' })
  @IsString()
  editorial!: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  precio!: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  disponibilidad?: boolean;

  @ApiProperty({ example: 'Ficción' })
  @IsString()
  genero!: string;
}
