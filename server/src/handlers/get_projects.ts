import { db } from '../db';
import { projectsTable } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { type Project } from '../schema';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const results = await db.select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const results = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.is_featured, true))
      .orderBy(desc(projectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured projects:', error);
    throw error;
  }
};