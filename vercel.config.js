module.exports = {
  // Build command for Vercel
  build: {
    env: {
      // Set Vite mode to production
      VITE_MODE: 'production'
    }
  },
  // Routes configuration
  routes: {
    // Serve static files from the dist/client directory
    cleanUrls: true,
    trailingSlash: false,
    // Handle SPA routing - all routes go to index.html
    rewrites: [
      { source: '/(.*)', destination: '/index.html' }
    ]
  },
  // Override build command to output to correct directory
  buildCommand: 'npm run build:vercel',
  // Output directory (where built assets are located)
  outputDirectory: 'dist/client',
  // Static files configuration
  staticFiles: {
    // Exclude server-only files from deployment
    exclude: ['server', 'wrangler.json', '.vite', '**/*.worker.js']
  }
};