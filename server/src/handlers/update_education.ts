import { db } from '../db';
import { educationTable } from '../db/schema';
import { type UpdateEducationInput, type Education } from '../schema';
import { eq } from 'drizzle-orm';

export const updateEducation = async (input: UpdateEducationInput): Promise<Education> => {
  try {
    // First verify the education entry exists
    const existingEducation = await db.select()
      .from(educationTable)
      .where(eq(educationTable.id, input.id))
      .execute();

    if (existingEducation.length === 0) {
      throw new Error(`Education entry with id ${input.id} not found`);
    }

    // Prepare update data - only include fields that were provided
    const updateData: any = {};
    
    if (input.institution !== undefined) {
      updateData.institution = input.institution;
    }
    
    if (input.degree !== undefined) {
      updateData.degree = input.degree;
    }
    
    if (input.field_of_study !== undefined) {
      updateData.field_of_study = input.field_of_study;
    }
    
    if (input.start_date !== undefined) {
      updateData.start_date = input.start_date;
    }
    
    if (input.end_date !== undefined) {
      updateData.end_date = input.end_date;
    }
    
    if (input.gpa !== undefined) {
      updateData.gpa = input.gpa;
    }
    
    if (input.description !== undefined) {
      updateData.description = input.description;
    }

    // Only proceed with update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      // No fields to update, return the existing record
      return existingEducation[0];
    }

    // Update the education entry
    const result = await db.update(educationTable)
      .set(updateData)
      .where(eq(educationTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Education update failed:', error);
    throw error;
  }
};