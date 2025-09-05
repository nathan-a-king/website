import { prerender } from './prerender.js';

function prerenderPlugin() {
  return {
    name: 'vite-plugin-prerender',
    
    async closeBundle() {
      // Run pre-rendering after the build is complete
      try {
        console.log('\n📄 Starting pre-rendering process...');
        await prerender();
      } catch (error) {
        console.error('Pre-rendering failed:', error);
        // Don't fail the build, just warn
      }
    }
  };
}

export default prerenderPlugin;