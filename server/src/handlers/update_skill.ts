import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type UpdateSkillInput, type Skill } from '../schema';
import { eq } from 'drizzle-orm';

export const updateSkill = async (input: UpdateSkillInput): Promise<Skill> => {
  try {
    // First check if the skill exists
    const existingSkill = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, input.id))
      .execute();

    if (existingSkill.length === 0) {
      throw new Error(`Skill with id ${input.id} not found`);
    }

    // Build update values object only with provided fields
    const updateValues: any = {};
    
    if (input.name !== undefined) {
      updateValues['name'] = input.name;
    }
    if (input.category !== undefined) {
      updateValues['category'] = input.category;
    }
    if (input.proficiency_level !== undefined) {
      updateValues['proficiency_level'] = input.proficiency_level;
    }
    if (input.is_featured !== undefined) {
      updateValues['is_featured'] = input.is_featured;
    }

    // Only proceed with update if there are fields to update
    if (Object.keys(updateValues).length === 0) {
      // Return existing skill if no updates provided
      return existingSkill[0];
    }

    // Update the skill record
    const result = await db.update(skillsTable)
      .set(updateValues)
      .where(eq(skillsTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Skill update failed:', error);
    throw error;
  }
};