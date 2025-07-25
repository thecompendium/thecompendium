import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  FileText, 
  Calendar, 
  Award, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { publicationsByCategory } from './publications/PublicationCategory';
import { achievements as realAchievements } from './Achievements';
import { teamMembersByYear, milestones } from './About';
import About from './About';
import { events as realEvents } from '../data/events';
import memberImages from '@/components/about/memberImages';
import timelineImages from '@/components/about/timelineImages';
import TimelineYear from './TimelineYear';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Placeholder image for gallery
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUgxMDFDMTExLjQ1NiA4MSAxMjAgODkuNTQ0IDEyMCAxMDBWMTEwQzEyMCAxMjAuNDU2IDExMS40NTYgMTI5IDEwMSAxMjlIOUFDODguNTQ0IDEyOSA4MCAxMjAuNDU2IDgwIDExMFYxMDBaIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUgxMDFDMTExLjQ1NiA4MSAxMjAgODkuNTQ0IDEyMCAxMDBWMTEwQzEyMCAxMjAuNDU2IDExMS40NTYgMTI5IDEwMSAxMjlIOUFDODguNTQ0IDEyOSA4MCAxMjAuNDU2IDgwIDExMFYxMDBaIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCAxMDBDODAgODkuNTQ0IDg4LjU0NCA4MSA5OSA4MUgxMDFDMTExLjQ1NiA4MSAxMjAgODkuNTQ0IDEyMCAxMDBWMTEwQzEyMCAxMjAuNDU2IDExMS40NTYgMTI5IDEwMSAxMjlIOUFDODguNTQ0IDEyOSA4MCAxMjAuNDU2IDgwIDExMFYxMDBaIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0EzQUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';

// Publication type
interface Publication {
  id: number;
  title: string;
  publisher?: string;
  description: string;
  image: string;
  pdfUrl: string;
  date: string;
  category: string;
}

// Event type
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  category: string;
  fullDescription?: string;
  capacity?: string;
  requirements?: string[];
  speakers?: Array<{ name: string; role: string }>;
  schedule?: Array<{ time: string; activity: string }>;
}

// Achievement type
interface Achievement {
  id: number;
  name: string;
  rollNo: string;
  category: string;
  description: string;
  image: string;
  pdf: string;
}

// Timeline type
interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  image: string;
  keyDevelopments: string;
  newEditions: string;
}

// Team type
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  year?: string;
  reflection?: string;
}

// Content type
interface WebsiteContent {
  id: string;
  section: string;
  title: string;
  content: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  contactInfo?: {
    email: string;
    linkedin: string;
    instagram: string;
  };
  socialLinks?: {
    linkedin: string;
    instagram: string;
  };
}

// --- API helpers for Publications ---
const PUBLICATIONS_API = 'http://localhost:3001/api/publications';

async function fetchPublications() {
  const res = await fetch(PUBLICATIONS_API);
  if (!res.ok) throw new Error('Failed to fetch publications');
  return res.json();
}

async function addPublication(pubData) {
  const res = await fetch(PUBLICATIONS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pubData),
  });
  if (!res.ok) throw new Error('Failed to add publication');
  return res.json();
}

async function updatePublication(id, pubData) {
  const res = await fetch(`${PUBLICATIONS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pubData),
  });
  if (!res.ok) throw new Error('Failed to update publication');
  return res.json();
}

async function deletePublication(id) {
  const res = await fetch(`${PUBLICATIONS_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete publication');
}

// --- API helpers for Achievements ---
const ACHIEVEMENTS_API = 'http://localhost:3001/api/achievements';

async function fetchAchievements() {
  const res = await fetch(ACHIEVEMENTS_API);
  if (!res.ok) throw new Error('Failed to fetch achievements');
  return res.json();
}

async function addAchievement(achData) {
  const res = await fetch(ACHIEVEMENTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(achData),
  });
  if (!res.ok) throw new Error('Failed to add achievement');
  return res.json();
}

async function updateAchievement(id, achData) {
  const res = await fetch(`${ACHIEVEMENTS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(achData),
  });
  if (!res.ok) throw new Error('Failed to update achievement');
  return res.json();
}

async function deleteAchievement(id) {
  const res = await fetch(`${ACHIEVEMENTS_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete achievement');
}

// --- API helpers for Timeline ---
const TIMELINE_API = 'http://localhost:3001/api/timeline';

async function fetchTimeline() {
  const res = await fetch(TIMELINE_API);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
}

async function addTimeline(tlData) {
  const res = await fetch(TIMELINE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tlData),
  });
  if (!res.ok) throw new Error('Failed to add timeline event');
  return res.json();
}

async function updateTimeline(id, tlData) {
  const res = await fetch(`${TIMELINE_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tlData),
  });
  if (!res.ok) throw new Error('Failed to update timeline event');
  return res.json();
}

async function deleteTimeline(id) {
  const res = await fetch(`${TIMELINE_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete timeline event');
}

// --- API helpers for Team ---
const TEAM_API = 'http://localhost:3001/api/team';

async function fetchTeam() {
  const res = await fetch(TEAM_API);
  if (!res.ok) throw new Error('Failed to fetch team');
  return res.json();
}

async function addTeamMember(memberData) {
  const res = await fetch(TEAM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) throw new Error('Failed to add team member');
  return res.json();
}

async function updateTeamMember(id, memberData) {
  const res = await fetch(`${TEAM_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData),
  });
  if (!res.ok) throw new Error('Failed to update team member');
  return res.json();
}

async function deleteTeamMember(id) {
  const res = await fetch(`${TEAM_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete team member');
}

// --- API helpers for Content ---
const CONTENT_API = 'http://localhost:3001/api/content';

async function fetchContent() {
  const res = await fetch(CONTENT_API);
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
}

async function addContent(contentData) {
  const res = await fetch(CONTENT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contentData),
  });
  if (!res.ok) throw new Error('Failed to add content');
  return res.json();
}

async function updateContent(id, contentData) {
  const res = await fetch(`${CONTENT_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contentData),
  });
  if (!res.ok) throw new Error('Failed to update content');
  return res.json();
}

async function deleteContent(id) {
  const res = await fetch(`${CONTENT_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete content');
}

// --- API helpers for Domain Heads ---
const DOMAIN_HEADS_API = 'http://localhost:3001/api/domain-heads';

async function fetchDomainHeads() {
  const res = await fetch(DOMAIN_HEADS_API);
  if (!res.ok) throw new Error('Failed to fetch domain heads');
  return res.json();
}
async function addDomainHead(headData) {
  const res = await fetch(DOMAIN_HEADS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(headData),
  });
  if (!res.ok) throw new Error('Failed to add domain head');
  return res.json();
}
async function updateDomainHead(id, headData) {
  const res = await fetch(`${DOMAIN_HEADS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(headData),
  });
  if (!res.ok) throw new Error('Failed to update domain head');
  return res.json();
}
async function deleteDomainHead(id) {
  const res = await fetch(`${DOMAIN_HEADS_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete domain head');
}
// --- API helpers for Gallery ---
const GALLERY_API = 'http://localhost:3001/api/gallery';

async function fetchGallery() {
  const res = await fetch(GALLERY_API);
  if (!res.ok) throw new Error('Failed to fetch gallery');
  return res.json();
}
async function addGalleryImage(imageData) {
  const res = await fetch(GALLERY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
  if (!res.ok) throw new Error('Failed to add gallery image');
  return res.json();
}
async function updateGalleryImage(id, imageData) {
  const res = await fetch(`${GALLERY_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(imageData),
  });
  if (!res.ok) throw new Error('Failed to update gallery image');
  return res.json();
}
async function deleteGalleryImage(id) {
  const res = await fetch(`${GALLERY_API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete gallery image');
}

// Ensure fetchEvents and event API helpers are defined at the top-level scope
async function fetchEvents() {
  const res = await fetch('http://localhost:3001/api/events');
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}
async function addEvent(eventData) {
  const res = await fetch('http://localhost:3001/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error('Failed to add event');
  return res.json();
}
async function updateEvent(id, eventData) {
  const res = await fetch(`http://localhost:3001/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error('Failed to update event');
  return res.json();
}
async function deleteEvent(id) {
  const res = await fetch(`http://localhost:3001/api/events/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete event');
}

// Add this utility at the top (after imports)
import timelineEvents from '../components/about/timelineEvents';

function getInitialTimeline() {
  // Convert timelineEvents to the format expected by the timeline state (add id if needed)
  return timelineEvents.map((event, idx) => ({
    ...event,
    id: idx + 1,
    keyDevelopments: Array.isArray(event.keyDevelopments) ? event.keyDevelopments.join(', ') : event.keyDevelopments,
    newEditions: Array.isArray(event.newEditions) ? event.newEditions.join(', ') : event.newEditions || '',
  }));
}

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [showPubForm, setShowPubForm] = useState(false);

  // Replace publications state initialization
  const [publications, setPublications] = useState([]);
  useEffect(() => {
    fetchPublications().then(setPublications).catch(console.error);
  }, []);

  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  // Replace achievements state initialization
  const [achievements, setAchievements] = useState([]);
  useEffect(() => {
    fetchAchievements().then(setAchievements).catch(console.error);
  }, []);

  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showAchievementForm, setShowAchievementForm] = useState(false);

  // Replace timeline state initialization
  const [timeline, setTimeline] = useState([]);
  useEffect(() => {
    fetchTimeline().then(setTimeline).catch(console.error);
  }, []);

  const [editingTimeline, setEditingTimeline] = useState<TimelineEvent | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  // Replace team state initialization
  const [team, setTeam] = useState([]);
  useEffect(() => {
    fetchTeam().then(setTeam).catch(console.error);
  }, []);

  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [showTeamForm, setShowTeamForm] = useState(false);

  // Replace domainHeads state initialization
  const [domainHeads, setDomainHeads] = useState([]);
  useEffect(() => {
    fetchDomainHeads().then(setDomainHeads).catch(console.error);
  }, []);

  const [editingDomainHead, setEditingDomainHead] = useState<any>(null);
  const [showDomainHeadForm, setShowDomainHeadForm] = useState(false);
  const removeDomainHead = (year: string, idx: number) => {
    setDomainHeads(prev => ({ ...prev, [year]: prev[year].filter((_, i) => i !== idx) }));
  };
  // Replace gallery state initialization
  const [gallery, setGallery] = useState([]);
  useEffect(() => {
    fetchGallery().then(setGallery).catch(console.error);
  }, []);
  const [editingGalleryYear, setEditingGalleryYear] = useState<string | null>(null);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryIndex, setEditingGalleryIndex] = useState<number | null>(null);
  
  const removeGalleryImage = (year: string, idx: number) => {
    setGallery(prev => ({ ...prev, [year]: prev[year].filter((_, i) => i !== idx) }));
  };

  const handleImageUpload = (year: string, index: number, file: File) => {
    // Create a temporary URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    
    // Update the gallery with the new image URL
    setGallery(prev => {
      const updatedGallery = { ...prev };
      if (!updatedGallery[year]) {
        updatedGallery[year] = Array.from({ length: 20 }, () => '');
      }
      updatedGallery[year][index] = imageUrl;
      return updatedGallery;
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, year: string, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(year, index, file);
    }
  };

  // Replace content state initialization
  const [content, setContent] = useState([]);
  useEffect(() => {
    fetchContent().then(setContent).catch(console.error);
  }, []);

  const [editingContent, setEditingContent] = useState<WebsiteContent | null>(null);
  const [showContentForm, setShowContentForm] = useState(false);

  // Ensure events state is defined and initialized from the API
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Save publications to localStorage
  useEffect(() => {
    localStorage.setItem('adminPublications', JSON.stringify(publications));
  }, [publications]);

  useEffect(() => { localStorage.setItem('adminEvents', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('adminAchievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('adminTimeline', JSON.stringify(timeline)); }, [timeline]);
  useEffect(() => { localStorage.setItem('adminTeam', JSON.stringify(team)); }, [team]);
  useEffect(() => { localStorage.setItem('adminDomainHeads', JSON.stringify(domainHeads)); }, [domainHeads]);
  useEffect(() => { localStorage.setItem('adminGallery', JSON.stringify(gallery)); }, [gallery]);

  // On initial load or when team changes, merge missing default reflections for 2022, 2023, 2024
  useEffect(() => {
    const defaultReflections = {
      '2022': [
        {
          id: 1,
          name: 'MYTHRI BORRA',
          role: 'PRESIDENT',
          image: '/team/MYTHRI-BORRA.jpg',
          bio: "Led the launch of our first annual magazine",
          year: '2022',
          reflection: `Leading The Compendium in 2022 was an incredible journey of growth and innovation. As President, I had the privilege of steering our club through a transformative year where we launched our first annual magazine - a milestone that marked our evolution from a campus club to a serious publication platform.\n\nThe year was filled with creative challenges, from organizing our signature debate events to pioneering design workshops that brought out the artistic talents of our members. Working alongside our amazing team, we successfully expanded our reach and established The Compendium as a hub for creative expression and intellectual discourse.\n\nThe launch of our annual magazine was particularly rewarding, as it showcased the diverse talents of our student community. It was heartening to see how our platform gave voice to so many creative minds and helped them develop professional publication skills.\n\nThis experience taught me the importance of collaborative leadership, creative vision, and the power of student-driven initiatives. The friendships formed and skills developed during this time continue to inspire me in my professional journey.`
        },
        {
          id: 2,
          name: 'ABHIRAMI KIRTHIVASAN',
          role: 'CREATIVE DIRECTOR',
          image: '/team/ABHIRAMI-KIRTHIVASAN.jpg',
          bio: "Creative lead for our design workshops",
          year: '2022',
          reflection: `Serving as Creative Director in 2022 was a deeply fulfilling experience that allowed me to merge my passion for design with leadership. This year marked a significant shift in our club's creative direction, as we moved beyond traditional journalism to embrace multimedia storytelling and visual design.\n\nLeading our design workshops was particularly rewarding - seeing students discover their creative potential and develop new skills was incredibly inspiring. The Graphic Designing Workshop and Pottery Workshop were highlights of the year, bringing together students from different backgrounds to explore their artistic talents.\n\nWorking on our first annual magazine was a monumental task that required balancing creativity with practical constraints. The collaborative process of curating content, designing layouts, and ensuring visual consistency taught me valuable lessons about project management and creative leadership.\n\nThe year reinforced my belief in the power of creative expression as a tool for personal and professional growth. Watching our members develop their design skills and confidence was the most rewarding aspect of my role.`
        },
        {
          id: 3,
          name: 'HARSHINI MUNAGALA',
          role: 'MANAGING DIRECTOR',
          image: '/team/HARSHINI-MUNAGALA.jpg',
          bio: "Managed club operations and events",
          year: '2022',
          reflection: `As Managing Director in 2022, I had the opportunity to oversee the operational aspects of our club's most transformative year. The launch of our annual magazine required meticulous planning, coordination, and execution - skills that I developed significantly during this period.\n\nManaging multiple events simultaneously, from our debate competitions to creative workshops, taught me the importance of effective communication and time management. Each event brought its own challenges and learning opportunities, helping me grow both professionally and personally.\n\nThe collaborative nature of our work was particularly rewarding. Working closely with our President and Creative Director, I learned the value of diverse perspectives in achieving common goals. The success of our events and the positive feedback from participants made all the hard work worthwhile.\n\nThis experience shaped my understanding of organizational leadership and the importance of creating an environment where creativity and efficiency can coexist. The skills I developed continue to serve me in my professional endeavors.`
        }
      ],
      '2023': [
        {
          id: 4,
          name: 'CHILKURI SRI CHARAN REDDY',
          role: 'PRESIDENT',
          image: '/team/CHILKURI-SAI-CHARAN-REDDY.jpg',
          bio: "Leading the club's vision and strategic initiatives, coordinating with different teams to drive innovation and growth.",
          year: '2023',
          reflection: `Leading The Compendium in 2023 was a year of strategic expansion and innovation. As President, I focused on broadening our club's impact through new initiatives while maintaining the creative excellence we had established.\n\nThe introduction of our Daily Digest was a significant milestone that transformed how we engage with our community. This regular content feature allowed us to showcase student work more frequently and maintain consistent engagement with our audience. It was rewarding to see how this initiative provided more opportunities for students to share their voices.\n\nOur Writer's Workshop and Scavenger Hunt events were particularly successful, bringing together students from across the campus and fostering a sense of community. These events not only showcased our creative capabilities but also strengthened our position as a hub for intellectual and creative activities.\n\nThe year taught me the importance of balancing innovation with sustainability. While introducing new initiatives, we also ensured that our core activities continued to thrive. The collaborative spirit of our team made this possible, and I'm grateful for the support and dedication of everyone involved.`
        },
        {
          id: 5,
          name: 'E F TRISHA ANGELINE',
          role: 'CREATIVE DIRECTOR',
          image: '/team/E-F-TRISHA-ANGELINE .jpg',
          bio: "Overseeing the club's creative direction, managing design projects, and ensuring visual consistency across all publications.",
          year: '2023',
          reflection: `Serving as Creative Director in 2023 was an exciting journey of creative exploration and innovation. This year marked our expansion into new creative territories while maintaining the high standards we had established.\n\nThe launch of our Daily Digest required a complete reimagining of our creative processes. Creating engaging visual content on a regular basis challenged our team to think more strategically about design and storytelling. The positive response from our community made all the creative challenges worthwhile.\n\nOur Writer's Workshop was a highlight of the year, as it allowed me to combine my passion for design with educational initiatives. Seeing students develop their creative writing skills and then having the opportunity to design the visual presentation of their work was incredibly rewarding.\n\nThe year reinforced my belief in the power of consistent creative direction. Maintaining visual consistency across all our publications while allowing for creative experimentation was a delicate balance that taught me valuable lessons about brand management and creative leadership.`
        },
        {
          id: 6,
          name: 'AMRUTHA VALLABHANENI',
          role: 'MANAGING DIRECTOR',
          image: '/team/AMRUTHA-VALLABHANENI.jpg',
          bio: "Managing day-to-day operations, coordinating events, and ensuring smooth execution of club activities and projects.",
          year: '2023',
          reflection: `As Managing Director in 2023, I had the privilege of overseeing operations during a year of significant growth and innovation. The introduction of new initiatives like the Daily Digest and expanded event programming required enhanced operational capabilities and strategic planning.\n\nCoordinating the Daily Digest production was particularly challenging and rewarding. Managing the workflow from content creation to publication on a regular basis taught me the importance of efficient processes and clear communication. The success of this initiative demonstrated the value of systematic operational management.\n\nOur expanded event programming, including the Writer's Workshop and Scavenger Hunt, required careful coordination of resources, timelines, and team efforts. Each event brought unique operational challenges that helped me develop my problem-solving and leadership skills.\n\nThe year taught me that effective management is about creating an environment where creativity can flourish while ensuring operational excellence. The collaborative spirit of our team and the support from our leadership made this possible, and I'm grateful for the opportunity to contribute to our club's growth.`
        }
      ],
      '2024': [
        {
          id: 7,
          name: 'K YAGNESH REDDY',
          role: 'PRESIDENT',
          image: '/team/k-yagnesh-reddy.jpg',
          bio: "Leading the club's vision and strategic initiatives, coordinating with different teams to drive innovation and growth.",
          year: '2024',
          reflection: `Leading The Compendium in our fifth anniversary year has been an incredible honor and a transformative experience. As President, I've had the privilege of steering our club through a year of celebration, innovation, and continued growth.\n\nOur fifth anniversary celebrations brought together the best of what we've accomplished over the years while setting the stage for future innovation. The diverse lineup of events - from our Design for Everyone Workshop to the Quiz Battle of the Brains - showcased our commitment to both creativity and intellectual engagement.\n\nThe launch of our website was a significant milestone that modernized our platform and expanded our reach. This digital transformation required careful planning and execution, and seeing it come to life was incredibly rewarding. The website now serves as a comprehensive showcase of our community's talents and achievements.\n\nThis year has reinforced my belief in the power of student-driven initiatives and the importance of creating platforms for creative expression. The collaborative spirit of our team and the support from our community have made this journey truly special.`
        },
        {
          id: 8,
          name: 'MULE BHARATH',
          role: 'CREATIVE DIRECTOR',
          image: '/team/mule-bharath.jpg',
          bio: "Overseeing the club's creative direction, managing design projects, and ensuring visual consistency across all publications.",
          year: '2024',
          reflection: `Serving as Creative Director in our fifth anniversary year has been an exciting journey of creative innovation and digital transformation. This year marked our evolution into a truly modern creative platform with the launch of our website and expanded digital presence.\n\nThe website launch was a major creative undertaking that required reimagining our visual identity for the digital age. Creating a design that honors our heritage while embracing modern web design principles was both challenging and rewarding. The positive response from our community has made all the creative challenges worthwhile.\n\nOur anniversary events, particularly the Design for Everyone Workshop, allowed me to combine my passion for design education with our celebration of creativity. Seeing students from different backgrounds discover their creative potential was incredibly inspiring and reinforced the importance of accessible design education.\n\nThe year has taught me that great design is about more than aesthetics - it's about creating experiences that inspire, engage, and empower. The collaborative nature of our work and the support from our team have made this creative journey truly fulfilling.`
        },
        {
          id: 9,
          name: 'ROHIT JOY',
          role: 'MANAGING DIRECTOR',
          image: '/team/ROHIT-JOY.jpg',
          bio: "Managing day-to-day operations, coordinating events, and ensuring smooth execution of club activities and projects.",
          year: '2024',
          reflection: `As Managing Director in our fifth anniversary year, I've had the privilege of overseeing operations during one of our most ambitious and successful periods. The combination of anniversary celebrations, new digital initiatives, and expanded programming required enhanced operational capabilities and strategic coordination.\n\nThe website launch was a major operational undertaking that required coordination across multiple teams and stakeholders. Managing the development process, content migration, and launch timeline taught me valuable lessons about digital project management and stakeholder communication.\n\nOur anniversary events, including the Courtroom Conundrum and State vs A Nobody, were particularly rewarding to coordinate. These events not only showcased our creative capabilities but also demonstrated our ability to execute complex, multi-faceted programs successfully.\n\nThe year has reinforced my belief in the importance of systematic operational management in enabling creative excellence. The collaborative spirit of our team and the support from our leadership have made this journey truly rewarding, and I'm grateful for the opportunity to contribute to our club's continued success.`
        }
      ]
    };
    setTeam(prev => {
      let merged = [...prev];
      Object.entries(defaultReflections).forEach(([year, members]) => {
        members.forEach(defaultMember => {
          const exists = merged.some(existing => existing.name === defaultMember.name && existing.year === year);
          if (!exists) {
            merged.push(defaultMember);
          }
        });
      });
      return merged;
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin-login');
  };

  const adminStats = [
    { title: 'Total Publications', value: '24', icon: FileText, color: 'text-blue-600' },
    { title: 'Upcoming Events', value: upcomingEventsList.length.toString(), icon: Calendar, color: 'text-green-600' },
    { title: 'Team Members', value: '12', icon: Users, color: 'text-purple-600' },
    { title: 'Achievements', value: '8', icon: Award, color: 'text-yellow-600' },
  ];

  const recentPublications = [
    { title: 'Annual Magazine 2023-2024', category: 'Magazine', date: '2024-01-15', status: 'Published' },
    { title: 'AI in Aeronautical Engineering', category: 'Article', date: '2024-01-10', status: 'Published' },
    { title: 'College News Edition 12', category: 'News', date: '2024-01-05', status: 'Draft' },
  ];

  const upcomingEvents = [
    { title: 'Design Workshop', date: '2024-02-15', attendees: 45, status: 'Confirmed' },
    { title: 'Coding Competition', date: '2024-02-20', attendees: 32, status: 'Planning' },
    { title: 'Photography Contest', date: '2024-02-25', attendees: 28, status: 'Confirmed' },
  ];

  // Helper to split events by date using our utility functions
  const upcomingEventsList = events.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
  const conductedEventsList = events.filter(e => {
    const eventDate = new Date(e.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate < today;
  });

  // --- Domain Heads CRUD logic ---
  const handleDomainHeadSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const headData = {
      year: formData.get('year'),
      name: formData.get('name'),
      position: formData.get('position'),
      image: formData.get('image'),
    };
    if (editingDomainHead && editingDomainHead.id) {
      updateDomainHead(editingDomainHead.id, headData)
        .then(updated => setDomainHeads(domainHeads.map(h => h.id === updated.id ? updated : h)))
        .catch(console.error);
    } else {
      addDomainHead(headData)
        .then(added => setDomainHeads([...domainHeads, added]))
        .catch(console.error);
    }
    setShowDomainHeadForm(false);
    setEditingDomainHead(null);
  };
  const handleDeleteDomainHead = (id) => {
    deleteDomainHead(id)
      .then(() => setDomainHeads(domainHeads.filter(h => h.id !== id)))
      .catch(console.error);
  };
  // --- Gallery CRUD logic ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const imageData = {
      year: formData.get('year'),
      image: formData.get('image'),
      index: formData.get('index'),
    };
    // Use editingGalleryYear and editingGalleryIndex for edit logic
    if (editingGalleryYear !== null && editingGalleryIndex !== null) {
      // You may want to implement update logic here if needed
      // For now, just close the form
      setShowGalleryForm(false);
      setEditingGalleryYear(null);
      setEditingGalleryIndex(null);
      return;
    } else {
      addGalleryImage(imageData)
        .then(added => setGallery([...gallery, added]))
        .catch(console.error);
    }
    setShowGalleryForm(false);
    setEditingGalleryYear(null);
    setEditingGalleryIndex(null);
  };
  const handleDeleteGalleryImage = (id) => {
    deleteGalleryImage(id)
      .then(() => setGallery(gallery.filter(img => img.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-theme-blue" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">The Compendium Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="flex items-center space-x-2"
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Website</span>
                </a>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="team">Journey</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Know More</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Publications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Recent Publications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPublications.map((pub, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{pub.title}</p>
                          <p className="text-xs text-gray-600">{pub.category} • {pub.date}</p>
                        </div>
                        <Badge variant={pub.status === 'Published' ? 'default' : 'secondary'}>
                          {pub.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEventsList.length > 0 ? (
                      upcomingEventsList.slice(0, 3).map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs text-gray-600">{event.date} • {event.location}</p>
                          </div>
                          <Badge variant="default">
                            Upcoming
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No upcoming events
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Publications Tab with CRUD */}
          <TabsContent value="publications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Publications</CardTitle>
                  <Button className="flex items-center space-x-2" onClick={() => { setEditingPub(null); setShowPubForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Publication</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Publications Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Publisher</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PDF Source</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image Source</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {publications.map((pub) => (
                        <tr key={pub.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{pub.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{pub.publisher || ''}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{pub.description}</td>
                          <td><a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">{pub.pdfUrl}</a></td>
                          <td><a href={pub.image} target="_blank" rel="noopener noreferrer">{pub.image}</a></td>
                          <td className="px-4 py-2 whitespace-nowrap">{pub.category}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{pub.date}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => window.open(pub.pdfUrl, '_blank')}><Eye className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" onClick={() => { setEditingPub(pub); setShowPubForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deletePublication(pub.id)
                                .then(() => setPublications(publications.filter(p => p.id !== pub.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Add/Edit Publication Form */}
                {showPubForm && (
                  <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">{editingPub ? 'Edit Publication' : 'Add Publication'}</h3>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const pubData = {
                        title: formData.get('title'),
                        publisher: formData.get('publisher'),
                        description: formData.get('description'),
                        image: formData.get('image'),
                        pdfUrl: formData.get('pdfUrl'),
                        date: formData.get('date'),
                        category: formData.get('category'),
                      };
                      if (editingPub) {
                        updatePublication(editingPub.id, pubData)
                          .then(updated => setPublications(publications.map(p => p.id === updated.id ? updated : p)))
                          .catch(console.error);
                      } else {
                        addPublication(pubData)
                          .then(added => setPublications([...publications, added]))
                          .catch(console.error);
                      }
                      setShowPubForm(false);
                      setEditingPub(null);
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input name="title" defaultValue={editingPub?.title || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Publisher Name</label>
                        <input name="publisher" defaultValue={editingPub?.publisher || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea name="description" defaultValue={editingPub?.description || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Image URL</label>
                        <input name="image" defaultValue={editingPub?.image || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">PDF URL</label>
                        <input name="pdfUrl" defaultValue={editingPub?.pdfUrl || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input name="date" type="date" defaultValue={editingPub?.date || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Category</label>
                        <input name="category" defaultValue={editingPub?.category || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit">{editingPub ? 'Update' : 'Add'}</Button>
                        <Button type="button" variant="outline" onClick={() => { setShowPubForm(false); setEditingPub(null); }}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab with CRUD */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Events</CardTitle>
                  <Button className="flex items-center space-x-2" onClick={() => { setEditingEvent(null); setShowEventForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Event</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Upcoming Events Table */}
                <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {upcomingEventsList.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No upcoming events</td></tr>
                      )}
                      {upcomingEventsList.map((event) => (
                        <tr key={event.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{event.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingEvent(event); setShowEventForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteEvent(event.id)
                                .then(() => setEvents(events.filter(e => e.id !== event.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Conducted Events Table */}
                <h3 className="text-lg font-semibold mb-2">Conducted Events</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {conductedEventsList.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-4 text-gray-400">No conducted events</td></tr>
                      )}
                      {conductedEventsList.map((event) => (
                        <tr key={event.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{event.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingEvent(event); setShowEventForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteEvent(event.id)
                                .then(() => setEvents(events.filter(e => e.id !== event.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showEventForm && (
                  <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const eventData = {
                        title: formData.get('title'),
                        date: formData.get('date'),
                        time: formData.get('time'),
                        location: formData.get('location'),
                        description: formData.get('description'),
                        image: formData.get('image'),
                        category: formData.get('category'),
                      };
                      if (editingEvent) {
                        updateEvent(editingEvent.id, eventData)
                          .then(updated => setEvents(events.map(e => e.id === updated.id ? updated : e)))
                          .catch(console.error);
                      } else {
                        addEvent(eventData)
                          .then(added => setEvents([...events, added]))
                          .catch(console.error);
                      }
                      setShowEventForm(false);
                      setEditingEvent(null);
                    }} className="space-y-4">
                      <div><label className="block text-sm font-medium">Title</label><input name="title" defaultValue={editingEvent?.title || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Date</label><input name="date" type="date" defaultValue={editingEvent?.date || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Time</label><input name="time" defaultValue={editingEvent?.time || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Location</label><input name="location" defaultValue={editingEvent?.location || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Description</label><textarea name="description" defaultValue={editingEvent?.description || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Image URL</label><input name="image" defaultValue={editingEvent?.image || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Category</label><input name="category" defaultValue={editingEvent?.category || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div className="flex gap-2"><Button type="submit">{editingEvent ? 'Update' : 'Add'}</Button><Button type="button" variant="outline" onClick={() => { setShowEventForm(false); setEditingEvent(null); }}>Cancel</Button></div>
                    </form>
                  </div>
                )}
                <Button variant="outline" className="ml-2" onClick={() => {
                  fetchEvents()
                    .then(setEvents)
                    .catch(console.error);
                }}>Reset to Real Data</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab with CRUD */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Journey</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Section: General Overview */}
                <h2 className="text-2xl font-bold mb-6">General Overview</h2>
                {/* Section 1: All Team Members */}
                <h3 className="text-xl font-bold mb-4">All Team Members (All Years)</h3>
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {team.map((member) => (
                        <tr key={member.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{member.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{member.role}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingTeam(member); setShowTeamForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteTeamMember(member.id)
                                .then(() => setTeam(team.filter(t => t.id !== member.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button className="flex items-center space-x-2 mt-4" onClick={() => { setEditingTeam(null); setShowTeamForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Member</span>
                  </Button>
                {showTeamForm && (
                  <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">{editingTeam ? 'Edit Member' : 'Add Member'}</h3>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const memberData = {
                        name: formData.get('name'),
                        role: formData.get('role'),
                        image: formData.get('image'),
                        bio: formData.get('bio'),
                        year: formData.get('year'),
                        reflection: formData.get('reflection'),
                      };
                      if (editingTeam) {
                        updateTeamMember(editingTeam.id, memberData)
                          .then(updated => setTeam(team.map(t => t.id === updated.id ? updated : t)))
                          .catch(console.error);
                      } else {
                        addTeamMember(memberData)
                          .then(added => setTeam([...team, added]))
                          .catch(console.error);
                      }
                      setShowTeamForm(false);
                      setEditingTeam(null);
                    }} className="space-y-4">
                      <div><label className="block text-sm font-medium">Name</label><input name="name" defaultValue={editingTeam?.name || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Role</label><input name="role" defaultValue={editingTeam?.role || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Image URL</label><input name="image" defaultValue={editingTeam?.image || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Bio</label><textarea name="bio" defaultValue={editingTeam?.bio || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Year</label><input name="year" defaultValue={editingTeam?.year || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Reflection</label><textarea name="reflection" defaultValue={editingTeam?.reflection || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div className="flex gap-2"><Button type="submit">{editingTeam ? 'Update' : 'Add'}</Button><Button type="button" variant="outline" onClick={() => { setShowTeamForm(false); setEditingTeam(null); }}>Cancel</Button></div>
                    </form>
                  </div>
                )}
                  <Button variant="outline" className="ml-2 mt-4" onClick={() => { localStorage.removeItem('adminTeam'); setTeam([]); }}>Reset to Real Data</Button>
                </div>
                <Separator className="my-8" />
                {/* Section 2: All Timeline Events */}
                <h3 className="text-xl font-bold mb-4">All Timeline Slots (All Years)</h3>
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Key Developments</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">New Editions</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeline.map((tl) => (
                        <tr key={tl.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{tl.year}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{tl.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{tl.description}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{tl.keyDevelopments}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{tl.newEditions}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingTimeline(tl); setShowTimelineForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteTimeline(tl.id)
                                .then(() => setTimeline(timeline.filter(t => t.id !== tl.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Button className="flex items-center space-x-2 mt-4" onClick={() => { setEditingTimeline(null); setShowTimelineForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Timeline Slot</span>
                  </Button>
                  {showTimelineForm && (
                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                      <h3 className="text-lg font-semibold mb-4">{editingTimeline ? 'Edit Timeline Slot' : 'Add Timeline Slot'}</h3>
                      <form onSubmit={async e => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const formData = new FormData(form);
                        const tlData = {
                          year: formData.get('year'),
                          title: formData.get('title'),
                          description: formData.get('description'),
                          image: formData.get('image'),
                          keyDevelopments: formData.get('keyDevelopments'),
                          newEditions: formData.get('newEditions'),
                        };
                        if (editingTimeline) {
                          updateTimeline(editingTimeline.id, tlData)
                            .then(updated => setTimeline(timeline.map(t => t.id === updated.id ? updated : t)))
                            .catch(console.error);
                        } else {
                          addTimeline(tlData)
                            .then(added => setTimeline([...timeline, added]))
                            .catch(console.error);
                        }
                        setShowTimelineForm(false);
                        setEditingTimeline(null);
                      }} className="space-y-4">
                        <div><label className="block text-sm font-medium">Year</label><input name="year" defaultValue={editingTimeline?.year || ''} required className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm font-medium">Title</label><input name="title" defaultValue={editingTimeline?.title || ''} required className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm font-medium">Description</label><textarea name="description" defaultValue={editingTimeline?.description || ''} required className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm font-medium">Image URL</label><input name="image" defaultValue={editingTimeline?.image || ''} required className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm font-medium">Key Developments</label><input name="keyDevelopments" defaultValue={editingTimeline?.keyDevelopments || ''} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm font-medium">New Editions</label><input name="newEditions" defaultValue={editingTimeline?.newEditions || ''} className="w-full border rounded px-3 py-2" /></div>
                        <div className="flex gap-2"><Button type="submit">{editingTimeline ? 'Update' : 'Add'}</Button><Button type="button" variant="outline" onClick={() => { setShowTimelineForm(false); setEditingTimeline(null); }}>Cancel</Button></div>
                      </form>
                    </div>
                  )}
                  <Button variant="outline" className="ml-2 mt-4" onClick={() => { localStorage.removeItem('adminTimeline'); setTimeline(getInitialTimeline()); }}>Reset to Real Data</Button>
                </div>
                <Separator className="my-12" />
                {/* Section: Years */}
                <section className="mb-16">
                  <h2 className="text-2xl font-bold mb-6">Years</h2>
                  {/* All yearly content removed as requested */}
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab with CRUD */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Achievements</CardTitle>
                  <Button className="flex items-center space-x-2" onClick={() => { setEditingAchievement(null); setShowAchievementForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Achievement</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {achievements.map((achievement) => (
                        <tr key={achievement.id}>
                          <td className="px-4 py-2 whitespace-nowrap">{achievement.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{achievement.rollNo}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{achievement.category}</td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingAchievement(achievement); setShowAchievementForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteAchievement(achievement.id)
                                .then(() => setAchievements(achievements.filter(a => a.id !== achievement.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showAchievementForm && (
                  <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">{editingAchievement ? 'Edit Achievement' : 'Add Achievement'}</h3>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const achData = {
                        name: formData.get('name'),
                        rollNo: formData.get('rollNo'),
                        category: formData.get('category'),
                        description: formData.get('description'),
                        image: formData.get('image'),
                        pdf: formData.get('pdf'),
                      };
                      if (editingAchievement) {
                        updateAchievement(editingAchievement.id, achData)
                          .then(updated => setAchievements(achievements.map(a => a.id === updated.id ? updated : a)))
                          .catch(console.error);
                      } else {
                        addAchievement(achData)
                          .then(added => setAchievements([...achievements, added]))
                          .catch(console.error);
                      }
                      setShowAchievementForm(false);
                      setEditingAchievement(null);
                    }} className="space-y-4">
                      <div><label className="block text-sm font-medium">Name</label><input name="name" defaultValue={editingAchievement?.name || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Roll No</label><input name="rollNo" defaultValue={editingAchievement?.rollNo || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Category</label><input name="category" defaultValue={editingAchievement?.category || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Description</label><textarea name="description" defaultValue={editingAchievement?.description || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">Image URL</label><input name="image" defaultValue={editingAchievement?.image || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div><label className="block text-sm font-medium">PDF URL</label><input name="pdf" defaultValue={editingAchievement?.pdf || ''} required className="w-full border rounded px-3 py-2" /></div>
                      <div className="flex gap-2"><Button type="submit">{editingAchievement ? 'Update' : 'Add'}</Button><Button type="button" variant="outline" onClick={() => { setShowAchievementForm(false); setEditingAchievement(null); }}>Cancel</Button></div>
                    </form>
                  </div>
                )}
                <Button variant="outline" className="ml-2" onClick={() => { localStorage.removeItem('adminAchievements'); setAchievements([]); }}>Reset to Real Data</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab with CRUD */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Website Content</CardTitle>
                  <Button className="flex items-center space-x-2" onClick={() => { setEditingContent(null); setShowContentForm(true); }}>
                    <Plus className="h-4 w-4" />
                    <span>Add Content</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Content Preview</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {content.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 whitespace-nowrap font-medium">{item.section}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{item.title}</td>
                          <td className="px-4 py-2">
                            <div className="max-w-xs truncate text-sm text-gray-600">
                              {item.content.substring(0, 100)}...
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingContent(item); setShowContentForm(true); }}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                              deleteContent(item.id)
                                .then(() => setContent(content.filter(c => c.id !== item.id)))
                                .catch(console.error);
                            }}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Add/Edit Content Form */}
                {showContentForm && (
                  <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">{editingContent ? 'Edit Content' : 'Add Content'}</h3>
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      const contentData = {
                        section: formData.get('section'),
                        title: formData.get('title'),
                        content: formData.get('content'),
                        description: formData.get('description'),
                        buttonText: formData.get('buttonText'),
                        buttonLink: formData.get('buttonLink'),
                        contactInfo: formData.get('email') ? {
                          email: formData.get('email'),
                          linkedin: formData.get('linkedin'),
                          instagram: formData.get('instagram'),
                        } : undefined,
                        socialLinks: formData.get('socialLinkedin') ? {
                          linkedin: formData.get('socialLinkedin'),
                          instagram: formData.get('socialInstagram'),
                        } : undefined,
                      };
                      if (editingContent) {
                        updateContent(editingContent.id, contentData)
                          .then(updated => setContent(content.map(c => c.id === updated.id ? updated : c)))
                          .catch(console.error);
                      } else {
                        addContent(contentData)
                          .then(added => setContent([...content, added]))
                          .catch(console.error);
                      }
                      setShowContentForm(false);
                      setEditingContent(null);
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">Section</label>
                        <input name="section" defaultValue={editingContent?.section || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input name="title" defaultValue={editingContent?.title || ''} required className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea name="content" defaultValue={editingContent?.content || ''} required rows={4} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Description (Optional)</label>
                        <input name="description" defaultValue={editingContent?.description || ''} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Button Text (Optional)</label>
                        <input name="buttonText" defaultValue={editingContent?.buttonText || ''} className="w-full border rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Button Link (Optional)</label>
                        <input name="buttonLink" defaultValue={editingContent?.buttonLink || ''} className="w-full border rounded px-3 py-2" />
                      </div>
                      
                      {/* Contact Info Fields (for Footer) */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Contact Information (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input name="email" defaultValue={editingContent?.contactInfo?.email || ''} className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">LinkedIn Handle</label>
                            <input name="linkedin" defaultValue={editingContent?.contactInfo?.linkedin || ''} className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Instagram Handle</label>
                            <input name="instagram" defaultValue={editingContent?.contactInfo?.instagram || ''} className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Links Fields (for Footer) */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Social Media Links (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium">LinkedIn URL</label>
                            <input name="socialLinkedin" defaultValue={editingContent?.socialLinks?.linkedin || ''} className="w-full border rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Instagram URL</label>
                            <input name="socialInstagram" defaultValue={editingContent?.socialLinks?.instagram || ''} className="w-full border rounded px-3 py-2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button type="submit">{editingContent ? 'Update' : 'Add'}</Button>
                        <Button type="button" variant="outline" onClick={() => { setShowContentForm(false); setEditingContent(null); }}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab with CRUD */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Know More</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Know More: Yearly Pages (Table Format, Pre-populated Data) */}
                {Object.keys(teamMembersByYear).sort().map((year) => {
                  const hasTeam = (teamMembersByYear[year] && teamMembersByYear[year].length > 0);
                  const hasDomainHeads = domainHeads[year] && domainHeads[year].length > 0;
                  return (
                    <div key={year} className="mb-16 p-6 border rounded-lg bg-white/80">
                      <h2 className="text-3xl font-extrabold mb-10 text-center tracking-tight drop-shadow-lg text-theme-blue">{year} Know More</h2>
                      {/* Team Reflections: Only show if original data exists */}
                      {hasTeam && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Team Reflections</h3>
                          <table className="min-w-full divide-y divide-gray-200 mb-2">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Reflection</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(team.filter(m => m.year === year) || []).map((member) => (
                                <tr key={member.id}>
                                  <td className="px-4 py-2 whitespace-nowrap"><img src={memberImages[member.name] || '/team/default-avatar.jpg'} alt={member.name} className="w-12 h-12 rounded-full object-cover" /></td>
                                  <td className="px-4 py-2 whitespace-nowrap">{member.name}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{member.role}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{member.reflection || ''}</td>
                                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setEditingTeam(member); setShowTeamForm(true); }}>Edit</Button>
                                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                                      const updatedTeam = team.filter(t => t.id !== member.id);
                                      setTeam(updatedTeam);
                                      localStorage.setItem('adminTeam', JSON.stringify(updatedTeam));
                                    }}>Delete</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Button className="flex items-center space-x-2 mt-2" onClick={() => { setEditingTeam({ year, id: null, name: '', role: '', reflection: '', image: '', bio: '' }); setShowTeamForm(true); }}>
                            <Plus className="h-4 w-4" />
                            <span>Add Reflection</span>
                          </Button>
                        </div>
                      )}
                      {/* Domain Heads: Only show if original data exists (2024 and later) */}
                      {hasDomainHeads && (
                        <div className="mb-8">
                          <h3 className="text-xl font-bold mb-4">Domain Heads</h3>
                          <table className="min-w-full divide-y divide-gray-200 mb-2">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(domainHeads[year] || []).map((head, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-2 whitespace-nowrap"><img src={head.image} alt={head.name} className="w-12 h-12 rounded-full object-cover" /></td>
                                  <td className="px-4 py-2 whitespace-nowrap">{head.name}</td>
                                  <td className="px-4 py-2 whitespace-nowrap">{head.position}</td>
                                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => { setEditingDomainHead({ ...head, year, idx }); setShowDomainHeadForm(true); }}>Edit</Button>
                                    <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                                      const updatedHeads = { ...domainHeads, [year]: domainHeads[year].filter((_, i) => i !== idx) };
                                      setDomainHeads(updatedHeads);
                                      localStorage.setItem('adminDomainHeads', JSON.stringify(updatedHeads));
                                    }}>Delete</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Button className="flex items-center space-x-2 mt-2" onClick={() => { setEditingDomainHead({ year, name: '', position: '', image: '' }); setShowDomainHeadForm(true); }}>
                            <Plus className="h-4 w-4" />
                            <span>Add Domain Head</span>
                          </Button>
                        </div>
                      )}
                      {/* Gallery: Table format, max 20 images */}
                      <div className="mb-8">
                        <h3 className="text-xl font-bold mb-4">Gallery (Max 20 Images)</h3>
                        <table className="min-w-full divide-y divide-gray-200 mb-2">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image Path</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: 20 }, (_, idx) => {
                              const imagePath = gallery[year]?.[idx] || '';
                              const hasImage = imagePath && imagePath !== `/gallery/years/${year}/img${idx + 1}.jpg`;
                              
                              return (
                                <tr key={idx}>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    {hasImage ? (
                                      <img 
                                        src={imagePath} 
                                        alt={`Gallery ${year} ${idx+1}`} 
                                        className="w-16 h-12 object-cover rounded-lg border"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = PLACEHOLDER_IMAGE;
                                        }}
                                      />
                                    ) : (
                                      <div className="w-16 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                        <span className="text-xs text-gray-500">No Image</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 max-w-xs truncate">
                                      {imagePath || 'Empty slot'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                                    <div className="relative">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileInputChange(e, year, idx)}
                                        className="hidden"
                                        id={`gallery-upload-${year}-${idx}`}
                                      />
                                      <label
                                        htmlFor={`gallery-upload-${year}-${idx}`}
                                        className="cursor-pointer"
                                      >
                                        <Button size="sm" variant="outline" asChild>
                                          <span>Upload</span>
                                        </Button>
                                      </label>
                                    </div>
                                    {hasImage && (
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="text-red-600"
                                        onClick={() => {
                                          const updatedGallery = { ...gallery };
                                          updatedGallery[year][idx] = `/gallery/years/${year}/img${idx + 1}.jpg`;
                                          setGallery(updatedGallery);
                                        }}
                                      >
                                        Reset
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Gallery Management Instructions:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Click "Upload" to add an image to any slot</li>
                            <li>• Images are stored temporarily in the browser</li>
                            <li>• Click "Reset" to clear an uploaded image</li>
                            <li>• Empty slots show placeholder paths</li>
                            <li>• Maximum 20 images per year</li>
                          </ul>
                          <div className="mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedGallery = { ...gallery };
                                updatedGallery[year] = Array.from({ length: 20 }, (_, i) => `/gallery/years/${year}/img${i + 1}.jpg`);
                                setGallery(updatedGallery);
                              }}
                              className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                              Reset All Images for {year}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin; 