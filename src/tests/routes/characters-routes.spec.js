const db = require('../../db');
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
  movieId: [1],
};
const testCharacter2 = {
  name: 'Donald',
  image: 'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
  age: 16,
  weight: 30,
  history: 'lorem ipsum',
  movieId: [1],
};

describe('Characters Routes', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('POST', () => {
    it('should return status 400 and corresponding text if any of the mandatory parameters is not send', async () => {
      const res = await request(server).post('/characters');
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Missing required parameters');
    });

    it('should return status 201 if the character was succesfully created', async () => {
      await Genre.create({ name: 'Action' });
      await Movie.create({
        title: 'Mulan',
        releaseDate: '2022-01-17',
        image: 'https://pics.filmaffinity.com/Mulan-247098384-large.jpg',
        rating: 5,
        genreId: 1,
      });
      const res = await request(server)
        .post('/characters')
        .send(testCharacter1);
      expect(res.statusCode).toBe(201);
      expect(res.text).toBe('character created successfully');
    });
  });

  describe('GET', () => {
    beforeEach(async () => {
      const t1 = await Character.create(testCharacter1);
      const t2 = await Character.create(testCharacter2);

      await Promise.all([
        t1.createMovie({ title: 'test movie', releaseDate: Date.now() }),
        t2.createMovie({ title: 'test movie 2', releaseDate: Date.now() }),
      ]);
    });
    it('should return status 200 and the characters list', async () => {
      const res = await request(server).get('/characters');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          name: 'Mickey',
          image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
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
        movies: [{ id: 1, title: 'test movie' }],
      });
    });
  });

  describe('DELETE',  () => {
    it('should delete return 404 if the character to delete does not exist' , async () =>{
      await Character.create(testCharacter1);
      const res = await request(server).delete('/characters?id=2')
      expect(res.statusCode).toBe(404)
      expect(res.text).toBe('Character to delete was not found.')
    })

     it('should return status 200 and correctly delete a characacter', async ()=> {
      await Character.create(testCharacter1);
      const res = await request(server).delete('/characters?id=1')
      expect(res.statusCode).toBe(200);

      const character = Character.findByPk(1)
      expect(character).toBe(undefined)
     })
  })
  describe('PATCH', () => {
    it('should return status 400 if no parameter was sent', async () => {
      const res = await request(server).path('/characters?id=1')

      expect(res.statusCode).toBe(400)
    })

    it('should return status 200 if it correctly updates the sent properties',async () => {
      await Character.create(testCharacter1);
      const res = await request(server).patch('/characters?id=1')
      .send({name:'Goofy'});
      expect(res.statusCode).toBe(200);
      const character = Character.findByPk(1)
      expect(character.name).toBe('Goofy')
    })
  })

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
