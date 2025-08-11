import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} - Nate King` : 'Nate King';
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}