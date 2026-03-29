# 🎨 Arcline Design Agency – CMS Dashboard

A modern, full-featured content management system for a design agency built with **Next.js**, **React**, **Prisma ORM**, and **MySQL**. Manage projects, blog posts, news, team members, and page content with an intuitive dashboard.

---

## ✨ Features

- **📊 Admin Dashboard** – Manage all content with a clean, responsive interface
- **🖼️ Project Portfolio** – Showcase projects with images, descriptions, and categorization
- **📝 Blog & News** – Create and publish articles with a rich text editor (TipTap)
- **👥 Team Management** – Edit team members with images and roles
- **📄 Dynamic Pages** – Edit homepage, about page, and services page content without code

- **🔐 Authentication** – Secure admin login with role-based access control
- **🎨 Rich Text Editor** – TipTap-based editor with formatting, links, and image insertion

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+
- **MySQL 8.0+**
- **npm** or **yarn** (comes with Node.js)

### 1️⃣ Clone & Install Dependencies

```bash
# Clone the repository
git clone git@github.com:Hisham-AlAhmad/Nextjs-Project.git
cd NextjsProject

# Install dependencies
npm install
```

### 2️⃣ Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Database Connection (MySQL)
DATABASE_URL="mysql://username:password@localhost:3306/arcline_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### 3️⃣ Set Up Database & Run Seed

```bash
# Create database tables
npx prisma migrate deploy

# Populate with sample data (projects, blog posts, team, etc.)
npm run seed
```

This will create:

- Admin user: `admin@arcline.com` / `admin123`
- 4 sample projects (residential, commercial, hospitality)
- 3 blog posts and 3 news articles
- Team member profiles with images
- Homepage, about page, and services page content

### 4️⃣ Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

### 🔓 Admin Dashboard Access

1. Navigate to [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login)
2. Log in with:
   - **Email:** `admin@arcline.com`
   - **Password:** `admin123`
3. You'll be redirected to the dashboard at `/dashboard`

### 📊 Dashboard Features

**Dashboard Home** (`/dashboard`)

- View overview statistics
- Quick access to all management sections

**Projects** (`/dashboard/projects`)

- Create, edit, and delete portfolio projects
- Upload project images
- Manage project categories and details
- Publish/unpublish projects

**Blog** (`/dashboard/blog`)

- Write articles with rich text editor
- Add images and formatting
- Manage tags and publication status
- View all published and draft posts

**News** (`/dashboard/news`)

- Publish company news and press releases
- Same rich text editor as blog

**Pages** (`/dashboard/pages`)

- Edit homepage sections (hero, stats)
- Update about page (mission, team members)
- Manage services list

**Users** (`/dashboard/users`)

- Create additional admin or editor accounts
- Set role permissions

**Submissions** (`/dashboard/submissions`)

- View contact form submissions
- Manage inquiry messages from project pages
- Mark as read/unread

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server on port 3000

# Database
npm run seed            # Populate database with sample data
npx prisma studio      # Open interactive database explorer
```
