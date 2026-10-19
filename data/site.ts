export type Tag = 'video' | 'music' | '3d';
export type ProgramTone = Tag | 'steel';
export type Tone = ProgramTone | 'mix';
export type IconName = 'timeline' | 'waveform' | 'faders' | 'cube' | 'play' | 'pen' | 'browser' | 'code';
export type Level = 1 | 2 | 3;

export interface Program {
  name: string;
  category: string;
  tone: ProgramTone;
  level: Level;
  icon: IconName;
}

export interface Step {
  title: string;
  text: string;
}

export interface Service {
  title: string;
  tone: Tone;
  bgPos: string;
  what?: string;
  tools: string[]; // Program names
  example: string; // Project id
  steps?: Step[];
}

export interface Entry {
  id: string;
  role: string;
  org: string;
  clip: string;
  tooltip: string;
  start: string; // 'YYYY-MM'
  end?: string; // 'YYYY-MM', left out = open-ended
}

export interface Project {
  id: string;
  name: string;
  image: string;
  tags: Tag[];
  subtitle: string;
  description: string[]; // paragraphs, <strong> allowed
  tools: string;
  year: string;
  link: string;
  where: string;
}

export interface Channel {
  kind: 'email' | 'linkedin' | 'instagram' | 'youtube';
  label: string;
  big: string;
  sub: string;
  url: string; // empty = channel left out
}

export interface Fact {
  label: string;
  value?: string;
  tags?: Tag[];
}

export type SectionId = 'intro' | 'about' | 'programs' | 'services' | 'career' | 'projects' | 'contact';

export interface SectionText {
  marker: string; // label in the header bar
  title?: string;
  caption?: string;
  note?: string;
}

export interface Site {
  name: string;
  brand: string;
  location: string;
  photoAlt: string;
  headline: string[];
  sub: string;
  email: string;
  sections: Record<SectionId, SectionText>; // in page order
  about: { statement: string; facts: Fact[] };
  programs: Program[];
  services: Service[];
  career: Entry[];
  education: Entry[];
  projects: Project[];
  contact: Channel[];
}

export const TAG_LABEL: Record<Tag, string> = { video: 'Video', music: 'Music', '3d': '3D' };
export const LEVEL_LABEL: Record<Level, string> = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' };

const email = 'lozys.work@gmail.com';

export const site: Site = {
  name: 'Lonny Zeindler',
  brand: 'Lozy Work',
  location: 'Zürich · Berlin', // placeholder
  photoAlt: 'Lonny Zeindler wearing headphones, a city behind him',
  headline: ['Media Informatics', 'student at BHT Berlin'],
  sub: 'I edit video, produce music and build in 3D.',
  email,

  sections: {
    intro: { marker: 'Intro' },
    about: { marker: 'About', title: 'About me' },
    programs: { marker: 'Tools', title: 'Tools and languages', caption: 'Levels are self-assessed.' },
    services: { marker: 'Services', title: 'Services', caption: 'Pick a service to see what I do and how.' },
    career: { marker: 'Career', title: 'Career and education' },
    projects: { marker: 'Projects', title: 'Selected projects', caption: 'Pick a project to see what I did on it.' },
    contact: { marker: 'Contact', title: 'Contact', caption: 'Pick a channel.', note: 'Or write to me directly' },
  },

  about: {
    statement: 'I’m Lonny, a first-year Media Informatics student at BHT Berlin. Next to my studies I work for CISTEC AG in Zürich as a marketing assistant and video editor.',
    facts: [
      { label: 'Studying', value: 'B.Sc. Media Informatics, BHT Berlin' },
      { label: 'Working', value: 'CISTEC AG, Zürich' },
      { label: 'Makes', tags: ['video', 'music', '3d'] },
    ],
  },

  programs: [
    { name: 'Final Cut Pro', category: 'Video', tone: 'video', level: 3, icon: 'timeline' },
    { name: 'Logic Pro', category: 'Music', tone: 'music', level: 3, icon: 'waveform' },
    { name: 'Ableton Live', category: 'Music', tone: 'music', level: 2, icon: 'faders' },
    { name: 'Blender', category: '3D', tone: '3d', level: 1, icon: 'cube' },
    { name: 'Adobe Premiere Pro', category: 'Video', tone: 'video', level: 1, icon: 'play' },
    { name: 'HTML & CSS', category: 'Web', tone: 'steel', level: 1, icon: 'browser' },
    { name: 'Java', category: 'Code', tone: 'steel', level: 1, icon: 'code' },
  ],

  services: [
    {
      title: 'Video editing & color grading',
      tone: 'video',
      bgPos: '54% 30%',
      tools: ['Final Cut Pro', 'Adobe Premiere Pro'],
      example: 'barkley',
    },
    {
      title: 'Music production & sound design',
      tone: 'music',
      bgPos: '72% 30%',
      tools: ['Logic Pro'],
      example: 'troy',
    },
    {
      title: '3D modeling & animation',
      tone: '3d',
      bgPos: '46% 50%',
      tools: ['Blender'],
      example: 'retro-tube',
    },
    {
      title: 'Social media content',
      tone: 'mix',
      bgPos: '78% 30%',
      tools: ['Final Cut Pro', 'Logic Pro'],
      example: 'nba-remix',
    },
  ],

  career: [
    {
      id: 'mkt',
      role: 'Marketing Assistant',
      org: 'CISTEC AG, Zürich',
      clip: 'Marketing Assistant',
      tooltip: 'Marketing Assistant, CISTEC AG',
      start: '2026-01',
    },
    {
      id: 'vid',
      role: 'Video Editor, UX design',
      org: 'CISTEC AG, Zürich',
      clip: 'Video Editor, UX design',
      tooltip: 'Video Editor, UX design, CISTEC AG',
      start: '2026-04', // placeholder
    },
  ],

  education: [
    {
      id: 'bht',
      role: 'B.Sc. Media Informatics',
      org: 'Berliner Hochschule für Technik (BHT)',
      clip: 'B.Sc. Media Informatics, BHT',
      tooltip: 'B.Sc. Media Informatics, BHT Berlin',
      start: '2026-09',
      end: '2029-08',
    },
    {
      id: 'matura',
      role: 'Matura, focus music',
      org: 'Atelierschule Zürich',
      clip: 'Matura, Atelierschule Zürich',
      tooltip: 'Matura, focus music, Atelierschule Zürich',
      start: '2021-08',
      end: '2025-07',
    },
  ],

  projects: [
    {
      id: 'nba-remix',
      name: 'NBA 2K x E-40 Remix',
      image: '/projects/nba_remix_challenge.webp',
      tags: ['music', 'video'],
      subtitle: 'A high-energy "Promo Edit" combining custom beat production with fast-paced basketball highlights',
      description: [
        'For this project, a friend and I entered the official <strong>NBA 2K x E-40 Remix Challenge</strong>. We engineered the beat in <strong>Logic Pro</strong> to hit hard and stay catchy, taking inspiration from the iconic 2K soundtracks.',
        "To promote the track, I used <strong>Final Cut Pro</strong> to create a rhythmic edit. I synced top-tier NBA plays to our custom transitions and bass drops, ensuring the visual energy matched the audio's intensity.",
      ],
      tools: 'Logic Pro, Final Cut Pro',
      year: '2025',
      link: 'https://www.instagram.com/reel/DE2IxdeNWnm/',
      where: 'Instagram',
    },
    {
      id: 'barkley',
      name: 'Saquon Barkley: 2K Royalty',
      image: '/projects/barkley_edit.webp',
      tags: ['music', 'video'],
      subtitle: "A high-energy sports tribute edit celebrating Saquon Barkley's historic 2024 MVP-caliber season and the Eagles' Super Bowl victory",
      description: [
        "Inspired by the wave of NFL edits during the 2024 season, I wanted to create a definitive tribute to Saquon Barkley's record-breaking year. After he surpassed 2,000 rushing yards and secured Offensive Player of the Year honors, I gathered the best game film to showcase his explosiveness.",
        'Using <strong>Final Cut Pro</strong>, I moved beyond simple cutting and focused heavily on custom visual filters and color grading to give the footage a cinematic, "premium" feel. To ensure the edit was 100% unique, I produced an <strong>original beat</strong> specifically for this video, allowing me to time every move to the rhythm of my own music.',
      ],
      tools: 'Final Cut Pro, Logic Pro',
      year: '2025',
      link: 'https://www.instagram.com/reel/DOMBw4iDKZa/',
      where: 'Instagram',
    },
    {
      id: 'warrior',
      name: 'To Become a Warrior',
      image: '/projects/maturaarbeit.webp',
      tags: ['video', 'music'],
      subtitle: 'A 10-minute documentary and theoretical thesis exploring how "Film Language" influences an audience and can be used as propaganda',
      description: [
        'Sidelined by an injury with the <strong>Winterthur Warriors</strong>, I used my recovery to deep-dive into cinema psychology. I handled the entire production: from researching and scriptwriting to capturing live-action footage during games and training.',
        'As a "one-man crew", I managed the full edit in Final Cut Pro and directed a professional voiceover session in Logic Pro. This project was a masterclass in filmmaking "rules," forcing me to balance the roles of director, cinematographer, and editor simultaneously.',
      ],
      tools: 'Final Cut Pro, Logic Pro',
      year: '2025',
      link: 'https://youtu.be/9VUrXeQQ7Bs',
      where: 'YouTube',
    },
    {
      id: 'retro-tube',
      name: 'The Retro Tube',
      image: '/projects/old_school_tv.webp',
      tags: ['3d'],
      subtitle: 'A stylized 3D animation of an "old school" vintage television, designed to serve as a custom intro for my YouTube channel',
      description: [
        'Inspiration struck when I saw a vintage metal sign featuring a classic TV set. I decided to recreate that aesthetic in 3D space using <strong>Blender</strong>. Since this was my first real dive into the software, I had to learn the fundamentals of 3D modeling from the ground up—shaping the geometry of the TV and experimenting with lighting to capture that nostalgic, retro glow.',
        'As a beginner, the biggest hurdle was understanding <strong>Materials and Texturing</strong>. Learning how to make plastic look like plastic and glass look like a screen—while also managing the keyframes for the animation—was a massive "level-up" moment for my technical skills.',
      ],
      tools: 'Blender',
      year: '2025',
      link: 'https://youtu.be/Pd0KQHxI0CQ',
      where: 'YouTube',
    },
    {
      id: 'troy',
      name: 'Cinematic Re-Scoring: Troy',
      image: '/projects/troy_resounded.webp',
      tags: ['video', 'music'],
      subtitle: 'Creative Direction',
      description: [
        // placeholder until Lonny writes it
        'I replaced the music of a scene from Troy with my own score and sound design, to hear how new music changes the same images.',
      ],
      tools: 'Logic Pro, Final Cut Pro',
      year: '2025',
      link: 'https://youtu.be/w47jHl_anqc',
      where: 'YouTube',
    },
  ],

  contact: [
    { kind: 'email', label: 'Email', big: email, sub: 'Click to copy', url: `mailto:${email}` },
    { kind: 'linkedin', label: 'LinkedIn', big: 'LinkedIn', sub: 'Open my profile', url: 'https://www.linkedin.com/in/lonny-zeindler-777b78383/' },
    { kind: 'instagram', label: 'Instagram', big: 'Instagram', sub: 'Reels and edits', url: 'https://www.instagram.com/lozy.work' },
    { kind: 'youtube', label: 'YouTube', big: 'YouTube', sub: 'The documentary, the Troy score, this TV', url: 'https://www.youtube.com/@lozy_work' },
  ],
};
