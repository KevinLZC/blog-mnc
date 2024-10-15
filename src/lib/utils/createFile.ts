import { readFileSync, writeFileSync, existsSync, stat } from "fs";
import { join } from "path";
import { fetchData } from "./fetchData";
import { slugify } from "./textConverter";
import { file } from "astro/loaders";

// Usar el directorio actual de ejecución
const baseDir = process.cwd();

function syncWriteFile(filename: string, data: any) {
  writeFileSync(join(baseDir, filename), data, {
    flag: "w",
  });

  const contents = readFileSync(join(baseDir, filename), "utf-8");
  console.log(contents);

  return contents;
}

export async function createNewFiles() {
  const token =
    "effcf70ebde2b932831208373be1c8e39511b9cd752d063a9d9cc335638d8e586ccf1d7cfc495be36a5cbe6cfdf3158e2da9ddc88942f4a6d4c7a3e34b63a32de009aa0b513afc9e22d81c8c0c3b063214796622ee74c1db52915c0f4e02512dbd6422733916a21b5374ef6b98ab1231cfcaafd1f846fd1e5ff54947900fb96e";

  const authors = await fetchData(token, "authors");
  const posts = await fetchData(token, "posts");

  authors.map((author: any) => {
    const {
      title,
      description,
      facebook,
      instagram,
      linkedin,
      twitter,
      info,
      image,
      updatedAt,
    } = author;

    const fileTemplate = `---\ntitle: ${title}\nimage: http://localhost:1337${image.url}\ndescription: ${description}\nsocial:\n  facebook: ${facebook ?? '""'}\n  instagram: ${instagram ?? '""'}\n  linkedin: ${linkedin ?? '""'}\n  twitter: ${twitter ?? '""'}\n---\n\n${info}\n`;

    const slug = slugify(title);
    const filePath = join(baseDir, `src/content/authors/${slug}.md`);

    if (!existsSync(filePath)) {
      syncWriteFile(`src/content/authors/${slug}.md`, fileTemplate);
    } else {
      stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error retrieving file stats: ${err.message}`);
          return;
        }
        const createdOn = new Date(stats.mtime.toISOString());
        if (createdOn < new Date(updatedAt)) {
          syncWriteFile(`src/content/authors/${slug}.md`, fileTemplate);
        }
      });
    }
  });

  posts.map((post: any) => {
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
      updatedAt,
    } = post;

    const filePath = join(baseDir, `src/content/posts/post-${id}.md`);
    const fileTemplate = `---\ntitle: "${title}"\ndescription: "${description}"\ndate: ${date}\nimage: "http://localhost:1337${image.url}"\nauthors: ["${author.title}"]\ncategories: ${JSON.stringify(categories.map((category: any) => category.name))}\ntags: ${JSON.stringify(tags.map((tag: any) => tag.name))}\ndraft: ${false}\n---\n\n${content}\n`;

    if (!existsSync(filePath)) {
      syncWriteFile(`src/content/posts/post-${id}.md`, fileTemplate);
    } else {
      stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error retrieving file stats: ${err.message}`);
          return;
        }
        const createdOn = new Date(stats.mtime.toISOString());
        if (createdOn < new Date(updatedAt)) {
          syncWriteFile(`src/content/posts/post-${id}.md`, fileTemplate);
        }
      });
    }
  });
}
// ---
// title: "La Importancia de la Nutrición Clínica en el Cuidado de la Salud"
// description: "Conoce cómo la nutrición clínica puede mejorar la calidad de vida de los pacientes."
// date: 2024 - 10-02T05:00:00Z
// image: "/images/posts/01.png"
// categories: ["nutrición"]
// authors: ["Dr. Jaime Alberto Bricio Barrios"]
// tags: ["nutrición clínica", "salud", "bienestar"]
// draft: false
// ---
