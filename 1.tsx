import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
export type Project = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
};
const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured online store with a modern UI.',
    longDescription: 'Developed a comprehensive e-commerce platform using React and Node.js, featuring product catalogs, a shopping cart, secure checkout with Stripe, and a user authentication system. The frontend is built for optimal user experience and responsiveness.\n\nThe architecture is designed to be scalable, handling thousands of products and concurrent users. State management is handled with Zustand for a lightweight and fast experience.',
    imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=2072&auto=format&fit=crop',
    tags: ['React', 'Node.js', 'Web Dev', 'Stripe'],
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    title: 'Project Management Tool',
    description: 'A collaborative tool to manage tasks and projects.',
    longDescription: 'A Kanban-style project management application that allows teams to organize tasks, track progress, and collaborate in real-time. Features include drag-and-drop boards, task assignments, and deadline tracking. Built with TypeScript and Firebase.\n\nReal-time data synchronization is achieved using Firebase Firestore, ensuring all team members have the most up-to-date view of the project status.',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
    tags: ['TypeScript', 'React', 'Firebase', 'Web Dev'],
    githubUrl: '#',
  },
  {
    id: 3,
    title: 'Personal Blog',
    description: 'A sleek, fast, and SEO-friendly personal blog.',
    longDescription: 'Designed and developed a personal blog with a focus on performance and readability. It uses a static site generator for speed and is integrated with a headless CMS for easy content management. Features include dark mode, search functionality, and RSS feeds.\n\nThe design is minimalist and content-focused, providing a pleasant reading experience across all devices.',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
    tags: ['Next.js', 'MDX', 'Design', 'Vercel'],
    liveUrl: '#',
  },
  {
    id: 4,
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex data.',
    longDescription: 'Created a dynamic data visualization dashboard using D3.js and React. It allows users to explore large datasets through interactive charts and graphs, with features like filtering, sorting, and data exporting. The dashboard is designed to be both powerful and intuitive.\n\nIt connects to a REST API to fetch data and presents it in a highly interactive and visually appealing manner, helping users to derive insights quickly.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    tags: ['React', 'D3.js', 'Data Viz', 'API'],
    githubUrl: '#',
  },
  {
    id: 5,
    title: 'Mobile Fitness App UI',
    description: 'A concept UI for a modern fitness tracking app.',
    longDescription: 'Designed a clean and motivating user interface for a mobile fitness application. The design focuses on clarity, ease of use, and providing users with at-a-glance progress tracking. Prototyped using Figma and built with React Native.\n\nThe UI kit includes components for workout tracking, progress charts, social sharing, and personalized coaching, all designed with a consistent and modern aesthetic.',
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop',
    tags: ['UI/UX', 'Figma', 'Design', 'React Native'],
    liveUrl: '#',
  },
  {
    id: 6,
    title: 'Cloud Storage Service',
    description: 'A secure and scalable cloud storage solution.',
    longDescription: 'Developed a cloud storage service with a focus on security and performance. Users can upload, download, and share files through a simple web interface. The backend is built on a microservices architecture and deployed on Cloudflare Workers for global low-latency access.\n\nEnd-to-end encryption is implemented to ensure user data privacy and security.',
    imageUrl: 'https://images.unsplash.com/photo-1585399001829-d7350d59622d?q=80&w=1974&auto=format&fit=crop',
    tags: ['Cloudflare', 'TypeScript', 'Web Dev', 'Security'],
    githubUrl: '#',
  },
];
const ProjectSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl">
    <Skeleton className="aspect-[16/9] w-full" />
    <div className="flex-grow p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mt-1" />
    </div>
    <div className="flex flex-wrap gap-2 p-6 pt-0">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);
export function ProjectsSection({ loading }: { loading: boolean }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const tags = useMemo(() => {
    const allTags = mockProjects.flatMap(p => p.tags);
    return ['All', ...Array.from(new Set(allTags))];
  }, []);
  const filteredProjects = useMemo(() => {
    if (!selectedTag || selectedTag === 'All') {
      return mockProjects;
    }
    return mockProjects.filter(p => p.tags.includes(selectedTag));
  }, [selectedTag]);
  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };
  const handleCloseSheet = () => {
    setSelectedProject(null);
  };
  return (
    <section id="projects" className="w-full">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-display text-gradient">Featured Projects</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Here are some of the projects I'm proud to have worked on.
        </p>
      </div>
      <div className="filter-chips">
        {tags.map(tag => (
          <Badge
            key={tag}
            onClick={() => setSelectedTag(tag)}
            variant={selectedTag === tag ? 'default' : 'secondary'}
            className={cn(
              'cursor-pointer px-4 py-2 text-sm transition-all duration-200 hover:scale-105',
              selectedTag === tag ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={index} />)
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={handleOpenProject} />
          ))
        )}
      </div>
      <Sheet open={!!selectedProject} onOpenChange={(isOpen) => !isOpen && handleCloseSheet()}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto" role="dialog" aria-modal="true">
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <SheetHeader>
                <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
                <SheetTitle className="text-3xl font-bold font-display">{selectedProject.title}</SheetTitle>
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </SheetHeader>
              <SheetDescription asChild>
                <div className="mt-6 text-base text-foreground/80 space-y-4">
                  {selectedProject.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </SheetDescription>
              <div className="mt-8 flex gap-4">
                {selectedProject.liveUrl && (
                  <Button asChild className="btn-gradient flex-1">
                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                      View Live <ArrowUpRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {selectedProject.githubUrl && (
                  <Button asChild variant="outline" className="flex-1">
                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" /> View Code
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
