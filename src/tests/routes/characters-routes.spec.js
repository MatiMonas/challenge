const db = require('../../db');
const { generateAccessToken } = require('../../common/jwt');
const request = require('supertest');
const { server } = require('../../api');
const sequelize = db.default.sequelize;
const Character = db.default.Characters;
const Genre = db.default.Genres;
const Movie = db.default.Movies;

const testCharacter1 = {
  name: 'Mickey',
  image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
  age: 15,
  weight: 40,
  history: 'lorem ipsum',
  movies: [1],
};
const testCharacter2 = {
  name: 'Donald',
  image: 'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
  age: 16,
  weight: 30,
  history: 'lorem ipsum',
  movies: [1],
};
let token = '';
describe('Characters Routes', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await request(server).post('/auth/register').send({
      email: 'prueba@prueba.com',
      password: '12345',
    });

    const response = await request(server).post('/auth/login').send({
      email: 'prueba@prueba.com',
      password: '12345',
    });

    token = response.body.accessToken;

    await Genre.bulkCreate([{ name: 'Action' }, { name: 'Drama' }]);
    await Movie.create({
      title: 'Mulan',
      releaseDate: '2022-01-17',
      image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
      rating: 5,
      genreId: 1,
    });
  });

  describe('POST', () => {
    it('should return status 400 and corresponding text if any of the mandatory parameters are missing', async () => {
      const res = await request(server)
        .post('/characters')
        .set({ Authorization: `Bearer ${token}` });

      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Missing required parameters');
    });

    it('should return status 400 and corresponding message if age or weight are not a number', async () => {
      const res = await request(server)
        .post('/characters')
        .send({
          name: 'Mickey',
          image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
          age: '15sd2',
          weight: '40sd2',
          history: 'lorem ipsum',
          movies: [1],
        })
        .set({ Authorization: `Bearer ${token}` });
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: 'age and weight must be an integer number',
      });
    });

    it('should return status 201 if the character was succesfully created', async () => {
      const res = await request(server)
        .post('/characters')
        .set({ Authorization: `Bearer ${token}` })
        .send(testCharacter1);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'character created sucessfully' });
    });
  });

  describe('Multiple Routes /characters', () => {
    beforeAll(async () => {
      try {
        await Character.create(testCharacter2);
        await Movie.create({
          title: 'Mulan 2',
          releaseDate: '2022-01-17',
          image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
          rating: 5,
          genreId: 2,
        });
      } catch (err) {
        console.log(err);
      }
    });

    describe('GET', () => {
      it('should return status 200 and the characters list', async () => {
        const res = await request(server).get('/characters');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([
          {
            id: 1,
            name: 'Mickey',
            image:
              'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
          },
          {
            id: 2,
            name: 'Donald',
            image:
              'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
          },
        ]);
      });

      it('should return status 200 and all the details of a character if an id is sent by query', async () => {
        const res = await request(server).get('/characters?id=1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: 1,
          image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
          name: 'Mickey',
          age: 15,
          weight: 40,
          history: 'lorem ipsum',
          movies: [{ id: 1, title: 'Mulan' }],
        });
      });
    });
    describe('DELETE', () => {
      it('should return 400 if the id was not sent', async () => {
        const res = await request(server)
          .delete('/characters')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number ',
        });
      });
      it('should return 400 if the id is not a number and a message to the user', async () => {
        const res = await request(server)
          .delete('/characters?id=1a')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number ',
        });
      });

      it('should return 404 if the character to delete does not exist', async () => {
        const res = await request(server)
          .delete('/characters?id=5')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'character not found' });
      });

      it('should return status 200 and correctly delete a characacter', async () => {
        const res = await request(server)
          .delete('/characters?id=1')
          .set({ Authorization: `Bearer ${token}` });
        const character = await Character.findByPk(1);
        expect(character).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'character deleted successfully' });
      });
    });

    describe('PATCH', () => {
      it('should return status 400 if the id was not sent', async () => {
        const res = await request(server)
          .patch('/characters')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number ',
        });
      });

      it('should return status 400 if the no required parameter to update was sent', async () => {
        const res = await request(server)
          .patch('/characters?id=2')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ message: 'missing required parameters' });
      });

      it('should return 400 if the id is not a number and a message to the user', async () => {
        const res = await request(server)
          .patch('/characters?id=1a')
          .set({ Authorization: `Bearer ${token}` });
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
          message: 'id is required and must be an integer number ',
        });
      });

      it('should return 404 if the character to delete does not exist', async () => {
        const res = await request(server)
          .patch('/characters?id=5')
          .set({ Authorization: `Bearer ${token}` })
          .send({ age: 10 });
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: 'character not found' });
      });

      it('should send status 204 if the character was updated', async () => {
        const res = await request(server)
          .patch('/characters?id=2')
          .set({ Authorization: `Bearer ${token}` })
          .send({
            age: 20,
            weight: 30,
            history: 'lorem lorem',
            movies: [1, 2],
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
