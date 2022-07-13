const db = require('../../db');
const request = require('supertest');
const { server } = require('../../api');
const sequelize = db.default.sequelize;

describe('Movies Routes', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('/movies', () => {
    it('should return status 200 and "Hello World" string', async () => {
      const res = await request(server).get('/movies');
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Hello World!');
    });
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
