import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { educationTable } from '../db/schema';
import { type IdParam, type CreateEducationInput } from '../schema';
import { deleteEducation } from '../handlers/delete_education';
import { eq } from 'drizzle-orm';

// Test input for creating education records
const testEducationInput: CreateEducationInput = {
  institution: 'Test University',
  degree: 'Bachelor of Science',
  field_of_study: 'Computer Science',
  start_date: new Date('2020-09-01'),
  end_date: new Date('2024-05-15'),
  gpa: 3.8,
  description: 'Relevant coursework in software engineering and algorithms'
};

describe('deleteEducation', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing education record', async () => {
    // Create test education record
    const insertResult = await db.insert(educationTable)
      .values({
        institution: testEducationInput.institution,
        degree: testEducationInput.degree,
        field_of_study: testEducationInput.field_of_study,
        start_date: testEducationInput.start_date,
        end_date: testEducationInput.end_date,
        gpa: testEducationInput.gpa,
        description: testEducationInput.description
      })
      .returning()
      .execute();

    const educationId = insertResult[0].id;
    const deleteInput: IdParam = { id: educationId };

    // Delete the education record
    const result = await deleteEducation(deleteInput);

    // Should return success
    expect(result.success).toBe(true);

    // Verify record was actually deleted from database
    const remainingRecords = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, educationId))
      .execute();

    expect(remainingRecords).toHaveLength(0);
  });

  it('should return false when trying to delete non-existent education record', async () => {
    const deleteInput: IdParam = { id: 999999 }; // Non-existent ID

    // Attempt to delete non-existent record
    const result = await deleteEducation(deleteInput);

    // Should return success: false
    expect(result.success).toBe(false);
  });

  it('should not affect other education records when deleting one', async () => {
    // Create multiple education records
    const insertResults = await db.insert(educationTable)
      .values([
        {
          institution: 'First University',
          degree: 'Bachelor of Arts',
          field_of_study: 'History',
          start_date: new Date('2018-09-01'),
          end_date: new Date('2022-05-15'),
          gpa: 3.5,
          description: 'Liberal arts education'
        },
        {
          institution: 'Second University',
          degree: 'Master of Science',
          field_of_study: 'Data Science',
          start_date: new Date('2022-09-01'),
          end_date: new Date('2024-05-15'),
          gpa: 3.9,
          description: 'Advanced analytics and machine learning'
        },
        {
          institution: testEducationInput.institution,
          degree: testEducationInput.degree,
          field_of_study: testEducationInput.field_of_study,
          start_date: testEducationInput.start_date,
          end_date: testEducationInput.end_date,
          gpa: testEducationInput.gpa,
          description: testEducationInput.description
        }
      ])
      .returning()
      .execute();

    const targetId = insertResults[1].id; // Delete the middle record
    const deleteInput: IdParam = { id: targetId };

    // Delete one education record
    const result = await deleteEducation(deleteInput);

    // Should return success
    expect(result.success).toBe(true);

    // Verify only the target record was deleted
    const remainingRecords = await db.select()
      .from(educationTable)
      .execute();

    expect(remainingRecords).toHaveLength(2);
    expect(remainingRecords.find(record => record.id === targetId)).toBeUndefined();
    expect(remainingRecords.find(record => record.id === insertResults[0].id)).toBeDefined();
    expect(remainingRecords.find(record => record.id === insertResults[2].id)).toBeDefined();
  });

  it('should handle deletion of education record with nullable fields', async () => {
    // Create education record with minimal required fields (nullable fields as null)
    const minimalEducation = await db.insert(educationTable)
      .values({
        institution: 'Minimal University',
        degree: 'Certificate',
        field_of_study: null,
        start_date: new Date('2023-01-01'),
        end_date: null, // Ongoing education
        gpa: null,
        description: null
      })
      .returning()
      .execute();

    const deleteInput: IdParam = { id: minimalEducation[0].id };

    // Delete the minimal education record
    const result = await deleteEducation(deleteInput);

    // Should return success
    expect(result.success).toBe(true);

    // Verify record was deleted
    const remainingRecords = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, minimalEducation[0].id))
      .execute();

    expect(remainingRecords).toHaveLength(0);
  });
});