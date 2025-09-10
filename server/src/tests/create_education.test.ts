import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { educationTable } from '../db/schema';
import { type CreateEducationInput } from '../schema';
import { createEducation } from '../handlers/create_education';
import { eq } from 'drizzle-orm';

// Complete test input with all required fields
const testInput: CreateEducationInput = {
  institution: 'University of Technology',
  degree: 'Bachelor of Science',
  field_of_study: 'Computer Science',
  start_date: new Date('2018-09-01'),
  end_date: new Date('2022-05-15'),
  gpa: 3.8,
  description: 'Focused on software engineering and data structures'
};

// Test input with minimal required fields
const minimalInput: CreateEducationInput = {
  institution: 'Tech College',
  degree: 'Associate Degree',
  field_of_study: null,
  start_date: new Date('2020-01-15'),
  end_date: null,
  gpa: null,
  description: null
};

describe('createEducation', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create education with all fields', async () => {
    const result = await createEducation(testInput);

    // Basic field validation
    expect(result.institution).toEqual('University of Technology');
    expect(result.degree).toEqual('Bachelor of Science');
    expect(result.field_of_study).toEqual('Computer Science');
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
    expect(typeof result.gpa).toBe('number');
    expect(result.gpa).toEqual(3.8);
    expect(result.description).toEqual('Focused on software engineering and data structures');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create education with minimal fields', async () => {
    const result = await createEducation(minimalInput);

    expect(result.institution).toEqual('Tech College');
    expect(result.degree).toEqual('Associate Degree');
    expect(result.field_of_study).toBeNull();
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeNull();
    expect(result.gpa).toBeNull();
    expect(result.description).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save education to database', async () => {
    const result = await createEducation(testInput);

    // Query using proper drizzle syntax
    const educations = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, result.id))
      .execute();

    expect(educations).toHaveLength(1);
    expect(educations[0].institution).toEqual('University of Technology');
    expect(educations[0].degree).toEqual('Bachelor of Science');
    expect(educations[0].field_of_study).toEqual('Computer Science');
    expect(educations[0].start_date).toBeInstanceOf(Date);
    expect(educations[0].end_date).toBeInstanceOf(Date);
    expect(educations[0].gpa).toEqual(3.8);
    expect(educations[0].description).toEqual('Focused on software engineering and data structures');
    expect(educations[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle current education without end date', async () => {
    const currentEducationInput: CreateEducationInput = {
      institution: 'Graduate University',
      degree: 'Master of Science',
      field_of_study: 'Data Science',
      start_date: new Date('2023-09-01'),
      end_date: null,
      gpa: 3.9,
      description: 'Currently pursuing advanced degree'
    };

    const result = await createEducation(currentEducationInput);

    expect(result.institution).toEqual('Graduate University');
    expect(result.degree).toEqual('Master of Science');
    expect(result.end_date).toBeNull();
    expect(result.gpa).toEqual(3.9);

    // Verify in database
    const educations = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, result.id))
      .execute();

    expect(educations[0].end_date).toBeNull();
    expect(educations[0].gpa).toEqual(3.9);
  });

  it('should create multiple education records', async () => {
    const education1 = await createEducation({
      institution: 'High School',
      degree: 'High School Diploma',
      field_of_study: null,
      start_date: new Date('2014-09-01'),
      end_date: new Date('2018-06-15'),
      gpa: null,
      description: null
    });

    const education2 = await createEducation(testInput);

    expect(education1.id).not.toEqual(education2.id);
    expect(education1.institution).toEqual('High School');
    expect(education2.institution).toEqual('University of Technology');

    // Verify both records exist in database
    const allEducations = await db.select()
      .from(educationTable)
      .execute();

    expect(allEducations).toHaveLength(2);
    
    const institutions = allEducations.map(e => e.institution).sort();
    expect(institutions).toEqual(['High School', 'University of Technology']);
  });
});