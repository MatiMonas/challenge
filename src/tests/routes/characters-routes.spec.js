const db = require('../../db');
const request = require('supertest');
const { server } = require('../../api');
const sequelize = db.default.sequelize;
const Character = db.default.Characters;

const testCharacter1 = {
  name: 'Mickey',
  image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
  age: 15,
  weight: 40,
};
const testCharacter2 = {
  name: 'Donald',
  image: 'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
  age: 16,
  weight: 30,
};

describe('Characters Routes', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('POST', () => {
    it('should return status 400 and corresponding text if any of the mandatory parameters is not send', async () => {
      const res = await request(server).post('/characters');
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe('Missing required properties');
    });

    it('should return status 201 if the character was succesfully created', async () => {
      const res = await request(server)
        .post('/characters')
        .send(testCharacter1);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        id: 1,
        ...testCharacter1,
      });
    });
  });

  describe('GET', () => {
    it('should return status 200 and the characters list', async () => {
      const res = await request(server).get('/characters');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          name: 'Mickey',
          image: 'https://sm.ign.com/ign_es/screenshot/default/11112_uq7s.jpg',
          age: 15,
          weight: 40,
        },
        {
          id: 2,
          name: 'Donald',
          image:
            'https://static.wikia.nocookie.net/disney/images/6/6f/Donald_Duck.png',
          age: 16,
          weight: 30,
        },
      ]);
    });
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
