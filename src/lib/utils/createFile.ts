import { readFileSync, writeFileSync, existsSync, stat } from "fs";
import { join } from "path";
import { fetchData } from "./fetchData";
import { slugify } from "./textConverter";

const baseDir = process.cwd();

function syncWriteFile(filename: string, data: any): string {
  const filePath = join(baseDir, filename);
  writeFileSync(filePath, data, { flag: "w" });
  const contents = readFileSync(filePath, "utf-8");
  return contents;
}

export async function createNewFiles() {
  const token =
    "effcf70ebde2b932831208373be1c8e39511b9cd752d063a9d9cc335638d8e586ccf1d7cfc495be36a5cbe6cfdf3158e2da9ddc88942f4a6d4c7a3e34b63a32de009aa0b513afc9e22d81c8c0c3b063214796622ee74c1db52915c0f4e02512dbd6422733916a21b5374ef6b98ab1231cfcaafd1f846fd1e5ff54947900fb96e";

  const authors = await fetchData(token, "authors");
  const posts = await fetchData(token, "posts");

  authors.forEach((author: any) => {
    const {
      title,
      description,
      facebook,
      instagram,
      linkedin,
      twitter,
      info,
      image,
    } = author;
    const slug = slugify(title);
    const filePath = join(baseDir, `src/content/authors/${slug}.md`);

    const fileTemplate = `
---
title: "${title}"
image: "http://localhost:1337${image.url}"
description: "${description}"
social:
  facebook: "${facebook ?? ""}"
  instagram: "${instagram ?? ""}"
  linkedin: "${linkedin ?? ""}"
  twitter: "${twitter ?? ""}"
---

${info}
`.trim();

    if (!existsSync(filePath)) {
      syncWriteFile(`src/content/authors/${slug}.md`, fileTemplate.trim());
    } else {
      const existingContent = readFileSync(filePath, "utf-8").trim();

      if (existingContent !== fileTemplate.trim()) {
        syncWriteFile(`src/content/authors/${slug}.md`, fileTemplate.trim());
      }
    }
  });

  posts.forEach((post: any) => {
    const {
      id,
      title,
      description,
      date,
      image,
      author,
      categories,
      tags,
      content,
    } = post;
    const filePath = join(baseDir, `src/content/posts/post-${id}.md`);

    const fileTemplate = `
---
title: "${title}"
description: "${description}"
date: ${date}
image: "http://localhost:1337${image.url}"
authors: ["${author.title}"]
categories: ${JSON.stringify(categories.map((category: any) => category.name))}
tags: ${JSON.stringify(tags.map((tag: any) => tag.name))}
draft: false
---

${content}
`.trim();

    if (!existsSync(filePath)) {
      syncWriteFile(`src/content/posts/post-${id}.md`, fileTemplate.trim());
    } else {
      const existingContent = readFileSync(filePath, "utf-8").trim();

      if (existingContent !== fileTemplate.trim()) {
        syncWriteFile(`src/content/posts/post-${id}.md`, fileTemplate.trim());
      }
    }
  });
}
