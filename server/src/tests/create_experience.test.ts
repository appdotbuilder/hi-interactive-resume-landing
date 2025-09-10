import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type CreateExperienceInput } from '../schema';
import { createExperience } from '../handlers/create_experience';
import { eq } from 'drizzle-orm';

// Test input for current position
const currentJobInput: CreateExperienceInput = {
  company_name: 'Tech Corp',
  position: 'Senior Software Engineer',
  description: 'Leading development of web applications using React and Node.js',
  start_date: new Date('2023-01-15'),
  end_date: null,
  is_current: true,
  location: 'San Francisco, CA',
  company_url: 'https://techcorp.com'
};

// Test input for past position
const pastJobInput: CreateExperienceInput = {
  company_name: 'StartupXYZ',
  position: 'Full Stack Developer',
  description: 'Built and maintained e-commerce platform',
  start_date: new Date('2021-06-01'),
  end_date: new Date('2022-12-31'),
  is_current: false,
  location: 'Remote',
  company_url: 'https://startupxyz.com'
};

// Minimal test input (required fields only)
const minimalInput: CreateExperienceInput = {
  company_name: 'Minimal Corp',
  position: 'Developer',
  description: null,
  start_date: new Date('2022-01-01'),
  end_date: null,
  is_current: false,
  location: null,
  company_url: null
};

describe('createExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a current position experience', async () => {
    const result = await createExperience(currentJobInput);

    // Basic field validation
    expect(result.company_name).toEqual('Tech Corp');
    expect(result.position).toEqual('Senior Software Engineer');
    expect(result.description).toEqual('Leading development of web applications using React and Node.js');
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.start_date.toISOString().split('T')[0]).toEqual('2023-01-15');
    expect(result.end_date).toBeNull();
    expect(result.is_current).toBe(true);
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.company_url).toEqual('https://techcorp.com');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a past position experience', async () => {
    const result = await createExperience(pastJobInput);

    // Verify past job specifics
    expect(result.company_name).toEqual('StartupXYZ');
    expect(result.position).toEqual('Full Stack Developer');
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
    expect(result.end_date!.toISOString().split('T')[0]).toEqual('2022-12-31');
    expect(result.is_current).toBe(false);
    expect(result.location).toEqual('Remote');
    expect(result.id).toBeDefined();
  });

  it('should create experience with minimal required fields', async () => {
    const result = await createExperience(minimalInput);

    // Verify nullable fields are handled correctly
    expect(result.company_name).toEqual('Minimal Corp');
    expect(result.position).toEqual('Developer');
    expect(result.description).toBeNull();
    expect(result.end_date).toBeNull();
    expect(result.is_current).toBe(false);
    expect(result.location).toBeNull();
    expect(result.company_url).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save experience to database', async () => {
    const result = await createExperience(currentJobInput);

    // Query the database to verify persistence
    const experiences = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, result.id))
      .execute();

    expect(experiences).toHaveLength(1);
    const savedExperience = experiences[0];
    
    expect(savedExperience.company_name).toEqual('Tech Corp');
    expect(savedExperience.position).toEqual('Senior Software Engineer');
    expect(savedExperience.description).toEqual('Leading development of web applications using React and Node.js');
    expect(savedExperience.is_current).toBe(true);
    expect(savedExperience.location).toEqual('San Francisco, CA');
    expect(savedExperience.company_url).toEqual('https://techcorp.com');
    expect(savedExperience.created_at).toBeInstanceOf(Date);
  });

  it('should handle date fields correctly', async () => {
    const testDate = new Date('2023-03-15T10:30:00Z');
    const endDate = new Date('2023-12-31T23:59:59Z');
    
    const dateInput: CreateExperienceInput = {
      company_name: 'Date Test Corp',
      position: 'Test Position',
      description: 'Testing date handling',
      start_date: testDate,
      end_date: endDate,
      is_current: false,
      location: 'Test City',
      company_url: 'https://datetest.com'
    };

    const result = await createExperience(dateInput);

    // Verify date handling
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
    expect(result.start_date.getTime()).toEqual(testDate.getTime());
    expect(result.end_date!.getTime()).toEqual(endDate.getTime());
  });

  it('should create multiple experiences independently', async () => {
    // Create multiple experiences
    const result1 = await createExperience(currentJobInput);
    const result2 = await createExperience(pastJobInput);
    const result3 = await createExperience(minimalInput);

    // Verify all have unique IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(result2.id).not.toEqual(result3.id);
    expect(result1.id).not.toEqual(result3.id);

    // Verify all are persisted in database
    const allExperiences = await db.select()
      .from(experienceTable)
      .execute();

    expect(allExperiences).toHaveLength(3);
    
    // Verify each experience is saved with correct data
    const companies = allExperiences.map(exp => exp.company_name);
    expect(companies).toContain('Tech Corp');
    expect(companies).toContain('StartupXYZ');
    expect(companies).toContain('Minimal Corp');
  });
});