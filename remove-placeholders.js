const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
files.forEach(file => {
  // Skip FacultyVerificationModal.jsx because it's for proof uploading
  if (file.includes('FacultyVerificationModal.jsx')) return;

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.match(/placeholder=\"[^\"]*\"/)) {
    content = content.replace(/\s*placeholder=\"[^\"]*\"/g, '');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});
console.log('Done removing placeholders');
