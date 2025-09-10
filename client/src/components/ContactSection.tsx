import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/utils/trpc';
import type { ContactInfo, CreateContactSubmissionInput } from '../../../server/src/schema';

interface ContactSectionProps {
  contactInfo: ContactInfo | null;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const [formData, setFormData] = useState<CreateContactSubmissionInput>({
    name: '',
    email: '',
    subject: null,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await trpc.createContactSubmission.mutate(formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: null,
        message: ''
      });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      label: 'Email',
      value: contactInfo?.email || 'hello@example.com',
      href: `mailto:${contactInfo?.email || 'hello@example.com'}`,
      description: 'Send me a direct email'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: contactInfo?.phone || '+1 (555) 123-4567',
      href: `tel:${contactInfo?.phone || '+15551234567'}`,
      description: 'Give me a call'
    },
    {
      icon: '📍',
      label: 'Location',
      value: contactInfo?.location || 'San Francisco, CA',
      href: null,
      description: 'Based in'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Connect with me',
      href: contactInfo?.linkedin || '#',
      description: 'Professional network'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Get In <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Ready to work together? Let's discuss your next project or just say hello!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Let's Connect! 🚀</h3>
              <p className="text-slate-300 leading-relaxed mb-8">
                I'm always excited to discuss new opportunities, interesting projects, or just chat about technology. 
                Whether you have a specific project in mind or want to explore possibilities, don't hesitate to reach out!
              </p>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-400 mb-1">{method.description}</div>
                      {method.href ? (
                        <a
                          href={method.href}
                          className="text-white hover:text-purple-400 transition-colors font-medium"
                          target={method.href.startsWith('http') ? '_blank' : undefined}
                          rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {method.value}
                        </a>
                      ) : (
                        <span className="text-white font-medium">{method.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Availability Status */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-semibold text-white">Currently Available</h4>
              </div>
              <p className="text-slate-400 text-sm">
                I'm actively looking for new opportunities and exciting projects. 
                Expected response time: within 24 hours.
              </p>
            </Card>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {contactInfo?.linkedin && (
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110"
                >
                  💼
                </a>
              )}
              {contactInfo?.github && (
                <a
                  href={contactInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110"
                >
                  🔗
                </a>
              )}
              {contactInfo?.website && (
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-purple-600 text-white p-3 rounded-lg transition-all duration-300 hover:scale-110"
                >
                  🌐
                </a>
              )}
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-slate-800/50 border-slate-700 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Send Message ✉️</h3>
            
            {submitStatus === 'success' && (
              <div className="bg-green-600/20 border border-green-600/30 text-green-400 p-4 rounded-lg mb-6">
                🎉 Thanks for reaching out! I'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-600/20 border border-red-600/30 text-red-400 p-4 rounded-lg mb-6">
                ❌ Something went wrong. Please try again or send me an email directly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: CreateContactSubmissionInput) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: CreateContactSubmissionInput) => ({ ...prev, email: e.target.value }))
                    }
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev: CreateContactSubmissionInput) => ({
                      ...prev,
                      subject: e.target.value || null
                    }))
                  }
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
                  placeholder="Project discussion, Job opportunity, etc."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData((prev: CreateContactSubmissionInput) => ({ ...prev, message: e.target.value }))
                  }
                  required
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500 resize-none"
                  placeholder="Tell me about your project, ideas, or just say hello..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message 🚀'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              <p>Or email me directly at{' '}
                <a 
                  href={`mailto:${contactInfo?.email || 'hello@example.com'}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {contactInfo?.email || 'hello@example.com'}
                </a>
              </p>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Something Amazing? 🌟</h3>
            <p className="text-slate-300 mb-6 text-lg">
              Let's turn your ideas into reality. I'm here to help you build something incredible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => {
                  const element = document.getElementById('projects');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                View My Work
              </Button>
              <Button
                onClick={() => window.open(`mailto:${contactInfo?.email || 'hello@example.com'}`, '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Email Me Directly
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}