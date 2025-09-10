import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type CreateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

// Helper function to create a test project
const createTestProject = async (data: CreateProjectInput) => {
  const result = await db.insert(projectsTable)
    .values({
      title: data.title,
      description: data.description,
      technologies: data.technologies,
      project_url: data.project_url,
      github_url: data.github_url,
      image_url: data.image_url,
      is_featured: data.is_featured
    })
    .returning()
    .execute();
  
  return {
    ...result[0],
    technologies: result[0].technologies as string[]
  };
};

// Test project data
const testProjectData: CreateProjectInput = {
  title: 'Original Project',
  description: 'Original description',
  technologies: ['JavaScript', 'React'],
  project_url: 'https://example.com',
  github_url: 'https://github.com/user/repo',
  image_url: 'https://example.com/image.jpg',
  is_featured: false
};

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all project fields', async () => {
    // Create initial project
    const originalProject = await createTestProject(testProjectData);

    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Updated Project',
      description: 'Updated description',
      technologies: ['TypeScript', 'Next.js', 'PostgreSQL'],
      project_url: 'https://updated.com',
      github_url: 'https://github.com/user/updated-repo',
      image_url: 'https://updated.com/image.png',
      is_featured: true
    };

    const result = await updateProject(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(originalProject.id);
    expect(result.title).toEqual('Updated Project');
    expect(result.description).toEqual('Updated description');
    expect(result.technologies).toEqual(['TypeScript', 'Next.js', 'PostgreSQL']);
    expect(result.project_url).toEqual('https://updated.com');
    expect(result.github_url).toEqual('https://github.com/user/updated-repo');
    expect(result.image_url).toEqual('https://updated.com/image.png');
    expect(result.is_featured).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only specified fields', async () => {
    // Create initial project
    const originalProject = await createTestProject(testProjectData);

    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Partially Updated Project',
      is_featured: true
    };

    const result = await updateProject(updateInput);

    // Verify only specified fields were updated
    expect(result.title).toEqual('Partially Updated Project');
    expect(result.is_featured).toEqual(true);
    
    // Verify other fields remained unchanged
    expect(result.description).toEqual(testProjectData.description);
    expect(result.technologies).toEqual(testProjectData.technologies);
    expect(result.project_url).toEqual(testProjectData.project_url);
    expect(result.github_url).toEqual(testProjectData.github_url);
    expect(result.image_url).toEqual(testProjectData.image_url);
  });

  it('should update nullable fields to null', async () => {
    // Create initial project with non-null optional fields
    const originalProject = await createTestProject(testProjectData);

    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      project_url: null,
      github_url: null,
      image_url: null
    };

    const result = await updateProject(updateInput);

    // Verify nullable fields were set to null
    expect(result.project_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    
    // Verify other fields remained unchanged
    expect(result.title).toEqual(testProjectData.title);
    expect(result.description).toEqual(testProjectData.description);
    expect(result.technologies).toEqual(testProjectData.technologies);
  });

  it('should persist changes in database', async () => {
    // Create initial project
    const originalProject = await createTestProject(testProjectData);

    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Database Persisted Project',
      technologies: ['Vue.js', 'Node.js']
    };

    await updateProject(updateInput);

    // Verify changes were persisted in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, originalProject.id))
      .execute();

    expect(projects).toHaveLength(1);
    const persistedProject = projects[0];
    expect(persistedProject.title).toEqual('Database Persisted Project');
    expect(persistedProject.technologies).toEqual(['Vue.js', 'Node.js']);
    expect(persistedProject.description).toEqual(testProjectData.description);
  });

  it('should handle empty technologies array', async () => {
    // Create initial project
    const originalProject = await createTestProject(testProjectData);

    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      technologies: []
    };

    const result = await updateProject(updateInput);

    expect(result.technologies).toEqual([]);
    expect(Array.isArray(result.technologies)).toBe(true);
  });

  it('should throw error for non-existent project', async () => {
    const updateInput: UpdateProjectInput = {
      id: 99999, // Non-existent ID
      title: 'Should Fail'
    };

    await expect(updateProject(updateInput)).rejects.toThrow(/Project with id 99999 not found/i);
  });

  it('should handle updating project with minimal data', async () => {
    // Create a minimal project (only required fields)
    const minimalProject = await createTestProject({
      title: 'Minimal Project',
      description: 'Minimal description',
      technologies: ['JavaScript'],
      project_url: null,
      github_url: null,
      image_url: null,
      is_featured: false
    });

    const updateInput: UpdateProjectInput = {
      id: minimalProject.id,
      title: 'Updated Minimal Project'
    };

    const result = await updateProject(updateInput);

    expect(result.title).toEqual('Updated Minimal Project');
    expect(result.description).toEqual('Minimal description');
    expect(result.project_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
  });
});