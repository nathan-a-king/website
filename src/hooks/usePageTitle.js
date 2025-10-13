import { useEffect } from 'react';
import { updateDocumentMeta, generatePageMeta } from '../utils/seo';

/**
 * Legacy hook for setting page titles. Delegates to updateDocumentMeta for unified control.
 * @deprecated Use updateDocumentMeta with generatePageMeta directly for better SEO control.
 */
export function usePageTitle(pageName) {
  useEffect(() => {
    // Derive full metadata from page name for consistency
    const meta = generatePageMeta(pageName.toLowerCase());
    updateDocumentMeta(meta);
  }, [pageName]);
}