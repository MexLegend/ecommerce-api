import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { GetFavoritesDto } from './dto/get-favorites.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) { 
    return this.favoriteService.toogleFavorite(createFavoriteDto);
  }

  @Get()
  findAll(@Query() params: GetFavoritesDto) {
    return this.favoriteService.findAll(params);
  }
}
