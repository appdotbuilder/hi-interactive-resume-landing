import { type IdParam, type ContactSubmission } from '../schema';

export const markSubmissionRead = async (input: IdParam): Promise<ContactSubmission> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is marking a contact submission as read (admin functionality).
    // Should update is_read to true for the specified submission.
    return {
        id: input.id,
        name: 'Contact Name',
        email: 'contact@example.com',
        subject: 'Contact Subject',
        message: 'Contact message content',
        is_read: true,
        created_at: new Date()
    } as ContactSubmission;
}