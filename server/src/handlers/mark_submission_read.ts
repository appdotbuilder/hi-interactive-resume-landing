import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type IdParam, type ContactSubmission } from '../schema';
import { eq } from 'drizzle-orm';

export const markSubmissionRead = async (input: IdParam): Promise<ContactSubmission> => {
  try {
    // Update the submission to mark it as read
    const result = await db.update(contactSubmissionsTable)
      .set({
        is_read: true
      })
      .where(eq(contactSubmissionsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Contact submission with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Failed to mark submission as read:', error);
    throw error;
  }
};