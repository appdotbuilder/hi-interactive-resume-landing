import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type IdParam } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteSkill = async (input: IdParam): Promise<{ success: boolean }> => {
  try {
    // Delete the skill record
    const result = await db.delete(skillsTable)
      .where(eq(skillsTable.id, input.id))
      .returning({ id: skillsTable.id })
      .execute();

    // Return success status based on whether a record was actually deleted
    return { success: result.length > 0 };
  } catch (error) {
    console.error('Skill deletion failed:', error);
    throw error;
  }
};