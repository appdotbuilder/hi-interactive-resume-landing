import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { createContactSubmission } from '../handlers/create_contact_submission';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInputWithSubject: CreateContactSubmissionInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Inquiry about services',
  message: 'I would like to know more about your web development services.'
};

// Test input without optional subject field
const testInputWithoutSubject: CreateContactSubmissionInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  subject: null,
  message: 'Quick question about your portfolio.'
};

describe('createContactSubmission', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact submission with subject', async () => {
    const result = await createContactSubmission(testInputWithSubject);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Inquiry about services');
    expect(result.message).toEqual('I would like to know more about your web development services.');
    expect(result.is_read).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a contact submission without subject', async () => {
    const result = await createContactSubmission(testInputWithoutSubject);

    // Basic field validation
    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.subject).toBeNull();
    expect(result.message).toEqual('Quick question about your portfolio.');
    expect(result.is_read).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact submission to database', async () => {
    const result = await createContactSubmission(testInputWithSubject);

    // Query using proper drizzle syntax
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions).toHaveLength(1);
    expect(submissions[0].name).toEqual('John Doe');
    expect(submissions[0].email).toEqual('john.doe@example.com');
    expect(submissions[0].subject).toEqual('Inquiry about services');
    expect(submissions[0].message).toEqual('I would like to know more about your web development services.');
    expect(submissions[0].is_read).toEqual(false);
    expect(submissions[0].created_at).toBeInstanceOf(Date);
  });

  it('should set is_read to false by default', async () => {
    const result = await createContactSubmission(testInputWithSubject);

    expect(result.is_read).toEqual(false);

    // Verify in database
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions[0].is_read).toEqual(false);
  });

  it('should handle long messages', async () => {
    const longMessage = 'A'.repeat(1000); // 1000 character message
    const longMessageInput: CreateContactSubmissionInput = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Long message test',
      message: longMessage
    };

    const result = await createContactSubmission(longMessageInput);

    expect(result.message).toEqual(longMessage);
    expect(result.message).toHaveLength(1000);

    // Verify in database
    const submissions = await db.select()
      .from(contactSubmissionsTable)
      .where(eq(contactSubmissionsTable.id, result.id))
      .execute();

    expect(submissions[0].message).toEqual(longMessage);
  });

  it('should create multiple submissions from same user', async () => {
    const firstSubmission = await createContactSubmission(testInputWithSubject);
    const secondSubmission = await createContactSubmission({
      ...testInputWithSubject,
      subject: 'Follow-up question',
      message: 'This is a follow-up to my previous inquiry.'
    });

    expect(firstSubmission.id).not.toEqual(secondSubmission.id);
    expect(secondSubmission.subject).toEqual('Follow-up question');
    expect(secondSubmission.message).toEqual('This is a follow-up to my previous inquiry.');

    // Verify both exist in database
    const allSubmissions = await db.select()
      .from(contactSubmissionsTable)
      .execute();

    expect(allSubmissions).toHaveLength(2);
    const emails = allSubmissions.map(s => s.email);
    expect(emails).toEqual(['john.doe@example.com', 'john.doe@example.com']);
  });
});