import { marked } from 'marked';

export const Preview = ({ content }: { content: string }) => {
  return (
    <div className="w-1/2 p-4 bg-white overflow-auto">
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
  );
}