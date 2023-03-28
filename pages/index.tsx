import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
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
  const [errors, setErrors] = useState("");
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
        <Editor
          height="60vh"
          width="60vh"
          path={file.name}
          language={file.language}
          defaultValue={file.value}
          options={{
            readOnly: false,
            cursorBlinking: "blink",
            fontWeight: "50",
            roundedSelection: false,
          }}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          onValidate={handleValidate}
        />
      </section>
      <section>
        <h4>{errors}</h4>
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
      if (typeof errMsg !== "undefined" && errMsg !== "") {
        setErrors(errMsg);
      }
    });
    console.log(`ErrMessages is ${errMessages}`);
  }

  function handleEditorChange(value: any, _: any) {
    console.log("current value is :", value);
  }
}
