export const openingTypes = ['All', 'Jobs', 'Internships']

// Ye sample data hai. Apne hisaab se badal lo. Baad me dashboard se manage hoga.
export const openings = [
  {
    id: 'frontend-developer',
    type: 'Job',
    title: 'Frontend Developer (React)',
    department: 'Engineering',
    location: 'Delhi',
    workMode: 'Hybrid / Remote',
    experience: '0-2 years',
    salary: 'Based on skills',
    openings: 2,
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'Git'],
    about:
      'Build fast, beautiful and responsive interfaces for our clients and our own products using React and Tailwind CSS.',
    responsibilities: [
      'Convert designs into clean, responsive React code',
      'Build reusable components and smooth animations',
      'Connect the UI with backend APIs',
      'Test and fix bugs across devices and browsers',
    ],
    requirements: [
      'Good knowledge of HTML, CSS, JavaScript and React',
      'Comfortable with Tailwind CSS and Git',
      'Understanding of responsive design',
      'A portfolio or GitHub with projects',
    ],
  },
  {
    id: 'backend-developer',
    type: 'Job',
    title: 'Backend Developer (Node.js)',
    department: 'Engineering',
    location: 'Delhi',
    workMode: 'Hybrid / Remote',
    experience: '0-2 years',
    salary: 'Based on skills',
    openings: 1,
    skills: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    about:
      'Design and build secure, scalable APIs and databases that power our web applications.',
    responsibilities: [
      'Design and build REST APIs with Node.js and Express',
      'Create and manage MongoDB databases',
      'Implement login, roles and security',
      'Deploy and maintain backend services',
    ],
    requirements: [
      'Strong basics of Node.js, Express and MongoDB',
      'Understanding of JWT authentication and REST APIs',
      'Familiar with Git and Postman',
      'Willingness to learn Docker and CI/CD',
    ],
  },
  {
    id: 'digital-marketing-executive',
    type: 'Job',
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    location: 'Delhi',
    workMode: 'On-site / Remote',
    experience: '0-2 years',
    salary: 'Based on skills',
    openings: 1,
    skills: ['Meta Ads', 'Canva', 'Analytics', 'Content'],
    about:
      'Plan and run ad campaigns and social media for our clients and help local businesses grow online.',
    responsibilities: [
      'Plan and run Facebook and Instagram ad campaigns',
      'Manage social media content calendars',
      'Track performance and prepare reports',
      'Coordinate with designers and clients',
    ],
    requirements: [
      'Hands-on knowledge of Meta Ads Manager',
      'Good communication in English and Hindi',
      'Basic Canva or design skills',
      'Analytical mindset',
    ],
  },
  {
    id: 'mern-internship',
    type: 'Internship',
    title: 'MERN Stack Internship',
    department: 'Engineering',
    mode: 'Remote / Delhi',
    duration: '3 Months',
    fee: 'Free · small guidance fee',
    openings: 10,
    skills: ['React', 'Node.js', 'MongoDB'],
    about:
      'Learn full-stack web development by building real projects with mentor guidance. No prior experience needed, just the will to learn.',
    learn: [
      'Build real MERN projects with mentor guidance',
      'Git, GitHub and deployment basics',
      'Code reviews and industry best practices',
    ],
    requirements: [
      'Basic computer knowledge',
      'Interest in coding, no experience needed',
      'A laptop or computer with internet',
    ],
  },
  {
    id: 'digital-marketing-internship',
    type: 'Internship',
    title: 'Digital Marketing Internship',
    department: 'Marketing',
    mode: 'Remote / Delhi',
    duration: '2 Months',
    fee: 'Free · small guidance fee',
    openings: 10,
    skills: ['Meta Ads', 'Canva', 'Social Media'],
    about:
      'Learn how businesses grow online. Work on real campaigns and social media for real clients.',
    learn: [
      'Run Facebook and Instagram ad campaigns',
      'Create posts and reels with Canva',
      'Read analytics and make reports',
    ],
    requirements: [
      'Basic computer and smartphone knowledge',
      'Interest in social media and marketing',
      'Willingness to learn and practice',
    ],
  },
  {
    id: 'ai-automation-internship',
    type: 'Internship',
    title: 'AI & Automation Internship',
    department: 'AI',
    mode: 'Remote / Delhi',
    duration: '3 Months',
    fee: 'Free · small guidance fee',
    openings: 5,
    skills: ['Python', 'Machine Learning', 'Automation'],
    about:
      'Get started with practical AI. Build simple machine learning projects and automations that solve real business problems.',
    learn: [
      'Basic Python and machine learning projects',
      'Build simple automations and chatbots',
      'Use AI tools for everyday business tasks',
    ],
    requirements: [
      'Basic computer knowledge',
      'Curiosity about AI and technology',
      'A laptop or computer with internet',
    ],
  },
]

export const perks = [
  {
    icon: 'rocket',
    title: 'Real Projects',
    text: 'Work on live client projects from day one, not just practice tasks.',
  },
  {
    icon: 'users',
    title: 'Mentor Guidance',
    text: 'Learn from developers and marketers who guide you at every step.',
  },
  {
    icon: 'laptop',
    title: 'Flexible Work',
    text: 'Remote and hybrid options, with our base in Delhi.',
  },
  {
    icon: 'award',
    title: 'Freelance Chances',
    text: 'Good performers get freelance projects and paid opportunities.',
  },
]