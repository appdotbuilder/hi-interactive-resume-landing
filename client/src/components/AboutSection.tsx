import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ContactInfo } from '../../../server/src/schema';

interface AboutSectionProps {
  contactInfo: ContactInfo | null;
}

export function AboutSection({ contactInfo }: AboutSectionProps) {
  // Fallback info for demonstration
  const fallbackInfo = {
    name: 'John Developer',
    title: 'Full Stack Developer & UI/UX Designer',
    location: 'San Francisco, CA',
    email: 'john@example.com',
    bio: "I'm a passionate full-stack developer with over 5 years of experience creating modern web applications. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you can find me exploring new technologies, contributing to open source projects, or enjoying the great outdoors."
  };

  const displayInfo = {
    name: contactInfo?.name || fallbackInfo.name,
    title: contactInfo?.title || fallbackInfo.title,
    location: contactInfo?.location || fallbackInfo.location,
    email: contactInfo?.email || fallbackInfo.email,
    bio: contactInfo?.bio || fallbackInfo.bio
  };

  const highlights = [
    { icon: '🎯', title: 'Problem Solver', description: 'I enjoy tackling complex challenges and finding elegant solutions' },
    { icon: '🚀', title: 'Innovation Focused', description: 'Always learning and implementing the latest technologies' },
    { icon: '🤝', title: 'Collaborative', description: 'Strong believer in teamwork and knowledge sharing' },
    { icon: '💡', title: 'Creative Thinker', description: 'Combining technical skills with creative problem-solving' }
  ];

  return (
    <section id="about" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            About <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Let me introduce myself and share my journey in the world of development
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Bio and Info */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 p-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{displayInfo.name}</h3>
                  <p className="text-lg text-purple-400 mb-4">{displayInfo.title}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                    {displayInfo.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{displayInfo.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <a 
                        href={`mailto:${displayInfo.email}`} 
                        className="hover:text-purple-400 transition-colors"
                      >
                        {displayInfo.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 leading-relaxed text-base">
                    {displayInfo.bio}
                  </p>
                </div>

                <div className="pt-4">
                  <div className="text-sm text-slate-500 mb-3">AVAILABILITY</div>
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                    🟢 Available for new opportunities
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Additional Info Cards */}
            <div className="space-y-4">
              <Card className="bg-slate-800/30 border-slate-700 p-6">
                <h4 className="text-lg font-semibold text-white mb-3">🎓 Philosophy</h4>
                <p className="text-slate-400 text-sm">
                  I believe in writing clean, maintainable code and creating user experiences that delight and inspire. 
                  Continuous learning and adaptation are key to staying ahead in this ever-evolving field.
                </p>
              </Card>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-8">What Drives Me</h3>
            
            <div className="grid gap-6">
              {highlights.map((highlight, index) => (
                <Card 
                  key={index} 
                  className="bg-slate-800/50 border-slate-700 p-6 hover:bg-slate-800/70 transition-all duration-300 hover:border-purple-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{highlight.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{highlight.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Fun Facts */}
            <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 p-6">
              <h4 className="text-lg font-semibold text-white mb-4">⚡ Quick Facts</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-purple-400 font-semibold">☕ Coffee Consumed</div>
                  <div className="text-slate-300">∞ cups</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold">🌍 Time Zone</div>
                  <div className="text-slate-300">PST/PDT</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold">🎵 Coding Music</div>
                  <div className="text-slate-300">Lo-Fi Hip Hop</div>
                </div>
                <div>
                  <div className="text-purple-400 font-semibold">🌟 Motto</div>
                  <div className="text-slate-300">Code with purpose</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}