import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PublicationCard } from '@/pages/Publications';

// Publication data organized by category
export const publicationsByCategory = {
  articles: [
    {
      id: 1,
      title: "Say Goodbye to GenAI and Hello to Agentic AI",
      description: "Say goodbye to traditional GenAI—Agentic AI ushers in a new era of autonomous, goal-driven intelligence.",
      image: "https://i.pinimg.com/736x/f6/00/79/f60079de2a667c0f57bdeee434046521.jpg",
      pdfUrl: "/public/pdfs/articles/Say-Goodbye-to-GenAI-and-Hello-to-Agentic-AI.pdf",
      date: "2025-05-01"
    },
    {
      id: 2,
      title: "Will AI Take Over the Jobs of Aeronautical Engineers?",
      description: "Exploring whether AI will augment or replace the roles of aeronautical engineers in the evolving aerospace industry.",
      image: "https://i.pinimg.com/736x/90/c2/67/90c267d32535119b049c1af29e227fe6.jpg",
      pdfUrl: "/public/pdfs/articles/ai-aeronautical-engineers.pdf",
      date: "2025-04-30"
    },
    {
      id: 3,
      title: "Claude AI",
      description: "A comprehensive exploration of Claude's capabilities and its impact on artificial intelligence development.",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      pdfUrl: "/public/pdfs/articles/claude-ai.pdf",
      date: "2024-03-25"
    },
    {
      id: 4,
      title: "DeepSeek AI",
      description: "An in-depth analysis of how artificial intelligence is transforming learning environments and educational methodologies.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1932&auto=format&fit=crop",
      pdfUrl: "/public/pdfs/articles/deepseek-ai.pdf",
      date: "2024-03-15"
    }
  ],
  "college-news": [
    {
      id: 1,
      title: "News Edition 12",
      description: "Latest updates on campus activities, achievements, and upcoming events in our newest edition.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_12.pdf",
      date: "2024-04-15"
    },
    {
      id: 2,
      title: "News Edition 11",
      description: "Recent developments, student achievements, and campus initiatives in this comprehensive edition.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_11.pdf",
      date: "2024-04-01"
    },
    {
      id: 3,
      title: "News Edition 10",
      description: "Covering international collaborations, faculty achievements, and upcoming initiatives.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_10.pdf",
      date: "2024-03-15"
    },
    {
      id: 4,
      title: "News Edition 9",
      description: "Highlighting research breakthroughs, campus developments, and student success stories.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_9.pdf",
      date: "2024-01-20"
    },
    {
      id: 5,
      title: "News Edition 8",
      description: "Showcasing student achievements, cultural events, and academic milestones.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_8.pdf",
      date: "2023-08-15"
    },
    {
      id: 6,
      title: "News Edition 7",
      description: "Latest updates on research projects, student innovations, and departmental achievements.",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_7.pdf",
      date: "2023-07-10"
    },
    {
      id: 7,
      title: "News Edition 6",
      description: "Comprehensive coverage of academic year highlights and achievements.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_6.pdf",
      date: "2023-06-22"
    },
    {
      id: 8,
      title: "News Edition 5",
      description: "Special focus on innovation, entrepreneurship, and student initiatives.",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_5.pdf",
      date: "2023-05-18"
    },
    {
      id: 9,
      title: "News Edition 4",
      description: "Coverage of major events, sports achievements, and cultural celebrations on campus.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_4.pdf",
      date: "2023-04-05"
    },
    {
      id: 10,
      title: "News Edition 3",
      description: "Featuring student success stories, faculty achievements, and community engagement.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_3.pdf",
      date: "2023-03-20"
    },
    {
      id: 11,
      title: "News Edition 2",
      description: "Highlighting academic excellence, research breakthroughs, and campus initiatives.",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_2.pdf",
      date: "2023-02-10"
    },
    {
      id: 12,
      title: "News Edition 1",
      description: "Latest campus updates, student achievements, and upcoming events in our first news edition.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/collegenews/news_edition_1.pdf",
      date: "2023-01-15"
    }
  ],
  "annual-magazine": [
    {
      id: 1,
      title: "Annual Magazine 2022-2023",
      description: "Our comprehensive annual publication showcasing student achievements, research articles, creative works, and key events of the academic year 2022-2023.",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/annualmagazine/Annual Magazine_2022-2023.pdf",
      date: "2023-06-30"
    },
    {
      id: 2,
      title: "Annual Magazine 2023-2024",
      description: "The latest edition of our annual magazine highlighting exceptional student projects, faculty research, cultural events, and academic milestones from 2023-2024.",
      image: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      pdfUrl: "/public/pdfs/annualmagazine/Annual Magazine_2023-2024.pdf",
      date: "2024-01-30"
    }
  ]
};

const categoryTitles = {
  'annual-magazine': 'Annual Magazine',
  'college-news': 'College News',
  'articles': 'Articles'
};

const categoryDescriptions = {
  'annual-magazine': 'Our prestigious annual publications that compile the year\'s best academic and creative work, featuring student research, articles, artwork, and memorable events.',
  'college-news': 'Stay updated with the latest happenings and developments around campus.',
  'articles': 'Explore our collection of informative and engaging articles.'
};

const PublicationCategory = () => {
  const { category = '' } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize the filtered publications to prevent unnecessary recalculations
  const publications = useMemo(() => {
    return publicationsByCategory[category] || [];
  }, [category]);

  const categoryTitle = categoryTitles[category] || 'Publications';
  const categoryDescription = categoryDescriptions[category] || '';

  if (!publications.length) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <section className="bg-gradient-to-b from-theme-blue to-theme-blue/90 text-white py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Category Not Found</h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                The requested category does not exist.
              </p>
          </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-theme-blue to-theme-blue/90 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryTitle}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {categoryDescription}
            </p>
          </div>
        </section>

        {/* Publications Grid */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <PublicationCard
                key={pub.id}
                {...pub}
                category={categoryTitle}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PublicationCategory; 