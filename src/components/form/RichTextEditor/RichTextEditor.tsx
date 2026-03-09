import JoditEditor from "jodit-react";
import type { Config } from "jodit/esm/config";
import { DeepPartial } from "jodit/esm/types";
import { useEffect, useMemo, useRef, useState } from "react";

const RichTextEditor = ({
  placeholder,
  value,
  onChange,
  direction,
}: {
  placeholder?: string;
  value: string;
  onChange: (html: string) => void;
  direction?: Config["direction"];
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const config = useMemo<DeepPartial<Config>>(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Start typings...",
      removeButtons: [
        "font",
        "speechRecognize",
        "image",
        "file",
        "video",
        "hr",
        "print",
      ],

      buttons: [
        "source",
        "|",
        "bold",
        "strikethrough",
        "underline",
        "italic",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "paragraph",
        "|",
        "link",
        "|",
        "align",
        "undo",
        "redo",
        "|",
        "eraser",
      ],
      spellcheck: true,
      useSplitMode: true,
      direction,
    }),
    [placeholder]
  );

  return (
    <JoditEditor
      ref={editor}
      className="relative prose"
      value={content}
      config={config}
      tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => {
        onChange(newContent);
      }}
    />
  );
};

export default RichTextEditor;
