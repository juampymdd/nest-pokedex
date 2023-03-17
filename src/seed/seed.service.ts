import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {
  
  constructor(
      @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,
      private readonly http: AxiosAdapter,
    ){}
  
  async executeSeed() {

    await this.pokemonModel.deleteMany({}) // delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: {no: number, name: string}[] = [];

    data.results.forEach(async ({ name, url })=>{

      const segments = url.split('/')
      const no = +segments[segments.length -2]

      pokemonToInsert.push({ no, name });
    })
    
    await this.pokemonModel.insertMany(pokemonToInsert)

    return 'Seed Excecuted';
  }

  // async executeSeedAlternative() {

  //   await this.pokemonModel.deleteMany({}) // delete * from pokemons

  //   const  data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

  //   const inserPromisesArray = [];
  //   data.results.forEach(async ({ name, url })=>{
  //     // console.log({ name, url })
  //     const segments = url.split('/')
  //     const no = +segments[segments.length -2]

  //     // await this.pokemonModel.create({ no, name})

  //     inserPromisesArray.push(
  //       this.pokemonModel.create({ no, name})
  //     );
  //   })
    
  //   await Promise.all( inserPromisesArray );

  //   return 'Seed Excecuted';
  // }
}
