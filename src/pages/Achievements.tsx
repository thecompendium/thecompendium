import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ExternalLink, Calendar, X } from 'lucide-react';

interface Achievement {
  name: string;
  rollNo: string;
  category: string;
  description: string;
  image: string;
  pdf: string;
}

const achievements: Achievement[] = [
  {
    name: "M.Mahathi",
    rollNo: "CSE(CS), 23951A62F0",
    category: "Story Writer",
    description: "A passionate storyteller who crafts compelling narratives that captivate readers. His unique writing style and creative storytelling have earned him recognition in various literary circles.",
    image: "/achievements/photos/M.Mahathi.jpg",
    pdf: "/achievements/pdfs/M-Mahathi-Stories.pdf"
  },
  {
    name: "M.Prashanth",
    rollNo: "CSE, 22951A05F9",
    category: "Painting",
    description: "A talented painter whose artwork vividly reflects emotions and stories, earning appreciation in exhibitions and inspiring creativity within the artistic community.",
    image: "/achievements/photos/M.Prashanth.jpg",
    pdf: "/achievements/pdfs/M-Prashanth-Art.pdf"
  },
  {
    name: "Chakri Shabad",
    rollNo: "CSE(DS), 22951A6724",
    category: "Poetry",
    description: "A gifted poet whose verses capture the essence of human emotions and experiences. His poetic works have earned recognition in literary competitions and have been featured in college publications, inspiring fellow writers with his creative expression.",
    image: "/achievements/photos/Chakri-Shabad.jpg",
    pdf: "/achievements/pdfs/Chakri-Shabad-poet.pdf"
  },
  {
    name: "Sai Kushal",
    rollNo: "ECE, 23951A04F2",
    category: "Doodle Art",
    description: "An exceptional artist known for his intricate doodle art that showcases creativity and attention to detail. His unique artistic style has garnered appreciation from fellow artists and art enthusiasts.",
    image: "/achievements/photos/Sai-Kushal.jpg",
    pdf: "/achievements/pdfs/Sai-Kushal-Art.pdf"
  },
  {
    name: "Charan Yelimela",
    rollNo: "CSIT, 22951A3313",
    category: "Story Writer",
    description: "A passionate storyteller who crafts compelling narratives that captivate readers. His unique writing style and creative storytelling have earned him recognition in various literary circles.",
    image: "/achievements/photos/Charan-Yelimela.JPG",
    pdf: "/achievements/pdfs/Charan-Yelimela-Stories.pdf"
  },
];

const Achievements = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isApplicationPeriod, setIsApplicationPeriod] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if current date is within application period
    const checkSubmissionPeriod = () => {
      // Allow submissions year-round (all months)
      setIsApplicationPeriod(true);
    };

    checkSubmissionPeriod();
  }, []);

  // Get the next allowed submission month (always available now)
  const getNextAllowedMonth = () => {
    return 'Now'; // Applications are always open
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add current date and time to form data
      const currentDate = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long',
        timeZone: 'Asia/Kolkata' // Indian timezone
      });
      
      // Add date to the form before submission
      const form = e.target as HTMLFormElement;
      const dateInput = document.createElement('input');
      dateInput.type = 'hidden';
      dateInput.name = 'Submission Date';
      dateInput.value = currentDate;
      form.appendChild(dateInput);
      
      form.submit();
      setIsFormOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-theme-blue">
      <Header />
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-theme-blue dark:bg-theme-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Student Talent & Achievements</h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Showcasing the creativity and accomplishments of our students, from art and writing to 
              innovations and milestones. A space to celebrate talent and inspire others!
            </p>
          </div>
        </section>
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-theme-blue">
          <div className="max-w-7xl mx-auto">
            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {achievements.map((achievement, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-[#020817] rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-800 transition hover:shadow-lg"
                >
                  <div className="flex p-6">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img 
                        src={achievement.image} 
                        alt={achievement.name} 
                        className="w-full h-full object-cover rounded-lg border border-gray-100 dark:border-gray-700"
                      />
                    </div>
                    <div className="ml-6 flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {achievement.name}
                        </h3>
                        <span className="text-theme-blue dark:text-yellow-400 text-sm">
                          {achievement.rollNo.split(', ')[1]}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {achievement.rollNo.split(', ')[0]}
                      </p>
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-theme-blue/10 dark:bg-yellow-400/10 text-theme-blue dark:text-yellow-400 rounded">
                          {achievement.category}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {achievement.description}
                      </p>
                      <a 
                        href={achievement.pdf}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-theme-blue hover:text-theme-blue/80 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium"
                      >
                        View Achievement <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Share Your Achievement CTA */}
            <div className="text-center mt-20">
              <h2 className="text-3xl md:text-4xl font-bold text-theme-blue dark:text-white mb-4">
                Share Your Achievement
              </h2>
              <p className="text-gray-700 dark:text-white/80 max-w-2xl mx-auto mb-8">
                Have a talent, accomplishment, or creative work to showcase? Submit your achievement and get featured on our page alongside other talented students.
              </p>
              <div className="mt-8">
                {isApplicationPeriod ? (
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center px-6 py-3 bg-theme-yellow text-theme-blue font-bold rounded-md hover:bg-theme-yellow/90 transition-colors"
                  >
                    Submit Achievement
                  </button>
                ) : (
                  <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-gray-300/20 text-gray-600 dark:text-white font-medium rounded-md gap-2 border border-gray-200 dark:border-white/20">
                    <Calendar className="h-4 w-4" />
                    <span>Submissions open in {getNextAllowedMonth()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

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
              <h3 className="text-xl font-bold text-theme-blue dark:text-white mb-4 sticky top-0 bg-white dark:bg-theme-blue pt-2">Submit Your Achievement</h3>
              
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
                    <option value="" className="text-theme-blue dark:text-white">Select your year</option>
                    <option value="1st Year" className="text-theme-blue dark:text-white">1st Year</option>
                    <option value="2nd Year" className="text-theme-blue dark:text-white">2nd Year</option>
                    <option value="3rd Year" className="text-theme-blue dark:text-white">3rd Year</option>
                    <option value="4th Year" className="text-theme-blue dark:text-white">4th Year</option>
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
                  <label htmlFor="achievement_description" className="block text-sm text-theme-blue dark:text-white mb-1">Achievement Description</label>
                  <textarea
                    id="achievement_description"
                    name="achievement_description"
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#021496] border border-gray-200 dark:border-white/30 rounded-md focus:outline-none focus:border-theme-blue dark:focus:border-white text-theme-blue dark:text-white text-sm"
                    placeholder="Describe your achievement, the process, and what makes it special"
                  ></textarea>
                </div>

                {/* Hidden FormSubmit.co fields */}
                <input type="hidden" name="_subject" value="New Achievement Submission!" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_next" value="https://thecompendiumclub.com/achievements" />
                <input type="hidden" name="_captcha" value="true" />

                <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-theme-blue pb-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-theme-yellow text-theme-blue font-medium rounded-md hover:bg-theme-yellow/90 transition-colors text-sm"
                  >
                    Submit Achievement
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
          Thank you for submitting your achievement! We will review it and feature it on our page soon.
        </div>
      )}
    </div>
  );
};

export default Achievements;
export { achievements };
