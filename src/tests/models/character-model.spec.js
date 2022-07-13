const db = require('../../db');
// NO SE ESTA HACIENDO UN MOCK DE LA BD

const sequelize = db.default.sequelize;
const Character = db.default.Characters;

describe('Character Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should not create the Character if name is not send', async () => {
    expect.assertions(1);
    try {
      await Character.create({ age: 15, weight: 45 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create the Character if age is not send', async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mickey', weight: 45 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create the Character if weight is not send', async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mickey', age: 15 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create two Characters with the same name', async () => {
    expect.assertions(1);
    try {
      const CharacterOne = await Character.create({
        name: 'Mickey',
        age: 15,
      });
      expect(CharacterOne.toJSON()).toHaveProperty('name', 'Mickey');
      expect(CharacterOne.toJSON()).toHaveProperty('age', 15);

      const CharacterTwo = await Character.create({
        name: 'Mickey',
        age: 10,
      });
      expect(CharacterTwo.toJSON()).toHaveProperty('name', 'Mickey');
      expect(CharacterTwo.toJSON()).toHaveProperty('age', 10);
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it("should not create a Character with if it's name contains anything but letters", async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mick2ey', age: 15 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create a Character if the age is not an integer number', async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mickey', age: 12.5 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create a Character with age greater than 99', async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mickey', age: 100 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });
  it('should create the Character if all required properties are ok', async () => {
    try {
      const testCharacter = await Character.create({
        name: 'Mickey',
        age: 15,
      });
      expect(testCharacter.toJSON()).toHaveProperty('name', 'Mickey');
      expect(testCharacter.toJSON()).toHaveProperty('age', 15);
      expect(testCharacter.toJSON()).toHaveProperty('history', null);
      expect(testCharacter.toJSON()).toHaveProperty('weight', null);
      expect(testCharacter.toJSON()).toHaveProperty('image', null);
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });

  it('should not create a Character with age less than 1', async () => {
    expect.assertions(1);
    try {
      await Character.create({ name: 'Mickey', age: 0 });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });
});

afterAll(async () => {
  await sequelize.sync({ force: true });
  sequelize.close();
});
