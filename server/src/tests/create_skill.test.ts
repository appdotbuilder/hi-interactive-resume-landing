import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateSkillInput = {
  name: 'TypeScript',
  category: 'Frontend',
  proficiency_level: 8,
  is_featured: true
};

// Test input with default values
const testInputWithDefaults: CreateSkillInput = {
  name: 'Node.js',
  category: 'Backend',
  proficiency_level: 7,
  is_featured: false // Explicitly set to test default behavior
};

describe('createSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a skill with all fields', async () => {
    const result = await createSkill(testInput);

    // Basic field validation
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('Frontend');
    expect(result.proficiency_level).toEqual(8);
    expect(result.is_featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a skill with default is_featured value', async () => {
    const result = await createSkill(testInputWithDefaults);

    // Verify default value is applied
    expect(result.name).toEqual('Node.js');
    expect(result.category).toEqual('Backend');
    expect(result.proficiency_level).toEqual(7);
    expect(result.is_featured).toEqual(false); // Default value from Zod schema
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save skill to database', async () => {
    const result = await createSkill(testInput);

    // Query database to verify persistence
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('TypeScript');
    expect(skills[0].category).toEqual('Frontend');
    expect(skills[0].proficiency_level).toEqual(8);
    expect(skills[0].is_featured).toEqual(true);
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different proficiency levels', async () => {
    const minProficiency: CreateSkillInput = {
      name: 'CSS',
      category: 'Frontend',
      proficiency_level: 1,
      is_featured: false
    };

    const maxProficiency: CreateSkillInput = {
      name: 'JavaScript',
      category: 'Frontend',
      proficiency_level: 10,
      is_featured: true
    };

    const result1 = await createSkill(minProficiency);
    const result2 = await createSkill(maxProficiency);

    expect(result1.proficiency_level).toEqual(1);
    expect(result2.proficiency_level).toEqual(10);
  });

  it('should handle different categories', async () => {
    const frontendSkill: CreateSkillInput = {
      name: 'React',
      category: 'Frontend',
      proficiency_level: 9,
      is_featured: true
    };

    const backendSkill: CreateSkillInput = {
      name: 'PostgreSQL',
      category: 'Database',
      proficiency_level: 7,
      is_featured: false
    };

    const result1 = await createSkill(frontendSkill);
    const result2 = await createSkill(backendSkill);

    expect(result1.category).toEqual('Frontend');
    expect(result2.category).toEqual('Database');
  });

  it('should create multiple skills without conflicts', async () => {
    const skill1: CreateSkillInput = {
      name: 'Python',
      category: 'Backend',
      proficiency_level: 8,
      is_featured: true
    };

    const skill2: CreateSkillInput = {
      name: 'Docker',
      category: 'DevOps',
      proficiency_level: 6,
      is_featured: false
    };

    const result1 = await createSkill(skill1);
    const result2 = await createSkill(skill2);

    // Verify both skills were created with unique IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(result1.name).toEqual('Python');
    expect(result2.name).toEqual('Docker');

    // Verify both are in database
    const allSkills = await db.select().from(skillsTable).execute();
    expect(allSkills).toHaveLength(2);
  });
});