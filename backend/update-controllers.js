const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(controllersDir);

// Skip these files as they've already been updated
const skipFiles = ['driversController.js', 'carsController.js', 'maintenanceTypeController.js', 'maintenanceHistoryController.js'];

files.forEach(file => {
  if (skipFiles.includes(file)) {
    console.log(`Skipping ${file} as it's already updated`);
    return;
  }

  const filePath = path.join(controllersDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace db.query with async/await and db.execute
  content = content.replace(/exports\.(\w+)\s*=\s*\(req,\s*res\)\s*=>\s*{/g, 'exports.$1 = async (req, res) => {');
  
  // Replace db.query with db.execute
  content = content.replace(/db\.query\(/g, 'await db.execute(');
  
  // Replace callbacks with try/catch
  content = content.replace(/\(err,\s*(\w+)\)\s*=>\s*{([^}]*?)if\s*\(err\)\s*{([^}]*?)return\s*res\.status\((\d+)\)\.send\(([^)]*?)\);([^}]*?)}\s*else\s*{([^}]*?)}/g, 
    (match, resultVar, beforeErr, errHandling, statusCode, errMessage, afterErr, successBlock) => {
      return `try {\n    const [${resultVar}] = $1\n    ${successBlock.trim()}\n  } catch (err) {${errHandling}return res.status(${statusCode}).json({ message: ${errMessage} });\n  }`;
    });
  
  // Replace res.send with res.json for consistency
  content = content.replace(/res\.status\((\d+)\)\.send\(/g, 'res.status($1).json({ message: ');
  content = content.replace(/res\.status\((\d+)\)\.send\('([^']+)'\)/g, 'res.status($1).json({ message: \'$2\' })');
  
  // Fix any remaining issues
  content = content.replace(/\);(\s*)\);/g, ');\n$1');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All controllers updated successfully!'); 