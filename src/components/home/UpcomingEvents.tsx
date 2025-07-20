import React, { useMemo } from 'react';
import { Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { openPdfViewer } from '@/utils/pdfUtils';
import { getUpcomingEvents, sortUpcomingEvents } from '@/utils/eventUtils';

const UpcomingEvents = () => {
  const navigate = useNavigate();

  // Get dynamic upcoming events based on current date
  const upcomingEvents = useMemo(() => sortUpcomingEvents(getUpcomingEvents()), []);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
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
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.date} | {event.time}</p>
                  <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
                  <p className="text-sm mb-4">{event.description}</p>
                  <button 
                    onClick={() => openPdfViewer(navigate, event.detailsPdf)}
                    className="inline-flex items-center text-theme-blue hover:text-theme-blue/80 dark:text-white dark:hover:text-white/80 text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>
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
