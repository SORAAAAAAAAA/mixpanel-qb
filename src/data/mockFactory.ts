import { faker } from '@faker-js/faker';
import { MixpanelProfile } from '@/types/index';

// A factory function that creates ONE random user
export const createRandomUser = (): MixpanelProfile => {
  return {
    distinctId: faker.string.uuid(),
    
    // Random standard properties
    $name: faker.person.fullName(),
    $email: faker.internet.email(),
    $avatar: faker.image.avatar(),
    $created: faker.date.past({ years: 2 }).toISOString(),
    $city: faker.location.city(),
    $region: faker.location.state(),
    $country_code: faker.location.countryCode(),
    $os: faker.helpers.arrayElement(['Android', 'iOS', 'Windows', 'MacOS']),

    // Random custom attributes
    customAttributes: {
      age: faker.number.int({ min: 18, max: 80 }),
      credit_score: faker.number.int({ min: 300, max: 850 }),
      net_worth_usd: faker.number.int({ min: 1000, max: 1000000 }),
      connected_accounts: faker.number.int({ min: 0, max: 10 }),
      // Pick random items from an array
      products: faker.helpers.arrayElements(['crypto', 'brokerage', 'banking', 'loans'], { min: 1, max: 4 }),
      geo_source: faker.location.country(),
      updated_at: faker.date.recent({ days: 30 }).toISOString(),
    },
  };
};

// Helper to generate MANY users
export const generateUsers = (count: number): MixpanelProfile[] => {
  return faker.helpers.multiple(createRandomUser, { count });
};