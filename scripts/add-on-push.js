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

    // If it has @Component but no changeDetection
    if (
      content.includes("@Component({") &&
      !content.includes("ChangeDetectionStrategy.OnPush")
    ) {
      // Add ChangeDetectionStrategy.OnPush to @Component
      content = content.replace(
        /@Component\(\{\s*/,
        "@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  ",
      );

      // Ensure ChangeDetectionStrategy is imported from @angular/core
      if (!content.includes("ChangeDetectionStrategy")) {
        const coreImportMatch = content.match(
          /import\s+{([^}]+)}\s+from\s+['"]@angular\/core['"]/,
        );
        if (coreImportMatch) {
          const imports = coreImportMatch[1]
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i);
          if (!imports.includes("ChangeDetectionStrategy")) {
            imports.push("ChangeDetectionStrategy");
            content = content.replace(
              coreImportMatch[0],
              `import { ${imports.join(", ")} } from '@angular/core'`,
            );
          }
        } else {
          content =
            `import { ChangeDetectionStrategy } from '@angular/core';\n` +
            content;
        }
      }

      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  });

  console.log(
    `Updated ${modifiedCount} components with ChangeDetectionStrategy.OnPush`,
  );
}

processFiles();
