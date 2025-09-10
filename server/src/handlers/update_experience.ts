import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type UpdateExperienceInput, type Experience } from '../schema';
import { eq } from 'drizzle-orm';

export const updateExperience = async (input: UpdateExperienceInput): Promise<Experience> => {
  try {
    // Build update object with only defined fields
    const updateData: Partial<typeof experienceTable.$inferInsert> = {};
    
    if (input.company_name !== undefined) updateData.company_name = input.company_name;
    if (input.position !== undefined) updateData.position = input.position;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.start_date !== undefined) updateData.start_date = input.start_date;
    if (input.end_date !== undefined) updateData.end_date = input.end_date;
    if (input.is_current !== undefined) updateData.is_current = input.is_current;
    if (input.location !== undefined) updateData.location = input.location;
    if (input.company_url !== undefined) updateData.company_url = input.company_url;

    // Update the experience record
    const result = await db.update(experienceTable)
      .set(updateData)
      .where(eq(experienceTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Experience with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Experience update failed:', error);
    throw error;
  }
};