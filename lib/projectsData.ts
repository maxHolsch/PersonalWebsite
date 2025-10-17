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
    fullDescription: 'How can we train people for difficult conversations? This project centers around the idea that pure logic alone rarely wins debates, particularly when opponents have endless facts to pull out or constantly shift topics. Instead, the real path to productive discourse is building common ground while staying true to core beliefs. This project explores these principles through an interactive training experience where users practice constructive communication techniques against SteamBot, an AI voice agent designed to steamroll conversations. By engaging with SteamBot, users develop the skills needed to navigate challenging dialogues and find genuine points of connection, even in the most adversarial situations.',
    url: 'https://malevolent-oracle.vercel.app',
    tags: ['AI', 'Voice Agent', 'Education', 'Debate'],
    featured: true,
  },
  {
    slug: 'socratic-sciences-tool',
    title: 'SOCRATIC SCIENCES TOOL',
    shortTitle: 'Socratic Sciences',
    description: 'Argument mapping platform for structured reasoning',
    fullDescription: 'What kinds of questions can we ask one another to truly learn about each other? This is what my teammates and I explored when building a digital system for Socratic sciences. We envision a world where conversation actually enriches our lives, harnessing the science of open-ended questioning to push beyond surface-level chatter, spark meaningful insights, deepen relationships, and build community understanding and trust. To make this vision real, we created an online question card game similar to Kahoot, where players join virtual rooms and meet on Zoom to answer and reflect on carefully crafted questions together. The platform transforms casual conversation into an opportunity for genuine connection and mutual understanding.',
    url: 'https://socrascience.vercel.app/home',
    tags: ['Social', 'Education', 'Web App', 'Community'],
    featured: true,
  },
  {
    slug: 'ai-with-max',
    title: 'AI WITH MAX',
    shortTitle: 'AI with Max',
    description: 'Educational AI collaboration and learning platform',
    fullDescription: 'How can we train non-technical audiences to learn about new AI methods? This is what I sought to explore in a course I titled AI with Max (AIM, which conveniently aligned with the name of the student organization where I launched this training, the Association of Innovative Marketers). The scope was straightforward yet ambitious: AI is transforming marketing, and we need to stay ahead of the curve. The course covered technical foundations, modern applications, and real-world implementations, with a focus on ensuring each participant completed a meaningful project by the end. Through hands-on learning and practical applications, students gained the confidence and skills to leverage AI tools in their marketing careers.',
    url: 'https://v0-ai-with-max.vercel.app',
    tags: ['Education', 'AI', 'Marketing', 'Course'],
    featured: true,
  },
  {
    slug: 'writing-and-policy',
    title: 'WRITING & POLICY',
    shortTitle: 'Writing & Policy',
    description: 'Research exploring deliberative democracy and decision-making',
    fullDescription: `This collection represents my work at the intersection of policy, law, and technology.

BlindSpots is a critical analysis of California's new legislation requiring prosecutors to view race-redacted evidence before making decisions. While the intent is admirable, no one had addressed the practical implementation challenges or scrutinized the research underpinning the law. Our team submitted the first substantive public comment, and remains the only group to comprehensively examine the bill's potential issues. This work demonstrates how policy analysis must go beyond good intentions to consider real-world feasibility and scientific validity.

In my article "Examining Bias in Unsupervised Learning Algorithms," I explore issues in American case law regarding different types of unsupervised learning algorithms and their relationship to the 14th Amendment's due process clause. This piece bridges legal theory with emerging AI technologies, examining how our legal frameworks must evolve to address algorithmic decision-making. The article was accepted and published in Trojan Review, USC's undergraduate law review journal.`,
    url: 'https://www.openblindcharging.org',
    tags: ['Policy', 'Research', 'Legal Theory', 'AI Ethics'],
    featured: true,
  },
  {
    slug: 'music-maker',
    title: 'MUSIC MAKER',
    shortTitle: 'Music Maker',
    description: 'Experimental music production interface using hand gestures',
    fullDescription: 'What might the future of music production look like? What if we could all be music DJs? This experimental project reimagines how we interact with music creation tools by replacing traditional mouse-and-keyboard interfaces with intuitive hand gestures. Using computer vision and gesture recognition, the platform tracks hand movements to control audio parameters in real-time, making music production feel more like conducting or performing than programming. By lowering the technical barrier to music creation, this project explores a future where anyone can express themselves musically through natural, embodied interactions. The interface transforms complex production workflows into playful, accessible experiences that invite experimentation and creative exploration.',
    url: 'https://promptdj-midi-amber.vercel.app/',
    tags: ['Music', 'Interactive', 'Web App', 'Experimental'],
    featured: false,
  },
  {
    slug: 'argument-mapper',
    title: 'ARGUMENT MAPPER',
    shortTitle: 'Argument Mapper',
    description: 'Visual tool for mapping complex arguments and reasoning',
    fullDescription: 'Productive discourse often breaks down because participants lose track of what is actually being argued. Claims shift, premises go unexamined, and logical connections remain implicit. The Argument Mapper addresses this challenge by providing a real-time visualization tool that maps the structure of conversations as they unfold. Whether used in person or online, the platform helps participants see the logical architecture of their discussions, identifying where arguments connect, where they diverge, and where gaps in reasoning exist. By making argumentative structure explicit and visible, this tool facilitates more rational, focused conversations where participants can genuinely engage with each other\'s reasoning rather than talking past one another. The result is deeper understanding and more productive dialogue, even on contentious topics.',
    tags: ['Visualization', 'Logic', 'Research'],
    featured: false,
  },
  {
    slug: 'helping-informed-voters',
    title: 'HELPING INFORMED VOTERS',
    shortTitle: 'Informed Voters',
    description: 'Platform for voter education and informed decision-making',
    fullDescription: 'What if informed voting was incentivized, not just encouraged? This platform reimagines democratic participation by implementing a novel voting system where voters who engage with candidate platforms receive increased voting power. Originally designed for University of Southern California Undergraduate Student Government elections, the system addresses a fundamental challenge in democracy: many voters make decisions without understanding candidates\' positions or qualifications. By rewarding those who take time to read and understand candidate platforms, the system creates a natural incentive structure for civic education. This isn\'t about restricting access to voting, but rather about acknowledging and rewarding the effort of informed participation. The result is a more engaged electorate and election outcomes that better reflect the will of those who have genuinely considered the options.',
    tags: ['Civic Tech', 'Education', 'Democracy'],
    featured: false,
  },
  {
    slug: 'keystroke-dynamics-scrambler',
    title: 'KEYSTROKE DYNAMICS SCRAMBLER',
    shortTitle: 'Keystroke Scrambler',
    description: 'Privacy tool exploring keystroke dynamics and user identification',
    fullDescription: 'Every time you type, you leave a unique biometric signature. Keystroke dynamics—the rhythm, timing, and pressure of your typing—is a highly trackable identifier that can reveal your identity across different platforms and contexts. This project tackles the challenge of protecting typing privacy through intelligent scrambling. Unlike previous scrambling tools that simply randomized typing patterns (making it obvious a scrambler was being used), this approach uses sample profiles as a foundation, making the scrambled patterns appear natural and difficult to detect. By blending your typing signature with realistic baseline profiles, the tool provides genuine privacy protection without raising red flags. This innovation represents a significant advance in biometric privacy, demonstrating how defensive technologies can evolve to stay ahead of identification systems.',
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
