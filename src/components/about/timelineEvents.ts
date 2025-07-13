interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string;
  keyDevelopments: string[];
  newEditions?: string[];
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: '2019',
    title: 'Vision & Beginnings',
    description: 'The Compendium was established with a vision to amplify student voices through creative journalism and innovation. It laid the foundation for a dynamic platform driven by passion and storytelling.',
    image: '/timeline/2019.jpg',
    keyDevelopments: []
  },
  {
    year: '2020',
    title: 'Laying the Groundwork',
    description: 'In its first full year, the club solidified its structure and began regular activities. The leadership team set the stage for future growth, focusing on member engagement and creative projects.',
    image: '/timeline/2020.jpg', // Make sure this image exists or update the path
    keyDevelopments: [
      'First regular club meetings',
      'Initial creative projects'
    ]
  },
  {
    year: '2021',
    title: 'Leadership & Signature Events',
    description: 'A new leadership team took charge, broadening the club\'s scope and launching signature events that gained popularity across campus.',
    image: '/timeline/2021.jpg',
    keyDevelopments: [
      'THE COMPENDIUM\'S DEBATE',
      'DEVIANCE 2022'
    ]
  },
  {
    year: '2022',
    title: 'Design & Artistic Growth',
    description: 'The third year marked a phase of artistic growth, with a focus on design and expression. Workshops and interactive sessions drew enthusiastic participation, reflecting the club\'s expanding creative influence.',
    image: '/timeline/2022.jpg',
    keyDevelopments: [
      'THE COMPENDIUM\'S DEBATE 2.0',
      'GRAPHIC DESIGNING WORKSHOP',
      'POTTERY WORKSHOP'
    ],
    newEditions: [
      'ANNUAL MAGAZINE (2022-2023)'
    ]
  },
  {
    year: '2023',
    title: 'Innovation & Engagement',
    description: 'This year brought the introduction of new initiatives, including regular content features and interactive events. The club continued to nurture talent while engaging students through thoughtfully curated activities.',
    image: '/timeline/2023.jpg',
    keyDevelopments: [
      'WRITER\'S WORKSHOP',
      'SCAVENGER HUNT'
    ],
    newEditions: [
      'DAILY DIGEST',
      'ANNUAL MAGAZINE (2023-2024)'
    ]
  },
  {
    year: '2024',
    title: 'Milestones & Impact',
    description: 'Commemorating its fifth anniversary, the club celebrated its journey with a vibrant lineup of intellectually and creatively stimulating events. It reaffirmed its role as a hub for innovation, expression, and impactful student experiences.',
    image: '/timeline/2024.jpg',
    keyDevelopments: [
      'DESIGN FOR EVERYONE - WORKSHOP',
      'QUIZ - THE BATTLE OF BRAINS',
      'VIBE CODING',
      'COURTROOM CONUNDRUM',
      'STATE VS A NOBODY'
    ],
    newEditions: [
      'ARTICLES',
      'WEBSITE',
      'CULTURAL FEST MAGAZINE (2024-2025)',
      'ANNUAL MAGAZINE (2024-2025)'
    ]
  }
];

export default timelineEvents; 