import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openPdfViewer } from '@/utils/pdfUtils';
import { cn } from '@/lib/utils';

export const upcomingEvents = [
  {
    title: "The Compendium Live",
    date: "July 19,2025",
    time: "2:00 PM to 4:00 PM",
    location: "AV Center",
    description: "Unveiling our digital presence — explore the official launch of our brand-new website!",
    image: "/events images/The Compendium Live.png",
    category: "Conference",
    detailsPdf: "/pdfs/events/Website Launch.pdf"
  }
];

const Events = () => {
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const conductedEvents = [
    {
      title: "State vs A Nobody",
      date: "Mar 26, 2025",
      time: "2:00 PM to 4:00 PM",
      location: "Sangeeth Auditorium",
      description: "A unique legal simulation event that challenges participants to navigate complex legal scenarios and develop critical thinking skills.",
      image: "/events images/STATE VS A  NOBODY.png",
      category: "Session",
      detailsPdf: "/pdfs/events/State vs A Nobody.pdf"
    },
    {
      title: "Courtroom Conundrum",
      date: "April 11 to 12, 2025",
      time: "2:00 PM to 4:00 PM",
      location: "R&D Block 4th Floor",
      description: "Experience the thrill of legal drama in this immersive mock court session. Witness compelling arguments and strategic thinking in action.",
      image: "/events images/Courtroom  Conundrum.png",
      category: "Competition",
      detailsPdf: "/pdfs/events/Courtroom  Conundrum.pdf"
    },
    {
      title: "Vibe Coding",
      date: "March 29, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "TIIC Center",
      description: "Join us for an exciting coding session where creativity meets technology. Experience the perfect blend of coding and innovation.",
      image: "/events images/Vibe Coding .png",
      category: "Workshop",
      detailsPdf: "/pdfs/events/Vibe Coding .pdf"
    },
    {
      title: "QUIZ : Battle Of The Brains",
      date: "February 15, 2025",
      time: "1:30 PM - 4:00 PM",
      location: "TIIC Center",
      description: "An exciting quiz competition to test your knowledge across various topics and compete for amazing prizes.",
      image: "/events images/Quiz Battle of the Brains.png",
      category: "Competition",
      detailsPdf: "/pdfs/events/Quiz Battle of the Brains.pdf"
    },
    {
      title: "Club Connect : Introducing New Joiners & Future Plans",
      date: "February 8, 2025",
      time: "1:30 PM - 4:00 PM",
      location: "AV Center",
      description: "A welcoming event to introduce new members and discuss upcoming initiatives and plans for the club's future.",
      image: "/events images/The Compendium Club Connect.png",
      category: "Conference",
      detailsPdf: "/pdfs/events/The Compendium Club Connect.pdf"
    },
    {
      title: "Design For Everyone Workshop",
      date: "Dec 7, 2024",
      time: "1:30 PM - 4:00 PM",
      location: "TIIC Center",
      description: "An interactive workshop exploring design principles and practices for all skill levels, focusing on accessibility and user experience.",
      image: "/events images/Design for Everyone Workshop.png",
      category: "Workshop",
      detailsPdf: "/pdfs/events/Design for Everyone Workshop.pdf"
    }
  ];

  const EventPdfButton = ({ pdfUrl, className = "" }) => (
    <button 
      onClick={() => openPdfViewer(navigate, pdfUrl)}
      className={`inline-flex items-center text-theme-blue hover:text-theme-blue/80 dark:text-white dark:hover:text-white/80 text-sm font-medium transition-colors ${className}`}
    >
      View Details
      <ArrowRight className="ml-2 h-4 w-4" />
    </button>
  );

  const RegisterButton = ({ className = "", eventTitle = "" }) => (
    <button 
      onClick={() => {
        if (eventTitle === "Courtroom Conundrum") {
          window.open("https://forms.gle/8MJADTffqvJe6b9QA", "_blank");
        } else {
          alert("Registration form will be added soon!");
        }
      }}
      className={`inline-flex items-center text-theme-blue hover:text-theme-blue/80 dark:text-white dark:hover:text-white/80 text-sm font-medium transition-colors ${className}`}
    >
      Register
      <ArrowRight className="ml-2 h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-theme-blue dark:bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-theme-blue to-theme-blue/90 text-white py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Workshops</h1>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Join us for interactive workshops, inspiring talks, and networking opportunities with fellow writers and publishers.
              </p>
            </div>
          </div>
        </section>

        {/* Conducted Events */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-theme-blue">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-theme-blue dark:text-white">Conducted Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conductedEvents.map((event, index) => (
                <div key={index} className="group bg-white hover:bg-gray-50 dark:bg-[#020817] dark:hover:bg-[#020817]/90 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-theme-yellow text-theme-blue px-2 py-0.5 rounded-full text-xs font-medium">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-serif font-bold text-theme-blue dark:text-white mb-2 group-hover:text-theme-blue dark:group-hover:text-theme-yellow transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <EventPdfButton pdfUrl={event.detailsPdf} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-theme-blue">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-theme-blue dark:text-white">Upcoming Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="group bg-white hover:bg-gray-50 dark:bg-[#020817] dark:hover:bg-[#020817]/90 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
                  <div className="h-40 overflow-hidden relative">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-theme-yellow text-theme-blue px-2 py-0.5 rounded-full text-xs font-medium">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-serif font-bold text-theme-blue dark:text-white mb-2 group-hover:text-theme-blue dark:group-hover:text-theme-yellow transition-colors line-clamp-2">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-theme-blue dark:text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <RegisterButton eventTitle={event.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;