// @ts-nocheck
import { Sequelize } from 'sequelize';
import config from './config';
import CharacterFactory from '../models/Character.model';
import MovieFactory from '../models/Movie.model';
import GenreFactory from '../models/Genre.model';
import { capitalizeFirstLetter } from '../common/utils';

const { DB_LOGGING = false } = process.env;

const sequelize = new Sequelize(config, {
  define: {
    underscored: true,
  },
  logging: DB_LOGGING ? (m) => console.debug(m) : false,
});

const Character = CharacterFactory(sequelize);
const Movie = MovieFactory(sequelize);
const Genre = GenreFactory(sequelize);




// Un personaje puede estar en muchas peliculas
// La pelicula puede tener muchos personajes
Character.belongsToMany(Movie, { through: 'character_movies' });
Movie.belongsToMany(Character, { through: 'character_movies' });

// Un genero puede pertenecer a muchas peliculas
// La pelicula tiene un solo genero

export default {
  ...sequelize.models,
  sequelize,
};
