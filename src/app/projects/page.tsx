import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateMetadata as seoMetadata } from "@/components/shared/SEO";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return seoMetadata({
    title: "Projects | Developer Portfolio",
    description: "Explore my latest projects and technical work showcasing my skills and experience in web development.",
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/projects`,
  });
}

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(projects.order);

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>

      {allProjects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">No projects yet</h2>
          <p className="text-muted-foreground">
            Check back soon for new projects!
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {allProjects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col md:flex-row gap-8 border-b pb-16"
            >
              {project.image && (
                <div className="w-full md:w-2/5 relative h-64 md:h-auto rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="w-full md:w-3/5 space-y-4">
                <h2 className="text-2xl font-bold">{project.title}</h2>

                <p className="text-muted-foreground">{project.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies?.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  {project.demoUrl && (
                    <Button asChild variant="default" size="sm">
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}

                  {project.githubUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
