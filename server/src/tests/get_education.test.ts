import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { educationTable } from '../db/schema';
import { type CreateEducationInput } from '../schema';
import { getEducation } from '../handlers/get_education';

// Test education entries
const testEducation1: CreateEducationInput = {
  institution: 'University of Technology',
  degree: 'Bachelor of Science',
  field_of_study: 'Computer Science',
  start_date: new Date('2018-09-01'),
  end_date: new Date('2022-05-15'),
  gpa: 3.8,
  description: 'Focused on software engineering and algorithms'
};

const testEducation2: CreateEducationInput = {
  institution: 'Code Academy',
  degree: 'Certificate',
  field_of_study: 'Full Stack Development',
  start_date: new Date('2023-01-01'),
  end_date: new Date('2023-06-30'),
  gpa: null,
  description: 'Intensive bootcamp covering modern web technologies'
};

const testEducation3: CreateEducationInput = {
  institution: 'Stanford University',
  degree: 'Master of Science',
  field_of_study: 'Artificial Intelligence',
  start_date: new Date('2022-09-01'),
  end_date: null, // Ongoing
  gpa: 3.9,
  description: null
};

describe('getEducation', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no education entries exist', async () => {
    const result = await getEducation();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('should return single education entry', async () => {
    // Create test education entry
    await db.insert(educationTable)
      .values({
        institution: testEducation1.institution,
        degree: testEducation1.degree,
        field_of_study: testEducation1.field_of_study,
        start_date: testEducation1.start_date,
        end_date: testEducation1.end_date,
        gpa: testEducation1.gpa,
        description: testEducation1.description
      })
      .execute();

    const result = await getEducation();

    expect(result).toHaveLength(1);
    expect(result[0].institution).toEqual('University of Technology');
    expect(result[0].degree).toEqual('Bachelor of Science');
    expect(result[0].field_of_study).toEqual('Computer Science');
    expect(result[0].gpa).toEqual(3.8);
    expect(typeof result[0].gpa).toBe('number');
    expect(result[0].start_date).toBeInstanceOf(Date);
    expect(result[0].end_date).toBeInstanceOf(Date);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should return multiple education entries ordered by start_date descending', async () => {
    // Insert test education entries
    await db.insert(educationTable)
      .values([
        {
          institution: testEducation1.institution,
          degree: testEducation1.degree,
          field_of_study: testEducation1.field_of_study,
          start_date: testEducation1.start_date, // 2018
          end_date: testEducation1.end_date,
          gpa: testEducation1.gpa,
          description: testEducation1.description
        },
        {
          institution: testEducation2.institution,
          degree: testEducation2.degree,
          field_of_study: testEducation2.field_of_study,
          start_date: testEducation2.start_date, // 2023 - most recent
          end_date: testEducation2.end_date,
          gpa: testEducation2.gpa,
          description: testEducation2.description
        },
        {
          institution: testEducation3.institution,
          degree: testEducation3.degree,
          field_of_study: testEducation3.field_of_study,
          start_date: testEducation3.start_date, // 2022
          end_date: testEducation3.end_date,
          gpa: testEducation3.gpa,
          description: testEducation3.description
        }
      ])
      .execute();

    const result = await getEducation();

    expect(result).toHaveLength(3);

    // Verify correct ordering by start_date descending (most recent first)
    expect(result[0].institution).toEqual('Code Academy'); // 2023 - most recent
    expect(result[1].institution).toEqual('Stanford University'); // 2022
    expect(result[2].institution).toEqual('University of Technology'); // 2018 - oldest

    // Verify date ordering
    expect(result[0].start_date.getFullYear()).toBe(2023);
    expect(result[1].start_date.getFullYear()).toBe(2022);
    expect(result[2].start_date.getFullYear()).toBe(2018);
  });

  it('should handle null GPA values correctly', async () => {
    // Insert education with null GPA
    await db.insert(educationTable)
      .values({
        institution: testEducation2.institution,
        degree: testEducation2.degree,
        field_of_study: testEducation2.field_of_study,
        start_date: testEducation2.start_date,
        end_date: testEducation2.end_date,
        gpa: null, // Null GPA
        description: testEducation2.description
      })
      .execute();

    const result = await getEducation();

    expect(result).toHaveLength(1);
    expect(result[0].gpa).toBeNull();
    expect(result[0].institution).toEqual('Code Academy');
  });

  it('should handle null optional fields correctly', async () => {
    // Insert education with minimal required fields
    await db.insert(educationTable)
      .values({
        institution: 'Tech Institute',
        degree: 'Associate Degree',
        field_of_study: null,
        start_date: new Date('2020-01-01'),
        end_date: null,
        gpa: null,
        description: null
      })
      .execute();

    const result = await getEducation();

    expect(result).toHaveLength(1);
    expect(result[0].institution).toEqual('Tech Institute');
    expect(result[0].degree).toEqual('Associate Degree');
    expect(result[0].field_of_study).toBeNull();
    expect(result[0].end_date).toBeNull();
    expect(result[0].gpa).toBeNull();
    expect(result[0].description).toBeNull();
    expect(result[0].start_date).toBeInstanceOf(Date);
  });

  it('should convert GPA numeric values correctly', async () => {
    // Insert education with various GPA values
    await db.insert(educationTable)
      .values([
        {
          institution: 'University A',
          degree: 'Bachelor',
          field_of_study: 'Engineering',
          start_date: new Date('2020-01-01'),
          end_date: new Date('2024-01-01'),
          gpa: 3.75, // Decimal GPA
          description: 'Test entry'
        },
        {
          institution: 'University B',
          degree: 'Master',
          field_of_study: 'Science',
          start_date: new Date('2019-01-01'),
          end_date: new Date('2023-01-01'),
          gpa: 4.0, // Whole number GPA
          description: 'Test entry 2'
        }
      ])
      .execute();

    const result = await getEducation();

    expect(result).toHaveLength(2);
    
    // Verify GPA values are properly converted to numbers
    expect(typeof result[0].gpa).toBe('number');
    expect(typeof result[1].gpa).toBe('number');
    expect(result[0].gpa).toEqual(3.75);
    expect(result[1].gpa).toEqual(4.0);
  });
});