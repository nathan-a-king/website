import '@testing-library/jest-dom';

// Clean up DOM after each test
afterEach(() => {
  // Remove all dynamically created meta tags and links
  document.querySelectorAll('meta[data-managed="runtime"]').forEach(el => el.remove());
  document.querySelectorAll('link[data-managed="runtime"]').forEach(el => el.remove());

  // Reset document title
  document.title = '';
});
