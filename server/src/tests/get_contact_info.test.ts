import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { getContactInfo } from '../handlers/get_contact_info';

describe('getContactInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no contact info exists', async () => {
    const result = await getContactInfo();
    expect(result).toBeNull();
  });

  it('should return contact info when record exists', async () => {
    // Create test contact info
    const contactData = {
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      bio: 'Passionate software engineer with 5+ years of experience',
      profile_image_url: 'https://example.com/profile.jpg'
    };

    await db.insert(contactInfoTable)
      .values(contactData)
      .execute();

    const result = await getContactInfo();

    // Verify all fields are returned correctly
    expect(result).not.toBeNull();
    expect(result!.name).toEqual('John Doe');
    expect(result!.title).toEqual('Software Engineer');
    expect(result!.email).toEqual('john.doe@example.com');
    expect(result!.phone).toEqual('+1-555-0123');
    expect(result!.location).toEqual('San Francisco, CA');
    expect(result!.website).toEqual('https://johndoe.dev');
    expect(result!.linkedin).toEqual('https://linkedin.com/in/johndoe');
    expect(result!.github).toEqual('https://github.com/johndoe');
    expect(result!.bio).toEqual('Passionate software engineer with 5+ years of experience');
    expect(result!.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recent contact info when multiple records exist', async () => {
    // Create older contact info
    await db.insert(contactInfoTable)
      .values({
        name: 'Old Name',
        title: 'Old Title',
        email: 'old@example.com'
      })
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create newer contact info
    await db.insert(contactInfoTable)
      .values({
        name: 'New Name',
        title: 'New Title', 
        email: 'new@example.com'
      })
      .execute();

    const result = await getContactInfo();

    // Should return the most recent record
    expect(result).not.toBeNull();
    expect(result!.name).toEqual('New Name');
    expect(result!.title).toEqual('New Title');
    expect(result!.email).toEqual('new@example.com');
  });

  it('should handle contact info with nullable fields', async () => {
    // Create contact info with only required fields
    const minimalContactData = {
      name: 'Jane Smith',
      title: 'Designer',
      email: 'jane.smith@example.com',
      // All other fields will be null
    };

    await db.insert(contactInfoTable)
      .values(minimalContactData)
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.name).toEqual('Jane Smith');
    expect(result!.title).toEqual('Designer');
    expect(result!.email).toEqual('jane.smith@example.com');
    expect(result!.phone).toBeNull();
    expect(result!.location).toBeNull();
    expect(result!.website).toBeNull();
    expect(result!.linkedin).toBeNull();
    expect(result!.github).toBeNull();
    expect(result!.bio).toBeNull();
    expect(result!.profile_image_url).toBeNull();
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });
});