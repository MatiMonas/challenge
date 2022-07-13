const db = require('../db');
// NO SE ESTA HACIENDO UN MOCK DE LA BD

const sequelize = db.default.sequelize;
const Character = db.default.Characters;

describe('Character Model', () => {
  

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  })
 

  describe('Check required properties', () => {
    it('should not create the Character if name is not send', async () => {
      expect.assertions(1);
      try {
        await Character.create({ age: 15 });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create the Character if age is not send', async () => {
      expect.assertions(1);
      try {
        await Character.create({ name: 'Mickey' });
      } catch (error) {
        expect(error.message).toBeDefined();
      }
    });

    it('should not create two Characters with the same name', async () => {
      expect.assertions(3);
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
      try{

        const testCharacter = await Character.create({
          name: 'Mickey',
          age: 15,
        });
        expect(testCharacter.toJSON()).toHaveProperty('name', 'Mickey');
        expect(testCharacter.toJSON()).toHaveProperty('age', 15);
        expect(testCharacter.toJSON()).toHaveProperty('history', null);
        expect(testCharacter.toJSON()).toHaveProperty('weight', null);
        expect(testCharacter.toJSON()).toHaveProperty('image', null);
      }catch(error){
        console.log(error)
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

  // describe('Parte DOS', () => {
  //   it('should retrieve the summary although it is not saved in the database', async () => {
  //     const Character = await Character.create({
  //       name: 'Thunderbolt',
  //       description: 'An incredibly powerful thunderbolt',
  //       mana_cost: 210.0});
  //     expect(Character.summary).toBe('Thunderbolt (210 points of mana) - Description: An incredibly powerful thunderbolt');
  //     const [results] = await sequelize.query('SELECT * FROM "Abilities" WHERE name = \'Thunderbolt\'');
  //     expect(results[0]).not.toHaveProperty('summary');
  //   });

  //   it('should not create the Character if mana_cost is lower than the min value', async () => {
  //     expect.assertions(1);
  //     try {
  //       await Character.create({name: 'Weak power', mana_cost: 5.0});
  //     } catch (error) {
  //       expect(error.message).toBeDefined();
  //     }
  //   });

  //   it('should not create the Character if mana_cost is higher than the max value', async () => {
  //     expect.assertions(1);
  //     try {
  //       await Character.create({name: 'Op power', mana_cost: 505.0});
  //     } catch (error) {
  //       expect(error.message).toBeDefined();
  //     }
  //   });
  // })

  afterAll(async () => {
    await sequelize.sync({ force: true });
    sequelize.close();
  });
});
