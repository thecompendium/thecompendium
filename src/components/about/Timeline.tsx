import React, { useState } from 'react';
import { milestones } from '../../pages/About';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string;
  keyDevelopments: string[];
  newEditions: string[];
}

interface TeamMember {
  name: string;
  position: string;
  description?: string;
  image?: string;
  bio?: string;
}

interface TimelineProps {
  onYearChange: (year: string) => void;
  teamMembers: {
    [key: string]: TeamMember[];
  };
}

const Timeline: React.FC<TimelineProps> = ({ onYearChange, teamMembers }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent>(milestones[milestones.length - 1]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEventClick = (event: TimelineEvent) => {
    if (event.year === selectedEvent.year) return;
    setIsAnimating(true);
    setSelectedEvent(event);
    onYearChange(event.year);
    setTimeout(() => setIsAnimating(false), 300);
  };

  React.useEffect(() => {
    onYearChange('2024');
  }, []);

  return (
    <div className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-5xl font-bold text-center text-theme-blue dark:text-white mb-12">Our Journey</h2>
        
        {/* Main Content Area */}
        <div className="mt-8">
          {/* Content Section */}
          <div className="flex gap-8">
            <div>
              {/* Left Side - Description */}
              <div className="w-[450px]">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col mb-8">
                  {/* Image Section */}
                  <div className="h-[250px] bg-gray-100">
                    <img 
                      src={selectedEvent.image || '/timeline/default-timeline.jpg'} 
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5 flex flex-col bg-[#020B5E] text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[28px] font-bold text-white">{selectedEvent.year}</span>
                      <div className="w-px h-6 bg-white/30" />
                      <span className="text-[22px] font-bold text-white">{selectedEvent.title}</span>
                    </div>
                    
                    <div className={`${isExpanded ? '' : ''}`}>
                      <p className={`text-white/90 text-[14px] leading-relaxed mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
                        {selectedEvent.description.split('\n\n')[0]}
                      </p>
                      
                      {selectedEvent.keyDevelopments.length > 0 && (
                        <div className={`mt-2 ${isExpanded ? '' : 'hidden'}`}>
                          <p className="text-yellow-400 font-semibold mb-2">EVENTS CONDUCTED:</p>
                          <ul className="list-disc pl-5 text-white/90 text-[14px] space-y-1">
                            {selectedEvent.keyDevelopments.map((event, index) => (
                              <li key={index} className="text-white/90">{event}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedEvent.newEditions && selectedEvent.newEditions.length > 0 && (
                        <div className={`mt-4 ${isExpanded ? '' : 'hidden'}`}>
                          <p className="text-yellow-400 font-semibold mb-2">NEW EDITION:</p>
                          <ul className="list-disc pl-5 text-white/90 text-[14px] space-y-1">
                            {selectedEvent.newEditions.map((edition, index) => (
                              <li key={index} className="text-white/90">{edition}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Buttons Row: Show more (left), View more (right) */}
                    <div className="flex justify-between items-center mt-4">
                      <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[13px] text-yellow-400 hover:text-yellow-300 underline"
                      >
                        {isExpanded ? 'Show less' : 'Show more'}
                      </button>
                      <button 
                        onClick={() => window.location.href = `/timeline/${selectedEvent.year}`}
                        className="text-[13px] text-yellow-400 hover:text-yellow-300 underline"
                      >
                        View more
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline Bar - Improved gradient and visibility */}
                <div className="relative h-[60px] flex items-center">
                  {/* Timeline Line with Blue Gradient */}
                  <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 opacity-80" />
                  {/* Timeline Points */}
                  <div className="relative flex justify-between items-center w-full px-4">
                    {milestones.map((event, index) => (
                      <div
                        key={event.year}
                        className={`relative cursor-pointer group transition-all duration-500 ${
                          selectedEvent.year !== event.year ? 'opacity-70 blur-0' : ''
                        }`}
                        onClick={() => handleEventClick(event)}
                        style={{ minWidth: '50px', textAlign: 'center' }}
                      >
                        {/* Year Label */}
                        <div 
                          className={`absolute -top-8 left-1/2 transform -translate-x-1/2
                            text-[18px] font-bold whitespace-nowrap transition-all duration-500 
                            ${selectedEvent.year === event.year 
                              ? 'text-yellow-400 drop-shadow-[0_0_4px_rgba(255,214,0,0.5)] scale-125' 
                              : 'text-blue-200 group-hover:text-yellow-200'
                            }`}
                          style={{ minWidth: '50px' }}
                        >
                          {event.year}
                        </div>
                        {/* Diamond Shape */}
                        <div className="relative">
                          <div 
                            className={`relative w-[16px] h-[16px] mx-auto transition-all duration-500
                              transform rotate-45 group-hover:scale-110 ${
                              selectedEvent.year === event.year 
                                ? 'bg-yellow-400 drop-shadow-[0_0_6px_rgba(255,214,0,0.4)] scale-125' 
                                : 'border-2 border-blue-300 group-hover:border-yellow-200'
                            }`}
                            style={{
                              boxShadow: selectedEvent.year === event.year 
                                ? '0 0 6px rgba(255, 214, 0, 0.4)' 
                                : 'none'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Team Members */}
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-8">
                {teamMembers[selectedEvent.year]?.map((member: TeamMember, index: number) => (
                  <div 
                    key={index} 
                    className={`relative group transition-opacity duration-300 ${
                      isAnimating ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-start gap-6">
                      {/* Profile Picture */}
                      <div className="w-[150px] h-[150px] rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border-2 border-gray-200 dark:border-gray-700">
                        <img 
                          src={member.image || memberImages[member.name] || '/team/default-avatar.jpg'} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                        />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1">
                        <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                          {member.name}
                        </h4>
                        <p className="text-[#6B7280] dark:text-gray-400 text-base mb-4">
                          <span className="inline-block">{member.position}</span>
                          <span className="block h-[1px] mt-4 border-t-2 border-dotted border-theme-yellow dark:border-theme-yellow w-[100px]"></span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          {member.bio || (member.position === "PRESIDENT" && "Leading the club's vision and strategic initiatives, coordinating with different teams to drive innovation and growth.")}
                          {!member.bio && member.position === "VICE PRESIDENT" && "Supporting the president in club operations and helping execute key initiatives while fostering team collaboration."}
                          {!member.bio && member.position === "CREATIVE DIRECTOR" && "Overseeing the club's creative direction, managing design projects, and ensuring visual consistency across all publications."}
                          {!member.bio && member.position === "MANAGING DIRECTOR" && "Managing day-to-day operations, coordinating events, and ensuring smooth execution of club activities and projects."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline; 