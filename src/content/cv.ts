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
  email: 'f.pakdaman@ut.ac.ir',
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
  { value: '2nd', label: 'RoboCup IranOpen 2023, Lunar Rover' },
  { value: '5', label: 'courses as TA or Head TA' },
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
    gpa: 'A- (3.94 / 4), top 5% of entrance cohort',
    thesisLabel: 'Bachelor thesis',
    thesis:
      'Development of a deep neural network based on U-Net for segmentation and classification of brain hemorrhage in CT scan images',
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
  role?: string;
  tags: string[];
  metric?: { value: string; label: string };
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: 'Cooperative Dual-Robot Navigation and Object Retrieval',
    category: 'Robotics',
    date: 'Aug 2026',
    sort: '2026-08',
    summary:
      'Two TurtleBots navigate a maze in simulation to find a box and bring it back together. Training starts from a warm start and continues with PPO or actor–critic methods.',
    role: 'Reinforcement learning, environment design, reward shaping, robot control',
    tags: ['RL', 'PPO', 'Multi-robot', 'Simulation'],
    featured: true,
  },
  {
    title: 'Educational Drone',
    category: 'Robotics',
    date: 'Mar 2026',
    sort: '2026-03',
    summary: 'Designed a drone that helps students get hands-on with how drones work.',
    tags: ['Drones', 'Education', 'Hardware'],
  },
  {
    title: 'Autonomous Race Drone Simulation',
    category: 'Robotics',
    date: 'Jul 2025',
    sort: '2025-07',
    summary:
      'Control and vision stack that flies a simulated race drone around the track with no pilot, using classical computer vision and PID control.',
    tags: ['ROS', 'PID', 'Computer Vision'],
  },
  {
    title: 'Autonomous Emergency Service Drone',
    category: 'Robotics',
    date: 'Mar 2024',
    sort: '2024-03',
    summary:
      'A multi-sensor drone with onboard vision on a Raspberry Pi: road detection and following, obstacle avoidance, optical flow, QR code reading and window detection, written in C++ with OpenCV.',
    role: 'Project lead, pilot, vision system',
    tags: ['C++', 'OpenCV', 'Raspberry Pi', 'Leadership'],
    featured: true,
  },
  {
    title: 'Lunar Rover',
    category: 'Robotics',
    date: 'May 2023',
    sort: '2023-05',
    summary:
      'A rover for rough terrain with an off-board vision system: panoramic capture, colour detection and ArUco markers. A laptop sends driving commands over UDP and receives live video from the rover’s Odroid board.',
    role: 'Vision system and ground-station communication',
    tags: ['Vision', 'UDP', 'Odroid', 'ArUco'],
    metric: { value: '2nd', label: 'RoboCup IranOpen 2023' },
    featured: true,
  },
  {
    title: 'U-Net and ResNet50 for Brain Hemorrhage Segmentation and Classification',
    category: 'Deep Learning',
    date: 'Aug 2024',
    sort: '2024-08',
    context: 'Bachelor thesis',
    summary:
      'Faster, more accurate diagnosis of intracranial hemorrhage on a small, imbalanced CT dataset, using data reduction, distribution-based sampling, augmentation and adjusted loss functions.',
    tags: ['U-Net', 'ResNet50', 'Medical imaging'],
    metric: { value: '0.94', label: 'classification sensitivity' },
    featured: true,
  },
  {
    title: 'Brain Hemorrhage Classification in CT Scans',
    category: 'Deep Learning',
    date: 'Dec 2023',
    sort: '2023-12',
    summary: 'Compared ResNet34, ResNet50, ResNet101, VGG16 and VGG19 for classifying intracranial hemorrhage.',
    tags: ['ResNet', 'VGG', 'Medical imaging'],
  },
  {
    title: 'Image Captioning with a ResNet50 Encoder and Hybrid LSTM–GRU Decoder',
    category: 'Deep Learning',
    date: 'May 2025',
    sort: '2025-05',
    context: 'Deep Learning course',
    summary:
      'End-to-end captioning model trained on Flickr8k, with greedy and beam-search decoding, evaluated with BLEU.',
    tags: ['LSTM', 'GRU', 'Flickr8k', 'BLEU'],
  },
  {
    title: 'Car Model Classification with VGG16 Features and SVM',
    category: 'Deep Learning',
    date: 'May 2025',
    sort: '2025-05',
    context: 'Deep Learning course',
    summary: 'Classified Toyota car models by feeding features from a pre-trained VGG16 into an SVM classifier.',
    tags: ['VGG16', 'SVM', 'Transfer learning'],
  },
  {
    title: 'Cityscapes Segmentation with U-Net',
    category: 'Deep Learning',
    date: 'Aug 2023',
    sort: '2023-08',
    summary: 'Implemented U-Net to segment urban street scenes from the Cityscapes dataset.',
    tags: ['U-Net', 'Segmentation', 'Cityscapes'],
  },
  {
    title: 'Predicting Spatial Problem-Solving Scores with AI',
    category: 'Course',
    date: 'Apr 2024',
    sort: '2024-04',
    context: 'Mechatronics',
    summary:
      'Predicted mental rotation test scores from participants’ hand and facial movements. CNNs such as ResNet18 struggled with the small dataset, so linear regression, random forest and SVM were compared.',
    tags: ['CNN', 'ResNet18', 'Random forest'],
  },
  {
    title: 'Decision Trees in Healthcare',
    category: 'Course',
    date: 'Jan 2024',
    sort: '2024-01',
    context: 'Fundamentals of Intelligent Systems',
    summary: 'Applied decision tree algorithms to COVID-19 symptom, breast cancer and life expectancy datasets.',
    tags: ['Decision trees', 'Healthcare data'],
  },
  {
    title: 'Quadcopter Modelling and Simulation',
    category: 'Course',
    date: 'Apr 2023',
    sort: '2023-04',
    context: 'Modeling and Simulation',
    summary: 'Designed the quadcopter’s mechanical structure in SolidWorks and simulated its control system in Simulink.',
    tags: ['SolidWorks', 'Simulink', 'Control'],
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
  logo?: LogoId;
};

export const RESEARCH_ROLES: Role[] = [
  {
    title: 'AI Researcher',
    org: 'TaarLab',
    place: 'University of Tehran',
    period: 'Sep 2024 – present',
    detail: 'Reinforcement learning and robotics research.',
    logo: 'taarlab',
  },
  {
    title: 'AI Researcher',
    org: 'APAC team',
    place: 'K. N. Toosi University of Technology · Dr. Amirhossein Nikoofard',
    period: 'Jun 2023 – Dec 2024',
    detail: 'Deep network implementation, data management and literature review.',
    logo: 'kntu',
  },
  {
    title: 'Team Leader',
    org: 'KN2C Robotics Lab',
    place: 'K. N. Toosi University of Technology · Dr. Hamid D. Taghirad',
    period: 'Apr 2023 – Apr 2024',
    detail: 'Led the team, managed and graded work, and worked on image processing.',
    logo: 'kntu',
  },
];

export const TEACHING = [
  { course: 'Advanced Programming (Python)', role: 'TA', term: 'Fall 2024', where: 'Enghelab-e Eslami Technical College', with: 'Dr. Hossein Yektamoghadam' },
  { course: 'Modeling and Simulation', role: 'Head TA', term: 'Spring 2024', where: 'K. N. Toosi University of Technology', with: 'Dr. Mahdi Aliyari-Shoorehdeli' },
  { course: 'Electronics 1', role: 'TA', term: 'Fall 2023', where: 'K. N. Toosi University of Technology', with: 'Dr. Mehdi Ehsanian' },
  { course: 'Numerical Methods', role: 'TA', term: 'Spring 2023', where: 'K. N. Toosi University of Technology', with: 'Dr. Amirhossein Nikoofard' },
  { course: 'Electrical Circuits 2', role: 'TA', term: 'Fall 2022', where: 'K. N. Toosi University of Technology', with: 'Dr. Ali A. Razi-Kazemi' },
];

export const HONORS: { mark: string; title: string; detail: string; url?: string }[] = [
  {
    mark: '2nd',
    title: '2nd place, Lunar Rover League',
    detail: 'RoboCup IranOpen 2023',
    url: 'http://iranopenrobocup.ir/ranks-archive?search=0150199724',
  },
  { mark: '21–22', title: 'Dean’s list', detail: 'K. N. Toosi University of Technology, 2021–2022' },
];

export const CERTIFICATES = [
  { title: 'Convolutional Neural Networks', meta: 'Coursera · 35 h · Sep 2023', url: 'https://www.coursera.org/account/accomplishments/certificate/MHYRP7D4TW7D' },
  { title: 'Improving Deep Neural Networks: Hyperparameter Tuning, Regularization and Optimization', meta: 'Coursera · 23 h · Jun 2023', url: 'https://coursera.org/share/0cf6e5ec606e608d62295bf1802b080d' },
  { title: 'Structuring Machine Learning Projects', meta: 'Coursera · 6 h · Jun 2023', url: 'https://coursera.org/share/6b6963064f0e8cc4dbcfc6be1b170499' },
  { title: 'Neural Networks and Deep Learning', meta: 'Coursera · 24 h · Apr 2023', url: 'https://coursera.org/share/a4aee4ec24b84e9f7084730d162c0c19' },
  { title: 'Programming for Everybody', meta: 'Coursera · 18 h · Aug 2022', url: 'https://coursera.org/share/e01caed41fae67f341d88167e67ae878' },
];

export const SKILLS = [
  { group: 'Programming', items: ['Python', 'C', 'C++'] },
  { group: 'AI', items: ['Deep Learning', 'Reinforcement Learning', 'Machine Learning', 'Image Processing'] },
  { group: 'Robotics', items: ['ROS', 'Computer Vision', 'PID control', 'OpenCV'] },
  { group: 'Research', items: ['Literature review', 'Team leadership', 'Project management', 'Communication'] },
];

export const VOLUNTEERING = [
  { title: 'Technical Committee', detail: 'FIRA 2026', date: 'Aug 2026' },
  { title: 'Student Committee', detail: 'ICROM 2024', date: 'Dec 2024' },
  { title: 'Assisted in authoring a book', detail: 'Electrical Circuits 2, with Dr. Ali A. Razi-Kazemi', date: 'Spring 2022' },
];
