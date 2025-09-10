import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type ContactInfo } from '../schema';
import { desc } from 'drizzle-orm';

export const getContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    // Get the most recent contact info record
    const result = await db.select()
      .from(contactInfoTable)
      .orderBy(desc(contactInfoTable.created_at))
      .limit(1)
      .execute();

    // Return null if no contact info exists
    if (result.length === 0) {
      return null;
    }

    // Return the first contact info record
    return result[0];
  } catch (error) {
    console.error('Failed to fetch contact info:', error);
    throw error;
  }
};