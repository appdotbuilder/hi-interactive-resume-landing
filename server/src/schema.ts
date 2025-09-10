import { z } from 'zod';

// Contact information schema
export const contactInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  website: z.string().url().nullable(),
  linkedin: z.string().url().nullable(),
  github: z.string().url().nullable(),
  bio: z.string().nullable(),
  profile_image_url: z.string().url().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Skills schema
export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  proficiency_level: z.number().int().min(1).max(10),
  is_featured: z.boolean(),
  created_at: z.coerce.date()
});

export type Skill = z.infer<typeof skillSchema>;

// Experience schema
export const experienceSchema = z.object({
  id: z.number(),
  company_name: z.string(),
  position: z.string(),
  description: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  is_current: z.boolean(),
  location: z.string().nullable(),
  company_url: z.string().url().nullable(),
  created_at: z.coerce.date()
});

export type Experience = z.infer<typeof experienceSchema>;

// Projects schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  project_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  image_url: z.string().url().nullable(),
  is_featured: z.boolean(),
  created_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Education schema
export const educationSchema = z.object({
  id: z.number(),
  institution: z.string(),
  degree: z.string(),
  field_of_study: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  gpa: z.number().nullable(),
  description: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Education = z.infer<typeof educationSchema>;

// Contact form submissions schema
export const contactSubmissionSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.coerce.date()
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

// Input schemas for creating/updating data

// Contact info input schema
export const updateContactInfoInputSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  website: z.string().url().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
  github: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  profile_image_url: z.string().url().nullable().optional()
});

export type UpdateContactInfoInput = z.infer<typeof updateContactInfoInputSchema>;

// Skill input schemas
export const createSkillInputSchema = z.object({
  name: z.string(),
  category: z.string(),
  proficiency_level: z.number().int().min(1).max(10),
  is_featured: z.boolean().default(false)
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

export const updateSkillInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  category: z.string().optional(),
  proficiency_level: z.number().int().min(1).max(10).optional(),
  is_featured: z.boolean().optional()
});

export type UpdateSkillInput = z.infer<typeof updateSkillInputSchema>;

// Experience input schemas
export const createExperienceInputSchema = z.object({
  company_name: z.string(),
  position: z.string(),
  description: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  is_current: z.boolean().default(false),
  location: z.string().nullable(),
  company_url: z.string().url().nullable()
});

export type CreateExperienceInput = z.infer<typeof createExperienceInputSchema>;

export const updateExperienceInputSchema = z.object({
  id: z.number(),
  company_name: z.string().optional(),
  position: z.string().optional(),
  description: z.string().nullable().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().nullable().optional(),
  is_current: z.boolean().optional(),
  location: z.string().nullable().optional(),
  company_url: z.string().url().nullable().optional()
});

export type UpdateExperienceInput = z.infer<typeof updateExperienceInputSchema>;

// Project input schemas
export const createProjectInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  project_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  image_url: z.string().url().nullable(),
  is_featured: z.boolean().default(false)
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  project_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  is_featured: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Education input schemas
export const createEducationInputSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field_of_study: z.string().nullable(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  gpa: z.number().nullable(),
  description: z.string().nullable()
});

export type CreateEducationInput = z.infer<typeof createEducationInputSchema>;

export const updateEducationInputSchema = z.object({
  id: z.number(),
  institution: z.string().optional(),
  degree: z.string().optional(),
  field_of_study: z.string().nullable().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().nullable().optional(),
  gpa: z.number().nullable().optional(),
  description: z.string().nullable().optional()
});

export type UpdateEducationInput = z.infer<typeof updateEducationInputSchema>;

// Contact submission input schema
export const createContactSubmissionInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string()
});

export type CreateContactSubmissionInput = z.infer<typeof createContactSubmissionInputSchema>;

// ID parameter schema for delete/get operations
export const idParamSchema = z.object({
  id: z.number()
});

export type IdParam = z.infer<typeof idParamSchema>;