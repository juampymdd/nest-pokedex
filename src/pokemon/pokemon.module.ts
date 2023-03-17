import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSechema } from './entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { 
        name: Pokemon.name, 
        schema: PokemonSechema
      }
    ]),
  ],
  exports: [
    MongooseModule
  ]
})
export class PokemonModule {}
