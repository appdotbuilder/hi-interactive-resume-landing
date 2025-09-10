import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type Experience } from '../schema';
import { desc } from 'drizzle-orm';

export const getExperience = async (): Promise<Experience[]> => {
  try {
    // Fetch all experience records ordered by start_date descending (most recent first)
    const results = await db.select()
      .from(experienceTable)
      .orderBy(desc(experienceTable.start_date))
      .execute();

    // Convert numeric fields and return
    return results.map(experience => ({
      ...experience,
      // No numeric conversions needed for this table - all fields are already proper types
    }));
  } catch (error) {
    console.error('Failed to fetch experience:', error);
    throw error;
  }
};