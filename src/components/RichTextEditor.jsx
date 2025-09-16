import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// MenuBar component remains the same...
const MenuBar = ({ editor }) => {
  // ... no changes here
  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-zinc-800 rounded-t-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-violet-600 text-white py-1 px-2 rounded' : 'py-1 px-2 rounded hover:bg-zinc-700'}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-violet-600 text-white py-1 px-2 rounded' : 'py-1 px-2 rounded hover:bg-zinc-700'}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-violet-600 text-white py-1 px-2 rounded' : 'py-1 px-2 rounded hover:bg-zinc-700'}
      >
        List
      </button>
    </div>
  );
};


export const RichTextEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    // Add this line as suggested by the error message
    immediatelyRender: false, 
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert min-h-[150px] max-w-none p-4 focus:outline-none',
      },
    },
  });

  return (
    <div className="border border-zinc-700 rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};