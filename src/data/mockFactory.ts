import { faker } from '@faker-js/faker';
import { MixpanelProfile } from '@/types/analytics/index';

// Seed faker for consistent server-side and client-side rendering
faker.seed(12345);

// A factory function that creates ONE random user
export const createRandomUser = (): MixpanelProfile => {
  // Create a date in early January 2024 to match the Mixpanel screenshot
  const jan2024 = new Date('2024-01-04');

  return {
    distinctId: faker.string.uuid(),

    // Random standard properties
    $name: faker.person.fullName(),
    $email: faker.internet.email(),
    $avatar: faker.image.avatar(),
    $created: jan2024.toISOString(),
    $city: faker.location.city(),
    $region: faker.location.state(),
    $country_code: faker.location.country(),
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
      updated_at: jan2024.toISOString(),
    },
  };
};

// Helper to generate MANY users
export const generateUsers = (count: number): MixpanelProfile[] => {
  return faker.helpers.multiple(createRandomUser, { count });
};