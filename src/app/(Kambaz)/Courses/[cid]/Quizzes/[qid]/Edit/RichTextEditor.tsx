/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";

export default function RichTextEditor({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: string) => void;
}) {
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      const text = value.replace(/<[^>]*>/g, '').trim();
      const words = text.split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    } else {
      setWordCount(0);
    }
  }, [value]);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="wd-rich-text-editor border rounded" style={{ backgroundColor: "white" }}>
      <div className="wd-menu-bar border-bottom p-2" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="d-flex gap-3">
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>Edit</a>
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>View</a>
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>Insert</a>
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>Format</a>
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>Tools</a>
          <a href="#" className="text-decoration-none text-dark" onClick={(e) => e.preventDefault()}>Table</a>
        </div>
      </div>

      <div className="wd-toolbar border-bottom p-2 d-flex align-items-center gap-2 flex-wrap" style={{ backgroundColor: "#f8f9fa" }}>
        <select className="form-select form-select-sm border" style={{ width: "auto", minWidth: "60px" }}>
          <option>12pt</option>
          <option>10pt</option>
          <option>14pt</option>
          <option>16pt</option>
          <option>18pt</option>
          <option>24pt</option>
        </select>

        <select className="form-select form-select-sm border" style={{ width: "auto", minWidth: "120px" }}>
          <option>Paragraph</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Heading 3</option>
        </select>

        <div className="vr" style={{ height: "20px" }}></div>

        <button
          className="btn btn-sm btn-light border"
          style={{ minWidth: "32px" }}
          title="Bold"
          onClick={(e) => {
            e.preventDefault();
            handleFormat("bold");
          }}
        >
          <strong>B</strong>
        </button>
        <button
          className="btn btn-sm btn-light border"
          style={{ minWidth: "32px" }}
          title="Italic"
          onClick={(e) => {
            e.preventDefault();
            handleFormat("italic");
          }}
        >
          <em>I</em>
        </button>
        <button
          className="btn btn-sm btn-light border"
          style={{ minWidth: "32px" }}
          title="Underline"
          onClick={(e) => {
            e.preventDefault();
            handleFormat("underline");
          }}
        >
          <u>U</u>
        </button>

        <div className="vr" style={{ height: "20px" }}></div>

        <button
          className="btn btn-sm btn-light border dropdown-toggle"
          type="button"
          style={{ minWidth: "32px" }}
          title="Text Color"
          onClick={(e) => e.preventDefault()}
        >
          A
        </button>

        <button
          className="btn btn-sm btn-light border dropdown-toggle"
          type="button"
          style={{ minWidth: "32px" }}
          title="Background Color"
          onClick={(e) => e.preventDefault()}
        >
          🖍️
        </button>

        <button
          className="btn btn-sm btn-light border dropdown-toggle"
          type="button"
          style={{ minWidth: "32px" }}
          title="Superscript/Subscript"
          onClick={(e) => e.preventDefault()}
        >
          T²
        </button>

        <div className="vr" style={{ height: "20px" }}></div>

        <button
          className="btn btn-sm btn-light border"
          style={{ minWidth: "32px" }}
          title="More Options"
          onClick={(e) => e.preventDefault()}
        >
          <span>⋮</span>
        </button>
      </div>

      <div className="position-relative" style={{ backgroundColor: "white" }}>
        <div
          ref={editorRef}
          contentEditable
          className="form-control border-0"
          style={{ 
            minHeight: "300px",
            resize: "vertical",
            fontFamily: "inherit",
            padding: "15px",
            overflowY: "auto",
            whiteSpace: "pre-wrap"
          }}
          onInput={handleInput}
          suppressContentEditableWarning={true}
        />
        <div 
          className="position-absolute"
          style={{ 
            top: "10px", 
            right: "10px",
            color: "green",
            fontSize: "0.9rem",
            fontWeight: "bold",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          100%
        </div>
      </div>

      <div className="wd-status-bar border-top p-2 d-flex justify-content-between align-items-center" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-muted small">p</div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-muted small">{wordCount} words</span>
          <button 
            className="btn btn-sm btn-link p-0 text-danger" 
            title="HTML Editor"
            onClick={(e) => e.preventDefault()}
          >
            &lt;/&gt;
          </button>
          <button 
            className="btn btn-sm btn-link p-0 text-danger" 
            title="More Options"
            onClick={(e) => e.preventDefault()}
          >
            <span>⋮</span>
          </button>
        </div>
      </div>
    </div>
  );
}

