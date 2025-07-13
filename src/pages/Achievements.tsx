import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ExternalLink } from 'lucide-react';

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
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

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
            {/* Share Your Achievement Section */}
            <div className="text-center mt-20">
              <h2 className="text-3xl md:text-4xl font-bold text-theme-blue dark:text-white mb-4">
                Share Your Talent & Achievements
              </h2>
              <p className="text-gray-700 dark:text-white/80 max-w-2xl mx-auto mb-8">
                Are you a student with a talent or accomplishment to share? We want to celebrate your success and feature your story.
              </p>
              <button 
                className="px-6 py-3 bg-yellow-400 text-theme-blue font-semibold rounded-md hover:bg-yellow-300 transition-colors shadow"
                onClick={() => setShowForm(true)}
              >
                Submit Your Achievement
              </button>
            </div>
            {/* Modal Form */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white dark:bg-theme-blue rounded-lg p-8 w-full max-w-lg shadow-2xl relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-2xl font-bold"
                    onClick={() => { setShowForm(false); setFormSubmitted(false); }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h3 className="text-2xl font-bold mb-4 text-theme-blue dark:text-yellow-400 text-center">Submit Your Talent or Achievement</h3>
                  {formSubmitted ? (
                    <div className="text-center text-lg text-green-600 dark:text-green-400 font-semibold py-8">
                      Thank you for your submission! We will reach you soon.
                    </div>
                  ) : (
                    <form 
                      action="https://formsubmit.co/thecompendiumiare@gmail.com"
                      method="POST"
                      className="space-y-6"
                      onSubmit={() => setFormSubmitted(true)}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Name</label>
                        <input name="name" type="text" className="w-full px-4 py-2 rounded border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-blue-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-blue dark:focus:ring-yellow-400" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Roll No</label>
                        <input name="rollNo" type="text" className="w-full px-4 py-2 rounded border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-blue-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-blue dark:focus:ring-yellow-400" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Phone Number</label>
                        <input name="phone" type="tel" pattern="[0-9]{10}" className="w-full px-4 py-2 rounded border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-blue-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-blue dark:focus:ring-yellow-400" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Achievement or Talent</label>
                        <input name="achievement_or_talent" type="text" className="w-full px-4 py-2 rounded border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-blue-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-blue dark:focus:ring-yellow-400" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Description</label>
                        <textarea name="description" className="w-full px-4 py-2 rounded border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-blue-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-blue dark:focus:ring-yellow-400 resize-none" rows={4} required></textarea>
                      </div>
                      <button type="submit" className="w-full px-6 py-3 bg-yellow-400 text-theme-blue font-semibold rounded-md hover:bg-yellow-300 transition-colors">Submit</button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Achievements;
export { achievements };
