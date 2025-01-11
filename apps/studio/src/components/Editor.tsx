import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { useParams, useRouter } from "@tanstack/react-router";
import * as Y from "yjs";
import { createTiptapExtensions } from "../../lib/tiptap";
import { TitleInput } from "./TitleInput";
import { Awareness } from "y-protocols/awareness";
import { ElectricProvider } from "../../y-electric";
// import { ConservativeAwarenessCleanup } from "../../y-electric/awareness-cleanup"
import { useFiles, updateFile } from "../../lib/files";
import "./editor.css";

// Map to cache ElectricProvider instances per fileId
const eProviderCache = new Map<string, ElectricProvider>();

function getProvider(fileId: string) {
  let eProvider = eProviderCache.get(fileId);

  if (!eProvider) {
    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);
    eProvider = new ElectricProvider(
      new URL(`/shape-proxy`, import.meta.env.VITE_API_URL).href,
      fileId,
      ydoc,
      {
        connect: true,
        awareness,
      },
    );
    awareness.on('change', ({ added, updated, removed }) => {
      // Get all current user states
      const states = awareness.getStates()
      console.log(`Current users in file ${fileId}:`, Array.from(states.values()))
    })

    // Create cleanup-er
    // new ConservativeAwarenessCleanup(awareness, {
    //   debug: true
    // })

    eProviderCache.set(fileId, eProvider);
  }

  return eProvider;
}

function ActualEditor({ fileId }: { fileId: string }) {
  console.log({ fileId });
  const eProvider = getProvider(fileId);
  const { files, isLoading } = useFiles();
  console.log({ eProvider });

  const file = files.find((file) => file.id === parseInt(fileId, 10));

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    // Fire and forget - errors will be handled by the optimistic store
    updateFile(parseInt(fileId, 10), { title: newTitle }).catch(console.error);
  };

  const handleContentChange = () => {
    console.log(`handleContentChange`);
  };

  const editor = useEditor({
    // enableContentCheck: true,
    extensions: createTiptapExtensions(eProvider),
  });

  if (isLoading || !file) {
    return ``;
  }

  return (
    <div className="flex-1 flex flex-col ml-10 lg:ml-0 border-l lg:border-0 border-grey bg-white">
      <TitleInput
        title={file.title}
        onChange={handleTitleChange}
        error={file.error}
      />
      <EditorContent
        editor={editor}
        className="flex-1 prose max-w-none p-4"
        onChange={handleContentChange}
      />
    </div>
  );
}

export default function Editor() {
  const { fileId } = useParams({ from: "/files/$fileId" });
  const router = useRouter();

  useEffect(() => {
    router.invalidate();
  }, [fileId]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <ActualEditor key={fileId} fileId={fileId} />
    </div>
  );
}