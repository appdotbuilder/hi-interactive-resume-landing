import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        title: input.title,
        description: input.description,
        technologies: input.technologies, // JSON column - no conversion needed
        project_url: input.project_url,
        github_url: input.github_url,
        image_url: input.image_url,
        is_featured: input.is_featured // Boolean column with Zod default applied
      })
      .returning()
      .execute();

    // Return the created project (no numeric conversions needed for this table)
    return result[0];
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};