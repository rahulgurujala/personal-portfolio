import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";

export const metadata = {
  title: "Contact | Developer Portfolio",
  description: "Get in touch with me for collaborations or opportunities",
};

export default async function ContactPage() {
  const profiles = await db.select().from(profile).limit(1);
  const userProfile = profiles[0] || {};

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg mb-8">
            I&apos;m always open to discussing new projects, opportunities, or
            collaborations. Feel free to reach out using the form or through any
            of my social profiles.
          </p>

          <div className="space-y-4">
            {userProfile.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <a
                  href={`mailto:${userProfile.email}`}
                  className="text-primary hover:underline"
                >
                  {userProfile.email}
                </a>
              </div>
            )}

            {userProfile.github && (
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-muted-foreground" />
                <a
                  href={userProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub
                </a>
              </div>
            )}

            {userProfile.linkedin && (
              <div className="flex items-center gap-3">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <a
                  href={userProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            )}

            {userProfile.twitter && (
              <div className="flex items-center gap-3">
                <Twitter className="h-5 w-5 text-muted-foreground" />
                <a
                  href={userProfile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Twitter
                </a>
              </div>
            )}
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
