import React from "react";
import { Link, rootRouteId, useSearch, useParams } from "@tanstack/react-router";
import { useFiles } from '../lib/files';

export default function FilesList() {
  const { files, isLoading } = useFiles();
  const params = useParams({ strict: false });
  const search = useSearch({ from: rootRouteId })
  const { fileId } = params;
  let filteredFiles = files

  if (search.q && search.q !== ``) {
    filteredFiles = files.filter(file => file.title?.toLowerCase().includes(search.q.toLowerCase()))
  }

  filteredFiles = filteredFiles.sort((a, b) => a.id > b.id ? 1 : -1)

  if (isLoading) {
    return ``
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredFiles.map((file) => (
        <Link
          key={file.id}
          to="/files/$fileId"
          params={{ fileId: file.id.toString() }}
          className={`block w-full text-left p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors ${fileId === file.id.toString() ? "bg-gray-100" : ""
            }`}
        >
          <div className="font-medium">
            {file.title}
            {file.error && (
              <span className="text-red-500 text-sm ml-2">Error: {file.error}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(file.created_at).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  );
}