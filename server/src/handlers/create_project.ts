import { type CreateProjectInput, type Project } from '../schema';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new project and persisting it in the database.
    return {
        id: 0, // Placeholder ID
        title: input.title,
        description: input.description,
        technologies: input.technologies,
        project_url: input.project_url,
        github_url: input.github_url,
        image_url: input.image_url,
        is_featured: input.is_featured,
        created_at: new Date()
    } as Project;
}