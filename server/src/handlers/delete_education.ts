import { db } from '../db';
import { educationTable } from '../db/schema';
import { type IdParam } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteEducation = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete the education record with the given ID
    const result = await db.delete(educationTable)
      .where(eq(educationTable.id, input.id))
      .returning()
      .execute();

    // Return success status based on whether a record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Education deletion failed:', error);
    throw error;
  }
};