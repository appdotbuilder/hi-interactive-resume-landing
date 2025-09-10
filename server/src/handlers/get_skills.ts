import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type Skill } from '../schema';
import { desc, asc, eq } from 'drizzle-orm';

export const getSkills = async (): Promise<Skill[]> => {
  try {
    // Get all skills ordered by category and proficiency level (descending)
    const results = await db.select()
      .from(skillsTable)
      .orderBy(asc(skillsTable.category), desc(skillsTable.proficiency_level))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
};

export const getFeaturedSkills = async (): Promise<Skill[]> => {
  try {
    // Get only featured skills ordered by proficiency level (descending)
    const results = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.is_featured, true))
      .orderBy(desc(skillsTable.proficiency_level))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured skills:', error);
    throw error;
  }
};