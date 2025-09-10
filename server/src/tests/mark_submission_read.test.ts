import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type IdParam, type CreateContactSubmissionInput } from '../schema';
import { markSubmissionRead } from '../handlers/mark_submission_read';
import { eq } from 'drizzle-orm';

// Test input data
const testSubmission: CreateContactSubmissionInput = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for the contact form.'
};

describe('markSubmissionRead', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should mark an unread submission as read', async () => {
    // Create a test submission (unread by default)
    const [createdSubmission] = await db.insert(contactSubmissionsTable)
      .values({
        name: testSubmission.name,
        email: testSubmission.email,
        subject: testSubmission.subject,
        message: testSubmission.message
      })
      .returning()
      .execute();

    // Verify it's initially unread
    expect(createdSubmission.is_read).toBe(false);

    // Mark it as read
    const input: IdParam = { id: createdSubmission.id };
    const result = await markSubmissionRead(input);

    // Verify the result
    expect(result.id).toBe(createdSubmission.id);
    expect(result.name).toBe(testSubmission.name);
    expect(result.email).toBe(testSubmission.email);
    expect(result.subject).toBe(testSubmission.subject);
    expect(result.message).toBe(testSubmission.message);
    expect(result.is_read).toBe(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update the submission in the database', async () => {
    // Create a test submission
    const [createdSubmission] = await db.insert(contactSubmissionsTable)
      .values({
        name: testSubmission.name,
        email: testSubmission.email,
        subject: testSubmission.subject,
        message: testSubmission.message
      })
      .returning()
      .execute();

    // Mark it as read
    const input: IdParam = { id: createdSubmission.id };
    await markSubmissionRead(input);

    // Verify the database was updated
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, createdSubmission.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].is_read).toBe(true);
    expect(submissions[0].name).toBe(testSubmission.name);
    expect(submissions[0].email).toBe(testSubmission.email);
  });

  it('should not affect already read submissions', async () => {
    // Create a submission that's already read
    const [createdSubmission] = await db.insert(contactSubmissionsTable)
      .values({
        name: testSubmission.name,
        email: testSubmission.email,
        subject: testSubmission.subject,
        message: testSubmission.message,
        is_read: true
      })
      .returning()
      .execute();

    // Mark it as read again
    const input: IdParam = { id: createdSubmission.id };
    const result = await markSubmissionRead(input);

    // Verify it's still read and data is unchanged
    expect(result.is_read).toBe(true);
    expect(result.name).toBe(testSubmission.name);
    expect(result.email).toBe(testSubmission.email);
  });

  it('should throw error for non-existent submission', async () => {
    const input: IdParam = { id: 999 };

    await expect(markSubmissionRead(input)).rejects.toThrow(/not found/i);
  });

  it('should handle multiple submissions correctly', async () => {
    // Create multiple submissions
    const [submission1] = await db.insert(contactSubmissionsTable)
      .values({
        name: 'Alice',
        email: 'alice@example.com',
        subject: 'First Message',
        message: 'First test message'
      })
      .returning()
      .execute();

    const [submission2] = await db.insert(contactSubmissionsTable)
      .values({
        name: 'Bob',
        email: 'bob@example.com',
        subject: 'Second Message',
        message: 'Second test message'
      })
      .returning()
      .execute();

    // Mark only the first one as read
    const input: IdParam = { id: submission1.id };
    await markSubmissionRead(input);

    // Verify only the first one is marked as read
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .execute();

    const readSubmission = submissions.find(s => s.id === submission1.id);
    const unreadSubmission = submissions.find(s => s.id === submission2.id);

    expect(readSubmission?.is_read).toBe(true);
    expect(unreadSubmission?.is_read).toBe(false);
  });
});