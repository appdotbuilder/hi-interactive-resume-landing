import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput } from '../schema';
import { updateContactInfo } from '../handlers/update_contact_info';
import { eq } from 'drizzle-orm';

// Test input with all fields
const fullTestInput: UpdateContactInfoInput = {
  name: 'Jane Smith',
  title: 'Senior Software Engineer',
  email: 'jane.smith@example.com',
  phone: '+1-555-0123',
  location: 'San Francisco, CA',
  website: 'https://janesmith.dev',
  linkedin: 'https://linkedin.com/in/janesmith',
  github: 'https://github.com/janesmith',
  bio: 'Experienced software engineer with a passion for web development',
  profile_image_url: 'https://example.com/profile.jpg'
};

// Partial test input
const partialTestInput: UpdateContactInfoInput = {
  name: 'John Updated',
  email: 'john.updated@example.com'
};

describe('updateContactInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create new contact info when none exists', async () => {
    const result = await updateContactInfo(fullTestInput);

    // Verify all fields are set correctly
    expect(result.name).toEqual('Jane Smith');
    expect(result.title).toEqual('Senior Software Engineer');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.phone).toEqual('+1-555-0123');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.website).toEqual('https://janesmith.dev');
    expect(result.linkedin).toEqual('https://linkedin.com/in/janesmith');
    expect(result.github).toEqual('https://github.com/janesmith');
    expect(result.bio).toEqual('Experienced software engineer with a passion for web development');
    expect(result.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create new contact info with defaults when empty input provided', async () => {
    const result = await updateContactInfo({});

    // Should use default values for required fields
    expect(result.name).toEqual('John Doe');
    expect(result.title).toEqual('Software Developer');
    expect(result.email).toEqual('contact@example.com');
    expect(result.phone).toBeNull();
    expect(result.location).toBeNull();
    expect(result.website).toBeNull();
    expect(result.linkedin).toBeNull();
    expect(result.github).toBeNull();
    expect(result.bio).toBeNull();
    expect(result.profile_image_url).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save new contact info to database', async () => {
    const result = await updateContactInfo(fullTestInput);

    // Query database to verify data was saved
    const saved = await db.select()
      .from(contactInfoTable)
      .where(eq(contactInfoTable.id, result.id))
      .execute();

    expect(saved).toHaveLength(1);
    expect(saved[0].name).toEqual('Jane Smith');
    expect(saved[0].title).toEqual('Senior Software Engineer');
    expect(saved[0].email).toEqual('jane.smith@example.com');
    expect(saved[0].phone).toEqual('+1-555-0123');
    expect(saved[0].created_at).toBeInstanceOf(Date);
    expect(saved[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update existing contact info', async () => {
    // First create initial contact info
    const initial = await updateContactInfo({
      name: 'Initial Name',
      title: 'Initial Title',
      email: 'initial@example.com'
    });

    // Then update with new values
    const updated = await updateContactInfo({
      name: 'Updated Name',
      bio: 'This is a new bio'
    });

    // Should have same ID but updated fields
    expect(updated.id).toEqual(initial.id);
    expect(updated.name).toEqual('Updated Name');
    expect(updated.title).toEqual('Initial Title'); // Should remain unchanged
    expect(updated.email).toEqual('initial@example.com'); // Should remain unchanged
    expect(updated.bio).toEqual('This is a new bio'); // Should be updated
    expect(updated.updated_at.getTime()).toBeGreaterThan(initial.updated_at.getTime());
  });

  it('should handle partial updates correctly', async () => {
    // Create initial contact info with full data
    await updateContactInfo(fullTestInput);

    // Update only specific fields
    const result = await updateContactInfo(partialTestInput);

    // Updated fields should change
    expect(result.name).toEqual('John Updated');
    expect(result.email).toEqual('john.updated@example.com');
    
    // Other fields should remain from original
    expect(result.title).toEqual('Senior Software Engineer');
    expect(result.phone).toEqual('+1-555-0123');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.website).toEqual('https://janesmith.dev');
  });

  it('should handle null values correctly', async () => {
    // Create initial contact with some values
    await updateContactInfo({
      name: 'Test User',
      title: 'Developer',
      email: 'test@example.com',
      phone: '+1-555-1234',
      bio: 'Original bio'
    });

    // Update to set fields to null
    const result = await updateContactInfo({
      phone: null,
      bio: null
    });

    expect(result.name).toEqual('Test User'); // Should remain
    expect(result.phone).toBeNull(); // Should be set to null
    expect(result.bio).toBeNull(); // Should be set to null
  });

  it('should only have one contact info record after multiple updates', async () => {
    // Create initial contact
    await updateContactInfo(fullTestInput);

    // Update multiple times
    await updateContactInfo({ name: 'Update 1' });
    await updateContactInfo({ name: 'Update 2' });
    await updateContactInfo({ name: 'Update 3' });

    // Should still only have one record
    const allContacts = await db.select()
      .from(contactInfoTable)
      .execute();

    expect(allContacts).toHaveLength(1);
    expect(allContacts[0].name).toEqual('Update 3');
  });

  it('should handle URL fields correctly', async () => {
    const urlInput: UpdateContactInfoInput = {
      name: 'URL Test',
      title: 'Developer',
      email: 'url@example.com',
      website: 'https://mywebsite.com',
      linkedin: 'https://linkedin.com/in/urltest',
      github: 'https://github.com/urltest'
    };

    const result = await updateContactInfo(urlInput);

    expect(result.website).toEqual('https://mywebsite.com');
    expect(result.linkedin).toEqual('https://linkedin.com/in/urltest');
    expect(result.github).toEqual('https://github.com/urltest');
  });
});