import { db } from '../db';
import { experienceTable } from '../db/schema';
import { type IdParam } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteExperience = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete the experience record
    const result = await db.delete(experienceTable)
      .where(eq(experienceTable.id, input.id))
      .execute();

    // Return success status based on whether a record was actually deleted
    return { success: (result.rowCount ?? 0) > 0 };
  } catch (error) {
    console.error('Experience deletion failed:', error);
    throw error;
  }
};