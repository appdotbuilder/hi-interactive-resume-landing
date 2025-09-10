import { type ContactSubmission } from '../schema';

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all contact form submissions (admin functionality).
    // Should return submissions ordered by created_at descending (most recent first).
    return [];
}

export const getUnreadContactSubmissions = async (): Promise<ContactSubmission[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching only unread contact form submissions.
    // Should return submissions where is_read = false.
    return [];
}