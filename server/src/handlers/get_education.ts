import { db } from '../db';
import { educationTable } from '../db/schema';
import { desc } from 'drizzle-orm';
import { type Education } from '../schema';

export const getEducation = async (): Promise<Education[]> => {
  try {
    const results = await db.select()
      .from(educationTable)
      .orderBy(desc(educationTable.start_date))
      .execute();

    // Convert numeric GPA field back to number
    return results.map(education => ({
      ...education,
      gpa: education.gpa !== null ? parseFloat(education.gpa.toString()) : null
    }));
  } catch (error) {
    console.error('Failed to fetch education data:', error);
    throw error;
  }
};