/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { promises as fs } from "fs";
import path from "path";

const archivePath = path.join(
  process.cwd(),
  "src",
  "app",
  "changelog",
  "archive",
);

const changelogFiles = ["25-08-24", "22-08-24", "02-08-24", "31-07-24"];

export async function readMarkdown() {
  const files: string[] = [];
  for (const file of changelogFiles) {
    const fileData = await fs.readFile(
      path.join(archivePath, `${file}.md`),
      "utf8",
    );
    files.push(fileData);
  }
  return files;
}

export default async function Page() {
  const files = await readMarkdown();

  return (
    <section className="pt-10">
      <div className="px-4 w-full justify-center items-center text-center">
        <h1 className="font-clash text-4xl font-bold">
          What's new in outfits.bio
        </h1>
        <p className="text-gray-500">
          Stay informed about the latest enhancements, features, and
          improvements across our webapp and mobile app.
        </p>
        <hr className="border-stroke mt-10" />
      </div>
      <div className="px-10 pb-10 flex flex-col gap-4">
        <MarkdownRender files={files} />
      </div>
    </section>
  );
}

function MarkdownRender({ files }: { files: string[] }) {
  return (
    <div>
      {files?.map((file: string, idx: number) => (
        <div key={idx}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-xl font-bold mt-10" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="mt-2 text-lg font-bold" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="mt-2 text-lg font-semibold" {...props} />
              ),
              h4: ({ ...props }) => (
                <h4 className="mt-2 text-base font-semibold" {...props} />
              ),
              h5: ({ ...props }) => (
                <h5 className="mt-2 text-sm font-semibold" {...props} />
              ),
              h6: ({ ...props }) => (
                <h6 className="mt-2 text-xs font-semibold" {...props} />
              ),
              p: ({ ...props }) => <p className="text-base" {...props} />,
              a: ({ ...props }) => (
                <a className="text-blue-500 hover:underline" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 border-gray-300 pl-4 italic"
                  {...props}
                />
              ),
              code: ({ ...props }) => (
                <code
                  className="bg-gray-100 p-1 rounded text-sm font-mono"
                  {...props}
                />
              ),
              pre: ({ ...props }) => (
                <pre
                  className="bg-gray-100 p-2 rounded overflow-x-auto"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc pl-5" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal pl-5" {...props} />
              ),
              li: ({ ...props }) => <li className="mb-1" {...props} />,
              table: ({ ...props }) => (
                <table className="min-w-full bg-white" {...props} />
              ),
              thead: ({ ...props }) => (
                <thead className="bg-gray-200" {...props} />
              ),
              tbody: ({ ...props }) => (
                <tbody className="divide-y divide-gray-200" {...props} />
              ),
              tr: ({ ...props }) => <tr {...props} />,
              th: ({ ...props }) => (
                <th className="px-4 py-2 text-left text-gray-700" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="px-4 py-2 text-gray-600" {...props} />
              ),
              img: ({ ...props }) => (
                <img
                  className="max-w-full h-auto"
                  alt="most likely an application screenshot"
                  {...props}
                />
              ),
            }}
          >
            {file}
          </ReactMarkdown>
          <hr className="border-stroke mt-10" />
        </div>
      ))}
    </div>
  );
}
