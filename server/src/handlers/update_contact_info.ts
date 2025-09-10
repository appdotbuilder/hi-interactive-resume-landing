import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput, type ContactInfo } from '../schema';
import { eq } from 'drizzle-orm';

export const updateContactInfo = async (input: UpdateContactInfoInput): Promise<ContactInfo> => {
  try {
    // First, check if contact info exists
    const existing = await db.select()
      .from(contactInfoTable)
      .limit(1)
      .execute();

    let result;

    if (existing.length === 0) {
      // No contact info exists, create new one
      // For creation, we need all required fields
      const createData = {
        name: input.name || 'John Doe', // Default fallbacks for required fields
        title: input.title || 'Software Developer',
        email: input.email || 'contact@example.com',
        phone: input.phone !== undefined ? input.phone : null,
        location: input.location !== undefined ? input.location : null,
        website: input.website !== undefined ? input.website : null,
        linkedin: input.linkedin !== undefined ? input.linkedin : null,
        github: input.github !== undefined ? input.github : null,
        bio: input.bio !== undefined ? input.bio : null,
        profile_image_url: input.profile_image_url !== undefined ? input.profile_image_url : null
      };

      const insertResult = await db.insert(contactInfoTable)
        .values(createData)
        .returning()
        .execute();
      
      result = insertResult[0];
    } else {
      // Contact info exists, update it
      const contactId = existing[0].id;
      
      // Build update data object with only provided fields
      const updateData: any = {
        updated_at: new Date()
      };

      // Only include fields that are explicitly provided in the input
      if (input.name !== undefined) updateData.name = input.name;
      if (input.title !== undefined) updateData.title = input.title;
      if (input.email !== undefined) updateData.email = input.email;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.location !== undefined) updateData.location = input.location;
      if (input.website !== undefined) updateData.website = input.website;
      if (input.linkedin !== undefined) updateData.linkedin = input.linkedin;
      if (input.github !== undefined) updateData.github = input.github;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.profile_image_url !== undefined) updateData.profile_image_url = input.profile_image_url;

      const updateResult = await db.update(contactInfoTable)
        .set(updateData)
        .where(eq(contactInfoTable.id, contactId))
        .returning()
        .execute();

      result = updateResult[0];
    }

    return result;
  } catch (error) {
    console.error('Contact info update failed:', error);
    throw error;
  }
};