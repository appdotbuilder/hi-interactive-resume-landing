import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type IdParam, type CreateSkillInput } from '../schema';
import { deleteSkill } from '../handlers/delete_skill';
import { eq } from 'drizzle-orm';

// Test input for skill creation
const testSkillInput: CreateSkillInput = {
  name: 'TypeScript',
  category: 'Frontend',
  proficiency_level: 8,
  is_featured: true
};

const testSkillInput2: CreateSkillInput = {
  name: 'Python',
  category: 'Backend',
  proficiency_level: 7,
  is_featured: false
};

describe('deleteSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully delete an existing skill', async () => {
    // Create a test skill first
    const createdSkill = await db.insert(skillsTable)
      .values({
        name: testSkillInput.name,
        category: testSkillInput.category,
        proficiency_level: testSkillInput.proficiency_level,
        is_featured: testSkillInput.is_featured
      })
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    // Delete the skill
    const result = await deleteSkill({ id: skillId });

    // Verify the result indicates success
    expect(result.success).toBe(true);

    // Verify the skill is actually deleted from the database
    const remainingSkills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillId))
      .execute();

    expect(remainingSkills).toHaveLength(0);
  });

  it('should return false when attempting to delete non-existent skill', async () => {
    const nonExistentId = 99999;

    // Attempt to delete non-existent skill
    const result = await deleteSkill({ id: nonExistentId });

    // Verify the result indicates failure
    expect(result.success).toBe(false);
  });

  it('should only delete the specified skill and leave others unchanged', async () => {
    // Create multiple test skills
    const skill1 = await db.insert(skillsTable)
      .values({
        name: testSkillInput.name,
        category: testSkillInput.category,
        proficiency_level: testSkillInput.proficiency_level,
        is_featured: testSkillInput.is_featured
      })
      .returning()
      .execute();

    const skill2 = await db.insert(skillsTable)
      .values({
        name: testSkillInput2.name,
        category: testSkillInput2.category,
        proficiency_level: testSkillInput2.proficiency_level,
        is_featured: testSkillInput2.is_featured
      })
      .returning()
      .execute();

    const skillToDelete = skill1[0];
    const skillToKeep = skill2[0];

    // Delete only the first skill
    const result = await deleteSkill({ id: skillToDelete.id });

    // Verify the deletion was successful
    expect(result.success).toBe(true);

    // Verify the deleted skill is gone
    const deletedSkillQuery = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillToDelete.id))
      .execute();

    expect(deletedSkillQuery).toHaveLength(0);

    // Verify the other skill remains
    const remainingSkillQuery = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillToKeep.id))
      .execute();

    expect(remainingSkillQuery).toHaveLength(1);
    expect(remainingSkillQuery[0].name).toEqual(testSkillInput2.name);
    expect(remainingSkillQuery[0].category).toEqual(testSkillInput2.category);
    expect(remainingSkillQuery[0].proficiency_level).toEqual(testSkillInput2.proficiency_level);
  });

  it('should handle invalid ID parameter', async () => {
    const invalidIdParam: IdParam = { id: -1 };

    // Attempt to delete with invalid ID
    const result = await deleteSkill(invalidIdParam);

    // Should return false for non-existent record
    expect(result.success).toBe(false);
  });

  it('should correctly handle edge case with ID 0', async () => {
    const zeroIdParam: IdParam = { id: 0 };

    // Attempt to delete with ID 0 (which likely doesn't exist)
    const result = await deleteSkill(zeroIdParam);

    // Should return false for non-existent record
    expect(result.success).toBe(false);
  });
});