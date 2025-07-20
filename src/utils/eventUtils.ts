export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  detailsPdf: string;
}

// All events data
export const allEvents: Event[] = [
  {
    title: "The Compendium Live",
    date: "July 19, 2025",
    time: "2:00 PM to 4:00 PM",
    location: "AV Center",
    description: "Unveiling our digital presence — explore the official launch of our brand-new website!",
    image: "/events images/The Compendium Live.png",
    category: "Conference",
    detailsPdf: "/pdfs/events/Website Launch.pdf"
  },
  {
    title: "State vs A Nobody",
    date: "May 26, 2025",
    time: "2:00 PM to 4:00 PM",
    location: "Sangeeth Auditorium",
    description: "A unique legal simulation event that challenges participants to navigate complex legal scenarios and develop critical thinking skills.",
    image: "/events images/STATE VS A NOBODY.png",
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

// Parse date string to Date object
export const parseEventDate = (dateString: string): Date => {
  // Handle different date formats
  const cleanDate = dateString.replace(/\s+/g, ' ').trim();
  
  // Handle "Dec 7, 2024" format
  if (cleanDate.match(/^[A-Za-z]{3}\s+\d{1,2},\s*\d{4}$/)) {
    return new Date(cleanDate);
  }
  
  // Handle "July 19, 2025" format
  if (cleanDate.match(/^[A-Za-z]+\s+\d{1,2},\s*\d{4}$/)) {
    return new Date(cleanDate);
  }
  
  // Handle "April 11 to 12, 2025" format - use the first date
  if (cleanDate.includes(' to ')) {
    const firstDate = cleanDate.split(' to ')[0];
    return new Date(firstDate + ', ' + cleanDate.split(', ')[1]);
  }
  
  // Handle "May 26, 2025" format
  if (cleanDate.match(/^[A-Za-z]+\s+\d{1,2},\s*\d{4}$/)) {
    return new Date(cleanDate);
  }
  
  // Default fallback
  return new Date(cleanDate);
};

// Check if event date has passed
export const isEventExpired = (event: Event): boolean => {
  const eventDate = parseEventDate(event.date);
  const currentDate = new Date();
  
  // Set current date to start of day for fair comparison
  currentDate.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  return eventDate < currentDate;
};

// Get upcoming events (not expired)
export const getUpcomingEvents = (): Event[] => {
  return allEvents.filter(event => !isEventExpired(event));
};

// Get conducted events (expired)
export const getConductedEvents = (): Event[] => {
  return allEvents.filter(event => isEventExpired(event));
};

// Sort events by date (upcoming: ascending, conducted: descending)
export const sortUpcomingEvents = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    return dateA.getTime() - dateB.getTime();
  });
};

export const sortConductedEvents = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    const dateA = parseEventDate(a.date);
    const dateB = parseEventDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}; 