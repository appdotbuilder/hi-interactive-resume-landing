import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Project } from '../../../server/src/schema';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [visibleProjects, setVisibleProjects] = useState(6);

  // Fallback project data for demonstration
  const fallbackProjects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, order management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Docker'],
      project_url: 'https://demo-ecommerce.com',
      github_url: 'https://github.com/username/ecommerce',
      image_url: null,
      is_featured: true,
      created_at: new Date('2023-06-01')
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      technologies: ['React', 'TypeScript', 'Socket.io', 'Express', 'MongoDB'],
      project_url: 'https://taskmaster-demo.com',
      github_url: 'https://github.com/username/taskmaster',
      image_url: null,
      is_featured: true,
      created_at: new Date('2023-04-15')
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A beautiful weather application with location-based forecasts, interactive maps, and detailed weather analytics.',
      technologies: ['Vue.js', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
      project_url: 'https://weather-viz.com',
      github_url: 'https://github.com/username/weather-dashboard',
      image_url: null,
      is_featured: false,
      created_at: new Date('2023-03-10')
    },
    {
      id: 4,
      title: 'Social Media Analytics',
      description: 'A comprehensive analytics platform for social media managers with data visualization and reporting capabilities.',
      technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'Redis'],
      project_url: null,
      github_url: 'https://github.com/username/social-analytics',
      image_url: null,
      is_featured: false,
      created_at: new Date('2023-02-01')
    },
    {
      id: 5,
      title: 'Recipe Finder',
      description: 'A recipe discovery app with ingredient-based search, nutritional information, and meal planning features.',
      technologies: ['React Native', 'Firebase', 'Spoonacular API'],
      project_url: 'https://recipefinder-app.com',
      github_url: null,
      image_url: null,
      is_featured: false,
      created_at: new Date('2023-01-15')
    },
    {
      id: 6,
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website showcasing my work and skills. Built with performance and accessibility in mind.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'tRPC'],
      project_url: 'https://myportfolio.com',
      github_url: 'https://github.com/username/portfolio',
      image_url: null,
      is_featured: false,
      created_at: new Date('2022-12-01')
    }
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;
  const featuredProjects = displayProjects.filter(project => project.is_featured);
  const regularProjects = displayProjects.filter(project => !project.is_featured);

  const showMoreProjects = () => {
    setVisibleProjects(prev => prev + 6);
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/30 group h-full">
      <div className="p-6 h-full flex flex-col">
        {/* Project Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>
              {project.is_featured && (
                <Badge className="bg-purple-600/20 text-purple-300 text-xs">Featured</Badge>
              )}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-4 flex-1">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs border-slate-600 text-slate-300 hover:border-purple-500/50 transition-colors"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Project Links */}
        <div className="flex gap-3 mt-auto pt-4 border-t border-slate-700">
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <span>🔗</span>
              <span>Live Demo</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors"
            >
              <span>📂</span>
              <span>Source Code</span>
            </a>
          )}
          {!project.project_url && !project.github_url && (
            <span className="text-sm text-slate-500">Private Project</span>
          )}
        </div>

        {/* Created Date */}
        <div className="text-xs text-slate-500 mt-2">
          Created: {project.created_at.toLocaleDateString()}
        </div>
      </div>
    </Card>
  );

  return (
    <section id="projects" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Featured <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            A showcase of my recent work and the technologies I love working with
          </p>
        </div>

        {displayProjects.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Projects Yet</h3>
            <p className="text-slate-400 text-lg">
              Projects will be displayed here once added to the portfolio. Stay tuned for amazing work!
            </p>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 text-center">⭐ Featured Work</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {featuredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Projects */}
            {regularProjects.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 text-center">🔧 Other Projects</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularProjects.slice(0, visibleProjects - featuredProjects.length).map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleProjects < displayProjects.length && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={showMoreProjects}
                      variant="outline"
                      className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3"
                    >
                      Load More Projects ({displayProjects.length - visibleProjects} remaining)
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Project Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displayProjects.length}
                </div>
                <div className="text-purple-400 font-semibold">Total Projects</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {featuredProjects.length}
                </div>
                <div className="text-blue-400 font-semibold">Featured</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {[...new Set(displayProjects.flatMap(p => p.technologies))].length}
                </div>
                <div className="text-green-400 font-semibold">Technologies</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-yellow-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displayProjects.filter(p => p.project_url || p.github_url).length}
                </div>
                <div className="text-yellow-400 font-semibold">Live Projects</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}