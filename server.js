import express from 'express';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflict with Nginx

// Serve static files from the dist-ssg directory
app.use(express.static(path.join(__dirname, 'dist-ssg')));

// Function to run a complete SSG build
function runFullSsgBuild() {
  console.log(`[${new Date().toISOString()}] Starting full SSG rebuild...`);
  
  // Set the BUILD_TIME environment variable
  const buildTime = new Date().toLocaleString();
  process.env.BUILD_TIME = buildTime;
  
  exec(`BUILD_TIME="${buildTime}" npm run build:ssg`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during build: ${error.message}`);
      return;
    }
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`Build stderr: ${stderr}`);
    }
    
    console.log(`[${new Date().toISOString()}] Full SSG rebuild completed successfully`);
    
    // Copy the newly built files to the Nginx directory
    try {
      exec('cp -r dist-ssg/* /usr/share/nginx/html/dist-ssg/', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error copying files: ${error.message}`);
          return;
        }
        console.log(`[${new Date().toISOString()}] Files copied to Nginx directory`);
      });
    } catch (err) {
      console.error(`Error copying files: ${err.message}`);
    }
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