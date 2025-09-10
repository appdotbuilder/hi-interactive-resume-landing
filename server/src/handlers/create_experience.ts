import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type CreateExperienceInput, type Experience } from '../schema';

export const createExperience = async (input: CreateExperienceInput): Promise<Experience> => {
  try {
    // Insert experience record
    const result = await db.insert(experienceTable)
      .values({
        company_name: input.company_name,
        position: input.position,
        description: input.description,
        start_date: input.start_date,
        end_date: input.end_date,
        is_current: input.is_current,
        location: input.location,
        company_url: input.company_url
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Experience creation failed:', error);
    throw error;
  }
};