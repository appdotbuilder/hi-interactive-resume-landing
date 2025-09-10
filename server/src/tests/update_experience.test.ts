import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type UpdateExperienceInput, type CreateExperienceInput } from '../schema';
import { updateExperience } from '../handlers/update_experience';
import { eq } from 'drizzle-orm';

// Helper to create test experience
const createTestExperience = async (): Promise<number> => {
  const testExperience: CreateExperienceInput = {
    company_name: 'Original Company',
    position: 'Original Position',
    description: 'Original description',
    start_date: new Date('2022-01-01'),
    end_date: new Date('2023-01-01'),
    is_current: false,
    location: 'Original Location',
    company_url: 'https://original.com'
  };

  const result = await db.insert(experienceTable)
    .values(testExperience)
    .returning()
    .execute();

  return result[0].id;
};

describe('updateExperience', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update experience with all fields', async () => {
    const experienceId = await createTestExperience();

    const input: UpdateExperienceInput = {
      id: experienceId,
      company_name: 'Updated Company',
      position: 'Updated Position',
      description: 'Updated description',
      start_date: new Date('2023-06-01'),
      end_date: new Date('2024-06-01'),
      is_current: false,
      location: 'Updated Location',
      company_url: 'https://updated.com'
    };

    const result = await updateExperience(input);

    expect(result.id).toEqual(experienceId);
    expect(result.company_name).toEqual('Updated Company');
    expect(result.position).toEqual('Updated Position');
    expect(result.description).toEqual('Updated description');
    expect(result.start_date).toEqual(new Date('2023-06-01'));
    expect(result.end_date).toEqual(new Date('2024-06-01'));
    expect(result.is_current).toEqual(false);
    expect(result.location).toEqual('Updated Location');
    expect(result.company_url).toEqual('https://updated.com');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update experience with partial fields', async () => {
    const experienceId = await createTestExperience();

    const input: UpdateExperienceInput = {
      id: experienceId,
      company_name: 'New Company Name',
      is_current: true
    };

    const result = await updateExperience(input);

    expect(result.id).toEqual(experienceId);
    expect(result.company_name).toEqual('New Company Name');
    expect(result.is_current).toEqual(true);
    // Other fields should remain unchanged
    expect(result.position).toEqual('Original Position');
    expect(result.description).toEqual('Original description');
    expect(result.location).toEqual('Original Location');
    expect(result.company_url).toEqual('https://original.com');
  });

  it('should update nullable fields to null', async () => {
    const experienceId = await createTestExperience();

    const input: UpdateExperienceInput = {
      id: experienceId,
      description: null,
      end_date: null,
      location: null,
      company_url: null
    };

    const result = await updateExperience(input);

    expect(result.id).toEqual(experienceId);
    expect(result.description).toBeNull();
    expect(result.end_date).toBeNull();
    expect(result.location).toBeNull();
    expect(result.company_url).toBeNull();
    // Non-updated fields should remain unchanged
    expect(result.company_name).toEqual('Original Company');
    expect(result.position).toEqual('Original Position');
  });

  it('should save updated experience to database', async () => {
    const experienceId = await createTestExperience();

    const input: UpdateExperienceInput = {
      id: experienceId,
      company_name: 'Database Test Company',
      position: 'Database Test Position'
    };

    await updateExperience(input);

    // Verify the data was saved to the database
    const experiences = await db.select()
      .from(experienceTable)
      .where(eq(experienceTable.id, experienceId))
      .execute();

    expect(experiences).toHaveLength(1);
    expect(experiences[0].company_name).toEqual('Database Test Company');
    expect(experiences[0].position).toEqual('Database Test Position');
    expect(experiences[0].description).toEqual('Original description'); // Unchanged
  });

  it('should set current position end_date to null', async () => {
    const experienceId = await createTestExperience();

    const input: UpdateExperienceInput = {
      id: experienceId,
      is_current: true,
      end_date: null
    };

    const result = await updateExperience(input);

    expect(result.is_current).toEqual(true);
    expect(result.end_date).toBeNull();
  });

  it('should throw error for non-existent experience', async () => {
    const input: UpdateExperienceInput = {
      id: 99999, // Non-existent ID
      company_name: 'Updated Company'
    };

    await expect(updateExperience(input)).rejects.toThrow(/Experience with id 99999 not found/i);
  });

  it('should handle date updates correctly', async () => {
    const experienceId = await createTestExperience();

    const newStartDate = new Date('2024-01-15');
    const newEndDate = new Date('2024-12-15');

    const input: UpdateExperienceInput = {
      id: experienceId,
      start_date: newStartDate,
      end_date: newEndDate
    };

    const result = await updateExperience(input);

    expect(result.start_date).toEqual(newStartDate);
    expect(result.end_date).toEqual(newEndDate);
    expect(result.start_date).toBeInstanceOf(Date);
    expect(result.end_date).toBeInstanceOf(Date);
  });
});