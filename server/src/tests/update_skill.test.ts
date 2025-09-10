import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type UpdateSkillInput, type CreateSkillInput } from '../schema';
import { updateSkill } from '../handlers/update_skill';
import { eq } from 'drizzle-orm';

// Helper function to create a test skill
const createTestSkill = async (skillData: Partial<CreateSkillInput> = {}) => {
  const defaultSkill: CreateSkillInput = {
    name: 'JavaScript',
    category: 'Frontend',
    proficiency_level: 8,
    is_featured: true
  };

  const skillToCreate = { ...defaultSkill, ...skillData };
  
  const result = await db.insert(skillsTable)
    .values(skillToCreate)
    .returning()
    .execute();

  return result[0];
};

describe('updateSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a skill with all fields', async () => {
    // Create a test skill first
    const existingSkill = await createTestSkill();

    const updateInput: UpdateSkillInput = {
      id: existingSkill.id,
      name: 'TypeScript',
      category: 'Backend',
      proficiency_level: 9,
      is_featured: false
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(existingSkill.id);
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('Backend');
    expect(result.proficiency_level).toEqual(9);
    expect(result.is_featured).toEqual(false);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update skill with partial fields', async () => {
    // Create a test skill first
    const existingSkill = await createTestSkill({
      name: 'React',
      category: 'Frontend',
      proficiency_level: 7,
      is_featured: false
    });

    const updateInput: UpdateSkillInput = {
      id: existingSkill.id,
      name: 'React.js',
      proficiency_level: 9
      // Only updating name and proficiency_level
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(existingSkill.id);
    expect(result.name).toEqual('React.js');
    expect(result.category).toEqual('Frontend'); // Should remain unchanged
    expect(result.proficiency_level).toEqual(9);
    expect(result.is_featured).toEqual(false); // Should remain unchanged
  });

  it('should update skill in database', async () => {
    // Create a test skill first
    const existingSkill = await createTestSkill();

    const updateInput: UpdateSkillInput = {
      id: existingSkill.id,
      name: 'Updated Skill Name',
      category: 'Updated Category',
      proficiency_level: 10,
      is_featured: true
    };

    await updateSkill(updateInput);

    // Verify the skill was updated in the database
    const updatedSkillFromDB = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, existingSkill.id))
      .execute();

    expect(updatedSkillFromDB).toHaveLength(1);
    expect(updatedSkillFromDB[0].name).toEqual('Updated Skill Name');
    expect(updatedSkillFromDB[0].category).toEqual('Updated Category');
    expect(updatedSkillFromDB[0].proficiency_level).toEqual(10);
    expect(updatedSkillFromDB[0].is_featured).toEqual(true);
  });

  it('should return unchanged skill when no update fields provided', async () => {
    // Create a test skill first
    const existingSkill = await createTestSkill();

    const updateInput: UpdateSkillInput = {
      id: existingSkill.id
      // No update fields provided
    };

    const result = await updateSkill(updateInput);

    // Should return the original skill unchanged
    expect(result.id).toEqual(existingSkill.id);
    expect(result.name).toEqual(existingSkill.name);
    expect(result.category).toEqual(existingSkill.category);
    expect(result.proficiency_level).toEqual(existingSkill.proficiency_level);
    expect(result.is_featured).toEqual(existingSkill.is_featured);
  });

  it('should throw error when skill not found', async () => {
    const updateInput: UpdateSkillInput = {
      id: 999999, // Non-existent skill ID
      name: 'Updated Name'
    };

    await expect(updateSkill(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update only is_featured flag', async () => {
    // Create a non-featured skill
    const existingSkill = await createTestSkill({
      name: 'Python',
      category: 'Backend',
      proficiency_level: 8,
      is_featured: false
    });

    const updateInput: UpdateSkillInput = {
      id: existingSkill.id,
      is_featured: true
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(existingSkill.id);
    expect(result.name).toEqual('Python'); // Should remain unchanged
    expect(result.category).toEqual('Backend'); // Should remain unchanged
    expect(result.proficiency_level).toEqual(8); // Should remain unchanged
    expect(result.is_featured).toEqual(true); // Should be updated
  });

  it('should update proficiency level within valid range', async () => {
    // Create a test skill
    const existingSkill = await createTestSkill();

    // Test updating to minimum value
    const updateInputMin: UpdateSkillInput = {
      id: existingSkill.id,
      proficiency_level: 1
    };

    const resultMin = await updateSkill(updateInputMin);
    expect(resultMin.proficiency_level).toEqual(1);

    // Test updating to maximum value
    const updateInputMax: UpdateSkillInput = {
      id: existingSkill.id,
      proficiency_level: 10
    };

    const resultMax = await updateSkill(updateInputMax);
    expect(resultMax.proficiency_level).toEqual(10);
  });

  it('should handle multiple skills correctly', async () => {
    // Create multiple test skills
    const skill1 = await createTestSkill({ name: 'Skill 1' });
    const skill2 = await createTestSkill({ name: 'Skill 2' });

    // Update only the first skill
    const updateInput: UpdateSkillInput = {
      id: skill1.id,
      name: 'Updated Skill 1'
    };

    const result = await updateSkill(updateInput);

    // Verify first skill was updated
    expect(result.name).toEqual('Updated Skill 1');

    // Verify second skill remains unchanged
    const unchangedSkill = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skill2.id))
      .execute();

    expect(unchangedSkill[0].name).toEqual('Skill 2');
  });
});