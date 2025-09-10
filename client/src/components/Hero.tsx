import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { ContactInfo, Skill, Project } from '../../../server/src/schema';

interface HeroProps {
  contactInfo: ContactInfo | null;
  featuredSkills: Skill[];
  featuredProjects: Project[];
}

export function Hero({ contactInfo, featuredSkills, featuredProjects }: HeroProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Fallback data for demonstration when handlers return empty arrays
  const displaySkills = featuredSkills.length > 0 ? featuredSkills : [
    { id: 1, name: 'React', category: 'Frontend', proficiency_level: 9, is_featured: true, created_at: new Date() },
    { id: 2, name: 'TypeScript', category: 'Programming', proficiency_level: 8, is_featured: true, created_at: new Date() },
    { id: 3, name: 'Node.js', category: 'Backend', proficiency_level: 8, is_featured: true, created_at: new Date() },
  ];

  const displayProjects = featuredProjects.length > 0 ? featuredProjects : [
    { 
      id: 1, 
      title: 'Modern Portfolio', 
      description: 'A responsive portfolio website built with React and TypeScript',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      project_url: null,
      github_url: null,
      image_url: null,
      is_featured: true,
      created_at: new Date()
    }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left">
            {/* Profile Image */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <Avatar className="w-32 h-32 ring-4 ring-purple-400/20">
                <AvatarImage src={contactInfo?.profile_image_url || undefined} />
                <AvatarFallback className="bg-purple-600 text-white text-3xl">
                  {contactInfo?.name ? contactInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2) : '👨‍💻'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Hi, I'm </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {contactInfo?.name || 'John Developer'}
              </span>
            </h1>

            {/* Title */}
            <h2 className="text-xl lg:text-2xl text-slate-300 mb-6 font-light">
              {contactInfo?.title || 'Full Stack Developer & UI/UX Designer'}
            </h2>

            {/* Bio */}
            <p className="text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed">
              {contactInfo?.bio || 
                "Passionate about creating beautiful, functional web applications that solve real-world problems. I combine technical expertise with creative design to deliver exceptional user experiences."
              }
            </p>

            {/* Featured Skills */}
            <div className="mb-8">
              <p className="text-sm text-slate-500 mb-3 uppercase tracking-wider">Featured Skills</p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {displaySkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    variant="secondary" 
                    className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors"
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button 
                size="lg" 
                onClick={() => scrollToSection('projects')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold"
              >
                View My Work 🚀
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection('contact')}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 text-lg"
              >
                Get In Touch
              </Button>
            </div>

            {/* Social Links */}
            {(contactInfo?.linkedin || contactInfo?.github || contactInfo?.website) && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {contactInfo.linkedin && (
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-purple-400 transition-colors text-2xl"
                  >
                    💼
                  </a>
                )}
                {contactInfo.github && (
                  <a
                    href={contactInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-purple-400 transition-colors text-2xl"
                  >
                    🔗
                  </a>
                )}
                {contactInfo.website && (
                  <a
                    href={contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-purple-400 transition-colors text-2xl"
                  >
                    🌐
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Featured Project */}
          <div className="lg:flex justify-end hidden">
            <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full backdrop-blur-sm">
              <div className="p-6">
                <div className="text-sm text-purple-400 font-semibold mb-2">✨ Featured Project</div>
                {displayProjects.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {displayProjects[0].title}
                    </h3>
                    <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                      {displayProjects[0].description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {displayProjects[0].technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => scrollToSection('projects')}
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                    >
                      View All Projects →
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="animate-bounce">
            <div className="text-slate-400 text-sm mb-2">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full mx-auto">
              <div className="w-1 h-3 bg-purple-400 rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}