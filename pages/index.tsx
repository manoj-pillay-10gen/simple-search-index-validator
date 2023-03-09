import React, { useEffect, useRef, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";
import files from "../data/files";

const Home = () => {
  const monaco = useMonaco();
  const editorRef = useRef(monaco);
  const [fileName, setFileName] = useState("basic.json");
  const file = files[fileName as string];

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
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: monaco
  ) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: "http://myserver/foo-schema.json", // id of the first schema
          fileMatch: ["basic.json"], // associate with our model
          schema: {
            type: "object",
            properties: {
              p1: {
                enum: ["v1", "v2"],
              },
              p2: {
                $ref: "http://myserver/bar-schema.json", // reference the second schema
              },
            },
          },
        },
        {
          uri: "http://myserver/bar-schema.json", // id of the second schema
          schema: {
            type: "object",
            properties: {
              q1: {
                enum: ["x1", "x2"],
              },
            },
          },
        },
      ],
    });
    editorRef.current = editor;
  }
  function handleValidateButtonClick() {
    // @ts-ignore
    const editorJsonString = editorRef.current.getValue();
    const editorJson = JSON.parse(editorJsonString);
    console.log(editorJson.mappings.dynamic);
    alert(JSON.stringify(editorJson));
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
};

export default Home;
