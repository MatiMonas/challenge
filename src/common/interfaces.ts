import jwt from 'jsonwebtoken';

export interface character {
  id: number;
  name: string;
  image?: string;
  age: number;
  history?: string;
  weight: number;
  movies: movie[];
}

export interface movie {
  id: number;
  title: string;
  releaseDate: string;
  image?: string;
  rating?: number;
  characters: character[];
  genreId: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: jwt.Jwt & jwt.JwtPayload & void ;
  }
}
