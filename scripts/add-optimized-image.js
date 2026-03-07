const fs = require('fs');
const path = require('path');

function processFiles() {
  const files = fs.readdirSync('src', { recursive: true })
    .map(f => path.join('src', f))
    .filter(f => f.endsWith('.ts'));
    
  let modifiedCount = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (content.match(/<img\s+src=['"]/)) {
      
      // 1. Replace <img src="..." with <img ngSrc="..."
      content = content.replace(/<img\s+src=(['"])/g, '<img ngSrc=$1');
      content = content.replace(/<img[^>]*>/g, (match) => {
          if (match.includes('ngSrc') && !match.includes('width=') && !match.includes('fill')) {
              return match.replace('<img', '<img width="1200" height="800"');
          }
          return match;
      });

      // 2. Add NgOptimizedImage import
      if (!content.includes('NgOptimizedImage')) {
        const commonImportMatch = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]@angular\/common['"]/);
        if (commonImportMatch) {
          const imports = commonImportMatch[1].split(',').map(i => i.trim()).filter(i => i);
          if (!imports.includes('NgOptimizedImage')) {
            imports.push('NgOptimizedImage');
            content = content.replace(commonImportMatch[0], `import { ${imports.join(', ')} } from '@angular/common'`);
          }
        } else {
           content = `import { NgOptimizedImage } from '@angular/common';\n` + content;
        }
      }

      // 3. Add to imports array of @Component
      if (!content.includes('imports: [')) {
         content = content.replace(/selector:\s*['"][^'"]+['"],/, match => `${match}\n  imports: [NgOptimizedImage],`);
      } else {
         content = content.replace(/imports:\s*\[([^\]]*)\]/, (match, inner) => {
             const trimmed = inner.trim();
             if (!trimmed.includes('NgOptimizedImage')) {
                 return `imports: [${trimmed ? trimmed + ', ' : ''}NgOptimizedImage]`;
             }
             return match;
         });
      }

      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  });
  
  console.log(`Updated ${modifiedCount} components with NgOptimizedImage`);
}

processFiles();
