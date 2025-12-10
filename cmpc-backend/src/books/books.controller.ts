import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('books')
@ApiBearerAuth()
@Controller({ path: 'books', version: '1' })
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo libro' })
  @ApiResponse({ status: 201, description: 'Libro creado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los libros con paginación y filtros',
  })
  @ApiResponse({ status: 200, description: 'Lista paginada de libros' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Query() query: QueryBooksDto) {
    return this.booksService.findAll(query);
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Exportar libros a CSV' })
  @ApiResponse({ status: 200, description: 'Archivo CSV generado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async exportCsv(@Res() res: Response) {
    const csv = await this.booksService.exportToCsv();

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=libros.csv');
    res.send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un libro por ID' })
  @ApiResponse({ status: 200, description: 'Libro encontrado' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un libro' })
  @ApiResponse({ status: 200, description: 'Libro actualizado' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un libro (soft delete)' })
  @ApiResponse({ status: 200, description: 'Libro eliminado' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
