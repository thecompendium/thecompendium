const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');
const ACHIEVEMENTS_FILE = path.join(DATA_DIR, 'achievements.json');
const TIMELINE_FILE = path.join(DATA_DIR, 'timeline.json');
const TEAM_FILE = path.join(DATA_DIR, 'team.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const DOMAIN_HEADS_FILE = path.join(DATA_DIR, 'domain-heads.json');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

// Ensure data directory and events file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}
if (!fs.existsSync(EVENTS_FILE)) {
  fs.writeFileSync(EVENTS_FILE, '[]', 'utf8');
}
if (!fs.existsSync(PUBLICATIONS_FILE)) {
  fs.writeFileSync(PUBLICATIONS_FILE, '[]', 'utf8');
}
if (!fs.existsSync(ACHIEVEMENTS_FILE)) {
  fs.writeFileSync(ACHIEVEMENTS_FILE, '[]', 'utf8');
}
if (!fs.existsSync(TIMELINE_FILE)) {
  fs.writeFileSync(TIMELINE_FILE, '[]', 'utf8');
}
if (!fs.existsSync(TEAM_FILE)) {
  fs.writeFileSync(TEAM_FILE, '[]', 'utf8');
}
if (!fs.existsSync(CONTENT_FILE)) {
  fs.writeFileSync(CONTENT_FILE, '[]', 'utf8');
}
if (!fs.existsSync(DOMAIN_HEADS_FILE)) {
  fs.writeFileSync(DOMAIN_HEADS_FILE, '[]', 'utf8');
}
if (!fs.existsSync(GALLERY_FILE)) {
  fs.writeFileSync(GALLERY_FILE, '[]', 'utf8');
}

function readEvents() {
  try {
    const data = fs.readFileSync(EVENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeEvents(events) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
}

function readPublications() {
  try {
    const data = fs.readFileSync(PUBLICATIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writePublications(publications) {
  fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(publications, null, 2), 'utf8');
}

function readAchievements() {
  try {
    const data = fs.readFileSync(ACHIEVEMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeAchievements(achievements) {
  fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify(achievements, null, 2), 'utf8');
}

function readTimeline() {
  try {
    const data = fs.readFileSync(TIMELINE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeTimeline(timeline) {
  fs.writeFileSync(TIMELINE_FILE, JSON.stringify(timeline, null, 2), 'utf8');
}

function readTeam() {
  try {
    const data = fs.readFileSync(TEAM_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeTeam(team) {
  fs.writeFileSync(TEAM_FILE, JSON.stringify(team, null, 2), 'utf8');
}

function readContent() {
  try {
    const data = fs.readFileSync(CONTENT_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeContent(content) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
}

function readDomainHeads() {
  try {
    const data = fs.readFileSync(DOMAIN_HEADS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeDomainHeads(domainHeads) {
  fs.writeFileSync(DOMAIN_HEADS_FILE, JSON.stringify(domainHeads, null, 2), 'utf8');
}
function readGallery() {
  try {
    const data = fs.readFileSync(GALLERY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeGallery(gallery) {
  fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2), 'utf8');
}

// GET all events
app.get('/api/events', (req, res) => {
  res.json(readEvents());
});

// POST new event
app.post('/api/events', (req, res) => {
  const events = readEvents();
  const newEvent = { ...req.body, id: Date.now().toString() };
  events.push(newEvent);
  writeEvents(events);
  res.status(201).json(newEvent);
});

// PUT update event
app.put('/api/events/:id', (req, res) => {
  const events = readEvents();
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });
  events[idx] = { ...events[idx], ...req.body, id: events[idx].id };
  writeEvents(events);
  res.json(events[idx]);
});

// DELETE event
app.delete('/api/events/:id', (req, res) => {
  let events = readEvents();
  const idx = events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Event not found' });
  const deleted = events[idx];
  events = events.filter(e => e.id !== req.params.id);
  writeEvents(events);
  res.json(deleted);
});

// GET all publications
app.get('/api/publications', (req, res) => {
  res.json(readPublications());
});
// POST new publication
app.post('/api/publications', (req, res) => {
  const publications = readPublications();
  const newPub = { ...req.body, id: Date.now().toString() };
  publications.push(newPub);
  writePublications(publications);
  res.status(201).json(newPub);
});
// PUT update publication
app.put('/api/publications/:id', (req, res) => {
  const publications = readPublications();
  const idx = publications.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Publication not found' });
  publications[idx] = { ...publications[idx], ...req.body, id: publications[idx].id };
  writePublications(publications);
  res.json(publications[idx]);
});
// DELETE publication
app.delete('/api/publications/:id', (req, res) => {
  let publications = readPublications();
  const idx = publications.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Publication not found' });
  const deleted = publications[idx];
  publications = publications.filter(p => p.id !== req.params.id);
  writePublications(publications);
  res.json(deleted);
});

// GET all achievements
app.get('/api/achievements', (req, res) => {
  res.json(readAchievements());
});
// POST new achievement
app.post('/api/achievements', (req, res) => {
  const achievements = readAchievements();
  const newAch = { ...req.body, id: Date.now().toString() };
  achievements.push(newAch);
  writeAchievements(achievements);
  res.status(201).json(newAch);
});
// PUT update achievement
app.put('/api/achievements/:id', (req, res) => {
  const achievements = readAchievements();
  const idx = achievements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Achievement not found' });
  achievements[idx] = { ...achievements[idx], ...req.body, id: achievements[idx].id };
  writeAchievements(achievements);
  res.json(achievements[idx]);
});
// DELETE achievement
app.delete('/api/achievements/:id', (req, res) => {
  let achievements = readAchievements();
  const idx = achievements.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Achievement not found' });
  const deleted = achievements[idx];
  achievements = achievements.filter(a => a.id !== req.params.id);
  writeAchievements(achievements);
  res.json(deleted);
});

// GET all timeline events
app.get('/api/timeline', (req, res) => {
  res.json(readTimeline());
});
// POST new timeline event
app.post('/api/timeline', (req, res) => {
  const timeline = readTimeline();
  const newTL = { ...req.body, id: Date.now().toString() };
  timeline.push(newTL);
  writeTimeline(timeline);
  res.status(201).json(newTL);
});
// PUT update timeline event
app.put('/api/timeline/:id', (req, res) => {
  const timeline = readTimeline();
  const idx = timeline.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Timeline event not found' });
  timeline[idx] = { ...timeline[idx], ...req.body, id: timeline[idx].id };
  writeTimeline(timeline);
  res.json(timeline[idx]);
});
// DELETE timeline event
app.delete('/api/timeline/:id', (req, res) => {
  let timeline = readTimeline();
  const idx = timeline.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Timeline event not found' });
  const deleted = timeline[idx];
  timeline = timeline.filter(t => t.id !== req.params.id);
  writeTimeline(timeline);
  res.json(deleted);
});

// GET all team members
app.get('/api/team', (req, res) => {
  res.json(readTeam());
});
// POST new team member
app.post('/api/team', (req, res) => {
  const team = readTeam();
  const newMember = { ...req.body, id: Date.now().toString() };
  team.push(newMember);
  writeTeam(team);
  res.status(201).json(newMember);
});
// PUT update team member
app.put('/api/team/:id', (req, res) => {
  const team = readTeam();
  const idx = team.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Team member not found' });
  team[idx] = { ...team[idx], ...req.body, id: team[idx].id };
  writeTeam(team);
  res.json(team[idx]);
});
// DELETE team member
app.delete('/api/team/:id', (req, res) => {
  let team = readTeam();
  const idx = team.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Team member not found' });
  const deleted = team[idx];
  team = team.filter(m => m.id !== req.params.id);
  writeTeam(team);
  res.json(deleted);
});

// GET all content
app.get('/api/content', (req, res) => {
  res.json(readContent());
});
// POST new content
app.post('/api/content', (req, res) => {
  const content = readContent();
  const newContent = { ...req.body, id: Date.now().toString() };
  content.push(newContent);
  writeContent(content);
  res.status(201).json(newContent);
});
// PUT update content
app.put('/api/content/:id', (req, res) => {
  const content = readContent();
  const idx = content.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Content not found' });
  content[idx] = { ...content[idx], ...req.body, id: content[idx].id };
  writeContent(content);
  res.json(content[idx]);
});
// DELETE content
app.delete('/api/content/:id', (req, res) => {
  let content = readContent();
  const idx = content.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Content not found' });
  const deleted = content[idx];
  content = content.filter(c => c.id !== req.params.id);
  writeContent(content);
  res.json(deleted);
});

// Domain Heads CRUD
app.get('/api/domain-heads', (req, res) => {
  res.json(readDomainHeads());
});
app.post('/api/domain-heads', (req, res) => {
  const domainHeads = readDomainHeads();
  const newHead = { ...req.body, id: Date.now().toString() };
  domainHeads.push(newHead);
  writeDomainHeads(domainHeads);
  res.status(201).json(newHead);
});
app.put('/api/domain-heads/:id', (req, res) => {
  const domainHeads = readDomainHeads();
  const idx = domainHeads.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Domain head not found' });
  domainHeads[idx] = { ...domainHeads[idx], ...req.body, id: domainHeads[idx].id };
  writeDomainHeads(domainHeads);
  res.json(domainHeads[idx]);
});
app.delete('/api/domain-heads/:id', (req, res) => {
  let domainHeads = readDomainHeads();
  const idx = domainHeads.findIndex(h => h.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Domain head not found' });
  const deleted = domainHeads[idx];
  domainHeads = domainHeads.filter(h => h.id !== req.params.id);
  writeDomainHeads(domainHeads);
  res.json(deleted);
});

// Gallery CRUD
app.get('/api/gallery', (req, res) => {
  res.json(readGallery());
});
app.post('/api/gallery', (req, res) => {
  const gallery = readGallery();
  const newImage = { ...req.body, id: Date.now().toString() };
  gallery.push(newImage);
  writeGallery(gallery);
  res.status(201).json(newImage);
});
app.put('/api/gallery/:id', (req, res) => {
  const gallery = readGallery();
  const idx = gallery.findIndex(img => img.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Gallery image not found' });
  gallery[idx] = { ...gallery[idx], ...req.body, id: gallery[idx].id };
  writeGallery(gallery);
  res.json(gallery[idx]);
});
app.delete('/api/gallery/:id', (req, res) => {
  let gallery = readGallery();
  const idx = gallery.findIndex(img => img.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Gallery image not found' });
  const deleted = gallery[idx];
  gallery = gallery.filter(img => img.id !== req.params.id);
  writeGallery(gallery);
  res.json(deleted);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 