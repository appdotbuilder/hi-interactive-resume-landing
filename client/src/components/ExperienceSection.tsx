import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Experience } from '../../../server/src/schema';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  // Fallback experience data for demonstration
  const fallbackExperiences: Experience[] = [
    {
      id: 1,
      company_name: 'Tech Innovations Inc.',
      position: 'Senior Full Stack Developer',
      description: 'Led development of enterprise-scale web applications using React, Node.js, and PostgreSQL. Mentored junior developers and implemented CI/CD pipelines that reduced deployment time by 60%.',
      start_date: new Date('2022-01-01'),
      end_date: null,
      is_current: true,
      location: 'San Francisco, CA',
      company_url: 'https://example.com',
      created_at: new Date()
    },
    {
      id: 2,
      company_name: 'Digital Solutions LLC',
      position: 'Frontend Developer',
      description: 'Developed responsive web applications using React and TypeScript. Collaborated with design teams to create pixel-perfect UIs and improved application performance by 40%.',
      start_date: new Date('2020-06-01'),
      end_date: new Date('2021-12-31'),
      is_current: false,
      location: 'Remote',
      company_url: null,
      created_at: new Date()
    },
    {
      id: 3,
      company_name: 'Startup Ventures',
      position: 'Junior Web Developer',
      description: 'Built and maintained company websites using HTML, CSS, JavaScript, and WordPress. Gained experience in agile development methodologies and version control systems.',
      start_date: new Date('2019-01-01'),
      end_date: new Date('2020-05-31'),
      is_current: false,
      location: 'Austin, TX',
      company_url: null,
      created_at: new Date()
    }
  ];

  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const calculateDuration = (startDate: Date, endDate: Date | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  return (
    <section id="experience" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Professional <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Experience</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            My journey through various roles and the impact I've made along the way
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {displayExperiences.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
              <div className="text-6xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-white mb-2">No Experience Added Yet</h3>
              <p className="text-slate-400">
                Professional experience will be displayed here once added to the portfolio.
              </p>
            </Card>
          ) : (
            <div className="space-y-8">
              {displayExperiences.map((experience, index) => (
                <Card 
                  key={experience.id} 
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/30 relative"
                >
                  {/* Timeline Line */}
                  {index < displayExperiences.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-purple-500 to-transparent"></div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          {/* Timeline Dot */}
                          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                            experience.is_current 
                              ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                              : 'bg-purple-500 shadow-lg shadow-purple-500/50'
                          }`}></div>
                          
                          <div>
                            <h3 className="text-xl lg:text-2xl font-bold text-white">
                              {experience.position}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="text-purple-400 font-semibold">
                                {experience.company_url ? (
                                  <a 
                                    href={experience.company_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-purple-300 transition-colors"
                                  >
                                    {experience.company_name} 🔗
                                  </a>
                                ) : (
                                  experience.company_name
                                )}
                              </span>
                              {experience.location && (
                                <>
                                  <span className="text-slate-500">•</span>
                                  <span className="text-slate-400 text-sm">📍 {experience.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:items-end gap-2 mt-4 lg:mt-0">
                        <div className="text-slate-400 text-sm">
                          {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {calculateDuration(experience.start_date, experience.end_date)}
                        </div>
                        {experience.is_current && (
                          <Badge className="bg-green-600/20 text-green-400 border-green-600/30 text-xs">
                            Current Position
                          </Badge>
                        )}
                      </div>
                    </div>

                    {experience.description && (
                      <div className="ml-8 lg:ml-8">
                        <p className="text-slate-300 leading-relaxed">
                          {experience.description}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Career Stats */}
          {displayExperiences.length > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displayExperiences.length}
                </div>
                <div className="text-purple-400 font-semibold">Companies</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {Math.round(displayExperiences.reduce((total, exp) => {
                    const start = new Date(exp.start_date);
                    const end = exp.end_date ? new Date(exp.end_date) : new Date();
                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
                    return total + months;
                  }, 0) / 12 * 10) / 10}+
                </div>
                <div className="text-blue-400 font-semibold">Years Experience</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displayExperiences.filter(exp => exp.is_current).length > 0 ? '✅' : '🔍'}
                </div>
                <div className="text-green-400 font-semibold">
                  {displayExperiences.filter(exp => exp.is_current).length > 0 ? 'Employed' : 'Available'}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}