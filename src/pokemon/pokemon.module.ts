import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSechema } from './entities/pokemon.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([
      { 
        name: Pokemon.name, 
        schema: PokemonSechema
      }
    ]),
  ]
})
export class PokemonModule {}
