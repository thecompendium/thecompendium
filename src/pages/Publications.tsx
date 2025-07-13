import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openPdfViewer, isLocalPath, getPublicPdfPath } from '@/utils/pdfUtils';

const Publications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dateDesc'); // Default sort: newest first
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // All publications data
  const publications = [
    // Articles
    {
      title: "Say Goodbye to GenAI and Hello to Agentic AI",
      description: "Say goodbye to traditional GenAI—Agentic AI ushers in a new era of autonomous, goal-driven intelligence.",
      image: "https://i.pinimg.com/736x/f6/00/79/f60079de2a667c0f57bdeee434046521.jpg",
      pdfUrl: "/public/pdfs/articles/Say-Goodbye-to-GenAI-and-Hello-to-Agentic-AI.pdf",
      category: "Articles",
      date: "2025-05-01"
    },
    {
      title: "Will AI Take Over the Jobs of Aeronautical Engineers?",
      description: "Exploring whether AI will augment or replace the roles of aeronautical engineers in the evolving aerospace industry.",
      image: "https://i.pinimg.com/736x/90/c2/67/90c267d32535119b049c1af29e227fe6.jpg",
      pdfUrl: "/public/pdfs/articles/ai-aeronautical-engineers.pdf",
      category: "Articles",
      date: "2025-04-30"
    },
    {
      title: "Claude AI",
      description: "A comprehensive exploration of Claude's capabilities and its impact on artificial intelligence development.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      pdfUrl: "/public/pdfs/articles/claude-ai.pdf",
      category: "Articles",
      date: "2024-03-25" // Updated date to be more recent
    },
    {
      title: "DeepSeek AI",
      description: "An in-depth analysis of how artificial intelligence is transforming learning environments and educational methodologies.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop",
      pdfUrl: "/public/pdfs/articles/deepseek-ai.pdf",
      category: "Articles",
      date: "2024-03-15"
    },
    // College News
    {
      title: "News Edition 12",
      description: "Latest updates on campus activities, achievements, and upcoming events in our newest edition.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_12.pdf",
      category: "College News",
      date: "2024-04-15"
    },
    {
      title: "News Edition 11",
      description: "Recent developments, student achievements, and campus initiatives in this comprehensive edition.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_11.pdf",
      category: "College News",
      date: "2024-04-01"
    },
    {
      title: "News Edition 10",
      description: "Covering international collaborations, faculty achievements, and upcoming initiatives.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_10.pdf",
      category: "College News",
      date: "2024-03-15"
    },
    {
      title: "News Edition 9",
      description: "Highlighting research breakthroughs, campus developments, and student success stories.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_9.pdf",
      category: "College News",
      date: "2024-01-20"
    },
    {
      title: "News Edition 8",
      description: "Showcasing student achievements, cultural events, and academic milestones.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_8.pdf",
      category: "College News",
      date: "2023-08-15" // Added date
    },
    {
      title: "News Edition 7",
      description: "Latest updates on research projects, student innovations, and departmental achievements.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_7.pdf",
      category: "College News",
      date: "2023-07-10" // Added date
    },
    {
      title: "News Edition 6",
      description: "Comprehensive coverage of academic year highlights and achievements.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_6.pdf",
      category: "College News",
      date: "2023-06-22" // Added date
    },
    {
      title: "News Edition 5",
      description: "Special focus on innovation, entrepreneurship, and student initiatives.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_5.pdf",
      category: "College News",
      date: "2023-05-18" // Added date
    },
    {
      title: "News Edition 4",
      description: "Coverage of major events, sports achievements, and cultural celebrations on campus.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_4.pdf",
      category: "College News",
      date: "2023-04-05" // Added date
    },
    {
      title: "News Edition 3",
      description: "Featuring student success stories, faculty achievements, and community engagement.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_3.pdf",
      category: "College News",
      date: "2023-03-20" // Added date
    },
    {
      title: "News Edition 2",
      description: "Highlighting academic excellence, research breakthroughs, and campus initiatives.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_2.pdf",
      category: "College News",
      date: "2023-02-10" // Added date
    },
    {
      title: "News Edition 1",
      description: "Latest campus updates, student achievements, and upcoming events in our first news edition.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_1.pdf",
      category: "College News",
      date: "2023-01-15" // Added date
    },

    // Annual Magazine
    {
      title: "Annual Magazine 2022-2023",
      description: "Our comprehensive annual publication showcasing student achievements, research articles, creative works, and key events of the academic year 2022-2023.",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/annualmagazine/Annual Magazine_2022-2023.pdf",
      category: "Annual Magazine",
      date: "2023-06-30"
    },
    {
      title: "Annual Magazine 2023-2024",
      description: "The latest edition of our annual magazine highlighting exceptional student projects, faculty research, cultural events, and academic milestones from 2023-2024.",
      image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/annualmagazine/Annual Magazine_2023-2024.pdf",
      category: "Annual Magazine",
      date: "2024-01-30"
    },
  ];

  // Add category counts for display
  const categoryCounts = {
    'All': publications.length,
    'Articles': publications.filter(pub => pub.category === 'Articles').length,
    'Annual Magazine': publications.filter(pub => pub.category === 'Annual Magazine').length,
    'College News': publications.filter(pub => pub.category === 'College News').length,
  };

  // Filter publications based on search query and selected category
  const filteredPublications = publications.filter(pub => 
    (selectedCategory === 'All' || pub.category === selectedCategory) &&
    (pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pub.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort the filtered publications
  const sortedPublications = [...filteredPublications].sort((a, b) => {
    switch(sortBy) {
      case 'dateAsc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'dateDesc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Get unique categories for the footer
  const categories = ['All', ...new Set(publications.map(pub => pub.category))];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-theme-blue to-theme-blue/90 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Publications</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Explore our diverse range of student-led articles, annual magazines, college news, and creative writing.
            </p>
          </div>
        </section>

        {/* Search and Category Section */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative max-w-xl w-full">
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-blue focus:border-transparent text-sm shadow-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <span className="sr-only">Clear search</span>
                    ×
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-theme-blue text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-80">({categoryCounts[category]})</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort options */}
            <div className="flex justify-end mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme-blue focus:border-transparent text-sm shadow-sm"
              >
                <option value="dateDesc">Newest First</option>
                <option value="dateAsc">Oldest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {selectedCategory !== 'All' && (
              <h2 className="text-2xl font-bold mb-6 text-theme-blue dark:text-white">{selectedCategory}</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPublications
                .map((pub, index) => (
                  <PublicationCard
                    key={index}
                    title={pub.title}
                    description={pub.description}
                    image={pub.image}
                    pdfUrl={pub.pdfUrl}
                    category={pub.category}
                    date={pub.date}
                  />
                ))}
            </div>
            {sortedPublications.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No publications found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Publication Card Component
export const PublicationCard = ({ title, description, image, pdfUrl, category, date }) => {
  const navigate = useNavigate();
  
  const handleViewPublication = () => {
    if (isLocalPath(pdfUrl)) {
      // Use our custom PDF viewer with the filename
      const fileName = pdfUrl.split('/').pop() || 'document';
      openPdfViewer(navigate, pdfUrl, fileName);
    } else {
      navigate(`/view-pdf/${encodeURIComponent(pdfUrl)}`);
    }
  };

  // Get category-specific button text
  const getButtonText = () => {
    switch(category) {
      case 'Annual Magazine':
        return 'View magazine';
      case 'College News':
        return 'Read news';
      case 'Articles':
        return 'Read article';
      default:
        return 'View publication';
    }
  };

  // Format the date for display (if needed)
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Special styling for Annual Magazine cards
  const isAnnualMagazine = category === 'Annual Magazine';

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border ${
      isAnnualMagazine 
        ? 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-400/30 dark:ring-yellow-500/30' 
        : 'border-gray-200 dark:border-gray-800'
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`inline-block py-1 px-3 text-xs font-medium rounded-full ${
            isAnnualMagazine 
              ? 'bg-yellow-500 text-white'
              : 'bg-theme-blue text-white'
          }`}>
            {category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${
          isAnnualMagazine ? 'text-yellow-600 dark:text-yellow-400' : 'text-theme-blue dark:text-white'
        }`}>{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <button
          onClick={handleViewPublication}
          className={`mt-4 flex items-center font-medium ${
            isAnnualMagazine
              ? 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300'
              : 'text-theme-blue hover:text-theme-blue/80 dark:text-white dark:hover:text-white/80'
          }`}
        >
          {getButtonText()}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Publications;
