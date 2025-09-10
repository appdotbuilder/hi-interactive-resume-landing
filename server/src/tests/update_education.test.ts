import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { educationTable } from '../db/schema';
import { type UpdateEducationInput } from '../schema';
import { updateEducation } from '../handlers/update_education';
import { eq } from 'drizzle-orm';

// Create a test education entry first
const createTestEducation = async () => {
  const result = await db.insert(educationTable)
    .values({
      institution: 'Test University',
      degree: 'Bachelor of Science',
      field_of_study: 'Computer Science',
      start_date: new Date('2020-09-01'),
      end_date: new Date('2024-05-15'),
      gpa: 3.8,
      description: 'Initial description'
    })
    .returning()
    .execute();
  
  return result[0];
};

describe('updateEducation', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of an education entry', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      institution: 'Updated University',
      degree: 'Master of Science',
      field_of_study: 'Software Engineering',
      start_date: new Date('2021-08-01'),
      end_date: new Date('2023-12-15'),
      gpa: 3.9,
      description: 'Updated description'
    };

    const result = await updateEducation(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(testEducation.id);
    expect(result.institution).toEqual('Updated University');
    expect(result.degree).toEqual('Master of Science');
    expect(result.field_of_study).toEqual('Software Engineering');
    expect(result.start_date).toEqual(new Date('2021-08-01'));
    expect(result.end_date).toEqual(new Date('2023-12-15'));
    expect(result.gpa).toEqual(3.9);
    expect(result.description).toEqual('Updated description');
    expect(result.created_at).toEqual(testEducation.created_at);
  });

  it('should update only specified fields', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      institution: 'Partially Updated University',
      gpa: 4.0
    };

    const result = await updateEducation(updateInput);

    // Verify only specified fields were updated
    expect(result.institution).toEqual('Partially Updated University');
    expect(result.gpa).toEqual(4.0);
    
    // Verify other fields remained unchanged
    expect(result.degree).toEqual('Bachelor of Science');
    expect(result.field_of_study).toEqual('Computer Science');
    expect(result.description).toEqual('Initial description');
  });

  it('should update nullable fields to null', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      field_of_study: null,
      end_date: null,
      gpa: null,
      description: null
    };

    const result = await updateEducation(updateInput);

    // Verify nullable fields were set to null
    expect(result.field_of_study).toBeNull();
    expect(result.end_date).toBeNull();
    expect(result.gpa).toBeNull();
    expect(result.description).toBeNull();
    
    // Verify required fields remained unchanged
    expect(result.institution).toEqual('Test University');
    expect(result.degree).toEqual('Bachelor of Science');
  });

  it('should save changes to database', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      institution: 'Database Test University',
      degree: 'PhD',
      gpa: 3.95
    };

    await updateEducation(updateInput);

    // Query database directly to verify changes were persisted
    const updatedEducation = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, testEducation.id))
      .execute();

    expect(updatedEducation).toHaveLength(1);
    expect(updatedEducation[0].institution).toEqual('Database Test University');
    expect(updatedEducation[0].degree).toEqual('PhD');
    expect(updatedEducation[0].gpa).toEqual(3.95);
    expect(updatedEducation[0].field_of_study).toEqual('Computer Science'); // Unchanged
  });

  it('should return existing record when no fields are provided for update', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id
      // No other fields provided
    };

    const result = await updateEducation(updateInput);

    // Should return the existing record unchanged
    expect(result.id).toEqual(testEducation.id);
    expect(result.institution).toEqual('Test University');
    expect(result.degree).toEqual('Bachelor of Science');
    expect(result.field_of_study).toEqual('Computer Science');
    expect(result.gpa).toEqual(3.8);
  });

  it('should throw error when education entry does not exist', async () => {
    const updateInput: UpdateEducationInput = {
      id: 99999, // Non-existent ID
      institution: 'Non-existent University'
    };

    await expect(updateEducation(updateInput)).rejects.toThrow(/Education entry with id 99999 not found/i);
  });

  it('should handle date updates correctly', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const newStartDate = new Date('2022-01-15');
    const newEndDate = new Date('2025-06-30');

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      start_date: newStartDate,
      end_date: newEndDate
    };

    const result = await updateEducation(updateInput);

    // Verify dates were updated correctly
    expect(result.start_date).toEqual(newStartDate);
    expect(result.end_date).toEqual(newEndDate);
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
  });

  it('should handle GPA precision correctly', async () => {
    // Create test education entry
    const testEducation = await createTestEducation();

    const updateInput: UpdateEducationInput = {
      id: testEducation.id,
      gpa: 3.675 // Test decimal precision
    };

    const result = await updateEducation(updateInput);

    // Verify GPA precision is maintained
    expect(result.gpa).toEqual(3.675);
    expect(typeof result.gpa).toBe('number');
  });
});