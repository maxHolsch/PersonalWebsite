export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  fullDescription?: string;
  url?: string;
  tags: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'debating-robot',
    title: 'DEBATING ROBOT',
    shortTitle: 'Debating Robot',
    description: 'AI-powered debate training system for improving argumentation skills',
    fullDescription: 'How can we train people for difficult conversations? This project centers around the idea that oftentimes pure logic will not be the thing to "win" a debate against someone, particularly when they always have another fact to pull out against you, or another topic to shift to. Rather, oftentimes the real way to win is to try and build common ground (while still holding true to your core beliefs), and build from there. This project explores these ideas, where people train in using constructive communication techniques against SteamBot, a steamrolling voice agent.',
    url: 'https://malevolent-oracle.vercel.app',
    tags: ['AI', 'Voice Agent', 'Education', 'Debate'],
    featured: true,
  },
  {
    slug: 'socratic-sciences-tool',
    title: 'SOCRATIC SCIENCES TOOL',
    shortTitle: 'Socratic Sciences',
    description: 'Argument mapping platform for structured reasoning',
    fullDescription: 'What kinds of questions can we ask one another to learn more about each other? This is what my teammates and I explored when building out a digital system for Socratic sciences. We envision a world where conversation actually enriches our lives. We harness the science of open-ended questioning to push beyond the chatter, spark insights, deepen relationships, and build community understanding and trust. To make this real, we built an online question card game—similar to Kahoot—where players can join rooms, then meet together on Zoom to answer and reflect on the questions.',
    url: 'https://socrascience.vercel.app/home',
    tags: ['Social', 'Education', 'Web App', 'Community'],
    featured: true,
  },
  {
    slug: 'ai-with-max',
    title: 'AI WITH MAX',
    shortTitle: 'AI with Max',
    description: 'Educational AI collaboration and learning platform',
    fullDescription: 'How can we train non-technical audiences to learn about new AI methods? This is what I sought to explore in a course I titled AI with Max (AIM, which conveniently was the name of the student organization where I launched this training, the Association of Innovative Marketers). The scope was simple: AI is taking over marketing, how can we make sure that we are ahead of the curve? We went through technical foundations, modern applications, and focused on helping each person in the class have a cool project by the end.',
    url: 'https://v0-ai-with-max.vercel.app',
    tags: ['Education', 'AI', 'Marketing', 'Course'],
    featured: true,
  },
  {
    slug: 'writing-and-policy',
    title: 'WRITING & POLICY',
    shortTitle: 'Writing & Policy',
    description: 'Research exploring deliberative democracy and decision-making',
    fullDescription: `Writing/policy projects:

**BlindSpots**
California has new legislation requiring prosecutors to view a race-redacted version of evidence before viewing the evidence normally and making a decision. No one has talked about how a program like this could be feasibly implemented, nor about issues with the research underpinning the law. We were the first to submit public comment greater than 10 sentences, and the only ones to comprehensively raise issue with the bill.
Link: www.openblindcharging.org

**Examining Bias in Unsupervised Learning Algorithms**
Wanting to write more in the realm of legal theory, I wrote an article examining issues in American case law regarding different kinds of unsupervised learning algorithms, and the 14th amendment's due process clause. Submitted and accepted to Trojan Review, USC's undergraduate law review journal.`,
    url: 'https://www.openblindcharging.org',
    tags: ['Policy', 'Research', 'Legal Theory', 'AI Ethics'],
    featured: true,
  },
  {
    slug: 'music-maker',
    title: 'MUSIC MAKER',
    shortTitle: 'Music Maker',
    description: 'Experimental music production interface using hand gestures',
    fullDescription: 'Personal project exploring: what might the future of music production look like? What if we could all be music DJs? How to use: the web app will track your fingers as a cursor. Pinch the play button to start the audio. Pinch and move your hand up or down to increase or decrease each individual knob. Double click on the text below the knob to change the vibe of the input.',
    url: 'https://promptdj-midi-amber.vercel.app/',
    tags: ['Music', 'Interactive', 'Web App', 'Experimental'],
    featured: false,
  },
  {
    slug: 'argument-mapper',
    title: 'ARGUMENT MAPPER',
    shortTitle: 'Argument Mapper',
    description: 'Visual tool for mapping complex arguments and reasoning',
    tags: ['Visualization', 'Logic', 'Research'],
    featured: false,
  },
  {
    slug: 'helping-informed-voters',
    title: 'HELPING INFORMED VOTERS',
    shortTitle: 'Informed Voters',
    description: 'Platform for voter education and informed decision-making',
    tags: ['Civic Tech', 'Education', 'Democracy'],
    featured: false,
  },
  {
    slug: 'keystroke-dynamics-scrambler',
    title: 'KEYSTROKE DYNAMICS SCRAMBLER',
    shortTitle: 'Keystroke Scrambler',
    description: 'Privacy tool exploring keystroke dynamics and user identification',
    tags: ['Privacy', 'Security', 'Research'],
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

export function getAllProjectSlugs(): string[] {
  return projects.map(project => project.slug);
}
