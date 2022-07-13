// NO SE ESTA HACIENDO UN MOCK DE LA BD

const db = require('../../db');

const sequelize = db.default.sequelize;
const Movie = db.default.Movies;

describe('Movie Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  describe('Check required properties', () => {
    it('should not create the Movie if title is not sent', async () => {
      expect.assertions(1);
      try {
        await Movie.create({ releaseDate: Date.now() });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create two Movies with the same name', async () => {
      expect.assertions(1);
      try {
        await Genre.create({ title: 'Aladdin' , releaseDate: Date.now()});
        await Genre.create({ title: 'Aladdin' , releaseDate: Date.now()});
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });
    it('should not create the Movie if releaseDate is not sent', async () => {
      expect.assertions(1);
      try {
        await Movie.create({ title: 'Aladdin' });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create the Movie if releaseDate format is not a Date', async () => {
      expect.assertions(1);
      try {
        await Movie.create({ title: 'Aladdin', releaseDate: 'a' }).then(
          (response) => console.log(response),
        );
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create the Movie if the rating is not from 1-5', async () => {
      expect.assertions(1);
      try {
        await Movie.create({
          title: 'Aladdin',
          releaseDate: Date.now(),
          rating: 6,
        }).then((response) => console.log(response));
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should  create the Movie if all required properties are okay', async () => {
      expect.assertions(3);
      try {
        const date = Date.now();
        const testMovie = await Movie.create({
          title: 'Aladdin',
          releaseDate: date,
        });
        expect(testMovie.toJSON()).toHaveProperty('title', 'Aladdin');
        expect(testMovie.toJSON()).toHaveProperty('releaseDate', date);
        expect(testMovie.toJSON()).toHaveProperty('rating', null);
        expect(testMovie.toJSON()).toHaveProperty('image', null);
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
