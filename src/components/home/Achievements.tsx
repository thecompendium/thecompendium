import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { openPdfViewer } from '@/utils/pdfUtils';

// Real achievements data
const achievements = [
  {
    name: "M.Prashanth",
    rollNo: "CSE, 22951A05F9",
    category: "Painting",
    description: "A passionate painter who brings emotions to life on canvas, their vibrant brushstrokes and distinctive style have garnered admiration in artistic communities.",
    image: "/achievements/photos/M.Prashanth.jpg",
    pdf: "/achievements/pdfs/M-Prashanth-Art.pdf"
  },
  {
    name: "M.Mahathi",
    rollNo: "CSE, 23951A62F0",
    category: "Story Writer",
    description: "A passionate storyteller who crafts compelling narratives that captivate readers. Their unique writing style and creative storytelling have earned them recognition in various literary circles.",
    image: "/achievements/photos/M.Mahathi.jpg",
    pdf: "/achievements/pdfs/M-Mahathi-Stories.pdf"
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
  }
];

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-yellow-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-medium bg-secondary rounded-full text-secondary-foreground">
            Celebrating Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Talent & Achievements</h2>
          <p className="text-muted-foreground max-w-2xl">
            Showcasing the creativity and accomplishments of our students, from art and writing to innovations and milestones. A space to celebrate talent and inspire others!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-[#020B5E] rounded-lg overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex p-6">
                <div className="w-32 h-32 flex-shrink-0">
                  <img 
                    src={achievement.image} 
                    alt={achievement.name}
                    className="w-full h-full object-cover rounded-lg border border-gray-100 dark:border-gray-800"
                    onError={(e) => {
                      e.currentTarget.src = '/achievements/photos/default-avatar.jpg';
                    }}
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
                  <button 
                    onClick={() => openPdfViewer(navigate, achievement.pdf)}
                    className="inline-flex items-center text-theme-blue hover:text-theme-blue/80 dark:text-yellow-400 dark:hover:text-yellow-300 text-sm font-medium transition-colors cursor-pointer"
                  >
                    View Achievement <ExternalLink className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/achievements"
            className="inline-flex items-center justify-center px-6 py-3 bg-theme-blue text-white dark:bg-yellow-400 dark:text-theme-blue rounded-md hover:bg-theme-blue/90 dark:hover:bg-yellow-400/90 transition-colors text-sm font-medium"
          >
            View All Achievements
            <Award className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Achievements;