import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist-ssg directory
app.use(express.static(path.join(__dirname, 'dist-ssg')));

// Function to run a complete SSG build
function runFullSsgBuild() {
  console.log(`[${new Date().toISOString()}] Starting full SSG rebuild...`);
  
  exec('npm run build:ssg', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error.message}`);
      return;
    }
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`Build stderr: ${stderr}`);
    }
    
    console.log(`[${new Date().toISOString()}] Full SSG rebuild completed successfully`);
  });
}

// For any route not found in static files, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist-ssg', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  
  // Run initial build
  runFullSsgBuild();
  
  // Set up interval to run a full rebuild every 10 seconds
  setInterval(runFullSsgBuild, 10000);
  
  console.log('Automatic rebuild scheduled every 10 seconds');
}); 