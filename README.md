# Next.js & Sanity Rach Website

##  Project Overview
This project is a **Next.js + Sanity** website built for **Rachel's** website. It integrates a **CMS (Sanity)** for content management and **Next.js (App Router)** for frontend rendering.

---
### Steps before you start coding:
1. **Create a new branch** in your local code terminal:
   ```sh
   git checkout -b update-readme
   ```
   Where update-readme is the codename for whatever you are going to be working on.
   
You can then make whatever changes you want and play around until you are comfortable that your updates are working.
3. **Commit your branch** to Github:
   ```sh
   git status
   git add .
   git commit -m "update readme"  
   git push -u origin update-readme
   ```
   To check the files that you have added or made changes to and in the third line the branch name must be in quotations
   
4. **Checking out** the new branch:
   Once you have added your new code to the Github repo, we can then both go through the changes and decide if they are good to commit to the main.
   Once we have committed the pull request then you can continue with step 4.
   
5. **Switching back** to the main branch:
   ```sh
   git checkout main
   git pull origin main    
   ```
   This will update your local code with whatever you have just committed to the repo

##  Project Setup Guide

### Follow these steps to set up the development environment on your local machine.

## 1. Clone the Repository
First, clone the project repository from GitHub:

```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_PROJECT_NAME.git
cd YOUR_PROJECT_NAME
```

## 2. Install Dependencies
Once inside the project directory, install the required dependencies:

```sh
npm install
```

or

```sh
yarn install
```

## 3. Set Up Environment Variables
Create an `.env.local` file in the project root and add the following variables:

```ini
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

If you don’t know your **Sanity Project ID**, run:

```sh
sanity projects list
```

## 4. Initialize Sanity Studio (If Applicable)
If the project includes Sanity Studio, navigate to the `sanity` directory and initialize it:

```sh
cd sanity
sanity init
```

- Select the existing Sanity project.
- Choose the **production** dataset.

Then, return to the root folder:

```sh
cd ..
```

## 5. Start the Development Server
Once everything is set up, start the project:

```sh
npm run dev
```

- **Next.js frontend:** [http://localhost:3000](http://localhost:3000)
- **Sanity Studio (if applicable):** [http://localhost:3000/studio](http://localhost:3000/studio)

---

##  Project Structure
This is a basic layout of how the project has been structured
```
 src
 ┣  app
 ┃  ┣  (frontend)      # Frontend pages
 ┃  ┃  ┣  posts
 ┃  ┃  ┃  ┣  page.tsx   # Blog listing page
 ┃  ┃  ┃  ┣  [slug]    # Dynamic post pages
 ┃  ┃  ┃  ┃  ┣  page.tsx
 ┃  ┃  ┣  layout.tsx   # Global layout wrapper
 ┃  ┃  ┣  page.tsx     # Homepage
 ┣  components         # Reusable UI components
 ┃  ┣  Header.tsx
 ┃  ┣  Footer.tsx
 ┃  ┣  Hero.tsx
 ┃  ┣  PortableTextRenderer.tsx
 ┣  sanity             # Sanity CMS setup
 ┃  ┣  schemaTypes
 ┃  ┃  ┣  authorType.ts
 ┃  ┃  ┣  postType.ts
 ┃  ┃  ┣  categoryType.ts
 ┃  ┣  sanityClient.ts
 ┣  styles
 ┃  ┣  global.css      # Global styles
 ┣  next.config.js
 ┣  package.json
 ┣  tsconfig.json
 ┣  .env.local
 ┣  README.md
```

---

## How to Add New Pages

### **Create a New Static Page**
To add a new static page (e.g., `About`, or `Article` page), create a new file inside:

 `src/app/(frontend)/about/page.tsx`
```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our media company!</p>
    </div>
  );
}
```
🔹 This page will be accessible at **`/about`**.

---

###  **Create a Dynamic Page (e.g., Blog Posts)**
Dynamic pages fetch data from **Sanity CMS**.

 `src/app/(frontend)/posts/[slug]/page.tsx`
```tsx
import { sanityClient } from '@/sanity/sanityClient';
import PortableTextRenderer from '@/components/PortableTextRenderer';

interface PostProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostProps) {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  const post = await sanityClient.fetch(query, { slug: params.slug });

  if (!post) return <div>Post not found</div>;

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <PortableTextRenderer content={post.content} />
    </main>
  );
}
```
🔹 Now, visiting `/posts/{your-slug}` will render the blog post.

---

## How to Inject HTML into React Components
Since content from **Sanity CMS** may contain raw HTML, we use `@portabletext/react` to safely inject it.

### **Install the Required Package**
```sh
npm install @portabletext/react
```

### **Use `PortableTextRenderer.tsx` to Inject HTML**
 `src/components/PortableTextRenderer.tsx`
```tsx
import { PortableText } from '@portabletext/react';
import React from 'react';

const components = {
  types: {
    block: (props: any) => <div dangerouslySetInnerHTML={{ __html: props.value }} />,
  },
};

const PortableTextRenderer = ({ content }: { content: any }) => {
  return <PortableText value={content} components={components} />;
};

export default PortableTextRenderer;
```
🔹 Now, any **HTML stored in Sanity** will be safely rendered inside Next.js pages.

---

##  How to Convert HTML to React Components
If you have **pre-made HTML**, convert it into reusable React components.

### Example: Convert a Homepage Section
 `src/components/Homepage.tsx`
```tsx
const Homepage = () => {
  return (
    <section className="homepage bg-gray-100 p-10 text-center">
      <h1 className="text-4xl font-bold">Welcome to Our Media Company</h1>
      <p className="text-lg text-gray-700">Your daily dose of news, videos, and more.</p>
    </section>
  );
};

export default Homepage;
```
🔹 Use it in any page like this:
```tsx
import Homepage from '@/components/Homepage';

export default function HomePage() {
  return (
    <div>
      <Homepage />
      {/* Other sections/components */}
    </div>
  );
}
```

---

##  Setting Up Global Layout (Header & Footer)
To maintain a **consistent UI**, wrap pages with a global layout.

 `src/components/Header.tsx`
```tsx
const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-2xl font-bold">MediaCo</h1>
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li><a href="/posts" className="hover:underline">Blog</a></li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
```

 `src/app/(frontend)/layout.tsx`
```tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
```
 Now, **all pages will have a header and footer automatically.**
---
##  Typegen
Whenever a query or schema is added/changed. Run these commands

### Commands:
   ```sh
   npx sanity@latest schema extract --path=./src/sanity/extract.json
   npx sanity@latest typegen generate
   npm run typegen
   ```

---

##  Deployment
Since the project is linked to **GitHub + Vercel**, any **push to GitHub** will auto-deploy.

### Steps:
1. **Push changes** to GitHub:
   ```sh
   git add .
   git commit -m "Updated components and pages" 
   git push origin main
   ```
2. **Check Vercel dashboard** for automatic deployment.

---

## File Structure from the template code

### Root Directory
- **.env.local**: Environment variables for local development.
- **.gitignore**: Specifies files and directories to ignore in Git.
- **components.json**: Likely a configuration file for components.
- **LICENSE**: Project license information.
- **next-env.d.ts**: TypeScript definitions for Next.js.
- **next.config.mjs**: Configuration file for Next.js.
- **package.json**: Project dependencies and scripts.
- **pnpm-lock.yaml**: Lockfile for pnpm package manager.
- **postcss.config.js**: Configuration for PostCSS (used with Tailwind CSS).
- **README.md**: Project documentation.
- **sample-data.tar.gz**: Sample data archive.
- **sanity.cli.ts**: CLI configuration for Sanity.
- **sanity.config.ts**: Main configuration for Sanity Studio.
- **sanity.types.ts**: TypeScript definitions for Sanity schemas.
- **schema.json**: JSON schema for the project.
- **tailwindcss.d.ts**: TypeScript definitions for Tailwind CSS.
- **tsconfig.json**: TypeScript configuration.

### .cursor
- **rules/**: Likely contains rules for .cursor (possibly related to a development tool).

### .next
- Contains build artifacts and cache for Next.js.

### app
- **globals.css**: Global CSS styles.
- **layout.tsx**: Layout component for the app.
- **not-found.tsx**: Custom 404 page.
- **robots.ts**: Robots.txt configuration for SEO.

### components
- Contains reusable React components.

### lib
- Utility functions and libraries.

### public
- Static assets (e.g., images, fonts).

### sanity
- Likely contains Sanity schemas and related files.

### types
- TypeScript type definitions.

---

## Sanity and Next.js Integration
Sanity serves as the headless CMS, while Next.js is the frontend framework. The integration works as follows:
1. **Sanity Studio**: Configured in `sanity.config.ts`, it allows content management.
2. **Data Fetching**: Use Sanity's GROQ queries or client libraries to fetch content in Next.js pages or components.
3. **Dynamic Content**: Sanity provides structured content that Next.js renders dynamically.

---

## Dynamic Styling in Pages
Use Tailwind CSS for dynamic styling:
```tsx
<div className={`bg-${isDarkMode ? 'black' : 'white'} text-${isDarkMode ? 'white' : 'black'}`}>
  Dynamic Styling Example
</div>
```

---

## Scroll-Based Interactions
Use libraries like `framer-motion` or `react-intersection-observer`:
```tsx
import { motion } from 'framer-motion';
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  Scroll-Based Animation
</motion.div>
```

---

## Client-Specific Functionality
Define reusable functions in the `lib` directory. For example:
```tsx
export const formatDate = (date: string) => new Date(date).toLocaleDateString();
```

---

## Optimizing Sanity Studio
1. **Custom Input Components**: Create custom input components for better UX.
2. **Predefined Templates**: Use document templates for common content types.
3. **Role-Based Access**: Configure roles to limit access to specific content.

---

## CSS Styling
Use Tailwind CSS for utility-first styling. Example:
```tsx
<div className="p-4 bg-blue-500 text-white rounded-lg">
  Tailwind Styled Component
</div>
```
For global styles, use `globals.css` in the `app` directory.



 **Happy coding! Don't fuck it up.**

