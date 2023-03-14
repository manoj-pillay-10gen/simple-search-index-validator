import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";
import files from "../data/files";
import { editor } from "monaco-editor";
import { loadAllSchema } from "../lib/schema";
import IMarker = editor.IMarker;

export async function getStaticProps() {
  const res = loadAllSchema();
  const allSchema = [];
  for await (const schema of res) {
    const schemaDef = {
      uri: schema.id,
      schema: JSON.parse(schema.contentJson),
    };
    // console.log(JSON.stringify(schemaDef));
    if (schema.id !== "index") {
      allSchema.push(schemaDef);
    }
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
    uri: "index", // id of the first schema
    fileMatch: [fileName], // associate with our model
    schema: require("../data/schema/index.json"),
  };

  useEffect(() => {
    editorRef.current?.focus();
  }, [file.name]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
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
            readOnly: false,
            cursorBlinking: "blink",
            fontWeight: "18px",
            roundedSelection: false,
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
