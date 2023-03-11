import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";
import files from "../data/files";
import { editor } from "monaco-editor";
import { loadAllSchema } from "../lib/schema";

export async function getStaticProps() {
  const res = loadAllSchema();
  const allSchema = [];
  for await (const schema of res) {
    const schemaDef = {
      uri: schema.id,
      schema: JSON.parse(schema.contentJson).schema,
    };
    // console.log(JSON.stringify(schemaDef));
    if (schema.id !== "parent") {
      allSchema.push(schemaDef);
    }
  }
  return {
    props: {
      allSchema,
    },
  };
}

export default function Home({ allSchema }) {
  const monaco = useMonaco();
  const editorRef = useRef(monaco);
  const [fileName, setFileName] = useState("basic.json");
  const file = files[fileName];

  const parentSchema = {
    uri: "parent", // id of the first schema
    fileMatch: [fileName], // associate with our model
    schema: require("../data/schema/parent.json"),
  };

  // const childSchema = {
  //   uri: "child", // id of the second schema
  //   schema: {
  //     type: "object",
  //     properties: {
  //       q1: {
  //         enum: ["x1", "x2"],
  //       },
  //     },
  //   },
  // };

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
          options={{ readOnly: false, cursorBlinking: "blink" }}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          onValidate={handleValidate}
        />
        <button onClick={handleValidateButtonClick}> Validate. </button>
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

  function handleValidate(markers) {
    // model markers
    markers.forEach((marker) =>
      console.log(
        "(Line Number",
        marker.startLineNumber,
        `) ${marker.severity}: `,
        marker.message
      )
    );
  }
  function handleEditorChange(value: any, _: any) {
    console.log("current value is :", value);
  }
}
