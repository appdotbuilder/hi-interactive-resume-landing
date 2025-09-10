import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactSubmissionsTable } from '../db/schema';
import { type CreateContactSubmissionInput } from '../schema';
import { getContactSubmissions, getUnreadContactSubmissions } from '../handlers/get_contact_submissions';

const testSubmission1: CreateContactSubmissionInput = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a potential project.'
};

const testSubmission2: CreateContactSubmissionInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: null,
  message: 'Hello, I am interested in your services.'
};

const testSubmission3: CreateContactSubmissionInput = {
  name: 'Bob Wilson',
  email: 'bob@example.com',
  subject: 'Job Opportunity',
  message: 'We have an exciting opportunity for you.'
};

describe('getContactSubmissions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no submissions exist', async () => {
    const result = await getContactSubmissions();
    expect(result).toEqual([]);
  });

  it('should return all submissions ordered by created_at descending', async () => {
    // Create test submissions with slight delay to ensure different timestamps
    const submission1 = await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission1,
        is_read: false
      })
      .returning()
      .execute();

    // Small delay to ensure different created_at times
    await new Promise(resolve => setTimeout(resolve, 10));

    const submission2 = await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission2,
        is_read: true
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const submission3 = await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission3,
        is_read: false
      })
      .returning()
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(3);
    
    // Verify ordering (most recent first)
    expect(result[0].id).toEqual(submission3[0].id);
    expect(result[1].id).toEqual(submission2[0].id);
    expect(result[2].id).toEqual(submission1[0].id);

    // Verify all submissions are returned regardless of read status
    const readStatuses = result.map(s => s.is_read);
    expect(readStatuses).toContain(true);
    expect(readStatuses).toContain(false);
  });

  it('should return submissions with correct field values', async () => {
    await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission1,
        is_read: false
      })
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(1);
    const submission = result[0];

    expect(submission.name).toEqual('John Doe');
    expect(submission.email).toEqual('john@example.com');
    expect(submission.subject).toEqual('Project Inquiry');
    expect(submission.message).toEqual('I would like to discuss a potential project.');
    expect(submission.is_read).toEqual(false);
    expect(submission.id).toBeDefined();
    expect(submission.created_at).toBeInstanceOf(Date);
  });

  it('should handle nullable subject field correctly', async () => {
    await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission2,
        is_read: false
      })
      .execute();

    const result = await getContactSubmissions();

    expect(result).toHaveLength(1);
    expect(result[0].subject).toBeNull();
    expect(result[0].name).toEqual('Jane Smith');
    expect(result[0].message).toEqual('Hello, I am interested in your services.');
  });
});

describe('getUnreadContactSubmissions', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no unread submissions exist', async () => {
    // Create only read submissions
    await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission1,
        is_read: true
      })
      .execute();

    const result = await getUnreadContactSubmissions();
    expect(result).toEqual([]);
  });

  it('should return only unread submissions', async () => {
    // Create mixed read/unread submissions
    const unreadSubmission1 = await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission1,
        is_read: false
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission2,
        is_read: true // This should not be returned
      })
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const unreadSubmission2 = await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission3,
        is_read: false
      })
      .returning()
      .execute();

    const result = await getUnreadContactSubmissions();

    expect(result).toHaveLength(2);
    
    // Verify only unread submissions are returned
    result.forEach(submission => {
      expect(submission.is_read).toEqual(false);
    });

    // Verify ordering (most recent first)
    expect(result[0].id).toEqual(unreadSubmission2[0].id);
    expect(result[1].id).toEqual(unreadSubmission1[0].id);
  });

  it('should return unread submissions with correct field values', async () => {
    await db.insert(contactSubmissionsTable)
      .values({
        ...testSubmission1,
        is_read: false
      })
      .execute();

    const result = await getUnreadContactSubmissions();

    expect(result).toHaveLength(1);
    const submission = result[0];

    expect(submission.name).toEqual('John Doe');
    expect(submission.email).toEqual('john@example.com');
    expect(submission.subject).toEqual('Project Inquiry');
    expect(submission.message).toEqual('I would like to discuss a potential project.');
    expect(submission.is_read).toEqual(false);
    expect(submission.id).toBeDefined();
    expect(submission.created_at).toBeInstanceOf(Date);
  });

  it('should return unread submissions ordered by created_at descending', async () => {
    // Create multiple unread submissions
    const submission1 = await db.insert(contactSubmissionsTable)
      .values({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        subject: 'First Message',
        message: 'This is the first message.',
        is_read: false
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const submission2 = await db.insert(contactSubmissionsTable)
      .values({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        subject: 'Second Message',
        message: 'This is the second message.',
        is_read: false
      })
      .returning()
      .execute();

    const result = await getUnreadContactSubmissions();

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(submission2[0].id); // Most recent first
    expect(result[1].id).toEqual(submission1[0].id);
  });
});