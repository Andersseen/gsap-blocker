const fs = require("fs");
const path = require("path");

function processFiles() {
  const files = fs
    .readdirSync("src", { recursive: true })
    .map((f) => path.join("src", f))
    .filter((f) => f.endsWith(".ts"));

  let modifiedCount = 0;

  files.forEach((file) => {
    let content = fs.readFileSync(file, "utf8");
    let origContent = content;

    // simplistic approach: if <img doesn't have alt, inject alt=""
    content = content.replace(/<(img\s+(?:[^>]*?))>/g, (match, inner) => {
      if (!inner.includes("alt=") && !inner.includes("[alt]=")) {
        return `<${inner} alt="">`;
      }
      return match;
    });

    if (content !== origContent) {
      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  });

  console.log(`Updated ${modifiedCount} files for accessibility`);
}
processFiles();
