import { db } from '../db';
import { educationTable } from '../db/schema';
import { type CreateEducationInput, type Education } from '../schema';

export const createEducation = async (input: CreateEducationInput): Promise<Education> => {
  try {
    // Insert education record
    const result = await db.insert(educationTable)
      .values({
        institution: input.institution,
        degree: input.degree,
        field_of_study: input.field_of_study,
        start_date: input.start_date,
        end_date: input.end_date,
        gpa: input.gpa, // Real column - no conversion needed
        description: input.description
      })
      .returning()
      .execute();

    const education = result[0];
    return education;
  } catch (error) {
    console.error('Education creation failed:', error);
    throw error;
  }
};