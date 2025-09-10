import { type CreateExperienceInput, type Experience } from '../schema';

export const createExperience = async (input: CreateExperienceInput): Promise<Experience> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is creating a new work experience entry and persisting it in the database.
    return {
        id: 0, // Placeholder ID
        company_name: input.company_name,
        position: input.position,
        description: input.description,
        start_date: input.start_date,
        end_date: input.end_date,
        is_current: input.is_current,
        location: input.location,
        company_url: input.company_url,
        created_at: new Date()
    } as Experience;
}