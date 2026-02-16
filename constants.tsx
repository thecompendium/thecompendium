
import { Publication, Achievement, TeamMember } from './types';

export const PUBLICATIONS: Publication[] = [
  {
    id: '1',
    title: 'Say Goodbye to GenAI and Hello to Agentic AI',
    category: 'Article',
    author: 'M Prashanth',
    date: 'Jan 24, 2025',
    summary: 'Say goodbye to traditional GenAI—Agentic AI ushers in a new era of autonomous, goal-driven intelligence.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/ai/800/600',
    link: '#'
  },
  {
    id: '2',
    title: 'Will AI Take Over the Jobs of Aeronautical Engineers?',
    category: 'Article',
    author: 'Editorial Team',
    date: 'Jan 20, 2025',
    summary: 'Exploring whether AI will augment or replace the roles of aeronautical engineers in the evolving aerospace industry.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/aero/800/600',
    link: '#'
  },
  {
    id: '3',
    title: 'News Edition 12',
    category: 'College News',
    author: 'The Compendium Team',
    date: 'Jan 15, 2025',
    summary: 'Latest updates on campus activities, achievements, and upcoming events in our newest edition.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/news12/800/600',
    link: '#'
  },
  {
    id: '4',
    title: 'Annual Magazine 2023-2024',
    category: 'Annual Magazine',
    author: 'The Compendium Team',
    date: 'Dec 2024',
    summary: 'The latest edition of our annual magazine highlighting exceptional student projects, faculty research, cultural events, and academic milestones.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/magazine/800/600',
    link: '#'
  },
  {
    id: '5',
    title: 'News Edition 11',
    category: 'College News',
    author: 'The Compendium Team',
    date: 'Nov 12, 2024',
    summary: 'Recent developments, student achievements, and campus initiatives in this comprehensive edition.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/news11/800/600',
    link: '#'
  },
  {
    id: '6',
    title: 'Claude AI vs DeepSeek AI',
    category: 'Article',
    author: 'Tech Desk',
    date: 'Oct 30, 2024',
    summary: 'An in-depth analysis of how artificial intelligence is transforming learning environments and educational methodologies.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/claude/800/600',
    link: '#'
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    name: 'M. Mahathi',
    // Fix: Updated rollNumber to roll_number to match Achievement interface
    roll_number: '23951A62F0',
    department: 'CSE(CS)',
    category: 'Story Writer',
    description: 'A passionate storyteller who crafts compelling narratives that captivate readers. Her unique writing style and creative storytelling have earned her recognition in various literary circles.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/p1/300/300'
  },
  {
    id: '2',
    name: 'M. Prashanth',
    // Fix: Updated rollNumber to roll_number to match Achievement interface
    roll_number: '22951A05F9',
    department: 'CSE',
    category: 'Painting',
    description: 'A talented painter whose artwork vividly reflects emotions and experiences, earning appreciation in exhibitions and inspiring creativity within the artistic community.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/p2/300/300'
  },
  {
    id: '3',
    name: 'Chakri Shabad',
    // Fix: Updated rollNumber to roll_number to match Achievement interface
    roll_number: '22951A6724',
    department: 'CSE(DS)',
    category: 'Poetry',
    description: 'A gifted poet whose verses capture the essence of human emotions and experiences. His poetic works have earned recognition in literary competitions and have been featured in college publications.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/p3/300/300'
  },
  {
    id: '4',
    name: 'Sai Kushal',
    // Fix: Updated rollNumber to roll_number to match Achievement interface
    roll_number: '23951A04F2',
    department: 'ECE',
    category: 'Doodle Art',
    description: 'An exceptional artist known for his intricate doodle art that showcases creativity and attention to detail. His unique artistic style has garnered appreciation from fellow artists.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/p4/300/300'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'K YAGNESH REDDY',
    role: 'PRESIDENT',
    description: 'Leading the club\'s vision and strategic initiatives, coordinating with different teams to drive innovation and growth.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/t1/300/300'
  },
  {
    id: '2',
    name: 'MULE BHARATH',
    role: 'CREATIVE DIRECTOR',
    description: 'Overseeing the club\'s creative direction, managing design projects, and ensuring visual consistency across all publications.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/t2/300/300'
  },
  {
    id: '3',
    name: 'ROHIT JOY',
    role: 'MANAGING DIRECTOR',
    description: 'Managing day-to-day operations, coordinating events, and ensuring smooth execution of club activities and projects.',
    // Corrected imageUrl to image_url
    image_url: 'https://picsum.photos/seed/t3/300/300'
  }
];
