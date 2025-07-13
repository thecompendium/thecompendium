export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  fullDescription?: string;
  image: string;
  category: string;
  capacity?: string;
  requirements?: string[];
  speakers?: Array<{
    name: string;
    role: string;
  }>;
  schedule?: Array<{
    time: string;
    activity: string;
  }>;
}

export const events: Event[] = [
  {
    id: "1",
    title: "State vs A Nobody",
    date: "2025-03-26",
    time: "2:00 PM to 4:00 PM",
    location: "Sangeeth Auditorium",
    description: "A unique legal simulation event that challenges participants to navigate complex legal scenarios and develop critical thinking skills.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // AI-generated law/courtroom image
    category: "Session",
    fullDescription: "A unique legal simulation event that challenges participants to navigate complex legal scenarios and develop critical thinking skills.",
  },
  {
    id: "2",
    title: "Courtroom Conundrum",
    date: "2025-04-11",
    time: "2:00 PM to 4:00 PM",
    location: "R&D Block 4th Floor",
    description: "Experience the thrill of legal drama in this immersive mock court session. Witness compelling arguments and strategic thinking in action.",
    image: "https://images.fastcompany.com/image/upload/f_webp,c_fit,w_1920,q_auto/wp-cms/uploads/2023/10/p-1-90970286-courtroom-design.jpg",
    category: "Competition",
    fullDescription: "Experience the thrill of legal drama in this immersive mock court session. Witness compelling arguments and strategic thinking in action.",
  },
  {
    id: "3",
    title: "Vibe Coding",
    date: "2025-03-29",
    time: "2:00 PM - 4:00 PM",
    location: "TIIC Center",
    description: "Join us for an exciting coding session where creativity meets technology. Experience the perfect blend of coding and innovation.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    category: "Workshop",
    fullDescription: "Join us for an exciting coding session where creativity meets technology. Experience the perfect blend of coding and innovation.",
  },
  {
    id: "4",
    title: "QUIZ : Battle Of The Brains",
    date: "2025-02-15",
    time: "1:30 PM - 4:00 PM",
    location: "TIIC Center",
    description: "An exciting quiz competition to test your knowledge across various topics and compete for amazing prizes.",
    image: "https://canopylab.io/wp-content/uploads/2023/01/Blog-Creating-multiple-choice-quizzes-with-the-CanopyLAB-Quiz-engine.jpg",
    category: "Competition",
    fullDescription: "An exciting quiz competition to test your knowledge across various topics and compete for amazing prizes.",
  },
  {
    id: "5",
    title: "Club Connect : Introducing New Joiners & Future Plans",
    date: "2025-02-08",
    time: "1:30 PM - 4:00 PM",
    location: "AV Center",
    description: "A welcoming event to introduce new members and discuss upcoming initiatives and plans for the club's future.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    category: "Conference",
    fullDescription: "A welcoming event to introduce new members and discuss upcoming initiatives and plans for the club's future.",
  },
  {
    id: "6",
    title: "Design For Everyone Workshop",
    date: "2024-12-07",
    time: "1:30 PM - 4:00 PM",
    location: "TIIC Center",
    description: "An interactive workshop exploring design principles and practices for all skill levels, focusing on accessibility and user experience.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    category: "Workshop",
    fullDescription: "An interactive workshop exploring design principles and practices for all skill levels, focusing on accessibility and user experience.",
  },
  {
    id: "7",
    title: "Website Launch",
    date: "2025-04-02",
    time: "3:00 PM to 4:00 PM",
    location: "AV Center",
    description: "Unveiling our digital presence — explore the official launch of our brand-new website!",
    image: "https://i.pinimg.com/736x/74/77/1b/74771bc4f8c628c2a5a50e5b06704465.jpg",
    category: "Conference",
    fullDescription: "Unveiling our digital presence — explore the official launch of our brand-new website!",
  }
]; 