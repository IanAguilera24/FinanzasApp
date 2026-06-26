// src/components/history/EditableCell.jsx
import { useState, useRef, useEffect } from "react";

export function EditableCell({ value, onSave, type = "text", options = null }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (type !== "select") inputRef.current.select();
    }
  }, [editing, type]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function handleSave() {
    setEditing(false);
    if (draft !== value) {
      onSave(draft);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  }

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        className="px-2 py-1 rounded cursor-pointer hover:bg-violet-50 transition min-h-[28px]"
        title="Clic para editar"
      >
        {options
          ? options.find((o) => o.id === value)?.label || value
          : type === "currency"
          ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value)
          : value || <span className="text-gray-300">—</span>}
      </div>
    );
  }

  if (type === "select" && options) {
    return (
      <select
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 rounded border border-violet-400 focus:outline-none text-sm"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={inputRef}
      type={type === "currency" ? "number" : type}
      step={type === "currency" ? "0.01" : undefined}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="w-full px-2 py-1 rounded border border-violet-400 focus:outline-none text-sm"
    />
  );
}