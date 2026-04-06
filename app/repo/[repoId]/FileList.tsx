"use client";

import { useEffect, useState } from "react";

export default function FileList({
  files,
}: {
  files: { path: string; contributors: string[]; count: number }[];
}) {
  const [hideNonCode, setHideNonCode] = useState(false);

  const NON_CODE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".ico",
    ".woff",
    ".ttf",
    ".eot",
    ".lock",
    ".gif",
    ".webp",
  ];

  const filteredFiles = hideNonCode
    ? files.filter(
        (f) => !NON_CODE_EXTENSIONS.some((ext) => f.path.endsWith(ext)),
      )
    : files;

  return (
    <div>
      <button
        onClick={() => setHideNonCode(!hideNonCode)}
        className="mb-4 text-sm px-3 py-1 rounded border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white"
      >
        {hideNonCode ? "Show all files" : "Hide images & lock files"}
      </button>

      {filteredFiles.map((file, index) => (
        <div
          key={index}
          className="flex justify-between py-1 border-b border-gray-800"
        >
          <span className="text-sm">{file.path}</span>
          <span>
            {file.count === 1 ? "🔴" : file.count === 2 ? "🟡" : "🟢"}
          </span>
        </div>
      ))}
    </div>
  );
}
