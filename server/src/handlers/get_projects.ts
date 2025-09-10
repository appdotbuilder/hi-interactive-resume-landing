import { type Project } from '../schema';

export const getProjects = async (): Promise<Project[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all projects for the resume landing page portfolio section.
    // Should return projects ordered by created_at descending (most recent first).
    return [];
}

export const getFeaturedProjects = async (): Promise<Project[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching only featured projects for the landing page hero section.
    // Should return projects where is_featured = true.
    return [];
}