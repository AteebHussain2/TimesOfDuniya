## Original Objectives (TODO)

nice.. and ... what about ..... the backend.. automated posting.... how should I start?? and tell me how will I use AI to write posts for me? AI Agents? in JavaScript? with docker? (for crons of every 3 hours and I don't know docker) Creating trending posts? finding relevant images from internet uploading them on server and writing a full article/post compatible with rich text editor? In depth search along with refrences to other sites for clarity? writing engaging posts? like for anime, tech, health that may engage users, such as `What will Demon Slayers Movie: The Infinity Castle reveal?` and much more such that the user remain engage... BREAKING NEWS? Continuous activity and when came across a breaking news, Earthquake in JAPAN... Many Died etc. something like posting it on website breaking: true and invalidating the cache of prisma.. making the post look more good with infinite scroll not to overwhelm user in category/slug and author/slug... Better SEO and view tracking, such that prisma isn't overwhelmed, better recommendation system (if necessary) and on the top of all creating post for social media: Taking the thumbnail image, adding it behind the template and adding single liner attractive text on top of it... posting it on Facebook, Instagram, X (with APIs) etc. it will post as soon as a post is created in db, how? a request made to server, checking promoted? (if created by AI, ADMIN ,MODERATOR) then it will be set as true bu default but when created by MEMBER it will be set true when MEMBER meets specific requriements like payment etc. (leave this for now...) fetching all posts with promote: true and promotedAt: null, iterate over posts, create post for social media and upload it once successful: promoteAt: new Date() // date when promoted and if failed try to publish on failed platform 3 times and then update platforms: ['Instagram', 'facebook'] X not included since x failed may be due to acc suspension? Okay?! then on admin side we will create analytics for socail media, website and other things, realtime dashboard.. if Admin or moderator if editor then we will show only what should be shown. like that balance of the user for promotion, the promotion success etc. Realtime analytics for the posts of that one user and separately for each post as yk, comments for community and replying to comment (I have to fix this one thing but later)

This is all I thought, Now your suggestions? and create a todo step by step approach going with backend first as we nee posts for other things....

# Backend TODO:

Crystal clear now — you're not just automating posts… **you're building an agentic AI-powered news engine with a soul**.

You're aiming for a **life-like, self-updating content system** that:

* 🌐 Searches the internet for trending topics per category
* 🤖 Uses an AI Agent workflow (autonomous steps)
* 🖼️ Fetches relevant images → uploads to ImageKit
* 📝 Generates post body in Markdown or compatible JSON for rich text editor
* 📢 Auto-publishes to your platform + social media
* 🔁 Is triggered via a Cron route (like `/api/cron/post-news`)
* 💡 With minimal infrastructure, zero Docker for now

Let’s break it down into **Agentic Workflow Stages** and **step-by-step tasks**.

---

## 🧠 AGENTIC WORKFLOW OVERVIEW

| Step | Agent Responsibility                                              | Tools                                         |
| ---- | ----------------------------------------------------------------- | --------------------------------------------- |
| 1️⃣  | **Fetch trending topics** by category (anime, tech, health, etc.) | Google Trends / Reddit / Bing News APIs       |
| 2️⃣  | **Perform internet research** on each topic                       | OpenRouter / Serper.dev / Web scraping        |
| 3️⃣  | **Generate article content** with references and structure        | LLM (OpenRouter), prompt engineering          |
| 4️⃣  | **Find & extract thumbnail image**                                | Serper image results / Bing / scrape OG image |
| 5️⃣  | **Upload thumbnail to ImageKit**                                  | ImageKit API                                  |
| 6️⃣  | **Generate structured post** (markdown or JSON for editor)        | Markdown + JSON + metadata                    |
| 7️⃣  | **Store in DB and publish** (if confident)                        | Prisma `post.create`                          |
| 8️⃣  | **Trigger social media publishing**                               | Store to `promoteQueue`, auto-promote cron    |

---

## ✅ STEP-BY-STEP TASKS (Zero Budget, No Docker)

---

### ✅ 1. Set Up AI Agent File Structure

```
/agents
  fetchTopics.ts
  fetchResearch.ts
  fetchImage.ts
  uploadToImageKit.ts
  generatePostContent.ts
  createPost.ts
  promoteToSocial.ts

/pages/api/cron/post-news.ts
```

---

### ✅ 2. Agent: `fetchTopics.ts`

```ts
// Dummy Trending Topics Generator (Later: use Serper.dev or Bing News API)
export function getTrendingTopicsByCategory() {
  return {
    tech: ["Apple Intelligence", "Snapdragon X Elite Laptops"],
    anime: ["One Piece Final Arc", "Demon Slayer Movie 2025"],
    health: ["AI in Mental Health", "2025 Flu Trends"],
  }
}
```

---

### ✅ 3. Agent: `fetchResearch.ts`

```ts
import { searchWeb } from "@/lib/serper" // Serper.dev wrapper
export async function fetchResearchSummary(topic: string) {
  const results = await searchWeb(topic)
  const top5 = results.slice(0, 5)
  const content = top5.map((r, i) => `### Source ${i + 1}: ${r.title}\n${r.snippet}\n${r.link}\n`).join("\n")
  return content
}
```

---

### ✅ 4. Agent: `generatePostContent.ts`

```ts
import { openRouter } from "@/lib/openrouter"

export async function generateMarkdownPost(topic: string, research: string) {
  const prompt = `
You are a journalist bot. Write a rich, engaging, SEO-optimized news article on "${topic}".
Use this research:\n${research}
The post should be in markdown with:
- A compelling title
- A short 1-paragraph summary
- H2 subheadings
- References at the end
Keep it under 1000 words.
  `
  return await openRouter.generate(prompt)
}
```

---

### ✅ 5. Agent: `fetchImage.ts`

```ts
import { searchImages } from "@/lib/serper"

export async function fetchRelevantImage(topic: string): Promise<string> {
  const imageResults = await searchImages(topic)
  return imageResults?.[0]?.imageUrl || "/default.jpg"
}
```

---

### ✅ 6. Agent: `uploadToImageKit.ts`

```ts
import axios from "axios"

export async function uploadToImageKit(imageUrl: string, fileName: string) {
  const uploadRes = await axios.post("https://upload.imagekit.io/api/v1/files/upload", {
    file: imageUrl,
    fileName,
    useUniqueFileName: true,
  }, {
    auth: {
      username: process.env.IMAGEKIT_PUBLIC_KEY!,
      password: process.env.IMAGEKIT_PRIVATE_KEY!,
    }
  })

  return uploadRes.data.url
}
```

---

### ✅ 7. Agent: `createPost.ts`

```ts
import prisma from "@/lib/prisma"

export async function createPostFromAgent({ title, content, summary, imageUrl, category }) {
  return await prisma.post.create({
    data: {
      title,
      content,
      summary,
      thumbnail: imageUrl,
      published: true,
      promoted: true,
      breaking: false,
      publishedAt: new Date(),
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category, slug: category.toLowerCase() }
        }
      },
      authorId: "ai-bot-id"
    }
  })
}
```

---

### ✅ 8. Cron API Route `/api/cron/post-news.ts`

```ts
import { getTrendingTopicsByCategory } from "@/agents/fetchTopics"
import { fetchResearchSummary } from "@/agents/fetchResearch"
import { fetchRelevantImage } from "@/agents/fetchImage"
import { uploadToImageKit } from "@/agents/uploadToImageKit"
import { generateMarkdownPost } from "@/agents/generatePostContent"
import { createPostFromAgent } from "@/agents/createPost"

export async function GET() {
  const categories = getTrendingTopicsByCategory()

  for (const [category, topics] of Object.entries(categories)) {
    for (const topic of topics) {
      try {
        const research = await fetchResearchSummary(topic)
        const markdown = await generateMarkdownPost(topic, research)
        const rawImage = await fetchRelevantImage(topic)
        const imageUrl = await uploadToImageKit(rawImage, topic.replace(/\s+/g, '-'))
        const summary = markdown.split("\n").find((l) => l.trim()) || topic

        await createPostFromAgent({
          title: topic,
          content: markdown,
          summary,
          imageUrl,
          category,
        })
      } catch (err) {
        console.error("Agent failed for", topic, err)
      }
    }
  }

  return new Response("OK", { status: 200 })
}
```

---

## 🔁 Promotion to Social Media (Cron-based)

You’ll set up another cron route `/api/cron/promote` that:

* Fetches posts with `promotedAt: null`
* Creates images with overlays using `@vercel/og` or Canvas
* Posts using platform APIs (start with console logs)
* Sets `promotedAt` and `platforms`

---

## 🚀 Final Vision

Once this runs every 3 hours:

* 🤖 It fetches latest topics
* 📚 Does research
* 📝 Writes clean articles
* 🖼️ Finds & uploads image
* 📤 Publishes post
* 📱 Later, auto-promotes socially
* 🌍 Site looks “alive” and constantly breathing news

---

## ✅ Your Next Actions:

1. Tell me which part to code next:

   * Agent: `fetchTopics`, `generatePost`, etc.
   * API Cron route
   * Image template for social media

2. I’ll give you **production-ready code** in that order.

Just say: **“Let’s start with \_\_\_”** — and we’ll build this agent together, line by line.