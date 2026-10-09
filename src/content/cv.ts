/**
 * Portfolio content, taken from Fatemeh Pakdaman's CV.
 * Edit this file to update the site; components only render what is here.
 */

const base = import.meta.env.BASE_URL;

export const LOGOS = {
  taarlab: { src: `${base}logos/taarlab.png`, alt: 'TaarLab logo', w: 126, h: 222 },
  ut: { src: `${base}logos/ut.png`, alt: 'University of Tehran logo', w: 316, h: 316 },
  kntu: { src: `${base}logos/kntu-emblem.png`, alt: 'K. N. Toosi University of Technology logo', w: 280, h: 282 },
} as const;

export type LogoId = keyof typeof LOGOS;

export const PROFILE = {
  name: 'Fatemeh Pakdaman',
  role: 'AI researcher in reinforcement learning and robotics',
  affiliation: 'TaarLab, University of Tehran',
  emails: ['f.pakdaman@ut.ac.ir', 'fatemeh1p13@gmail.com'],
  linkedin: 'https://www.linkedin.com/in/fatemeh-pakdaman-63558a232',
  interests: ['Deep Learning', 'Reinforcement Learning', 'Robotics', 'Image Processing'],
  languages: [
    { name: 'Persian', level: 'Native' },
    { name: 'English', level: 'Fluent' },
  ],
};

export const FACTS = [
  { value: '2', label: 'conference papers' },
  { value: 'Top 5%', label: 'of B.Sc. entrance cohort' },
  { value: '7', label: 'courses as TA or Head TA' },
];

export const CURRENT = {
  logo: 'taarlab' as LogoId,
  org: 'TaarLab',
  place: 'University of Tehran',
  title: 'AI Researcher',
  since: 'Sep 2024 – present',
  focus: 'Reinforcement learning and robotics',
  thesis: 'Room rearrangement using AI-based collaborative robotic agents',
  supervisors: [
    { name: 'Prof. Ahmad Kalhor', url: 'https://scholar.google.com/citations?user=m7xdmMgAAAAJ&hl=en' },
    { name: 'Prof. Mehdi Tale Masouleh', url: 'https://scholar.google.com/citations?user=gkiFy20AAAAJ&hl=en' },
  ],
};

export type Education = {
  logo: LogoId;
  school: string;
  degree: string;
  period: string;
  place: string;
  gpa: string;
  thesisLabel: string;
  thesis: string;
  supervisors: { name: string; url?: string }[];
};

export const EDUCATION: Education[] = [
  {
    logo: 'ut',
    school: 'University of Tehran',
    degree: 'M.Sc. in Control Engineering',
    period: '2024 – present',
    place: 'Tehran, Iran',
    gpa: 'A- (3.05 / 4)',
    thesisLabel: 'Master thesis',
    thesis: 'Room rearrangement using AI-based collaborative robotic agents',
    supervisors: CURRENT.supervisors,
  },
  {
    logo: 'kntu',
    school: 'K. N. Toosi University of Technology',
    degree: 'B.Sc. in Electrical Engineering',
    period: '2020 – 2024',
    place: 'Tehran, Iran',
    gpa: 'A- (3.94 / 4) · top 5% of entrance cohort',
    thesisLabel: 'Bachelor thesis',
    thesis: 'U-Net based segmentation and classification of brain hemorrhage in CT scans',
    supervisors: [
      { name: 'Prof. Amirhossein Nikoofard', url: 'https://scholar.google.com/citations?hl=en&user=vk4WVkQAAAAJ' },
    ],
  },
];

export type ProjectCategory = 'Robotics' | 'Deep Learning' | 'Course';

export type Project = {
  title: string;
  category: ProjectCategory;
  date: string;
  /** sortable yyyy-mm */
  sort: string;
  context?: string;
  summary: string;
  tags: string[];
  metric?: { value: string; label: string };
};

export const PROJECTS: Project[] = [
  {
    title: 'Cooperative Dual-Robot Navigation and Object Retrieval',
    category: 'Robotics',
    date: 'Aug 2026',
    sort: '2026-08',
    summary: 'Two simulated TurtleBots learn to find a box in a maze and bring it back together (warm start, then PPO / actor–critic).',
    tags: ['RL', 'PPO', 'Multi-robot'],
  },
  {
    title: 'Educational Drone',
    category: 'Robotics',
    date: 'Mar 2026',
    sort: '2026-03',
    summary: 'A drone designed to teach students how drones work.',
    tags: ['Drones', 'Education'],
  },
  {
    title: 'Autonomous Race Drone Simulation',
    category: 'Robotics',
    date: 'Jul 2025',
    sort: '2025-07',
    summary: 'Pilot-free racing in simulation with classical computer vision and PID control.',
    tags: ['ROS', 'PID', 'Vision'],
  },
  {
    title: 'Autonomous Emergency Service Drone',
    category: 'Robotics',
    date: 'Mar 2024',
    sort: '2024-03',
    summary: 'Led the team, piloted, and built the onboard C++/OpenCV vision: road following, obstacle avoidance, QR and window detection.',
    tags: ['C++', 'OpenCV', 'Raspberry Pi'],
  },
  {
    title: 'Lunar Rover',
    category: 'Robotics',
    date: 'May 2023',
    sort: '2023-05',
    summary: 'Built the off-board vision (panoramas, colour and ArUco detection) and UDP link to the ground station.',
    tags: ['Vision', 'UDP', 'ArUco'],
    metric: { value: '2nd', label: 'RoboCup IranOpen 2023' },
  },
  {
    title: 'Brain Hemorrhage Segmentation and Classification',
    category: 'Deep Learning',
    date: 'Aug 2024',
    sort: '2024-08',
    context: 'Bachelor thesis',
    summary: 'U-Net and ResNet50 on a small, imbalanced CT dataset, with sampling, augmentation and loss tuning.',
    tags: ['U-Net', 'ResNet50', 'Medical imaging'],
    metric: { value: '0.94', label: 'sensitivity' },
  },
  {
    title: 'Brain Hemorrhage Classification in CT Scans',
    category: 'Deep Learning',
    date: 'Dec 2023',
    sort: '2023-12',
    summary: 'Compared ResNet34/50/101 and VGG16/19.',
    tags: ['ResNet', 'VGG'],
  },
  {
    title: 'Image Captioning on Flickr8k',
    category: 'Deep Learning',
    date: 'May 2025',
    sort: '2025-05',
    summary: 'ResNet50 encoder with a hybrid LSTM–GRU decoder; greedy and beam search, scored with BLEU.',
    tags: ['LSTM', 'GRU', 'BLEU'],
  },
  {
    title: 'Car Model Classification',
    category: 'Deep Learning',
    date: 'May 2025',
    sort: '2025-05',
    summary: 'Pre-trained VGG16 features with an SVM classifier for Toyota models.',
    tags: ['VGG16', 'SVM'],
  },
  {
    title: 'Cityscapes Segmentation',
    category: 'Deep Learning',
    date: 'Aug 2023',
    sort: '2023-08',
    summary: 'U-Net segmentation of urban street scenes.',
    tags: ['U-Net', 'Segmentation'],
  },
  {
    title: 'Predicting Spatial Problem-Solving Scores',
    category: 'Course',
    date: 'Apr 2024',
    sort: '2024-04',
    summary: 'Mental rotation scores from hand and facial movements; CNNs vs. regression, random forest and SVM.',
    tags: ['CNN', 'Random forest'],
  },
  {
    title: 'Decision Trees in Healthcare',
    category: 'Course',
    date: 'Jan 2024',
    sort: '2024-01',
    summary: 'COVID-19 symptoms, breast cancer and life expectancy data.',
    tags: ['Decision trees'],
  },
  {
    title: 'Quadcopter Modelling and Simulation',
    category: 'Course',
    date: 'Apr 2023',
    sort: '2023-04',
    summary: 'Mechanical design in SolidWorks, control simulation in Simulink.',
    tags: ['SolidWorks', 'Simulink'],
  },
];

export const PUBLICATIONS = [
  {
    authors: 'F. Pakdaman, S. M. Rastegari, H. Hosseini, M. Tale Masouleh, A. Kalhor, M. Nayeri',
    title: 'Egocentric Vision-Based Reinforcement Learning for Long-Horizon Cooperative Dual-Robot Object Transportation',
    venue: 'International Conference on Computer and Knowledge Engineering (ICCKE)',
    year: '2026',
    firstAuthor: true,
  },
  {
    authors: 'M. Hoseyni, K. Davoodi, F. Pakdaman, A. Nikoofard, M. Aliyari',
    title: 'Comprehensive Hyperparameter Tuning to Enhance Deep Learning Performance for Intracranial Hemorrhage Classification in Head CT Scans',
    venue: 'Iranian Conference on Biomedical Engineering (ICBME)',
    year: '2024',
    url: 'https://ieeexplore.ieee.org/abstract/document/10894967',
  },
];

export type Role = {
  title: string;
  org: string;
  place: string;
  period: string;
  detail: string;
  logo: LogoId;
};

export const RESEARCH_ROLES: Role[] = [
  { title: 'AI Researcher', org: 'TaarLab', place: 'University of Tehran', period: 'Sep 2024 – present', detail: 'Reinforcement learning and robotics', logo: 'taarlab' },
  { title: 'AI Researcher', org: 'APAC team', place: 'K. N. Toosi University', period: 'Jun 2023 – Dec 2024', detail: 'Deep learning for medical imaging', logo: 'kntu' },
  { title: 'Team Leader', org: 'KN2C Robotics Lab', place: 'K. N. Toosi University', period: 'Apr 2023 – Apr 2024', detail: 'Team management and image processing', logo: 'kntu' },
];

export type TeachingGroup = {
  place: string;
  logo: LogoId | null;
  courses: { course: string; role: 'TA' | 'Head TA'; term?: string }[];
};

/** Teaching assistant roles, grouped by university (newest first). */
export const TEACHING: TeachingGroup[] = [
  {
    place: 'University of Tehran',
    logo: 'ut',
    courses: [
      { course: 'Deep Learning', role: 'TA' },
      { course: 'Robotics', role: 'TA' },
    ],
  },
  {
    place: 'Enghelab-e Eslami Technical College',
    logo: null,
    courses: [{ course: 'Advanced Programming (Python)', role: 'TA', term: 'Fall 2024' }],
  },
  {
    place: 'K. N. Toosi University of Technology',
    logo: 'kntu',
    courses: [
      { course: 'Modeling and Simulation', role: 'Head TA', term: 'Spring 2024' },
      { course: 'Electronics 1', role: 'TA', term: 'Fall 2023' },
      { course: 'Numerical Methods', role: 'TA', term: 'Spring 2023' },
      { course: 'Electrical Circuits 2', role: 'TA', term: 'Fall 2022' },
    ],
  },
];

export const SKILLS = [
  { group: 'Programming', items: ['Python', 'C', 'C++'] },
  { group: 'AI', items: ['Deep Learning', 'Reinforcement Learning', 'Machine Learning', 'Image Processing'] },
  { group: 'Robotics', items: ['ROS', 'Computer Vision', 'PID control', 'OpenCV'] },
  { group: 'Research', items: ['Literature review', 'Team leadership', 'Project management', 'Communication'] },
];
