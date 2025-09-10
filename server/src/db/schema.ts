import { serial, text, pgTable, timestamp, integer, boolean, json, real } from 'drizzle-orm/pg-core';

// Contact information table - stores personal/professional info for the resume
export const contactInfoTable = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  email: text('email').notNull(),
  phone: text('phone'), // Nullable by default
  location: text('location'), // Nullable by default
  website: text('website'), // Nullable by default
  linkedin: text('linkedin'), // Nullable by default
  github: text('github'), // Nullable by default
  bio: text('bio'), // Nullable by default
  profile_image_url: text('profile_image_url'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Skills table - stores technical and professional skills
export const skillsTable = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // e.g., "Frontend", "Backend", "Design", etc.
  proficiency_level: integer('proficiency_level').notNull(), // 1-10 scale
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Experience table - stores work experience
export const experienceTable = pgTable('experience', {
  id: serial('id').primaryKey(),
  company_name: text('company_name').notNull(),
  position: text('position').notNull(),
  description: text('description'), // Nullable by default
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'), // Nullable for current positions
  is_current: boolean('is_current').default(false).notNull(),
  location: text('location'), // Nullable by default
  company_url: text('company_url'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Projects table - stores portfolio projects
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: json('technologies').$type<string[]>().notNull(), // Array of technology names
  project_url: text('project_url'), // Nullable by default
  github_url: text('github_url'), // Nullable by default
  image_url: text('image_url'), // Nullable by default
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Education table - stores educational background
export const educationTable = pgTable('education', {
  id: serial('id').primaryKey(),
  institution: text('institution').notNull(),
  degree: text('degree').notNull(),
  field_of_study: text('field_of_study'), // Nullable by default
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'), // Nullable for ongoing studies
  gpa: real('gpa'), // Use real for decimal values, nullable by default
  description: text('description'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Contact submissions table - stores contact form submissions
export const contactSubmissionsTable = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'), // Nullable by default
  message: text('message').notNull(),
  is_read: boolean('is_read').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type ContactInfo = typeof contactInfoTable.$inferSelect;
export type NewContactInfo = typeof contactInfoTable.$inferInsert;

export type Skill = typeof skillsTable.$inferSelect;
export type NewSkill = typeof skillsTable.$inferInsert;

export type Experience = typeof experienceTable.$inferSelect;
export type NewExperience = typeof experienceTable.$inferInsert;

export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;

export type Education = typeof educationTable.$inferSelect;
export type NewEducation = typeof educationTable.$inferInsert;

export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
export type NewContactSubmission = typeof contactSubmissionsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  contactInfo: contactInfoTable,
  skills: skillsTable,
  experience: experienceTable,
  projects: projectsTable,
  education: educationTable,
  contactSubmissions: contactSubmissionsTable,
};