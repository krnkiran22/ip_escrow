export const COLLABORATION_TEMPLATES = {
  book: {
    id: 'book',
    name: 'Book (Writer + Illustrator)',
    category: 'Writing & Content',
    description: 'Collaborative book creation with writer and illustrator',
    roles: ['Writer', 'Illustrator'],
    suggestedMilestones: [
      {
        title: 'Draft Manuscript',
        description: 'Complete first draft of manuscript',
        percentage: 30,
        deliverableType: 'Document'
      },
      {
        title: 'Initial Illustrations',
        description: 'Create sketches for key scenes',
        percentage: 25,
        deliverableType: 'Design'
      },
      {
        title: 'Final Manuscript',
        description: 'Edited and finalized manuscript',
        percentage: 20,
        deliverableType: 'Document'
      },
      {
        title: 'Final Illustrations',
        description: 'Completed, full-color illustrations',
        percentage: 25,
        deliverableType: 'Design'
      }
    ],
    revenueSplit: {
      creator: 50,
      collaborator: 50
    },
    licenseTerms: {
      commercial: true,
      attribution: true,
      modifications: false
    },
    estimatedDuration: '3-6 months',
    typicalBudget: '2-5 ETH',
    icon: 'BookOpen'
  },
  
  music: {
    id: 'music',
    name: 'Music (Artist + Producer)',
    category: 'Music & Audio',
    description: 'Music production collaboration',
    roles: ['Artist/Songwriter', 'Producer'],
    suggestedMilestones: [
      {
        title: 'Song Composition',
        description: 'Melody, lyrics, and chord progression',
        percentage: 25,
        deliverableType: 'Audio'
      },
      {
        title: 'Demo Recording',
        description: 'Initial recording and arrangement',
        percentage: 25,
        deliverableType: 'Audio'
      },
      {
        title: 'Full Production',
        description: 'Mixed and mastered track',
        percentage: 30,
        deliverableType: 'Audio'
      },
      {
        title: 'Final Masters',
        description: 'Release-ready audio files',
        percentage: 20,
        deliverableType: 'Audio'
      }
    ],
    revenueSplit: {
      creator: 60,
      collaborator: 40
    },
    licenseTerms: {
      commercial: true,
      attribution: true,
      modifications: true
    },
    estimatedDuration: '1-3 months',
    typicalBudget: '1-3 ETH',
    icon: 'Music'
  },
  
  video: {
    id: 'video',
    name: 'Video (Director + Editor)',
    category: 'Video & Animation',
    description: 'Video production from concept to final cut',
    roles: ['Director', 'Video Editor'],
    suggestedMilestones: [
      {
        title: 'Concept & Storyboard',
        description: 'Video concept and visual planning',
        percentage: 20,
        deliverableType: 'Document'
      },
      {
        title: 'Raw Footage',
        description: 'Filmed raw video footage',
        percentage: 30,
        deliverableType: 'Video'
      },
      {
        title: 'Rough Cut',
        description: 'Initial edit for review',
        percentage: 25,
        deliverableType: 'Video'
      },
      {
        title: 'Final Cut',
        description: 'Color graded, polished final video',
        percentage: 25,
        deliverableType: 'Video'
      }
    ],
    revenueSplit: {
      creator: 55,
      collaborator: 45
    },
    licenseTerms: {
      commercial: true,
      attribution: true,
      modifications: false
    },
    estimatedDuration: '2-4 months',
    typicalBudget: '3-8 ETH',
    icon: 'Video'
  },
  
  game: {
    id: 'game',
    name: 'Game (Developer + Artist)',
    category: 'Programming & Tech',
    description: 'Indie game development collaboration',
    roles: ['Game Developer', '2D/3D Artist'],
    suggestedMilestones: [
      {
        title: 'Game Design Document',
        description: 'Complete GDD and art style guide',
        percentage: 15,
        deliverableType: 'Document'
      },
      {
        title: 'Core Mechanics Prototype',
        description: 'Working gameplay prototype',
        percentage: 25,
        deliverableType: 'Code'
      },
      {
        title: 'Art Assets',
        description: 'Characters, environments, UI',
        percentage: 30,
        deliverableType: 'Design'
      },
      {
        title: 'Final Game Build',
        description: 'Integrated, playable game',
        percentage: 30,
        deliverableType: 'Code'
      }
    ],
    revenueSplit: {
      creator: 50,
      collaborator: 50
    },
    licenseTerms: {
      commercial: true,
      attribution: true,
      modifications: true
    },
    estimatedDuration: '4-12 months',
    typicalBudget: '5-15 ETH',
    icon: 'Gamepad2'
  },

  design: {
    id: 'design',
    name: 'Brand Identity (Designer + Copywriter)',
    category: 'Graphic Design',
    description: 'Complete brand identity with visual and verbal elements',
    roles: ['Graphic Designer', 'Brand Copywriter'],
    suggestedMilestones: [
      {
        title: 'Brand Strategy & Research',
        description: 'Market research, mood boards, brand positioning',
        percentage: 20,
        deliverableType: 'Document'
      },
      {
        title: 'Visual Identity Concepts',
        description: 'Logo concepts, color palette, typography',
        percentage: 30,
        deliverableType: 'Design'
      },
      {
        title: 'Brand Messaging',
        description: 'Tagline, brand voice, key messaging',
        percentage: 25,
        deliverableType: 'Document'
      },
      {
        title: 'Brand Guidelines',
        description: 'Complete brand book with usage guidelines',
        percentage: 25,
        deliverableType: 'Document'
      }
    ],
    revenueSplit: {
      creator: 60,
      collaborator: 40
    },
    licenseTerms: {
      commercial: true,
      attribution: false,
      modifications: false
    },
    estimatedDuration: '1-2 months',
    typicalBudget: '2-4 ETH',
    icon: 'Palette'
  },

  podcast: {
    id: 'podcast',
    name: 'Podcast (Host + Editor)',
    category: 'Music & Audio',
    description: 'Podcast series production',
    roles: ['Podcast Host', 'Audio Editor'],
    suggestedMilestones: [
      {
        title: 'Series Concept & Planning',
        description: 'Format, topics, guest list, branding',
        percentage: 15,
        deliverableType: 'Document'
      },
      {
        title: 'Pilot Episode Recording',
        description: 'First episode raw recording',
        percentage: 25,
        deliverableType: 'Audio'
      },
      {
        title: 'Pilot Episode Edit',
        description: 'Edited, mixed pilot with intro/outro',
        percentage: 30,
        deliverableType: 'Audio'
      },
      {
        title: 'First 5 Episodes Delivered',
        description: 'Complete first batch of episodes',
        percentage: 30,
        deliverableType: 'Audio'
      }
    ],
    revenueSplit: {
      creator: 55,
      collaborator: 45
    },
    licenseTerms: {
      commercial: true,
      attribution: true,
      modifications: true
    },
    estimatedDuration: '2-3 months',
    typicalBudget: '1.5-4 ETH',
    icon: 'Mic'
  }
};

export function getTemplateIcon(iconName) {
  // This will be used to dynamically import icons
  return iconName;
}

export function applyTemplate(template, formSetters) {
  if (!template) return;
  
  // Auto-fill project title
  formSetters.setTitle(`${template.name} Project`);
  
  // Set category
  formSetters.setCategory(template.category);
  
  // Set description
  formSetters.setDescription(
    `Collaborative ${template.name.toLowerCase()} project. ${template.description}`
  );
  
  // Set milestones
  const milestones = template.suggestedMilestones.map((m, idx) => ({
    id: `milestone-${idx}`,
    title: m.title,
    description: m.description,
    percentage: m.percentage,
    deliverableType: m.deliverableType,
    amount: 0 // Will be calculated based on budget
  }));
  formSetters.setMilestones(milestones);
  
  // Set revenue split if available
  if (formSetters.setRevenueSplit) {
    formSetters.setRevenueSplit(template.revenueSplit);
  }
  
  // Set license terms if available
  if (formSetters.setLicenseTerms) {
    formSetters.setLicenseTerms(template.licenseTerms);
  }
  
  return true;
}
