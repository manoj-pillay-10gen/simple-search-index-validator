import React, { useRef, useState } from "react";
import Editor, {
  OnMount,
  OnValidate,
  OnChange,
  BeforeMount,
} from "@monaco-editor/react";
import Layout from "../components/layout";
import files from "../data/files";
import { loadAllSchema } from "../lib/schema";
import styles from "../components/layout.module.css";
import utilStyles from "../styles/utils.module.css";
// const slushTheme = require("../styles/SlushTheme.json");
// const leafyGreenLightTheme = require("../styles/LeafyGreenLightTheme.json");
const draftTheme = require("../styles/draftTheme.json");

export async function getStaticProps() {
  const res = loadAllSchema();
  console.log(res);
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
  const [fileName, setFileName] = useState("vector1.json");
  const file = files[fileName as string];
  const [errors, setErrors] = useState<{ id: number; msg: string }[]>([]);
  let nextId = 0;

  const handleBeforeEditorMount: BeforeMount = (monaco) => {
    const parentSchema = {
      uri: "vectorIndex.json", // id of the first schema
      fileMatch: ["*"], // associate with our model
    };
    allSchema.push(parentSchema);
    console.log(allSchema);
    monaco.editor.defineTheme("sandboxTheme", draftTheme);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemaValidation: "error",
      schemas: allSchema,
      allowComments: true,
      trailingCommas: "ignore",
    });
  };

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleValidate: OnValidate = (markers) => {
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
  };

  const handleEditorChange: OnChange = (value) => {
    console.log("current value is :", value);
  };

  return (
    <Layout home>
      <div className={styles.header}>
        <section>
          <h3 className={utilStyles.lightText}>
            Prototype for Vector Search Index Editor
          </h3>
        </section>
      </div>

      <section>
        <button
          disabled={fileName === "vector1.json"}
          onClick={() => setFileName("vector1.json")}
        >
          Vector Index Definition 1
        </button>
        <button
          disabled={fileName === "vector2.json"}
          onClick={() => setFileName("vector2.json")}
        >
          Vector Index Definition 2
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
            suggestSelection: "recentlyUsedByPrefix",
            mouseWheelZoom: true,
            suggest: {
              showWords: false,
              preview: true,
              previewMode: "subwordSmart",
              showInlineDetails: true,
              showStatusBar: true,
              showTypeParameters: true,
            },
            stickyTabStops: true,
            inlineSuggest: {
              showToolbar: "onHover",
              enabled: true,
              mode: "subwordSmart",
            },
            minimap: {
              enabled: false,
            },
            showUnused: true,
          }}
          theme="sandboxTheme"
          beforeMount={handleBeforeEditorMount}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          onValidate={handleValidate}
        />
        <button onClick={handleValidateButtonClick}> Validate.</button>
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

  function handleValidateButtonClick() {
    // @ts-ignore
    // const editorJsonString = JSON.stringify(editorRef.current.getValue());
    const editorJsonString = editorRef.current.getValue();
    const editorJson = JSON.parse(editorJsonString);
    // console.log(editorJson.mappings.dynamic);
    alert(editorJson);
    for (let key in editorJson) {
      console.log(key);
    }
    // console.log(editorJson);
    // console.log(allSchema);
  }
}
