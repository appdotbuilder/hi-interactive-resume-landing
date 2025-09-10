import { type Skill } from '../schema';

export const getSkills = async (): Promise<Skill[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all skills for the resume landing page.
    // Should return skills ordered by category and proficiency level.
    return [];
}

export const getFeaturedSkills = async (): Promise<Skill[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching only featured skills for the landing page hero section.
    // Should return skills where is_featured = true.
    return [];
}