import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type IdParam, type CreateProjectInput } from '../schema';
import { deleteProject } from '../handlers/delete_project';
import { eq } from 'drizzle-orm';

// Test input for creating projects
const testProjectInput: CreateProjectInput = {
  title: 'Test Project',
  description: 'A project for testing deletion',
  technologies: ['TypeScript', 'React'],
  project_url: 'https://example.com',
  github_url: 'https://github.com/example/test',
  image_url: 'https://example.com/image.jpg',
  is_featured: false
};

describe('deleteProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully delete an existing project', async () => {
    // Create a test project first
    const createResult = await db.insert(projectsTable)
      .values({
        title: testProjectInput.title,
        description: testProjectInput.description,
        technologies: testProjectInput.technologies,
        project_url: testProjectInput.project_url,
        github_url: testProjectInput.github_url,
        image_url: testProjectInput.image_url,
        is_featured: testProjectInput.is_featured
      })
      .returning()
      .execute();

    const createdProject = createResult[0];
    const deleteInput: IdParam = { id: createdProject.id };

    // Delete the project
    const result = await deleteProject(deleteInput);

    // Should return success
    expect(result.success).toBe(true);
  });

  it('should remove project from database', async () => {
    // Create a test project first
    const createResult = await db.insert(projectsTable)
      .values({
        title: testProjectInput.title,
        description: testProjectInput.description,
        technologies: testProjectInput.technologies,
        project_url: testProjectInput.project_url,
        github_url: testProjectInput.github_url,
        image_url: testProjectInput.image_url,
        is_featured: testProjectInput.is_featured
      })
      .returning()
      .execute();

    const createdProject = createResult[0];
    const deleteInput: IdParam = { id: createdProject.id };

    // Verify project exists before deletion
    const beforeDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, createdProject.id))
      .execute();

    expect(beforeDelete).toHaveLength(1);

    // Delete the project
    await deleteProject(deleteInput);

    // Verify project no longer exists
    const afterDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, createdProject.id))
      .execute();

    expect(afterDelete).toHaveLength(0);
  });

  it('should return false for non-existent project', async () => {
    const nonExistentId = 99999;
    const deleteInput: IdParam = { id: nonExistentId };

    // Try to delete non-existent project
    const result = await deleteProject(deleteInput);

    // Should return false indicating no project was deleted
    expect(result.success).toBe(false);
  });

  it('should not affect other projects when deleting one', async () => {
    // Create multiple test projects
    const project1Result = await db.insert(projectsTable)
      .values({
        title: 'Project 1',
        description: 'First test project',
        technologies: ['JavaScript'],
        project_url: null,
        github_url: null,
        image_url: null,
        is_featured: false
      })
      .returning()
      .execute();

    const project2Result = await db.insert(projectsTable)
      .values({
        title: 'Project 2',
        description: 'Second test project',
        technologies: ['Python'],
        project_url: null,
        github_url: null,
        image_url: null,
        is_featured: true
      })
      .returning()
      .execute();

    const project1 = project1Result[0];
    const project2 = project2Result[0];

    // Delete only the first project
    const deleteInput: IdParam = { id: project1.id };
    const result = await deleteProject(deleteInput);

    expect(result.success).toBe(true);

    // Verify first project is deleted
    const project1Check = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project1.id))
      .execute();

    expect(project1Check).toHaveLength(0);

    // Verify second project still exists
    const project2Check = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project2.id))
      .execute();

    expect(project2Check).toHaveLength(1);
    expect(project2Check[0].title).toEqual('Project 2');
    expect(project2Check[0].is_featured).toBe(true);
  });

  it('should handle projects with complex data correctly', async () => {
    // Create project with all fields populated
    const complexProject: CreateProjectInput = {
      title: 'Complex Project',
      description: 'A project with all possible fields filled',
      technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
      project_url: 'https://complex-project.com',
      github_url: 'https://github.com/user/complex-project',
      image_url: 'https://example.com/complex-image.jpg',
      is_featured: true
    };

    const createResult = await db.insert(projectsTable)
      .values({
        title: complexProject.title,
        description: complexProject.description,
        technologies: complexProject.technologies,
        project_url: complexProject.project_url,
        github_url: complexProject.github_url,
        image_url: complexProject.image_url,
        is_featured: complexProject.is_featured
      })
      .returning()
      .execute();

    const createdProject = createResult[0];
    const deleteInput: IdParam = { id: createdProject.id };

    // Delete the complex project
    const result = await deleteProject(deleteInput);

    expect(result.success).toBe(true);

    // Verify it's completely removed from database
    const deletedProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, createdProject.id))
      .execute();

    expect(deletedProject).toHaveLength(0);
  });
});