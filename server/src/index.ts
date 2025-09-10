import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  updateContactInfoInputSchema,
  createSkillInputSchema,
  updateSkillInputSchema,
  createExperienceInputSchema,
  updateExperienceInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createEducationInputSchema,
  updateEducationInputSchema,
  createContactSubmissionInputSchema,
  idParamSchema
} from './schema';

// Import handlers
import { getContactInfo } from './handlers/get_contact_info';
import { updateContactInfo } from './handlers/update_contact_info';
import { getSkills, getFeaturedSkills } from './handlers/get_skills';
import { createSkill } from './handlers/create_skill';
import { updateSkill } from './handlers/update_skill';
import { deleteSkill } from './handlers/delete_skill';
import { getExperience } from './handlers/get_experience';
import { createExperience } from './handlers/create_experience';
import { updateExperience } from './handlers/update_experience';
import { deleteExperience } from './handlers/delete_experience';
import { getProjects, getFeaturedProjects } from './handlers/get_projects';
import { createProject } from './handlers/create_project';
import { updateProject } from './handlers/update_project';
import { deleteProject } from './handlers/delete_project';
import { getEducation } from './handlers/get_education';
import { createEducation } from './handlers/create_education';
import { updateEducation } from './handlers/update_education';
import { deleteEducation } from './handlers/delete_education';
import { createContactSubmission } from './handlers/create_contact_submission';
import { getContactSubmissions, getUnreadContactSubmissions } from './handlers/get_contact_submissions';
import { markSubmissionRead } from './handlers/mark_submission_read';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Contact Info routes
  getContactInfo: publicProcedure
    .query(() => getContactInfo()),
  updateContactInfo: publicProcedure
    .input(updateContactInfoInputSchema)
    .mutation(({ input }) => updateContactInfo(input)),

  // Skills routes
  getSkills: publicProcedure
    .query(() => getSkills()),
  getFeaturedSkills: publicProcedure
    .query(() => getFeaturedSkills()),
  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),
  updateSkill: publicProcedure
    .input(updateSkillInputSchema)
    .mutation(({ input }) => updateSkill(input)),
  deleteSkill: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteSkill(input)),

  // Experience routes
  getExperience: publicProcedure
    .query(() => getExperience()),
  createExperience: publicProcedure
    .input(createExperienceInputSchema)
    .mutation(({ input }) => createExperience(input)),
  updateExperience: publicProcedure
    .input(updateExperienceInputSchema)
    .mutation(({ input }) => updateExperience(input)),
  deleteExperience: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteExperience(input)),

  // Projects routes
  getProjects: publicProcedure
    .query(() => getProjects()),
  getFeaturedProjects: publicProcedure
    .query(() => getFeaturedProjects()),
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),
  deleteProject: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteProject(input)),

  // Education routes
  getEducation: publicProcedure
    .query(() => getEducation()),
  createEducation: publicProcedure
    .input(createEducationInputSchema)
    .mutation(({ input }) => createEducation(input)),
  updateEducation: publicProcedure
    .input(updateEducationInputSchema)
    .mutation(({ input }) => updateEducation(input)),
  deleteEducation: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => deleteEducation(input)),

  // Contact submission routes
  createContactSubmission: publicProcedure
    .input(createContactSubmissionInputSchema)
    .mutation(({ input }) => createContactSubmission(input)),
  getContactSubmissions: publicProcedure
    .query(() => getContactSubmissions()),
  getUnreadContactSubmissions: publicProcedure
    .query(() => getUnreadContactSubmissions()),
  markSubmissionRead: publicProcedure
    .input(idParamSchema)
    .mutation(({ input }) => markSubmissionRead(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();