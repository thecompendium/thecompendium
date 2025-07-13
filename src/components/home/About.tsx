import React, { useState } from 'react';
import { Users, Pen, Award, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isApplicationPeriod, getApplicationMessage } from '@/utils/applicationPeriod';

const About = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Feature cards data
  const features = [
    {
      icon: <Pen className="w-8 h-8 text-theme-blue dark:text-theme-yellow" />,
      title: "Student Publications",
      description: "A platform for students to publish their articles, creative writing, short story and more."
    },
    {
      icon: <Award className="w-8 h-8 text-theme-blue dark:text-theme-yellow" />,
      title: "Achievements Showcase",
      description: "Highlighting the accomplishments of our students across academic and creative disciplines."
    },
    {
      icon: <Calendar className="w-8 h-8 text-theme-blue dark:text-theme-yellow" />,
      title: "Events & Workshops",
      description: "Regular events to enhance writing skills, learn about publishing, and network with professionals."
    },
    {
      icon: <Users className="w-8 h-8 text-theme-blue dark:text-theme-yellow" />,
      title: "Diverse Community",
      description: "A supportive network of student writers, editors, designers, and faculty mentors."
    }
  ];

  return (
    <section className="py-20 bg-yellow-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-medium bg-secondary rounded-full text-secondary-foreground">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About The Compendium</h2>
          <p className="text-muted-foreground text-lg">
            We are a student-led News publication society dedicated to cultivating writing talent, promoting student talent and achievements, and providing a platform for diverse voices across the campus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover-lift bg-white dark:bg-theme-blue"
            >
              <div className="mb-5">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl font-medium mb-3 text-theme-blue dark:text-theme-yellow">
                {feature.title}
              </h3>
              <p className="text-muted-foreground dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white dark:bg-gray-950 rounded-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h3 className="font-serif text-2xl md:text-3xl font-medium mb-6">Join Our Team</h3>
            <p className="text-muted-foreground mb-6">
              Interested in writing, editing, design, or photography? Become part of our publication team and gain valuable skills while showcasing your work.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Develop professional writing and editing skills",
                "Build your portfolio with the help of the club",
                "Connect with like-minded creative individuals",
                "Participate in workshops and special events"
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 w-5 h-5 mr-3 mt-0.5 text-green-600 dark:text-green-400 text-xs">✓</span>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => isApplicationPeriod() && setIsFormOpen(true)}
              className={`inline-flex items-center justify-center px-6 py-3 rounded-md transition-colors font-medium text-sm self-start ${
                isApplicationPeriod()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-500 text-white cursor-not-allowed'
              }`}
              disabled={!isApplicationPeriod()}
            >
              Apply to Join
            </button>
            <p className={`mt-3 text-sm ${isApplicationPeriod() ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              {getApplicationMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-theme-blue rounded-lg w-full max-w-xl relative my-8">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute right-3 top-3 text-theme-blue dark:text-white/70 hover:text-theme-blue/70 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-theme-blue dark:text-white mb-4 sticky top-0 bg-white dark:bg-theme-blue pt-2">Join Our Team</h3>
              
              <form 
                action="https://formsubmit.co/thecompendiumiare@gmail.com" 
                method="POST" 
                className="space-y-4"
                onSubmit={handleFormSubmit}
              >
                <div>
                  <label htmlFor="name" className="block text-sm text-theme-blue dark:text-white mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm text-theme-blue dark:text-white mb-1">Year</label>
                  <select
                    id="year"
                    name="year"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                  >
                    <option value="">Select your year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm text-theme-blue dark:text-white mb-1">Branch</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your branch/department"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-theme-blue dark:text-white mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-theme-blue dark:text-white mb-1">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="domain" className="block text-sm text-theme-blue dark:text-white mb-1">Domain</label>
                  <select
                    id="domain"
                    name="domain"
                    required
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                  >
                    <option value="">Select your domain</option>
                    <option value="Designer">Designer</option>
                    <option value="Reporter">Reporter</option>
                    <option value="Writer">Writer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Photographer">Photographer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm text-theme-blue dark:text-white mb-1">Experience</label>
                  <textarea
                    id="experience"
                    name="experience"
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Tell us about your relevant experience"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="source" className="block text-sm text-theme-blue dark:text-white mb-1">How did you hear about us?</label>
                  <textarea
                    id="source"
                    name="source"
                    required
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Let us know how you found out about the club"
                  ></textarea>
                </div>

                {/* Hidden fields for FormSubmit */}
                <input type="hidden" name="_subject" value="New Team Application" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="http://localhost:8080/about" />

                <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-theme-blue pb-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-theme-yellow text-theme-blue font-medium rounded-md hover:bg-theme-yellow/90 transition-colors text-sm"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-gray-200 dark:border-white/30 text-theme-blue dark:text-white font-medium rounded-md hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Popup */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Thank you for your application! We will review it and get back to you soon.
        </div>
      )}
    </section>
  );
};

export default About;
