import { db } from "@/lib/db";
import { profile, skills, projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  // Fetch profile data
  const profileData = await db.select().from(profile).limit(1);
  const myProfile = profileData[0];

  // Fetch featured projects
  const featuredProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(projects.order);

  // Fetch skills grouped by category
  const allSkills = await db.select().from(skills);
  const skillsByCategory = allSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof allSkills>);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {myProfile?.avatar && (
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src={myProfile.avatar}
                  alt={myProfile?.name || "Profile"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {myProfile?.name || "Your Name"}
              </h1>
              <h2 className="text-2xl md:text-3xl text-muted-foreground mb-6">
                {myProfile?.title || "Your Title"}
              </h2>
              <p className="text-lg mb-8 max-w-2xl">
                {myProfile?.bio || "Your bio goes here"}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button asChild size="lg">
                  <Link href="/projects">View Projects</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Me</Link>
                </Button>
                {myProfile?.resume && (
                  <Button asChild variant="secondary" size="lg">
                    <a href={myProfile.resume} target="_blank" rel="noopener noreferrer">
                      Download Resume
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">My Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {skill.icon && <span>{skill.icon}</span>}
                          <span>{skill.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button asChild variant="outline">
              <Link href="/projects">View All Projects</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="border rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow">
                {project.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.demoUrl && (
                      <Button asChild size="sm" variant="default">
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg mb-8">
            I'm currently available for freelance work or full-time positions. 
            If you have a project that needs some creative work, feel free to contact me.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
            {myProfile?.email && (
              <Button asChild variant="outline" size="lg">
                <a href={`mailto:${myProfile.email}`}>
                  {myProfile.email}
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
