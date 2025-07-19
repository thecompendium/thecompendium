import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import memberImages from '@/components/about/memberImages';
import timelineEvents from '@/components/about/timelineEvents';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Team members data (copy from About.tsx for demo)
const teamMembersByYear = {
  '2019': [
    { name: 'ANUSHA VAJHA', position: 'PRESIDENT' },
    { name: 'RAHUL SATTARAPU', position: 'VICE PRESIDENT' },
  ],
  '2020': [
    { name: 'RAHUL SATTARAPU', position: 'PRESIDENT' },
    { name: 'SHARWAN SOLANKI', position: 'CREATIVE DIRECTOR' },
    { name: 'SACHIN PISIPATI', position: 'MANAGING DIRECTOR' },
  ],
  '2021': [
    { name: 'SACHIN PISIPATI', position: 'PRESIDENT' },
    { name: 'MR X', position: 'CREATIVE DIRECTOR' },
    { name: 'MR X', position: 'MANAGING DIRECTOR' },
  ],
  '2022': [
    { name: 'MYTHRI BORRA', position: 'PRESIDENT' },
    { name: 'ABHIRAMI KIRTHIVASAN', position: 'CREATIVE DIRECTOR' },
    { name: 'HARSHINI MUNAGALA', position: 'MANAGING DIRECTOR' },
  ],
  '2023': [
    { name: 'CHILKURI SRI CHARAN REDDY', position: 'PRESIDENT' },
    { name: 'E F TRISHA ANGELINE', position: 'CREATIVE DIRECTOR' },
    { name: 'AMRUTHA VALLABHANENI', position: 'MANAGING DIRECTOR' },
  ],
  '2024': [
    { name: 'K YAGNESH REDDY', position: 'PRESIDENT' },
    { name: 'MULE BHARATH', position: 'CREATIVE DIRECTOR' },
    { name: 'ROHIT JOY', position: 'MANAGING DIRECTOR' },
  ],
};

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

const TimelineYear = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const event = timelineEvents.find(e => e.year === year);
  const team = teamMembersByYear[year] || [];

  // Update for Vite: use new import.meta.glob syntax and correct asset paths
  const gallery2023Images = Object.values(import.meta.glob('/gallery/years/2023/*?url', { eager: true, import: 'default' }));

  // Dynamically load images for the year (works for 2019 and future years)
  useEffect(() => {
    let images = [];
    if (year === '2019') {
      images = [
        '/gallery/years/2019/imgi_2_img_7537.jpg',
        '/gallery/years/2019/imgi_3_img_5896.jpg',
        '/gallery/years/2019/imgi_4_img_5916.jpg',
        '/gallery/years/2019/imgi_5_img_6038.jpg',
        '/gallery/years/2019/imgi_6_img_6186.jpg',
        '/gallery/years/2019/imgi_8_img_7547.jpg',
        '/gallery/years/2019/imgi_9_img_5913.jpg',
        '/gallery/years/2019/imgi_10_img_6108.jpg',
        '/gallery/years/2019/imgi_11_img_6347.jpg',
        '/gallery/years/2019/imgi_12_img_6363.jpg',
        '/gallery/years/2019/imgi_13_img_6397.jpg',
        '/gallery/years/2019/imgi_14_img_6398.jpg',
        '/gallery/years/2019/imgi_15_img_6402.jpg',
        '/gallery/years/2019/imgi_16_img_7369.jpg',
        '/gallery/years/2019/imgi_17_img_7496.jpg',
      ];
    } else if (year === '2024') {
      images = [
        '/gallery/years/2024/IMG-20250415-WA0051.jpg',
        '/gallery/years/2024/Screenshot 2025-07-03 154613.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154552.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154528.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154454.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154433.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154340.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154307.png',
        '/gallery/years/2024/Screenshot 2025-07-03 154241.png',
        '/gallery/years/2024/Screenshot 2025-07-03 153829.png',
        '/gallery/years/2024/IMG-20241130-WA0022.jpg',
        '/gallery/years/2024/IMG_20241130_160832.jpg',
        '/gallery/years/2024/IMG_20250426_144204.jpg',
        '/gallery/years/2024/IMG-20241207-WA0062.jpg',
        '/gallery/years/2024/IMG-20241207-WA0058.jpg',
        '/gallery/years/2024/IMG_20241207_161006.jpg',
        '/gallery/years/2024/IMG_0547.JPG',
        '/gallery/years/2024/IMG_20250208_141152.jpg',
        '/gallery/years/2024/IMG_20250208_152832~2.jpg',
        '/gallery/years/2024/IMG-20250215-WA0040.jpg',
        '/gallery/years/2024/IMG-20250215-WA0069.jpg',
        '/gallery/years/2024/IMG-20250215-WA0073.jpg',
        '/gallery/years/2024/IMG-20250215-WA0095.jpg',
        '/gallery/years/2024/IMG-20250215-WA0103.jpg',
        '/gallery/years/2024/IMG-20250329-WA0017.jpg',
        '/gallery/years/2024/IMG-20250412-WA0005.jpg',
        '/gallery/years/2024/IMG-20250412-WA0006.jpg',
        '/gallery/years/2024/IMG-20250415-WA0049.jpg',
        '/gallery/years/2024/IMG-20250415-WA0024(1).jpg',
        '/gallery/years/2024/IMG-20250415-WA0053.jpg',
      ];
    } else if (year === '2022') {
      images = [
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.58_668793f0.jpg',
        '/gallery/years/2022/WhatsApp Image f0.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.14.00_1bd5a6eb.jpg',
        '/gallery/years/2022/WhatsApp Image.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.54_c8c91fca.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.40_c38da9ef.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.17.53_68640c0c.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.17.53_8a1429ce.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.17.52_d8eb8322.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.59_13edec2c.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.59_2b934936.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.56_358e53e6.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.56_b49e4526.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.54_b5ed64b0.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.53_0a719790.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.52_1742dc94.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.51_bcfffa2b.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.51_3476d253.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.50_40db3cfa.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.49_02e9bf0f.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.38_c1ed7a68.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.39_4e817d41.jpg',
        '/gallery/years/2022/WhatsApp Image 2025-06-26 at 11.13.38_73e42e0b.jpg',
      ];
    } else if (year === '2023') {
      images = [
        '/gallery/years/2023/IMG_4841.jpg',
        '/gallery/years/2023/IMG-20240501-WA0017.jpg',
        '/gallery/years/2023/Screenshot 2025-07-03 202559.png',
        '/gallery/years/2023/Screenshot 2025-07-03 202645.png',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.23_f84b69de.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.24_9cbcbe86.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.24_d54432b0.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.26_53517f95.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.26_622cdfa6.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-03 at 22.18.27_c9150c9c.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-07 at 13.20.34_7b1a2999.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-07 at 15.21.14_315966fa.jpg',
        '/gallery/years/2023/WhatsApp Image 2025-07-07 at 15.22.31_772c9d62.jpg',
      ];
    } else {
      images = Array.from({ length: 20 }, (_, i) => `/gallery/years/${year}/img${i + 1}.jpg`);
    }
    setGalleryImages(shuffle(images));
  }, [year]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020B5E] to-[#03116a] text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400 underline mb-6">&larr; Back</button>
        {/* Only show Team Reflections title for years other than 2019 and 2021 */}
        {year !== '2019' && year !== '2020' && year !== '2021' && (
          <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight drop-shadow-lg">{year} Team Reflections</h1>
        )}
        {/* Only show reflections for years other than 2019 and 2021 */}
        {year !== '2019' && year !== '2020' && year !== '2021' && (
          <div className="flex flex-col items-center gap-12 mb-16">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.25 }}
                className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10"
                style={{ minHeight: 180 }}
              >
                <img
                  src={memberImages[member.name] || '/team/default-avatar.jpg'}
                  alt={member.name}
                  className="w-44 h-44 object-cover mb-4 md:mb-0 flex-shrink-0 rounded-full border-4 border-yellow-400 shadow-lg"
                  style={{ objectFit: 'cover', objectPosition: member.name === 'ABHIRAMI KIRTHIVASAN' ? 'center 10%' : 'center 30%' }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.25 + 0.3 }}
                  className="relative bg-white/10 rounded-2xl px-10 py-12 min-h-[250px] w-full max-w-5xl text-center md:text-left shadow-md border-l-4 border-yellow-400 font-serif text-lg text-white/95 flex-1"
                  style={{ fontFamily: 'serif' }}
                >
                  <div className="mb-2">
                    <span className="font-extrabold text-2xl md:text-3xl text-yellow-300 tracking-wide drop-shadow-lg" style={{ letterSpacing: '0.04em' }}>{member.name}</span>
                    {member.position && (
                      <span className="ml-3 px-2 py-1 bg-yellow-400/20 text-yellow-200 font-bold uppercase text-base md:text-lg rounded shadow-sm tracking-wider" style={{ letterSpacing: '0.08em' }}>
                        {member.position}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'Tangerine, cursive', fontSize: '1em', display: 'block', marginTop: 8 }}>
                    {member.name === 'MULE BHARATH' && year === '2024' ? (
                      <>
                        When I first joined The Compendium, I was just someone with a love for design and a spark of curiosity. I didn't know where I'd fit in or how much this place would come to mean to me. I started as a designer — quietly creating, learning, and watching the magic of teamwork unfold around me. With every poster, every idea shared, and every small contribution, I began to grow — not just in skill, but in confidence.<br /><br />
                        As time passed, I was trusted with more. Becoming the Design Head was a defining chapter — leading a team of creatives, holding together our visual identity, and learning the value of responsibility. And then came the moment I was named Creative Director — something I never expected, but will never forget. I was overwhelmed with surprise, pride, and gratitude. This role wasn't just about guiding design; it was about shaping the voice and spirit of the club. It taught me how to listen, lead, and dream bigger.<br /><br />
                        But what truly made this journey unforgettable were the people. I made friends who became family and shared moments I'll carry with me for life. From seniors who believed in me, to teammates who stood by me — thank you. The Compendium gave me so much more than a title. It gave me belonging, purpose, and a chapter of my life that I'll always hold close to my heart.
                      </>
                    ) : member.name === 'MYTHRI BORRA' && year === '2022' ? (
                      <>
                        My journey in The Compendium started off really simple — as a designer back when Rahul was the president. Honestly, I just wanted to make some connections and somehow managed to get into the club with the very little designing skills I had 😅. But I made sure I was active and contributed wherever I could. We used to have so many offline meetings back then — those were seriously some of the most fun times.<br /><br />
                        Then came Sachin Pisipati's term as president. And after that, he offered me the role of president — which, to be real, I never even imagined. I was honestly terrified to take it up. But Sachin really believed in me, explained how much potential I had,That push from him was everything and all the team members back then were so helpful . Taking up the president role was probably the biggest turning point in my personality. You won't believe it — I overcame stage fear, I learned how to organize events and meetups, and most importantly, I learned how to talk to people the right way.<br /><br />
                        The Compendium is such a big, old, and beautiful club — and carrying that legacy was a huge responsibility. I think I did a decent job at it 😊. And the rest? It's just amazing memories — the meetings, the random outings, the fun debates, the graphic designing workshop — everything felt like a hit and it was genuinely so much fun.<br /><br />
                        I just hope this vibe continues forever. To everyone taking up roles or just being a part of this club — please take care of it. This isn't just a club, it's genuinely like a family ❤.
                      </>
                    ) : member.name === 'ABHIRAMI KIRTHIVASAN' && year === '2022' ? (
                      <>
                        I initially joined the club on a whim—just a random meeting I walked into, mostly because I was trying to skip a class. I didn't have any expectations and barely knew what the club was really about. But something about the energy, the people, and the way everyone was so passionate about what they were doing caught my attention.<br /><br />
                        Over time, I started getting more involved. What started as casual participation turned into something I genuinely looked forward to. I met people who became close friends, mentors, and teammates. Slowly, I found myself stepping out of my comfort zone—taking initiative, sharing ideas, and eventually leading projects. The environment encouraged creativity and gave me space to learn by doing.<br /><br />
                        Eventually, I was given the opportunity to serve as the Creative Director. It wasn't something I ever imagined when I first walked in, but the journey taught me a lot about collaboration, responsibility, and believing in my own ideas. Being part of the club not only helped me grow personally, but it also made college feel more meaningful and connected.
                      </>
                    ) : member.name === 'HARSHINI MUNAGALA' && year === '2022' ? (
                      <>
                        In my first year, like many over enthusiastic freshers, I was a little hesitant but eager to try new things. That’s when I came across The Compendium during orientation and decided to give reporting a shot. I didn’t know it then, but that choice would end up shaping a beautiful part of my college experience.<br /><br />
                        I started as a reporter, then took on roles as Head of Reporting and later Managing Director. Interviewing people became one of my favorite parts, somewhere along the way, I realised I genuinely loved talking to people, especially about what they're passionate about. Interviewing others taught me how to listen, how to connect, and it brought some really meaningful friendships into my life.<br /><br />
                        Some of my best memories are from our monthly meets. We’d scramble to get people to show up, but the ones who came made it worth it. Those sessions were full of debates, laughter, and the kind of energy that made it all feel special.<br /><br />
                        Looking back, The Compendium wasn’t just a club I joined but a place I truly felt belonged overtime. It was a space that helped me find my voice, build real bonds, and create some of the best memories of college. I’ll always be grateful for that.
                      </>
                    ) : member.name === 'CHILKURI SRI CHARAN REDDY' && year === '2023' ? (
                      <>
                        Like many success stories, even mine did not have any shortcuts. It was the responsibility and sheer passion that I showed towards the roles that I was assigned. Starting as a content writer in the first year, to being the president of The Compendium, every position was a new dimension to be explored. The experience added an extra edge in handling the club as I had been in the shoes of my fellow club mates; showing empathy, and backing up the team in tough times is crucial to being a leader.<br /><br />
                        When I took upon the role of the president, I very well knew that it was not going be easy and fancy – both in terms of cooperation from the management and keeping up the team’s morale. The excitement and enthusiasm of any new team goes down within a snap. Being aware of this, I kept introducing new activities and events that made the club feel like we were doing something unique and fresh. Such a boost in the team kept all of us going. When it came to the coordination from the management, I took it like a challenge rather than as an excuse. Anyone on Earth providing with all the resources to do a splendid event, that is not really something notable. What makes a team more special and stronger are the hurdles we pass, and the challenges we accept. Hence The Compendium has become what we are today!<br /><br />
                        Everything did not go as we planned. But that is not what I look at, it is the journey I embrace. Years later when I look back at this phase of my life, my breath fills with pride, and my chin and chest go up!
                      </>
                    ) : member.name === 'E F TRISHA ANGELINE' && year === '2023' ? (
                      <>
                        When I first joined Compendium, I didn’t have a formal design degree or years of agency experience. What I did have was a sketchbook full of dreams, an eye for detail, and a heart that beat faster every time I opened Illustrator. I was a self-taught designer, fuelled by curiosity, late-night tutorials, and an eagerness to explore every corner of creativity.<br /><br />
                        I still remember the amount of nervousness I had during my interview—sitting across from our former Creative Director Jacob Alex and Ex-President Sachin. I was this quiet, unsure girl with a deep love for design, trying hard not to let my nerves show. <br /><br />
                        In those early days, I was reserved—letting my work speak louder than I could. But slowly, something began to shift. From a shy person, a new enthusiasm and energy began to grow. With every project, deadline, and team discussion, I stepped out of my shell a little more. I took on last-minute designs, experimented fearlessly, and slowly built the confidence to not just contribute—but to lead.<br /><br />
                        Over time, I moved from being a designer to Head of Design, learning to manage responsibilities, guide juniors, and create a space where creativity could thrive. Today, as Creative Director, I get to shape our visual voice while working alongside an amazing team.<br /><br />
                        From planning Workshops to bringing our quarterly editions and annual magazine to life, this journey has been nothing short of transformative. What started as a solo path of self-learning has become a shared creative mission—one that has taught me the power of collaboration, courage, and trusting your spark, even when your voice shakes.<br /><br />
                        I’m still growing, still learning—but with a clearer vision, a stronger voice, and a deep gratitude for how far this journey has brought me.
                      </>
                    ) : member.name === 'K YAGNESH REDDY' && year === '2024' ? (
                      <>
                        Thank You, The Compendium 💙<br /><br />
                        Right now, I’m the President of The Compendium—a tag that’s very special to me since childhood. But this journey wasn’t planned; it just happened step by step. I joined Compendium in my first year only because my friend joined. Honestly, I had no clue about the club. When Mythri akka called me after my application for Social Media Manager, I was totally blank. I started handling social media, but I was always scared—scared of every single Instagram story, every LinkedIn post, always doubting if I was doing things right. But Mythri akka, who was the President back then, was always so friendly and helpful. She supported me every time, no matter what.<br /><br />
                        In second year, things got busier. I became Social Media Head. That’s when Nithya and Shravya became like my pillars—always supportive, hardworking, and ready to help anytime. Sricharan anna became President that year—another gem of a person. He gave me full freedom, trusted me completely, and made me feel comfortable like a friend. But still, I felt something missing—I was doing the work but didn’t own the club from my heart. That changed when I met Sachin anna, our ex-President. In one 30-minute chat, he made me feel like Compendium is mine. His words planted that feeling inside me. From then on, I wasn’t working for the club—I was working as the club. Mythri akka and Charan anna always watered that plant with their support. One of the best memories from that time is The Scavenger Hunt—an online event me and my team organized. We were crazy excited every single day, and the event was a big success. I also have to mention Amrutha—our MD and the smiley girl of our club. Her ever-present smile kept the whole club fresh and happy.<br /><br />
                        And just like that, I reached my third year and became the President. I met Bharath (our CD) and Alex (our MD)—two amazing people. I always believe Compendium doesn’t run on one head, but three—CD, MD, and President. That’s what makes us different. The faith of Mythri akka, Charan anna in me gave me strength. The tree Sachin anna planted still grows inside me. But the real magic is the people—my core team, domain heads—so hardworking, so energetic. We are more like a family. There’s always something happening in our club group, always some event, some idea. We pulled off five successful events this year, and Compendium made noise across IARE like never before. The moment I received the club memento on stage—I can’t explain how proud I felt. That moment made me feel truly unique. And Bharath—I don’t have words. Sometimes I feel he is the President, not me. His dedication, ideas, friendship—he’s the backbone of everything. From midnight talks to endless planning, we shared more time talking about the club than about our studies. His presence kept Compendium alive and growing. Now it’s time to pass on the chair to the next generation. But the memories, the friendships, the love for this club—will always stay.<br /><br />
                        If I ever write a 100-page book on my life, 30 pages will be about The Compendium. Thank you, everyone, for trusting me and for making this journey unforgettable. Thank you so much 💙
                      </>
                    ) : member.name === 'AMRUTHA VALLABHANENI' && year === '2023' ? (
                      <>
                        I started my journey with compendium as a reporter in second year. the day i joined, there was an event (a debate) organised by compendium so i attended the debate and made a report of it the same day. I slowly understood the process and working of compendium. but what i love the most about the club is always the people and the idea of collaboration. each domain is interdependent, i write the report, get it approved by the domain head ( Harshini), send it to a writer or writer head,then pair the respective photographs. It was always fun to look forward to the appreciation to my reports by Harshini.<br /><br />
                        Then in 3rd year I happened to be in the core team, leading compendium as the managing director. It was a great experience considering I got to interact, guide and manage newbies and watch our club grow from the scratch all over again, keeping the functionality same,if not more effective. all the performances were remarkable, to watch juniors grow into their core team was memorable.
                      </>
                    ) : member.name === 'ROHIT JOY' && year === '2024' ? (
                      <>
                        Being a part of The Compendium has been one of the most enriching experiences of my college life. I joined as a designer under the leadership of Shruthi, and later Trisha, two people who not only guided me, but also inspired me with their dedication and vision. Under their mentorship, I learned the importance of detail, and how even the smallest design can bring a story to life.<br /><br />
                        Over time, I had the opportunity to take on more responsibility and was eventually entrusted with the role of Managing Director. It was a proud and humbling moment, to lead the very club where I had once been a quiet team member learning the ropes.<br /><br />
                        As MD, I got to experience every side of the club, the energy of our amazing sessions, the effort behind meeting deadlines, the rush of covering events, the satisfaction of seeing our work published, and yes, even the late night edits and work.<br /><br />
                        As I wrap up my journey with The Compendium, I just want to take a moment to say a heartfelt thank you.<br /><br />
                        To Shruthi, thank you for seeing potential in me and welcoming me into the design team.<br />
                        To Trisha, thank you for your constant guidance and for helping me grow as a designer under your leadership.<br />
                        To every team member, thank you for your creativity, support, and the countless memories we’ve shared.<br /><br />
                        To The Compendium itself, thank you for giving me a platform to learn, lead, and be part of something truly meaningful. This journey, from being a designer to becoming the Managing Director, has been one of the most fulfilling parts of my college life. I leave with a heart full of gratitude and memories I’ll always cherish. This club shaped a big part of who I am today, and for that, I’ll be forever thankful.
                      </>
                    ) : (
                      <>
                        This is a placeholder for {member.name}'s personal journey and experiences in the club during {year}. (Replace with real stories!)<br /><br />
                  During my time with the club, I had the opportunity to collaborate with an amazing team, learn new skills, and contribute to several successful projects. The experience not only helped me grow professionally but also allowed me to form lasting friendships and memories. I am grateful for the support and encouragement from my peers and mentors, which made this journey truly unforgettable.
                      </>
                    )}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
        {/* Domain Heads Section for 2024 */}
        {year === '2024' && (
          <div className="py-14 mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-6">Domain Heads</h2>
            <p className="text-gray-200 text-center mb-16">Meet our 2024 domain leaders</p>
            {(() => {
              const domainHeads = [
                {
                  name: 'ABHINAV VIKAS',
                  position: 'PHOTOGRAPHY HEAD',
                  image: '/team/domain-heads/ABHINAV VIKAS (1).png',
                },
                {
                  name: 'KRANTHI KUMAR VEGGALAM',
                  position: 'DESIGN HEAD',
                  image: '/team/domain-heads/kranthi kumar veggalam.png',
                },
                {
                  name: 'KEERTHI NORI',
                  position: 'WRITER HEAD',
                  image: '/team/domain-heads/keerthi nori.png',
                },
                {
                  name: 'MADKI SAI CHARAN',
                  position: 'REPORTER HEAD',
                  image: '/team/domain-heads/madki sai charan.png',
                },
                {
                  name: 'G.LIKITHA',
                  position: 'SOCIAL MEDIAHEAD',
                  image: '/team/domain-heads/G likitha.png',
                }
              ];
              const shuffledDomainHeads = React.useMemo(() => shuffle([...domainHeads]), []);
              const [centerIdx, setCenterIdx] = React.useState(0);
              const visibleCount = 5;
              const getDisplayIndices = () => {
                // Always show 5: center, 2 left, 2 right (with wrap-around)
                const indices = [];
                for (let i = -2; i <= 2; i++) {
                  indices.push((centerIdx + i + shuffledDomainHeads.length) % shuffledDomainHeads.length);
                }
                return indices;
              };
              const handleLeft = () => setCenterIdx(idx => (idx - 1 + shuffledDomainHeads.length) % shuffledDomainHeads.length);
              const handleRight = () => setCenterIdx(idx => (idx + 1) % shuffledDomainHeads.length);
              const displayIndices = getDisplayIndices();
              return (
                <div className="relative flex items-center justify-center max-w-6xl mx-auto">
                  {/* Left Arrow */}
                  <button
                    onClick={handleLeft}
                    className={`absolute left-0 z-20 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow transition`}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    aria-label="Scroll left"
                  >
                    <FaChevronLeft size={32} />
                  </button>
                  {/* Cards Row */}
                  <div className="flex flex-row justify-center items-center gap-8 w-full px-12">
                    {displayIndices.map((idx, pos) => {
                      const head = shuffledDomainHeads[idx];
                      const isCenter = pos === 2;
                      const isSide = pos === 1 || pos === 3;
                      const isFar = pos === 0 || pos === 4;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center cursor-pointer select-none
                            transition-all duration-500 ease-in-out transform
                            ${isCenter ? 'scale-125 z-30' : isSide ? 'scale-100 blur-sm opacity-60 z-20' : 'scale-90 blur-md opacity-30 z-10'}`}
                          style={{ minWidth: isCenter ? 320 : 180, maxWidth: isCenter ? 340 : 200 }}
                          onClick={() => isCenter ? null : setCenterIdx(idx)}
                        >
                          <img
                            src={head.image}
                            alt={head.name}
                            className={`rounded-full border-4 border-yellow-400 shadow object-cover bg-gray-100 transition-all duration-500 ease-in-out ${isCenter ? 'w-56 h-56' : 'w-32 h-32'}`}
                            style={{ objectPosition: 'center top' }}
                          />
                          <div className={`font-semibold uppercase text-lg mb-1 tracking-wide transition-all duration-500 ${isCenter ? 'text-yellow-400' : 'text-gray-400'}`}
                            style={{ fontSize: isCenter ? '1.35rem' : '1.1rem', letterSpacing: '0.08em', fontWeight: 700, textShadow: isCenter ? '0 2px 8px #0002' : 'none' }}
                          >{head.position}</div>
                          <div className={`mb-1 text-center transition-all duration-500 ${isCenter ? 'text-yellow-200 font-extrabold' : 'text-gray-400 font-bold'}`}
                            style={{ fontSize: isCenter ? '2.1rem' : '1.3rem', letterSpacing: '0.04em', textShadow: isCenter ? '0 2px 8px #0002' : 'none' }}
                          >{head.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Right Arrow */}
                  <button
                    onClick={handleRight}
                    className={`absolute right-0 z-20 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow transition`}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    aria-label="Scroll right"
                  >
                    <FaChevronRight size={32} />
                  </button>
                </div>
              );
            })()}
          </div>
        )}
        {/* Domain Heads Section for 2023 */}
        {year === '2023' && (
          <div className="py-14 mb-16 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-6">Domain Heads</h2>
            <p className="text-gray-200 text-center mb-16">Meet our 2023 domain leaders</p>
            {(() => {
              const domainHeads = [
                {
                  name: 'ANJANA PEREPI',
                  position: 'REPORTER HEAD',
                  image: '/team/domain-heads/ANJANA PEREPI.png',
                },
                {
                  name: 'NISHKARSH SHARMA',
                  position: 'WRITER HEAD',
                  image: '/team/domain-heads/NISHKARSH SHARMA.png',
                },
                {
                  name: 'MULE BHARATH',
                  position: 'DESIGNER HEAD',
                  image: memberImages['MULE BHARATH'] || '/team/mule-bharath.jpg',
                },
                {
                  name: 'K YAGNESH REDDY',
                  position: 'SOCIAL MEDIA',
                  image: memberImages['K YAGNESH REDDY'] || '/team/k-yagnesh-reddy.jpg',
                },
                {
                  name: 'ABHINAV VIKAS',
                  position: 'PHOTOGRAPHY HEAD',
                  image: '/team/domain-heads/ABHINAV VIKAS (1).png',
                }
              ];
              const shuffledDomainHeads = React.useMemo(() => shuffle([...domainHeads]), []);
              const [centerIdx, setCenterIdx] = React.useState(0);
              const visibleCount = 5;
              const getDisplayIndices = () => {
                const indices = [];
                for (let i = -2; i <= 2; i++) {
                  indices.push((centerIdx + i + shuffledDomainHeads.length) % shuffledDomainHeads.length);
                }
                return indices;
              };
              const handleLeft = () => setCenterIdx(idx => (idx - 1 + shuffledDomainHeads.length) % shuffledDomainHeads.length);
              const handleRight = () => setCenterIdx(idx => (idx + 1) % shuffledDomainHeads.length);
              const displayIndices = getDisplayIndices();
              return (
                <div className="relative flex items-center justify-center max-w-6xl mx-auto">
                  {/* Left Arrow */}
                  <button
                    onClick={handleLeft}
                    className={`absolute left-0 z-20 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow transition`}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    aria-label="Scroll left"
                  >
                    <FaChevronLeft size={32} />
                  </button>
                  {/* Cards Row */}
                  <div className="flex flex-row justify-center items-center gap-8 w-full px-12">
                    {displayIndices.map((idx, pos) => {
                      const head = shuffledDomainHeads[idx];
                      const isCenter = pos === 2;
                      const isSide = pos === 1 || pos === 3;
                      const isFar = pos === 0 || pos === 4;
                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center cursor-pointer select-none
                            transition-all duration-500 ease-in-out transform
                            ${isCenter ? 'scale-125 z-30' : isSide ? 'scale-100 blur-sm opacity-60 z-20' : 'scale-90 blur-md opacity-30 z-10'}`}
                          style={{ minWidth: isCenter ? 320 : 180, maxWidth: isCenter ? 340 : 200 }}
                          onClick={() => isCenter ? null : setCenterIdx(idx)}
                        >
                          <img
                            src={head.image}
                            alt={head.name}
                            className={`rounded-full border-4 border-yellow-400 shadow object-cover bg-gray-100 transition-all duration-500 ease-in-out ${isCenter ? 'w-56 h-56' : 'w-32 h-32'}`}
                            style={{ objectPosition: 'center top' }}
                          />
                          <div className={`font-semibold uppercase text-lg mb-1 tracking-wide transition-all duration-500 ${isCenter ? 'text-yellow-400' : 'text-gray-400'}`}
                            style={{ fontSize: isCenter ? '1.35rem' : '1.1rem', letterSpacing: '0.08em', fontWeight: 700, textShadow: isCenter ? '0 2px 8px #0002' : 'none' }}
                          >{head.position}</div>
                          <div className={`mb-1 text-center transition-all duration-500 ${isCenter ? 'text-yellow-200 font-extrabold' : 'text-gray-400 font-bold'}`}
                            style={{ fontSize: isCenter ? '2.1rem' : '1.3rem', letterSpacing: '0.04em', textShadow: isCenter ? '0 2px 8px #0002' : 'none' }}
                          >{head.name}</div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Right Arrow */}
                  <button
                    onClick={handleRight}
                    className={`absolute right-0 z-20 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow transition`}
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    aria-label="Scroll right"
                  >
                    <FaChevronRight size={32} />
                  </button>
                </div>
              );
            })()}
          </div>
        )}
        {/* Year Gallery Section */}
        {year !== '2020' && year !== '2021' && (
        <section className="mt-20 mb-10">
          <motion.h2
            className="text-3xl font-extrabold mb-10 text-yellow-400 text-center tracking-tight drop-shadow"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Gallery {year}
          </motion.h2>
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                className="relative group cursor-pointer bg-[#021496]/40 rounded-2xl border-4 border-yellow-400 shadow-xl overflow-hidden flex items-center justify-center"
                style={{
                  minWidth: 180,
                  minHeight: 120,
                  maxWidth: 400,
                  maxHeight: 350,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08, type: 'tween', ease: 'easeOut' }}
                whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(247,202,2,0.18)' }}
              >
                <img
                  src={img}
                  alt={`Gallery ${year} ${idx+1}`}
                  className="w-auto h-auto max-w-full max-h-[340px] object-contain transition-all duration-300 group-hover:shadow-yellow-400/40 bg-[#021496]/40"
                  style={{ display: 'block', margin: '0 auto' }}
                  onClick={() => { setLightboxImg(img); setLightboxIdx(idx); }}
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Download button overlay */}
                <a
                  href={img}
                  download
                  className="absolute bottom-3 right-3 bg-yellow-400 text-theme-blue rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg hover:bg-yellow-300"
                  title="Download image"
                  onClick={e => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.25h15m-7.5-16.5v12m0 0l-4.5-4.5m4.5 4.5l4.5-4.5" />
                  </svg>
                </a>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-all flex items-center justify-center text-lg font-bold text-yellow-300 select-none pointer-events-none">View</div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        )}
        {/* Lightbox Modal */}
        {lightboxImg && lightboxIdx !== null && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            tabIndex={-1}
            onClick={() => { setLightboxImg(null); setLightboxIdx(null); }}
            onKeyDown={e => {
              if (e.key === 'ArrowLeft') {
                e.stopPropagation();
                setLightboxIdx((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0);
                setLightboxImg(galleryImages[(lightboxIdx! - 1 + galleryImages.length) % galleryImages.length]);
              } else if (e.key === 'ArrowRight') {
                e.stopPropagation();
                setLightboxIdx((prev) => prev !== null ? (prev + 1) % galleryImages.length : 0);
                setLightboxImg(galleryImages[(lightboxIdx! + 1) % galleryImages.length]);
              } else if (e.key === 'Escape') {
                setLightboxImg(null); setLightboxIdx(null);
              }
            }}
          >
            <button
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-yellow-400 text-theme-blue rounded-full p-3 shadow-lg hover:bg-yellow-300 z-50"
              onClick={e => {
                e.stopPropagation();
                setLightboxIdx((prev) => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0);
                setLightboxImg(galleryImages[(lightboxIdx! - 1 + galleryImages.length) % galleryImages.length]);
              }}
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <img
              src={lightboxImg}
              alt="Large view"
              className="max-h-[80vh] max-w-[90vw] rounded-2xl border-4 border-yellow-400 shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-yellow-400 text-theme-blue rounded-full p-3 shadow-lg hover:bg-yellow-300 z-50"
              onClick={e => {
                e.stopPropagation();
                setLightboxIdx((prev) => prev !== null ? (prev + 1) % galleryImages.length : 0);
                setLightboxImg(galleryImages[(lightboxIdx! + 1) % galleryImages.length]);
              }}
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineYear; 