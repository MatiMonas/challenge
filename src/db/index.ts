// @ts-nocheck
import { Sequelize } from 'sequelize';
import config from './config';
import CharacterFactory from '../models/Character.model';
import MovieFactory from '../models/Movie.model';
import GenreFactory from '../models/Genre.model';
import UsersFactory from '../models/User.model';

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
const User = UsersFactory(sequelize);

// Un personaje puede estar en muchas peliculas
// La pelicula puede tener muchos personajes
Character.belongsToMany(Movie, { through: 'character_movies' , as: 'movies' });
Movie.belongsToMany(Character, { through: 'character_movies', as: 'characters' });

// Un genero puede pertenecer a muchas peliculas
// La pelicula tiene un solo genero
Genre.hasMany(Movie, { foreignKey: 'genreId', as : 'movies' });
Movie.belongsTo(Genre, { foreignKey: 'genreId', as: 'genre' });

export default {  
  ...sequelize.models,
  sequelize,
  Character, 
  Movie, 
  Genre,
  User
};
