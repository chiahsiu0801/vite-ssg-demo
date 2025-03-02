import express from 'express';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Time between regenerations (in milliseconds)
const REGENERATION_INTERVAL = 10000; // 10 seconds

// Track last build time
let lastBuildTime = Date.now();
let isBuilding = false;

// Setup regeneration timer
function setupRegenerationTimer() {
  console.log(`Setting up regeneration timer to run every ${REGENERATION_INTERVAL/1000} seconds`);
  
  // Initial check
  checkAndRegenerateIfNeeded();
  
  // Set up interval for regular checks
  setInterval(checkAndRegenerateIfNeeded, REGENERATION_INTERVAL);
}

function checkAndRegenerateIfNeeded() {
  console.log('Checking if regeneration is needed...');
  
  // Only check if we're not already building
  if (!isBuilding) {
    console.log('Time to regenerate home page HTML...');
    regenerateHomePageHtml();
  } else {
    console.log('Skipping regeneration: build already in progress');
  }
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any route not found in static files, serve index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Function to regenerate only the home page HTML
async function regenerateHomePageHtml() {
  isBuilding = true;
  console.log('Starting home page HTML regeneration...');
  
  try {
    // Read the current index.html template
    const templatePath = path.join(__dirname, 'dist', 'index.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    
    // Check if the app mount point exists in the template with the data-server-rendered attribute
    if (!template.includes('<div id="app" data-server-rendered="true">')) {
      console.error('Could not find app mount point with data-server-rendered attribute in template');
      console.log('Template content:', template.substring(0, 200) + '...'); // Log part of the template for debugging
      isBuilding = false;
      return;
    }
    
    // Extract the parts before and after the app mount point
    const [beforeApp, afterAppWithContent] = template.split('<div id="app" data-server-rendered="true">', 2);
    
    // Check if we successfully split the template
    if (!afterAppWithContent) {
      console.error('Failed to split template at app mount point');
      isBuilding = false;
      return;
    }
    
    // Split the after part to get the content after the closing div
    const afterAppParts = afterAppWithContent.split('</div>', 2);
    if (afterAppParts.length < 2) {
      console.error('Could not find closing div tag');
      isBuilding = false;
      return;
    }
    
    const afterAppContent = afterAppParts[1];
    
    // For now, let's use a simpler approach to update just the build time
    // This is more reliable than trying to re-render the entire app
    const currentContent = afterAppParts[0];
    
    // Update the build time in the current content
    const updatedContent = currentContent.replace(
      /Build time: ([^<]+)/,
      `Build time: ${new Date().toLocaleString()}`
    );
    
    // Reconstruct the HTML
    const updatedHtml = beforeApp + 
                       '<div id="app" data-server-rendered="true">' + 
                       updatedContent + 
                       '</div>' + 
                       afterAppContent;
    
    // Write the updated HTML back to index.html
    await fs.writeFile(templatePath, updatedHtml);
    
    console.log('Home page HTML regeneration completed successfully!');
    lastBuildTime = Date.now();
  } catch (error) {
    console.error(`Error during HTML regeneration: ${error.message}`);
    console.error(error.stack); // Log the full stack trace for debugging
  } finally {
    isBuilding = false;
  }
}

// Function to update only the build time in the home page HTML
async function updateHomeBuildTime() {
  isBuilding = true;
  console.log('Updating home page build time...');
  
  try {
    // Read the current index.html
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    let html = await fs.readFile(indexPath, 'utf-8');
    
    // Replace the build time with the current time
    // This assumes there's a specific pattern in your HTML that can be targeted
    const buildTimePattern = /Build time: ([^<]+)/;
    const newBuildTime = `Build time: ${new Date().toLocaleString()}`;
    
    if (buildTimePattern.test(html)) {
      html = html.replace(buildTimePattern, newBuildTime);
      
      // Write the updated HTML back
      await fs.writeFile(indexPath, html);
      console.log('Home page build time updated successfully!');
    } else {
      console.warn('Could not find build time pattern in HTML');
    }
    
    lastBuildTime = Date.now();
  } catch (error) {
    console.error(`Error updating build time: ${error.message}`);
  } finally {
    isBuilding = false;
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`ISR Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view your site`);
  console.log(`Home page HTML will regenerate every ${REGENERATION_INTERVAL/1000} seconds`);
  
  // Start the regeneration timer after server starts
  setupRegenerationTimer();
}); 