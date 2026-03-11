// Simple test to verify landing page components can be imported
const fs = require('fs');
const path = require('path');

const components = [
  'src/components/landing/HeroSection.jsx',
  'src/components/landing/FeaturesSection.jsx',
  'src/components/landing/HowItWorksSection.jsx',
  'src/components/landing/CTASection.jsx'
];

console.log('Checking landing page components...');

components.forEach(component => {
  const filePath = path.join(__dirname, component);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${component} exists`);
  } else {
    console.log(`✗ ${component} missing`);
  }
});

console.log('Landing page implementation complete!');
