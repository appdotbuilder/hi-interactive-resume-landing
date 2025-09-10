import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkills, getFeaturedSkills } from '../handlers/get_skills';

// Test data for different skill categories
const testSkills: CreateSkillInput[] = [
  {
    name: 'React',
    category: 'Frontend',
    proficiency_level: 9,
    is_featured: true
  },
  {
    name: 'Node.js',
    category: 'Backend',
    proficiency_level: 8,
    is_featured: true
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    proficiency_level: 8,
    is_featured: false
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    proficiency_level: 7,
    is_featured: false
  },
  {
    name: 'Docker',
    category: 'DevOps',
    proficiency_level: 6,
    is_featured: true
  }
];

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no skills exist', async () => {
    const result = await getSkills();
    expect(result).toEqual([]);
  });

  it('should return all skills ordered by category and proficiency level', async () => {
    // Insert test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getSkills();

    // Should return all skills
    expect(result).toHaveLength(5);

    // Verify ordering: Backend, Database, DevOps, Frontend (alphabetical by category)
    expect(result[0].category).toBe('Backend');
    expect(result[1].category).toBe('Database');
    expect(result[2].category).toBe('DevOps');
    expect(result[3].category).toBe('Frontend');
    expect(result[4].category).toBe('Frontend');

    // Within Frontend category, React (9) should come before TypeScript (8)
    expect(result[3].name).toBe('React');
    expect(result[3].proficiency_level).toBe(9);
    expect(result[4].name).toBe('TypeScript');
    expect(result[4].proficiency_level).toBe(8);
  });

  it('should return skills with all required fields', async () => {
    await db.insert(skillsTable).values([testSkills[0]]).execute();

    const result = await getSkills();

    expect(result).toHaveLength(1);
    const skill = result[0];
    expect(skill.id).toBeDefined();
    expect(skill.name).toBe('React');
    expect(skill.category).toBe('Frontend');
    expect(skill.proficiency_level).toBe(9);
    expect(skill.is_featured).toBe(true);
    expect(skill.created_at).toBeInstanceOf(Date);
  });
});

describe('getFeaturedSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no featured skills exist', async () => {
    // Insert non-featured skills
    await db.insert(skillsTable).values([
      { ...testSkills[2], is_featured: false },
      { ...testSkills[3], is_featured: false }
    ]).execute();

    const result = await getFeaturedSkills();
    expect(result).toEqual([]);
  });

  it('should return only featured skills', async () => {
    // Insert all test skills
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getFeaturedSkills();

    // Should return only the 3 featured skills
    expect(result).toHaveLength(3);
    
    // All returned skills should be featured
    result.forEach(skill => {
      expect(skill.is_featured).toBe(true);
    });

    // Verify the specific featured skills are returned
    const skillNames = result.map(skill => skill.name);
    expect(skillNames).toContain('React');
    expect(skillNames).toContain('Node.js');
    expect(skillNames).toContain('Docker');
  });

  it('should return featured skills ordered by proficiency level descending', async () => {
    await db.insert(skillsTable).values(testSkills).execute();

    const result = await getFeaturedSkills();

    expect(result).toHaveLength(3);

    // Should be ordered by proficiency level (descending): React (9), Node.js (8), Docker (6)
    expect(result[0].name).toBe('React');
    expect(result[0].proficiency_level).toBe(9);
    expect(result[1].name).toBe('Node.js');
    expect(result[1].proficiency_level).toBe(8);
    expect(result[2].name).toBe('Docker');
    expect(result[2].proficiency_level).toBe(6);
  });

  it('should return featured skills with all required fields', async () => {
    await db.insert(skillsTable).values([testSkills[0]]).execute();

    const result = await getFeaturedSkills();

    expect(result).toHaveLength(1);
    const skill = result[0];
    expect(skill.id).toBeDefined();
    expect(skill.name).toBe('React');
    expect(skill.category).toBe('Frontend');
    expect(skill.proficiency_level).toBe(9);
    expect(skill.is_featured).toBe(true);
    expect(skill.created_at).toBeInstanceOf(Date);
  });
});