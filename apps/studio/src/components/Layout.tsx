
import Sidebar from "./Sidebar";
import FileList from "./FileList";
import Editor from "./Editor";
import { Preview } from "./Preview";
import { useState } from "react";

export const Layout = () => {
  const [content, setContent] = useState('');
  return (
    <div>
      <h1>Hubql Studio</h1>
      <Sidebar />
      <FileList />
      <Editor />
      <Preview content={content} />
    </div>
  );
}