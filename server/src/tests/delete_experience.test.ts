import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type IdParam } from '../schema';
import { deleteExperience } from '../handlers/delete_experience';
import { eq } from 'drizzle-orm';

// Test input for creating experience records
const testExperience = {
  company_name: 'Test Company',
  position: 'Software Developer',
  description: 'Working on various projects',
  start_date: new Date('2023-01-01'),
  end_date: new Date('2023-12-31'),
  is_current: false,
  location: 'Remote',
  company_url: 'https://test-company.com'
};

describe('deleteExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully delete an existing experience', async () => {
    // Create a test experience record
    const [createdExperience] = await db.insert(experienceTable)
      .values(testExperience)
      .returning()
      .execute();

    const input: IdParam = { id: createdExperience.id };

    // Delete the experience
    const result = await deleteExperience(input);

    // Verify the deletion was successful
    expect(result.success).toBe(true);

    // Verify the record no longer exists in the database
    const experiences = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, createdExperience.id))
      .execute();

    expect(experiences).toHaveLength(0);
  });

  it('should return false when attempting to delete a non-existent experience', async () => {
    const input: IdParam = { id: 99999 }; // Non-existent ID

    const result = await deleteExperience(input);

    // Should return false since no record was deleted
    expect(result.success).toBe(false);
  });

  it('should not affect other experience records when deleting one', async () => {
    // Create multiple experience records
    const [experience1] = await db.insert(experienceTable)
      .values({
        ...testExperience,
        company_name: 'First Company'
      })
      .returning()
      .execute();

    const [experience2] = await db.insert(experienceTable)
      .values({
        ...testExperience,
        company_name: 'Second Company'
      })
      .returning()
      .execute();

    // Delete only the first experience
    const result = await deleteExperience({ id: experience1.id });

    expect(result.success).toBe(true);

    // Verify only the first experience was deleted
    const deletedExperience = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, experience1.id))
      .execute();

    expect(deletedExperience).toHaveLength(0);

    // Verify the second experience still exists
    const remainingExperience = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, experience2.id))
      .execute();

    expect(remainingExperience).toHaveLength(1);
    expect(remainingExperience[0].company_name).toBe('Second Company');
  });

  it('should handle deletion of experience with minimal data', async () => {
    // Create experience with only required fields
    const minimalExperience = {
      company_name: 'Minimal Company',
      position: 'Developer',
      start_date: new Date('2023-01-01'),
      is_current: true
    };

    const [createdExperience] = await db.insert(experienceTable)
      .values(minimalExperience)
      .returning()
      .execute();

    const result = await deleteExperience({ id: createdExperience.id });

    expect(result.success).toBe(true);

    // Verify the record was deleted
    const experiences = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, createdExperience.id))
      .execute();

    expect(experiences).toHaveLength(0);
  });
});