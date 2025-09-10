import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Skill } from '../../../server/src/schema';

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Fallback skills data for demonstration
  const fallbackSkills: Skill[] = [
    { id: 1, name: 'React', category: 'Frontend', proficiency_level: 9, is_featured: true, created_at: new Date() },
    { id: 2, name: 'TypeScript', category: 'Programming', proficiency_level: 8, is_featured: true, created_at: new Date() },
    { id: 3, name: 'Node.js', category: 'Backend', proficiency_level: 8, is_featured: true, created_at: new Date() },
    { id: 4, name: 'PostgreSQL', category: 'Database', proficiency_level: 7, is_featured: false, created_at: new Date() },
    { id: 5, name: 'Python', category: 'Programming', proficiency_level: 7, is_featured: false, created_at: new Date() },
    { id: 6, name: 'Vue.js', category: 'Frontend', proficiency_level: 6, is_featured: false, created_at: new Date() },
    { id: 7, name: 'Docker', category: 'DevOps', proficiency_level: 6, is_featured: false, created_at: new Date() },
    { id: 8, name: 'AWS', category: 'Cloud', proficiency_level: 6, is_featured: false, created_at: new Date() },
    { id: 9, name: 'MongoDB', category: 'Database', proficiency_level: 7, is_featured: false, created_at: new Date() },
    { id: 10, name: 'GraphQL', category: 'Backend', proficiency_level: 6, is_featured: false, created_at: new Date() },
    { id: 11, name: 'Tailwind CSS', category: 'Frontend', proficiency_level: 8, is_featured: false, created_at: new Date() },
    { id: 12, name: 'Jest', category: 'Testing', proficiency_level: 7, is_featured: false, created_at: new Date() },
    { id: 13, name: 'Git', category: 'Tools', proficiency_level: 8, is_featured: false, created_at: new Date() },
    { id: 14, name: 'Figma', category: 'Design', proficiency_level: 6, is_featured: false, created_at: new Date() },
  ];

  const displaySkills = skills.length > 0 ? skills : fallbackSkills;
  
  // Get unique categories
  const categories = ['all', ...new Set(displaySkills.map(skill => skill.category))];
  
  // Filter skills based on selected category
  const filteredSkills = selectedCategory === 'all' 
    ? displaySkills 
    : displaySkills.filter(skill => skill.category === selectedCategory);

  // Group skills by category for better visualization
  const skillsByCategory = displaySkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  // Sort skills within each category by proficiency level
  Object.keys(skillsByCategory).forEach(category => {
    skillsByCategory[category].sort((a, b) => b.proficiency_level - a.proficiency_level);
  });

  const getProficiencyLabel = (level: number) => {
    if (level >= 9) return 'Expert';
    if (level >= 7) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    if (level >= 3) return 'Basic';
    return 'Beginner';
  };

  const getProficiencyColor = (level: number) => {
    if (level >= 9) return 'from-green-500 to-emerald-500';
    if (level >= 7) return 'from-blue-500 to-cyan-500';
    if (level >= 5) return 'from-purple-500 to-pink-500';
    if (level >= 3) return 'from-yellow-500 to-orange-500';
    return 'from-gray-500 to-slate-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Database': '🗃️',
      'Programming': '💻',
      'DevOps': '🚀',
      'Cloud': '☁️',
      'Testing': '🧪',
      'Design': '✨',
      'Tools': '🔧',
      'Mobile': '📱'
    };
    return icons[category] || '💡';
  };

  return (
    <section id="skills" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Technical <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            The tools and technologies I use to bring ideas to life
          </p>
        </div>

        {displaySkills.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Skills Added Yet</h3>
            <p className="text-slate-400 text-lg">
              Technical skills will be displayed here once added to the portfolio.
            </p>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {category === 'all' ? '🌟 All Skills' : `${getCategoryIcon(category)} ${category}`}
                </Button>
              ))}
            </div>

            {/* Skills Grid */}
            {selectedCategory === 'all' ? (
              // Show all skills grouped by category
              <div className="space-y-12">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">
                      {getCategoryIcon(category)} {category}
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill) => (
                        <Card 
                          key={skill.id} 
                          className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/30 group"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                  {skill.name}
                                </h4>
                                <p className="text-sm text-slate-400">{getProficiencyLabel(skill.proficiency_level)}</p>
                              </div>
                              {skill.is_featured && (
                                <Badge className="bg-purple-600/20 text-purple-300 text-xs">⭐</Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Proficiency</span>
                                <span className="text-white font-medium">{skill.proficiency_level}/10</span>
                              </div>
                              <div className="relative">
                                <Progress 
                                  value={skill.proficiency_level * 10} 
                                  className="h-2 bg-slate-700"
                                />
                                <div 
                                  className={`absolute inset-0 h-2 bg-gradient-to-r ${getProficiencyColor(skill.proficiency_level)} rounded-full transition-all duration-500`}
                                  style={{ width: `${skill.proficiency_level * 10}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Show filtered skills
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                  <Card 
                    key={skill.id} 
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/30 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-slate-400">{getProficiencyLabel(skill.proficiency_level)}</p>
                        </div>
                        {skill.is_featured && (
                          <Badge className="bg-purple-600/20 text-purple-300 text-xs">⭐</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Proficiency</span>
                          <span className="text-white font-medium">{skill.proficiency_level}/10</span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={skill.proficiency_level * 10} 
                            className="h-2 bg-slate-700"
                          />
                          <div 
                            className={`absolute inset-0 h-2 bg-gradient-to-r ${getProficiencyColor(skill.proficiency_level)} rounded-full transition-all duration-500`}
                            style={{ width: `${skill.proficiency_level * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Skills Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displaySkills.length}
                </div>
                <div className="text-purple-400 font-semibold">Total Skills</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displaySkills.filter(s => s.proficiency_level >= 8).length}
                </div>
                <div className="text-green-400 font-semibold">Expert Level</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {Object.keys(skillsByCategory).length}
                </div>
                <div className="text-blue-400 font-semibold">Categories</div>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-yellow-500/30 p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {displaySkills.filter(s => s.is_featured).length}
                </div>
                <div className="text-yellow-400 font-semibold">Featured</div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}