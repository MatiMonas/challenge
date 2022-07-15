const db = require('../../db');
const request = require('supertest');
const { server } = require('../../api');
const sequelize = db.default.sequelize;
const Character = db.default.Characters;
const Genre = db.default.Genres;
const Movie = db.default.Movies;

const movie1 = {
  title: 'Mulan',
  releaseDate: '2022-01-17',
  image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
  rating: 5,
  genreId: 1,
};

const movie2 = {
  title: 'Mulan 2',
  releaseDate: '2022-01-17',
  image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
  rating: 5,
  genreId: 1,
};

let token = '';
describe('Movies Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await Genre.bulkCreate([{ name: 'Action' }, { name: 'Drama' }]);
    await request(server).post('/auth/register').send({
      email: 'prueba@prueba.com',
      password: '12345',
    });

    const response = await request(server).post('/auth/login').send({
      email: 'prueba@prueba.com',
      password: '12345',
    });

    token = response.body.accessToken;
  });

  describe('POST', () => {
    it('should return status 400 and corresponding text if any of the mandatory parameters are missing', async () => {
      const res = await request(server)
        .post('/movies')
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'missing required parameters' });
    });

    it('should return status 400 and corresponding message if rating or genreId are not a number', async () => {
      const res = await request(server)
        .post('/movies')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          title: 'Mulan 2',
          releaseDate: '2022-01-17',
          image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
          rating: '5sd2',
          genreId: 'asl;kd2',
        });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: 'rating and genreId must be an integer number',
      });
    });

    it('should return status 201 if the movie was succesfully created', async () => {
      const res = await request(server)
        .post('/movies')
        .set({ Authorization: `Bearer ${token}` })
        .send(movie1);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'movie created' });
    });
  });
  describe('Multiple Routes /movies', () => {
    beforeAll(async () => {
      try {
        await Movie.create(movie2);
        let char = await Character.create({
          name: 'Donald',
          image:
            'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
          age: 16,
          weight: 30,
          history: 'lorem ipsum',
        });
        await char.addMovie(1);
      } catch (err) {
        console.log(err);
      }
    });

    describe('GET', () => {
      it('should return status 200 and the movies list', async () => {
        const res = await request(server).get('/movies');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
          {
            id: 1,
            title: 'Mulan',
            releaseDate: '2022-01-17',
            image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
          },
          {
            id: 2,
            title: 'Mulan 2',
            releaseDate: '2022-01-17',
            image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
          },
        ]);
      });
      it('should return status 200 and all the details of a movie if an id is sent by query', async () => {
        const res = await request(server).get('/movies?id=1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: 1,
          title: 'Mulan',
          releaseDate: '2022-01-17',
          image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
          rating: 5,
          genreId: 1,
          characters: [{ id: 1, name: 'Donald' }],
        });
      });
    });
    describe('DELETE', () => {
      it('should return 400 if the id was not sent', async () => {
        const res = await request(server)
          .delete('/movies')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number',
        });
      });

      it('should return 400 if the id is not a number and a message to the user', async () => {
        const res = await request(server)
          .delete('/movies?id=1a')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number',
        });
      });

      it('should return 404 if the movie to delete does not exist', async () => {
        const res = await request(server)
          .delete('/movies?id=5')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'movie not found' });
      });

      it('should return status 200 and correctly delete a characacter', async () => {
        const res = await request(server)
          .delete('/movies?id=1')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'movie deleted successfully' });
      });
    });

    describe('PATCH', () => {
      it('should return status 400 if the id was not sent', async () => {
        const res = await request(server)
          .patch('/movies')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and it must be an integer number',
        });
      });

      it('should return status 400 if the no required parameter to update was sent', async () => {
        const res = await request(server)
          .patch('/movies?id=2')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: 'missing required parameters' });
      });

      it('should return 400 if rating is not a number and a message to the user', async () => {
        const res = await request(server)
          .patch('/movies?id=1')
          .set({ Authorization: `Bearer ${token}` })
          .send({ rating: '23ka0', image: 'aa' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'rating must be an integer number',
        });
      });

      it('should return 404 if the movie to delete does not exist', async () => {
        const res = await request(server)
          .patch('/movies?id=10')
          .set({ Authorization: `Bearer ${token}` })
          .send({ rating: 3 });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'movie not found' });
      });

      it('should send status 204 if the movie was updated', async () => {
        const res = await request(server)
          .patch('/movies?id=2')
          .set({ Authorization: `Bearer ${token}` })
          .send({
            rating: 2,
            image:
              'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
          });
        expect(res.statusCode).toBe(204);
      });
    });
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
