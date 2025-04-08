import { db } from "./index";
import { profile, skills, projects, blogPosts, tags } from "./schema";
import "dotenv/config";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");

    // Add profile data
    console.log("Adding profile data...");
    await db
      .insert(profile)
      .values({
        userId: "default-user-id", // Adding required userId field
        name: "John Doe",
        title: "Full Stack Developer",
        bio: "Passionate developer with expertise in React, Next.js, and Node.js. I love building beautiful, responsive web applications with great user experiences.",
        avatar: "/images/avatar.jpg",
        email: "john@example.com",
        github: "https://github.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
      })
      .onConflictDoUpdate({
        target: profile.id,
        set: {
          name: "John Doe",
          title: "Full Stack Developer",
          bio: "Passionate developer with expertise in React, Next.js, and Node.js. I love building beautiful, responsive web applications with great user experiences.",
        },
      });

    // Add skills
    console.log("Adding skills data...");
    const skillsData = [
      { name: "React", icon: "⚛️", category: "frontend", proficiency: 90 },
      { name: "Next.js", icon: "▲", category: "frontend", proficiency: 85 },
      { name: "TypeScript", icon: "TS", category: "frontend", proficiency: 80 },
      { name: "Node.js", icon: "🟢", category: "backend", proficiency: 85 },
      { name: "PostgreSQL", icon: "🐘", category: "backend", proficiency: 75 },
      { name: "Docker", icon: "🐳", category: "devops", proficiency: 70 },
    ];

    for (const skill of skillsData) {
      await db.insert(skills).values(skill).onConflictDoNothing();
    }

    // Add projects
    console.log("Adding projects data...");
    const projectsData = [
      {
        title: "E-commerce Platform",
        description:
          "A full-featured e-commerce platform built with Next.js, Stripe, and PostgreSQL.",
        image: "/images/projects/ecommerce.jpg",
        demoUrl: "https://ecommerce-demo.example.com",
        githubUrl: "https://github.com/johndoe/ecommerce",
        technologies: [
          "Next.js",
          "React",
          "PostgreSQL",
          "Stripe",
          "Tailwind CSS",
        ],
        featured: true,
        order: 1,
      },
      {
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates.",
        image: "/images/projects/taskapp.jpg",
        demoUrl: "https://tasks-demo.example.com",
        githubUrl: "https://github.com/johndoe/taskapp",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
        featured: true,
        order: 2,
      },
    ];

    for (const project of projectsData) {
      await db.insert(projects).values(project).onConflictDoNothing();
    }

    // Add blog posts
    console.log("Adding blog posts data...");
    const blogPostsData = [
      {
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        excerpt: "Learn how to build modern web applications with Next.js",
        content: `
          <h2>Introduction to Next.js</h2>
          <p>Next.js is a React framework that enables server-side rendering and static site generation.</p>
          <h2>Why Next.js?</h2>
          <p>Next.js provides an excellent developer experience with features like:</p>
          <ul>
            <li>Server-side rendering</li>
            <li>Static site generation</li>
            <li>API routes</li>
            <li>File-based routing</li>
          </ul>
          <h2>Getting Started</h2>
          <p>To create a new Next.js app, run:</p>
          <pre><code>npx create-next-app my-app</code></pre>
        `,
        coverImage: "/images/blog/nextjs.jpg",
        published: true,
      },
      {
        title: "Understanding TypeScript with React",
        slug: "typescript-with-react",
        excerpt: "How to leverage TypeScript in your React applications",
        content: `
          <h2>Why TypeScript?</h2>
          <p>TypeScript adds static typing to JavaScript, helping catch errors early in development.</p>
          <h2>Setting Up TypeScript with React</h2>
          <p>Create a new React app with TypeScript:</p>
          <pre><code>npx create-react-app my-app --template typescript</code></pre>
          <h2>Benefits</h2>
          <p>Using TypeScript with React provides:</p>
          <ul>
            <li>Better IDE support</li>
            <li>Type checking for props</li>
            <li>Improved refactoring</li>
          </ul>
        `,
        coverImage: "/images/blog/typescript.jpg",
        published: true,
      },
    ];

    for (const post of blogPostsData) {
      await db.insert(blogPosts).values(post).onConflictDoNothing();
    }

    // Add tags
    console.log("Adding tags data...");
    const tagsData = [
      { name: "Next.js" },
      { name: "React" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Web Development" },
    ];

    for (const tag of tagsData) {
      await db.insert(tags).values(tag).onConflictDoNothing();
    }

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
