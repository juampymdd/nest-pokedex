import { BadGatewayException, Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  
  private defaultLimit: number;

  constructor(

    @InjectModel( Pokemon.name )
    
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,

  ) {

    this.defaultLimit = this.configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try{
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
    }catch( error ){
      this.handleExceptions( error )
    }
  }

  findAll( PaginationDto: PaginationDto ) {
    const { limit = this.defaultLimit, offset = 0 } = PaginationDto
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    ;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if(!isNaN(Number(term))){
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    
    // MongoId
    if ( !pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term);
    }
    
    // Name
    if(!pokemon){
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase() });
    }

    if(!pokemon){
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
    }
    
    return pokemon;
    
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    let pokemon = await this.findOne( term );
    console.log(pokemon);
    if ( updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    
      try{
        await pokemon.updateOne( updatePokemonDto );
        return {...pokemon.toJSON(), ...updatePokemonDto};
      }catch( error ){
        this.handleExceptions( error )
      }
  }

  async remove(id: string) {

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found.`)
    }

    return;
  }

  private handleExceptions (error: any){
    if(error.code === 11000){
      throw new BadGatewayException(`Pokemon already exist in db ${JSON.stringify(error.keyValue)}`);
    }else {
      console.log(error);
      throw new InternalServerErrorException(`Can´t create pokemon - Check server logs`);
    }
  }
}
