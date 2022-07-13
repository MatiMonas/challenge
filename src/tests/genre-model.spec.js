// NO SE ESTA HACIENDO UN MOCK DE LA BD

const db = require('../db');

const sequelize = db.default.sequelize;
const Genre = db.default.Genres;

describe('Genre Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('Check required properties', () => {
    it('should not create the Genre if name is not sent', async () => {
      expect.assertions(1);
      try {
        await Genre.create({});
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create two Genres with the same name', async () => {
      expect.assertions(1);
      try {
        await Genre.create({ title: 'Drama' });
        await Genre.create({ title: 'Drama' });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should  create the Genre if all required properties are okay', async () => {
      expect.assertions(1);
      try {
        await Genre.create({ title: 'Drama' });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
  });

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
