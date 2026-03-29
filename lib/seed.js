import prisma from './prisma.js'
import bcrypt from 'bcryptjs'
import { toPlainText } from './richTextUtils.js'

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ──────────────────────────────────────────────────
  // ADMIN USER
  // ──────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@arcline.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@arcline.com',
      password: hashedPassword,
      role: 'ADMIN',
      permissions: []
    }
  })
  console.log('✅ Admin user created/updated')

  // ──────────────────────────────────────────────────
  // PROJECTS
  // ──────────────────────────────────────────────────
  const projects = [
    {
      title: 'Stone Court Residence',
      slug: 'stone-court-residence',
      category: 'Residential',
      excerpt: 'A courtyard-led residence balancing privacy with filtered daylight and garden continuity.',
      description: 'This residence reorients domestic life around a shaded central court. Circulation loops across interior and exterior thresholds, enabling passive cooling while preserving family privacy.',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1616593969747-4797dc75033e?auto=format&fit=crop&w=1600&q=80'
      ],
      details: {
        location: 'Beirut',
        area: '420 m2',
        year: '2024',
        status: 'Completed'
      },
      published: true
    },
    {
      title: 'Northlight Office Hub',
      slug: 'northlight-office-hub',
      category: 'Commercial',
      excerpt: 'A layered workplace with daylight-first planning and acoustic zoning for hybrid teams.',
      description: 'Northlight Office Hub transforms an existing shell into a high-performance workspace. The strategy introduces collaborative spines, silent zones, and material transitions that support concentration.',
      images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80'],
      details: {
        location: 'Dubai',
        area: '1800 m2',
        year: '2025',
        status: 'Completed'
      },
      published: true
    },
    {
      title: 'Harborline Boutique Hotel',
      slug: 'harborline-boutique-hotel',
      category: 'Hospitality',
      excerpt: 'A coastal hospitality project built around tactile materials and choreographed arrival moments.',
      description: 'This boutique hotel concept combines local stone, timber, and textured plaster to frame a sequence of calm guest experiences. Public and private programs are stitched through stepped terraces.',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80'],
      details: {
        location: 'Byblos',
        area: '5100 m2',
        year: '2026',
        status: 'In Progress'
      },
      published: true
    },

  ]

  for (const projectData of projects) {
    await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: projectData,
      create: projectData
    })
  }
  console.log(`✅ ${projects.length} projects created/updated`)

  // ──────────────────────────────────────────────────
  // BLOG POSTS
  // ──────────────────────────────────────────────────
  const blogPosts = [
    {
      title: 'The Art of Minimalist Interior Design',
      slug: 'minimalist-interior-design',
      excerpt: 'Exploring how less, truly is more. Learn the principles and practices behind creating minimalist spaces.',
      content: 'Minimalism in interior design is more than just a aesthetic choice—it\'s a philosophy of living intentionally. By removing unnecessary elements, we create spaces that breathe and allow for clarity of thought. This approach emphasizes quality over quantity, functionality over ornamentation, and harmony with our surroundings.\n\nKey principles include neutral color palettes, uncluttered surfaces, and purposeful placement of each item. The result is environments that feel spacious, calm, and deeply personal.',
      tags: ['design', 'minimalism', 'interior'],
      published: true,
      authorId: user.id
    },
    {
      title: 'Sustainable Materials in Modern Design',
      slug: 'sustainable-materials-design',
      excerpt: 'How to integrate eco-friendly materials without compromising on aesthetics or durability.',
      content: 'Sustainability is no longer a luxury—it\'s a necessity. Modern designers have access to a wealth of environmentally-conscious materials that don\'t sacrifice beauty or durability. From reclaimed wood to recycled metals, from natural stone to innovative bio-based alternatives, sustainable materials offer endless possibilities.\n\nThis guide explores the best sustainable materials available today and how to integrate them into residential and commercial spaces with style.',
      tags: ['sustainability', 'materials', 'eco-friendly'],
      published: true,
      authorId: user.id
    },
    {
      title: 'Lighting Design: More Than Just Brightness',
      slug: 'lighting-design-basics',
      excerpt: 'A comprehensive guide to layered lighting and how proper lighting transforms spaces.',
      content: 'Lighting is one of the most powerful tools in interior design, yet it\'s often overlooked. Proper lighting not only illuminates a space but shapes mood, emphasizes architectural features, and enhances functionality. The key is understanding layered lighting: ambient, task, and accent lighting working in harmony.',
      tags: ['lighting', 'design', 'ambiance'],
      published: true,
      authorId: user.id
    }
  ]

  for (const blogData of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: blogData.slug },
      update: blogData,
      create: blogData
    })
  }
  console.log(`✅ ${blogPosts.length} blog posts created/updated`)

  // ──────────────────────────────────────────────────
  // NEWS POSTS
  // ──────────────────────────────────────────────────
  const newsPosts = [
    {
      title: 'Arcline Wins Design Excellence Award 2024',
      slug: 'design-excellence-award-2024',
      excerpt: 'Recognized for innovation and creative excellence in contemporary interior design.',
      content: 'We\'re thrilled to announce that Arcline has been awarded the prestigious Design Excellence Award for 2024. This recognition reflects our commitment to pushing creative boundaries and delivering exceptional results for our clients. The award specifically highlighted our work on sustainable residential projects and innovative hospitality designs.',
      published: true,
      authorId: user.id
    },
    {
      title: 'New Office Location Opens Downtown',
      slug: 'downtown-office-opening',
      excerpt: 'Arcline expands with a new state-of-the-art office space in downtown Beirut.',
      content: 'We\'re excited to announce the opening of our new flagship office location in downtown Beirut. The 320 m² space showcases our design philosophy with collaborative workspaces, creative meeting areas, and sustainable features. This expansion allows us to better serve our growing client base and collaborate with more talented creatives.',
      published: true,
      authorId: user.id
    },
    {
      title: 'Featured in Design Magazine - March 2024',
      slug: 'featured-design-magazine-march',
      excerpt: 'Our latest residential projects featured in the international Design Magazine.',
      content: 'Arcline\'s recent residential projects have been featured in this month\'s issue of Design Magazine. The publication highlights our approach to sustainable luxury living and the minimalist design principles that define our work. Read the full article to learn more about our design process and philosophy.',
      published: true,
      authorId: user.id
    }
  ]

  for (const newsData of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: newsData.slug },
      update: newsData,
      create: newsData
    })
  }
  console.log(`✅ ${newsPosts.length} news posts created/updated`)

  // ──────────────────────────────────────────────────
  // PAGE CONTENT - HOME PAGE
  // ──────────────────────────────────────────────────
  await prisma.pageContent.upsert({
    where: { page_section: { page: 'home', section: 'hero' } },
    update: {
      content: {
        heading: 'Elevate Your Space',
        subheading: 'Modern design solutions for residential, commercial, and hospitality projects',
        ctaText: 'Start Your Project',
        backgroundImage: '/uploads/hero-bg.jpg'
      }
    },
    create: {
      page: 'home',
      section: 'hero',
      content: {
        heading: 'Elevate Your Space',
        subheading: 'Modern design solutions for residential, commercial, and hospitality projects',
        ctaText: 'Start Your Project',
        backgroundImage: '/uploads/hero-bg.jpg'
      }
    }
  })

  await prisma.pageContent.upsert({
    where: { page_section: { page: 'home', section: 'stats' } },
    update: {
      content: {
        projects: '120+',
        clients: '150+',
        years: '15+',
        team: '25'
      }
    },
    create: {
      page: 'home',
      section: 'stats',
      content: {
        projects: '120+',
        clients: '150+',
        years: '15+',
        team: '25'
      }
    }
  })

  console.log('✅ Home page content created/updated')

  // ──────────────────────────────────────────────────
  // PAGE CONTENT - ABOUT PAGE
  // ──────────────────────────────────────────────────
  await prisma.pageContent.upsert({
    where: { page_section: { page: 'about', section: 'mission' } },
    update: {
      content: {
        heading: 'Our Mission',
        text: 'At Arcline, we believe that exceptional design transcends aesthetics—it\'s about creating spaces that enhance lives and inspire creativity. With over 15 years of experience, we combine innovative thinking with meticulous craftsmanship to deliver transformative interior design solutions.'
      }
    },
    create: {
      page: 'about',
      section: 'mission',
      content: {
        heading: 'Our Mission',
        text: 'At Arcline, we believe that exceptional design transcends aesthetics—it\'s about creating spaces that enhance lives and inspire creativity. With over 15 years of experience, we combine innovative thinking with meticulous craftsmanship to deliver transformative interior design solutions.'
      }
    }
  })

  await prisma.pageContent.upsert({
    where: { page_section: { page: 'about', section: 'team' } },
    update: {
      content: [
        {
          name: 'Hisham Al Ahmad',
          role: 'Founder, Programmer',
          image: '/uploads/1774773769221-01cylk.png'
        },
        {
          name: 'Mahdi',
          role: 'Designer, Editor, Manager',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        },
        {
          name: 'Mohammad Mousa',
          role: 'Customer Service, Emotional Support',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        },
        {
          name: 'Mohamad Al Haj Mousa',
          role: 'Sales Representative',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        }
      ]
    },
    create: {
      page: 'about',
      section: 'team',
      content: [
        {
          name: 'Hisham Al Ahmad',
          role: 'Founder, Programmer',
          image: '/uploads/1774773769221-01cylk.png'
        },
        {
          name: 'Mahdi',
          role: 'Designer, Editor, Manager',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        },
        {
          name: 'Mohammad Mousa',
          role: 'Customer Service, Emotional Support',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        },
        {
          name: 'Mohamad Al Haj Mousa',
          role: 'Sales Representative',
          image: '/uploads/dokja-94a237840bf9aa5c.jpg'
        }
      ]
    }
  })

  console.log('✅ About page content created/updated')

  // ──────────────────────────────────────────────────
  // PAGE CONTENT - SERVICES PAGE
  // ──────────────────────────────────────────────────
  await prisma.pageContent.upsert({
    where: { page_section: { page: 'services', section: 'list' } },
    update: {
      content: [
        {
          title: 'Residential Design',
          description: 'Custom interior design solutions for homes that reflect your lifestyle and personality.',
          icon: '🏠'
        },
        {
          title: 'Commercial Spaces',
          description: 'Professional office and retail design that enhances productivity and brand image.',
          icon: '🏢'
        },
        {
          title: 'Hospitality Design',
          description: 'Unique environments for hotels, restaurants, and entertainment venues.',
          icon: '🍽️'
        },
        {
          title: '3D Visualization',
          description: 'Advanced rendering technology to preview spaces before implementation.',
          icon: '🎨'
        },
        {
          title: 'Project Management',
          description: 'Complete oversight from concept to completion, ensuring quality and timelines.',
          icon: '📋'
        },
        {
          title: 'Consultation Services',
          description: 'Expert advice on design direction, budgeting, and material selection.',
          icon: '💡'
        }
      ]
    },
    create: {
      page: 'services',
      section: 'list',
      content: [
        {
          title: 'Residential Design',
          description: 'Custom interior design solutions for homes that reflect your lifestyle and personality.',
          icon: '🏠'
        },
        {
          title: 'Commercial Spaces',
          description: 'Professional office and retail design that enhances productivity and brand image.',
          icon: '🏢'
        },
        {
          title: 'Hospitality Design',
          description: 'Unique environments for hotels, restaurants, and entertainment venues.',
          icon: '🍽️'
        },
        {
          title: '3D Visualization',
          description: 'Advanced rendering technology to preview spaces before implementation.',
          icon: '🎨'
        },
        {
          title: 'Project Management',
          description: 'Complete oversight from concept to completion, ensuring quality and timelines.',
          icon: '📋'
        },
        {
          title: 'Consultation Services',
          description: 'Expert advice on design direction, budgeting, and material selection.',
          icon: '💡'
        }
      ]
    }
  })

  console.log('✅ Services page content created/updated')

  // ──────────────────────────────────────────────────
  // FORM SUBMISSIONS - CONTACT & PROJECT INQUIRIES
  // ──────────────────────────────────────────────────
  const contactCount = await prisma.contactSubmission.count()
  if (contactCount === 0) {
    await prisma.contactSubmission.createMany({
      data: [
        {
          name: 'Rami Khaled',
          email: 'rami.khaled@example.com',
          projectType: 'Residential',
          message: 'I am planning a 280 m² villa renovation and need full interior and lighting design support. Can we schedule a consultation this week?',
          read: false,
        },
        {
          name: 'Nour Ataya',
          email: 'nour.ataya@example.com',
          projectType: 'Commercial',
          message: 'We are opening a boutique office in Beirut and need space planning, branding-aligned interiors, and execution supervision.',
          read: true,
        },
        {
          name: 'Karim Al Saad',
          email: 'karim.saad@example.com',
          projectType: 'Hospitality',
          message: 'We are developing a cafe concept and need help with layout optimization, customer flow, and ambiance design.',
          read: false,
        },
        {
          name: 'Leen Shamas',
          email: 'leen.shamas@example.com',
          projectType: 'Residential',
          message: 'Looking for a modern minimalist redesign for my apartment. I like neutral tones and warm lighting. Please share your process and timeline.',
          read: true,
        },
        {
          name: 'Fadi Nasser',
          email: 'fadi.nasser@example.com',
          projectType: 'Commercial',
          message: 'Can you support us with redesigning our showroom and customer waiting area before Q3 launch?',
          read: false,
        },
      ],
    })
    console.log('✅ Contact submissions seeded')
  } else {
    console.log('ℹ️ Contact submissions already exist, skipping createMany')
  }

  const inquiryCount = await prisma.projectInquiry.count()
  if (inquiryCount === 0) {
    const inquiryProjects = await prisma.project.findMany({
      where: {
        slug: {
          in: ['stone-court-residence', 'northlight-office-hub', 'harborline-boutique-hotel'],
        },
      },
      select: { id: true, slug: true, title: true },
    })

    const projectMap = Object.fromEntries(inquiryProjects.map(p => [p.slug, p.id]))
    const inquiriesToCreate = [
      {
        slug: 'stone-court-residence',
        name: 'Ahmad Darwish',
        email: 'ahmad.darwish@example.com',
        message: 'We are interested in a residence concept with strong indoor-outdoor continuity. Can you share an estimated design timeline?',
        read: false,
      },
      {
        slug: 'stone-court-residence',
        name: 'Maya El Hage',
        email: 'maya.elhage@example.com',
        message: 'Can your team handle both interior architecture and furnishing for a residential project inspired by this approach?',
        read: true,
      },
      {
        slug: 'northlight-office-hub',
        name: 'Samer Hakim',
        email: 'samer.hakim@example.com',
        message: 'Our startup is moving offices and we need a collaborative setup similar to this project. Do you offer phased execution?',
        read: false,
      },
      {
        slug: 'harborline-boutique-hotel',
        name: 'Rita Matar',
        email: 'rita.matar@example.com',
        message: 'We have a hospitality project in Byblos and want to discuss concept development and room identity strategy.',
        read: true,
      },
    ]

    const inquiryData = inquiriesToCreate
      .map(item => {
        const projectId = projectMap[item.slug]
        if (!projectId) return null
        return {
          name: item.name,
          email: item.email,
          message: item.message,
          read: item.read,
          projectId,
        }
      })
      .filter(Boolean)

    if (inquiryData.length > 0) {
      await prisma.projectInquiry.createMany({ data: inquiryData })
      console.log(`✅ ${inquiryData.length} project inquiries seeded`)
    } else {
      console.log('ℹ️ No project inquiries seeded because matching projects were not found')
    }
  } else {
    console.log('ℹ️ Project inquiries already exist, skipping createMany')
  }

  // ──────────────────────────────────────────────────
  // LEGACY CONTENT SANITIZATION
  // ──────────────────────────────────────────────────
  // Ensures existing rows created before this change are converted to plain text.
  const allProjects = await prisma.project.findMany({ select: { id: true, title: true, excerpt: true, description: true, category: true } })
  for (const project of allProjects) {
    const safeTitle = toPlainText(project.title)
    const safeExcerpt = toPlainText(project.excerpt)
    const safeDescription = toPlainText(project.description)
    const safeCategory = toPlainText(project.category)
    if (safeTitle !== project.title || safeExcerpt !== project.excerpt || safeDescription !== project.description || safeCategory !== project.category) {
      await prisma.project.update({
        where: { id: project.id },
        data: {
          title: safeTitle,
          excerpt: safeExcerpt,
          description: safeDescription,
          category: safeCategory,
        },
      })
    }
  }

  const allBlogPosts = await prisma.blogPost.findMany({ select: { id: true, title: true, excerpt: true, content: true } })
  for (const post of allBlogPosts) {
    const safeTitle = toPlainText(post.title)
    const safeExcerpt = toPlainText(post.excerpt)
    const safeContent = toPlainText(post.content)
    if (safeTitle !== post.title || safeExcerpt !== post.excerpt || safeContent !== post.content) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          title: safeTitle,
          excerpt: safeExcerpt,
          content: safeContent,
        },
      })
    }
  }

  const allNewsPosts = await prisma.newsPost.findMany({ select: { id: true, title: true, excerpt: true, content: true } })
  for (const post of allNewsPosts) {
    const safeTitle = toPlainText(post.title)
    const safeExcerpt = toPlainText(post.excerpt)
    const safeContent = toPlainText(post.content)
    if (safeTitle !== post.title || safeExcerpt !== post.excerpt || safeContent !== post.content) {
      await prisma.newsPost.update({
        where: { id: post.id },
        data: {
          title: safeTitle,
          excerpt: safeExcerpt,
          content: safeContent,
        },
      })
    }
  }

  console.log('✅ Legacy HTML content sanitized to plain text')

  console.log('\n✨ Seed completed successfully!\n')
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())