export interface character  {
  id: number;
  name: string;
  image?: string;
  age: number;
  history?: string;
  weight: number;
  movies: movie[]
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