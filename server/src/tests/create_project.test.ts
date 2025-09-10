import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Simple test input with all required fields
const testInput: CreateProjectInput = {
  title: 'Test Project',
  description: 'A comprehensive test project for portfolio',
  technologies: ['React', 'TypeScript', 'Node.js'],
  project_url: 'https://example.com/project',
  github_url: 'https://github.com/user/project',
  image_url: 'https://example.com/image.jpg',
  is_featured: true
};

// Minimal test input
const minimalInput: CreateProjectInput = {
  title: 'Minimal Project',
  description: 'Minimal project description',
  technologies: ['JavaScript'],
  project_url: null,
  github_url: null,
  image_url: null,
  is_featured: false // Will use Zod default
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Project');
    expect(result.description).toEqual('A comprehensive test project for portfolio');
    expect(result.technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(result.project_url).toEqual('https://example.com/project');
    expect(result.github_url).toEqual('https://github.com/user/project');
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.is_featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(typeof result.id).toEqual('number');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a project with minimal fields', async () => {
    const result = await createProject(minimalInput);

    // Basic field validation
    expect(result.title).toEqual('Minimal Project');
    expect(result.description).toEqual('Minimal project description');
    expect(result.technologies).toEqual(['JavaScript']);
    expect(result.project_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.is_featured).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createProject(testInput);

    // Query using proper drizzle syntax
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Test Project');
    expect(projects[0].description).toEqual('A comprehensive test project for portfolio');
    expect(projects[0].technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(projects[0].project_url).toEqual('https://example.com/project');
    expect(projects[0].is_featured).toEqual(true);
    expect(projects[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle empty technologies array', async () => {
    const inputWithEmptyTech: CreateProjectInput = {
      ...testInput,
      technologies: []
    };

    const result = await createProject(inputWithEmptyTech);

    expect(result.technologies).toEqual([]);
    expect(result.title).toEqual('Test Project');
    expect(result.id).toBeDefined();
  });

  it('should handle complex technologies array', async () => {
    const inputWithComplexTech: CreateProjectInput = {
      ...testInput,
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    };

    const result = await createProject(inputWithComplexTech);

    expect(result.technologies).toEqual(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']);
    
    // Verify in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects[0].technologies).toEqual(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']);
  });

  it('should create multiple projects successfully', async () => {
    const project1 = await createProject(testInput);
    const project2 = await createProject(minimalInput);

    expect(project1.id).not.toEqual(project2.id);
    expect(project1.title).toEqual('Test Project');
    expect(project2.title).toEqual('Minimal Project');

    // Verify both exist in database
    const allProjects = await db.select()
      .from(projectsTable)
      .execute();

    expect(allProjects).toHaveLength(2);
    
    const titles = allProjects.map(p => p.title).sort();
    expect(titles).toEqual(['Minimal Project', 'Test Project']);
  });
});