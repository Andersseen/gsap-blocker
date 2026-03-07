const fs = require('fs');
const path = require('path');

function processFiles() {
  const files = fs.readdirSync('src', { recursive: true })
    .map(f => path.join('src', f))
    .filter(f => f.endsWith('.ts'));
    
  let modifiedCount = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Check ChangeDetectionStrategy
    if (content.includes('ChangeDetectionStrategy.OnPush') && !content.match(/import\s+\{[\s\S]*?ChangeDetectionStrategy[\s\S]*?\}\s+from\s+['"]@angular\/core['"]/)) {
        const coreImportMatch = content.match(/import\s+\{([\s\S]+?)\}\s+from\s+['"]@angular\/core['"]/);
        if (coreImportMatch) {
            const imports = coreImportMatch[1].split(',').map(i => i.trim()).filter(i => i);
            if (!imports.includes('ChangeDetectionStrategy')) {
                imports.push('ChangeDetectionStrategy');
                content = content.replace(coreImportMatch[0], `import { ${imports.join(', ')} } from '@angular/core';`);
                changed = true;
            }
        } else {
             content = `import { ChangeDetectionStrategy } from '@angular/core';\n` + content;
             changed = true;
        }
    }

    // Check NgOptimizedImage
    if (content.includes('NgOptimizedImage') && !content.match(/import\s+\{[\s\S]*?NgOptimizedImage[\s\S]*?\}\s+from\s+['"]@angular\/common['"]/)) {
        const commonImportMatch = content.match(/import\s+\{([\s\S]+?)\}\s+from\s+['"]@angular\/common['"]/);
        if (commonImportMatch) {
            const imports = commonImportMatch[1].split(',').map(i => i.trim()).filter(i => i);
            if (!imports.includes('NgOptimizedImage')) {
                imports.push('NgOptimizedImage');
                content = content.replace(commonImportMatch[0], `import { ${imports.join(', ')} } from '@angular/common';`);
                changed = true;
            }
        } else {
             content = `import { NgOptimizedImage } from '@angular/common';\n` + content;
             changed = true;
        }
    }

    if (changed) {
      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  });
  
  console.log(`Updated ${modifiedCount} files with missing imports`);
}
processFiles();
