import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Layout from "../components/layout";
import files from "../data/files";
import { editor } from "monaco-editor";
import { loadAllSchema } from "../lib/schema";
import IMarker = editor.IMarker;

import utilStyles from "../styles/utils.module.css";
import styles from "../components/layout.module.css";

export async function getStaticProps() {
  const res = loadAllSchema();
  const allSchema = [];
  for await (const schema of res) {
    const schemaDef = {
      uri: schema.id,
      schema: JSON.parse(schema.contentJson),
    };
    allSchema.push(schemaDef);
  }
  return {
    props: {
      allSchema,
    },
  };
}

// @ts-ignore
export default function Home({ allSchema }) {
  const editorRef = useRef<any>(null);
  const [fileName, setFileName] = useState("basic.json");
  const file = files[fileName as string];
  const [errors, setErrors] = useState<{ id: number; msg: string }[]>([]);
  let nextId = 0;

  const parentSchema = {
    uri: "jsonEditorIndex.json", // id of the first schema
    fileMatch: ["basic.json", "intermediate.json"], // associate with our model
  };

  useEffect(() => {
    editorRef.current?.focus();

    if (editorRef.current) {
      const editor = editorRef.current.editor;

      // Add the decoration
      const decorations = editor.deltaDecorations(
        [],
        [
          {
            range: new window.monaco.Range(1, 1, 1, 1), // Example range for the decoration
            options: {
              isWholeLine: true,
              className: "instruction-decoration", // CSS class for styling the decoration
            },
          },
        ]
      );

      // Cleanup the decoration when component unmounts
      return () => {
        editor.deltaDecorations(decorations, []);
      };
    }
  }, [file.name]);

  return (
    <Layout home>
      <div className={styles.header}>
        <section>
          <h3 className={utilStyles.lightText}>
            Prototype for Atlas Search JSON Editor
          </h3>
        </section>
      </div>
      <section>
        <button
          disabled={fileName === "basic.json"}
          onClick={() => setFileName("basic.json")}
        >
          Basic Index Definition
        </button>
        <button
          disabled={fileName === "intermediate.json"}
          onClick={() => setFileName("intermediate.json")}
        >
          Intermediate Index Definition
        </button>
        <Editor
          height="60vh"
          width="60vh"
          path={file.name}
          language={file.language}
          defaultValue={file.value}
          options={{
            cursorBlinking: "blink",
            fontSize: 14,
            roundedSelection: false,
            padding: {
              top: 10,
            },
            automaticLayout: true,
            fixedOverflowWidgets: true,
            suggest: {
              showWords: false,
              preview: true,
              previewMode: "subwordSmart",
              showInlineDetails: true,
              showStatusBar: true,
              showTypeParameters: true,
              showEnumMembers: false,
            },
            inlineSuggest: {
              showToolbar: "always",
              enabled: true,
              mode: "subwordSmart",
            },
            showUnused: true,
          }}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          onValidate={handleValidate}
        />
        <button onClick={handleValidateButtonClick}> Validate. </button>
      </section>
      <section>
        <ul>
          {errors.map((e) => (
            <li key={e.id}>{e.msg}</li>
          ))}
        </ul>
      </section>
    </Layout>
  );

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: any
  ) {
    allSchema.push(parentSchema);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: "error",
      schemas: allSchema,
      allowComments: true,
      trailingCommas: "ignore",
    });
    editorRef.current = editor;
  }
  function handleValidateButtonClick() {
    // @ts-ignore
    const editorJsonString = editorRef.current.getValue();
    const editorJson = JSON.parse(editorJsonString);
    // console.log(editorJson.mappings.dynamic);
    alert(JSON.stringify(editorJson));
    console.log(allSchema);
  }
  function handleValidate(markers: IMarker[]) {
    // model markers
    let errMessages = markers.map((marker) => {
      const errMsg = `(Line Number ${marker.startLineNumber}) ${marker.severity}: ${marker.message}`;
      if (
        typeof errMsg !== "undefined" &&
        !errors.some((e) => e.msg === errMsg) &&
        errMsg !== ""
      ) {
        setErrors([{ id: nextId++, msg: errMsg }]);
      }
    });
    console.log(`ErrMessages is ${errMessages}`);
  }
  function handleEditorChange(value: any, _: any) {
    console.log("current value is :", value);
  }
}
