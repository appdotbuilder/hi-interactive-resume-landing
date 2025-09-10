import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type ContactSubmission } from '../schema';
import { desc, eq } from 'drizzle-orm';

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const result = await db.select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.created_at))
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    throw error;
  }
};

export const getUnreadContactSubmissions = async (): Promise<ContactSubmission[]> => {
  try {
    const result = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.is_read, false))
      .orderBy(desc(contactSubmissionsTable.created_at))
      .execute();

    return result;
  } catch (error) {
    console.error('Failed to fetch unread contact submissions:', error);
    throw error;
  }
};