import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type CreateExperienceInput } from '../schema';
import { getExperience } from '../handlers/get_experience';

// Test experience data
const testExperience1: CreateExperienceInput = {
  company_name: 'Tech Corp',
  position: 'Senior Developer',
  description: 'Led development of web applications',
  start_date: new Date('2022-01-01'),
  end_date: new Date('2023-12-31'),
  is_current: false,
  location: 'San Francisco, CA',
  company_url: 'https://techcorp.com'
};

const testExperience2: CreateExperienceInput = {
  company_name: 'Startup Inc',
  position: 'Full Stack Developer',
  description: 'Built MVP and scaled the platform',
  start_date: new Date('2023-01-01'),
  end_date: null,
  is_current: true,
  location: 'Remote',
  company_url: 'https://startup.com'
};

const testExperience3: CreateExperienceInput = {
  company_name: 'Old Company',
  position: 'Junior Developer',
  description: null,
  start_date: new Date('2020-06-01'),
  end_date: null,
  is_current: false,
  location: null,
  company_url: null
};

describe('getExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no experience exists', async () => {
    const result = await getExperience();
    expect(result).toEqual([]);
  });

  it('should return all experience records', async () => {
    // Insert test data
    await db.insert(experienceTable)
      .values([testExperience1, testExperience2, testExperience3])
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(3);
    
    // Verify all records are returned with correct fields
    const companies = result.map(exp => exp.company_name);
    expect(companies).toContain('Tech Corp');
    expect(companies).toContain('Startup Inc');
    expect(companies).toContain('Old Company');
  });

  it('should order experience by start_date descending (most recent first)', async () => {
    // Insert test data
    await db.insert(experienceTable)
      .values([testExperience1, testExperience2, testExperience3])
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(3);
    
    // Check ordering - most recent first
    expect(result[0].company_name).toEqual('Startup Inc'); // 2023-01-01
    expect(result[1].company_name).toEqual('Tech Corp');   // 2022-01-01
    expect(result[2].company_name).toEqual('Old Company'); // 2020-06-01

    // Verify dates are in descending order
    expect(result[0].start_date >= result[1].start_date).toBe(true);
    expect(result[1].start_date >= result[2].start_date).toBe(true);
  });

  it('should return experience with all required fields', async () => {
    // Insert experience with all fields populated
    await db.insert(experienceTable)
      .values(testExperience1)
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(1);
    const experience = result[0];

    // Verify all fields are present and correct types
    expect(experience.id).toBeDefined();
    expect(typeof experience.id).toBe('number');
    expect(experience.company_name).toEqual('Tech Corp');
    expect(experience.position).toEqual('Senior Developer');
    expect(experience.description).toEqual('Led development of web applications');
    expect(experience.start_date).toBeInstanceOf(Date);
    expect(experience.end_date).toBeInstanceOf(Date);
    expect(experience.is_current).toBe(false);
    expect(experience.location).toEqual('San Francisco, CA');
    expect(experience.company_url).toEqual('https://techcorp.com');
    expect(experience.created_at).toBeInstanceOf(Date);
  });

  it('should handle experience with nullable fields', async () => {
    // Insert experience with minimal required fields
    await db.insert(experienceTable)
      .values(testExperience3)
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(1);
    const experience = result[0];

    // Verify required fields
    expect(experience.company_name).toEqual('Old Company');
    expect(experience.position).toEqual('Junior Developer');
    expect(experience.start_date).toBeInstanceOf(Date);
    expect(experience.is_current).toBe(false);
    
    // Verify nullable fields
    expect(experience.description).toBeNull();
    expect(experience.end_date).toBeNull();
    expect(experience.location).toBeNull();
    expect(experience.company_url).toBeNull();
  });

  it('should handle experience with current position', async () => {
    // Insert current position
    await db.insert(experienceTable)
      .values(testExperience2)
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(1);
    const experience = result[0];

    expect(experience.company_name).toEqual('Startup Inc');
    expect(experience.is_current).toBe(true);
    expect(experience.end_date).toBeNull();
  });

  it('should handle multiple experience records with same start date', async () => {
    // Create two experiences with same start date
    const sameDate = new Date('2022-01-01');
    const exp1 = { ...testExperience1, start_date: sameDate, company_name: 'Company A' };
    const exp2 = { ...testExperience1, start_date: sameDate, company_name: 'Company B' };

    await db.insert(experienceTable)
      .values([exp1, exp2])
      .execute();

    const result = await getExperience();

    expect(result).toHaveLength(2);
    // Both should have same start date
    expect(result[0].start_date.getTime()).toEqual(sameDate.getTime());
    expect(result[1].start_date.getTime()).toEqual(sameDate.getTime());
  });
});