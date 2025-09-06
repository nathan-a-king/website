export function extractFirstImageFromMarkdown(content) {
  // Regular expressions to match different markdown image formats
  const imagePatterns = [
    // Standard markdown: ![alt text](image.jpg)
    /!\[[^\]]*\]\(([^)]+)\)/,
    // Reference style: ![alt text][ref] (would need additional logic to resolve refs)
    // HTML img tags: <img src="image.jpg" ...>
    /<img[^>]+src="([^"]+)"/i,
    /<img[^>]+src='([^']+)'/i
  ];

  for (const pattern of imagePatterns) {
    const match = content.match(pattern);
    if (match) {
      let imagePath = match[1];
      
      // Clean up the path
      imagePath = imagePath.trim();
      
      // Convert relative paths to absolute URLs
      if (imagePath.startsWith('/')) {
        return `https://www.nateking.dev${imagePath}`;
      } else if (imagePath.startsWith('http')) {
        return imagePath;
      } else {
        // Handle relative paths (assume they're relative to site root)
        return `https://www.nateking.dev/${imagePath}`;
      }
    }
  }
  
  return null;
}