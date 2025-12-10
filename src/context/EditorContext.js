import React, { createContext, useContext, useState } from "react";

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [editorActions, setEditorActions] = useState(null);
  return (
    <EditorContext.Provider value={{ editorActions, setEditorActions }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => useContext(EditorContext);
