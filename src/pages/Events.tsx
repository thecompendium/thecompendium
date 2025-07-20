import React, { useEffect, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openPdfViewer } from '@/utils/pdfUtils';
import { cn } from '@/lib/utils';
import { 
  getUpcomingEvents, 
  getConductedEvents, 
  sortUpcomingEvents, 
  sortConductedEvents,
  type Event 
} from '@/utils/eventUtils';

// Export upcoming events for use in other components
export const upcomingEvents = getUpcomingEvents();

const Events = () => {
  const navigate = useNavigate();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get dynamic events based on current date
  const upcomingEventsList = useMemo(() => sortUpcomingEvents(getUpcomingEvents()), []);
  const conductedEventsList = useMemo(() => sortConductedEvents(getConductedEvents()), []);

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
              {conductedEventsList.length > 0 ? (
                conductedEventsList.map((event, index) => (
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Conducted Events</h3>
                  <p className="text-gray-500 dark:text-gray-400">No events have been conducted yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 px-6 md:px-12 bg-white dark:bg-theme-blue">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-12 text-theme-blue dark:text-white">Upcoming Events</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEventsList.length > 0 ? (
                upcomingEventsList.map((event, index) => (
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
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Upcoming Events</h3>
                  <p className="text-gray-500 dark:text-gray-400">Check back soon for new events and workshops!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Events;