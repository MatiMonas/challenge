
const db = require('../../db');
const request = require('supertest');
const {server} = require('../../api');
const { constants } = require('../../common/utils');
const sequelize = db.default.sequelize;




describe('Test Routes', () => {
  beforeEach(async ()=> {
    await sequelize.sync({force: true})
  })

  describe('/test', ()=> {
    it('should return status 200 and "Hello World" string', async () => {
      const res = await request(server).get('/test')
      expect(res.statusCode).toBe(200);
      expect(res.text).toEqual('Hello World!')
    })
  })

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
})