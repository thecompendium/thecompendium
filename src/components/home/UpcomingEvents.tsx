import React from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { openPdfViewer } from '@/utils/pdfUtils';

// Sample events data
const events = [
  {
    id: 1,
    title: "Website Launch",
    description: "Unveiling our digital presence — explore the official launch of our brand-new website!",
    date: "02/05/2025",
    time: "2:00 PM to 3:00 PM",
    location: "AV Center",
    registrationLink: "https://forms.gle/8MJADTffqvJe6b9QA",
    detailsPdf: "/public/pdfs/events/Website-Launch.pdf"
  }
];

const UpcomingEvents = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-yellow-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <span className="inline-block py-1 px-3 mb-4 text-xs font-medium bg-secondary rounded-full text-secondary-foreground">
            Mark Your Calendar
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-muted-foreground max-w-2xl">
            Join us for workshops, launches, and special events to enhance your writing and publishing skills.
          </p>
        </div>

        <div className="space-y-6">
          {events.map((event) => (
            <div 
              key={event.id}
              className="group bg-card rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover-lift"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 bg-gray-100 dark:bg-gray-800 p-6 flex flex-col justify-center items-center text-center">
                  <Calendar className="h-8 w-8 mb-3 text-theme-blue dark:text-white" />
                  <h3 className="font-serif text-xl font-medium mb-1 text-gray-900 dark:text-white">{event.date}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{event.time}</p>
                </div>
                
                <div className="md:w-3/4 p-6 md:p-8">
                  <h3 className="font-serif text-2xl font-medium mb-3 text-gray-900 dark:text-white group-hover:text-theme-blue dark:group-hover:text-theme-yellow transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {event.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-700 dark:text-gray-300 gap-4 mb-6">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-theme-blue dark:text-white" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-theme-blue dark:text-white" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    {event.title === "Website Launch" ? (
                      <button 
                        onClick={() => alert("Registration will be available soon!")}
                        className="inline-flex items-center justify-center px-4 py-2 bg-theme-blue text-white rounded-md hover:bg-theme-blue/90 transition-colors text-sm font-medium"
                      >
                        Register Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </button>
                    ) : (
                      <a 
                        href={event.registrationLink}
                        className="inline-flex items-center justify-center px-4 py-2 bg-theme-blue text-white rounded-md hover:bg-theme-blue/90 transition-colors text-sm font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register Now
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/events"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            View All Events
            <Calendar className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
