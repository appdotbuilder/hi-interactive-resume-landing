import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Hero } from '@/components/Hero';
import { AboutSection } from '@/components/AboutSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { ContactSection } from '@/components/ContactSection';
import { Navigation } from '@/components/Navigation';
import type { ContactInfo, Experience, Project, Skill } from '../../server/src/schema';

function App() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [
        contactInfoResult,
        experiencesResult,
        projectsResult,
        featuredProjectsResult,
        skillsResult,
        featuredSkillsResult
      ] = await Promise.all([
        trpc.getContactInfo.query(),
        trpc.getExperience.query(),
        trpc.getProjects.query(),
        trpc.getFeaturedProjects.query(),
        trpc.getSkills.query(),
        trpc.getFeaturedSkills.query()
      ]);

      setContactInfo(contactInfoResult);
      setExperiences(experiencesResult);
      setProjects(projectsResult);
      setFeaturedProjects(featuredProjectsResult);
      setSkills(skillsResult);
      setFeaturedSkills(featuredSkillsResult);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navigation contactInfo={contactInfo} />
      
      <main>
        <Hero 
          contactInfo={contactInfo} 
          featuredSkills={featuredSkills}
          featuredProjects={featuredProjects} 
        />
        
        <AboutSection contactInfo={contactInfo} />
        
        <ExperienceSection experiences={experiences} />
        
        <ProjectsSection projects={projects} />
        
        <SkillsSection skills={skills} />
        
        <ContactSection contactInfo={contactInfo} />
      </main>
      
      <footer className="bg-slate-800 border-t border-slate-700 py-8 text-center">
        <p className="text-slate-400">
          © {new Date().getFullYear()} {contactInfo?.name || 'Portfolio'}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;