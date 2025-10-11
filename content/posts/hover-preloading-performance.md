---
slug: hover-preloading-performance
title: "Making Fast Feel Instantaneous: Hover-Based Preloading"
date: October 11, 2025
excerpt: "My blog loaded in 348ms—fast by any standard. But with a single performance optimization, I made it feel instant. Here's how hover-based preloading turned milliseconds into magic."
---

My blog was already fast. LCP under 400ms. Zero layout shift. HTTP caching working perfectly. By every objective measure, it was performing well.

But "fast" and "instant" are different things. Fast is measurable. Instant is *felt*. And there's a gap between 348ms and the moment a user decides to click—a gap where performance can hide.

This is the story of closing that gap with hover-based preloading, turning an already fast blog into one that feels instantaneous.

## The Starting Point: Already Optimized

Before making any changes, I measured baseline performance using Chrome DevTools:

**Blog List Page:**
- **LCP:** 266ms
- **TTFB:** 2ms
- **CLS:** 0.00

**Individual Post Page:**
- **LCP:** 348ms
- **TTFB:** 2ms
- **CLS:** 0.00

These numbers are excellent. Sub-400ms LCP is in the top 5% of websites. The architecture was already sound:

- Static JSON APIs pre-generated at build time
- Client-side caching with 5-minute TTL
- HTTP 304 responses for unchanged content
- Lazy-loaded markdown rendering

But when I clicked through to a post, there was still a perceptible moment—a brief flash where the page was thinking. Not slow, but not instant.

The problem wasn't the 348ms itself. The problem was *when* those 348ms happened: after the click, during the moment of anticipation.

## The Psychology of Perceived Performance

Users don't experience your site in milliseconds. They experience it in moments:

1. **Hover moment:** "This looks interesting..."
2. **Decision moment:** "I'll click this."
3. **Anticipation moment:** "Show me the content."

Most performance optimization focuses on step 3: making the load faster. But what if we could move the work to step 1, when the user isn't waiting yet?

This is the core insight of preloading: do the work before it's needed, during the time when users aren't consciously waiting.

## The Implementation: Preloading on Hover

I already had the infrastructure in place. My `usePosts.js` hook included a `usePreloadPost` function that was built but never used:

```javascript
export function usePreloadPost() {
  const preloadPost = useCallback(async (slug) => {
    if (!slug) return;

    // Check if already cached
    const cachedPost = postCache.get(slug);
    const now = Date.now();

    if (cachedPost && (now - cachedPost.timestamp) < CACHE_DURATION) {
      return; // Already cached
    }

    try {
      const response = await fetch(`/api/posts/${slug}.json`);
      if (response.ok) {
        const postData = await response.json();
        postCache.set(slug, {
          data: postData,
          timestamp: now
        });
      }
    } catch (err) {
      // Silently fail for preloading
      console.debug('Preload failed for:', slug, err);
    }
  }, []);

  return { preloadPost };
}
```

The function was sitting there, waiting to be used. I just needed to wire it up.

In `BlogPage.jsx`, I imported the hook and added two event handlers to each post link:

```javascript
import { usePostsIndex, usePreloadPost } from '../hooks/usePosts';

export default function BlogPage() {
  const { posts, loading, error } = usePostsIndex();
  const { preloadPost } = usePreloadPost();

  // ... filtering and pagination logic ...

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {paginatedPosts.map((post, index) => (
        <Link
          key={post.slug}
          to={`/blog/${post.slug}`}
          className="block h-full"
          onMouseEnter={() => preloadPost(post.slug)}
          onFocus={() => preloadPost(post.slug)}
        >
          <Card>
            {/* Post card content */}
          </Card>
        </Link>
      ))}
    </div>
  );
}
```

Two lines of code. `onMouseEnter` for hover, `onFocus` for keyboard navigation. That's it.

## The Results: Before and After

I tested the implementation using Chrome DevTools Performance tools and network monitoring.

### Before: Click-to-Load Pattern

**User Journey:**
1. User hovers over post (no action)
2. User clicks link
3. Navigation starts
4. Browser fetches `/api/posts/[slug].json` (~3.5KB)
5. React parses markdown content
6. Components render
7. **Total time:** 348ms

**Network Activity:**
- 1 request after click
- Status: 304 Not Modified (from HTTP cache)
- Perceived wait: noticeable

### After: Hover-to-Preload Pattern

**User Journey:**
1. User hovers over post → **preload triggers silently**
2. Browser fetches `/api/posts/[slug].json` in background
3. Content cached in memory
4. User clicks link
5. React renders from cache immediately
6. **Perceived time:** ~0ms

**Network Activity:**
- 1 request during hover (user doesn't notice)
- Status: 200 OK (initial fetch)
- Subsequent click: no network request needed
- Perceived wait: none

### Measured Impact

The actual load time didn't change much—the work still needs to happen. But the *perceived* load time dropped from 348ms to effectively zero.

Here's what the network timeline looked like:

```
Before:
[Hover]─────[Click]→[Fetch]→[Parse]→[Render] (348ms)
                    └─ User waiting ─┘

After:
[Hover]→[Fetch]→[Cache]─────[Click]→[Render] (~0ms perceived)
        └─ User browsing ─┘
```

The total time is similar, but it happens during a moment when the user isn't consciously waiting.

## Why This Works

Hover-based preloading exploits a fundamental truth about web interaction: there's always a gap between hovering and clicking.

**Average hover-to-click time:** 200-500ms

That's enough time to fetch a 3.5KB JSON file, parse it, and cache it in memory. By the time the user decides to click, the content is already there.

The technique works because:

1. **Small payloads:** Blog posts are 2-10KB JSON. Quick to fetch.
2. **High likelihood:** If someone hovers, they're probably interested.
3. **Silent failures:** Preload errors don't break the experience.
4. **Cache-aware:** The system checks the cache first, avoiding redundant requests.

## The Cost-Benefit Analysis

**Bandwidth cost:** Minimal. Preload requests only fire on hover, and most users who hover do click. False positives (hover without click) waste a few KB, but modern connections handle this easily.

**Implementation cost:** Two lines of code. The infrastructure (caching, fetching) already existed.

**User experience gain:** Subjectively massive. The blog went from "fast" to "instant."

**Accessibility bonus:** Adding `onFocus` means keyboard users get the same benefit.

## When Not to Use This

Hover preloading isn't a universal solution. It works here because:

- Posts are small (2-10KB)
- Hover-to-click conversion is high on blogs
- False positives are cheap
- No authentication required

Don't use this pattern when:

- Resources are large (images, videos)
- Hover-to-click conversion is low
- Bandwidth is constrained (mobile)
- Authentication adds complexity

## The Craft of Perceived Performance

This optimization is a reminder that performance isn't just about milliseconds. It's about timing, psychology, and the gap between user intent and system response.

My blog was already fast. The optimization didn't make it faster in absolute terms—the work still takes 348ms. But it moved that work to a moment when the user wasn't consciously waiting, transforming the experience from "fast" to "instant."

That's the craft of perceived performance: understanding not just how long things take, but *when* they happen in the user's mental model.

Fast is a number. Instant is a feeling. And with the right optimization, you can turn one into the other.

---

**Implementation details:**
- Framework: React 19 with Vite
- Caching: In-memory Map with 5-minute TTL
- Preload hook: Custom React hook with silent failures
- Testing: Chrome DevTools Performance and Network tools

The complete code is available in my [website repository](https://github.com/nathan-a-king/website).
