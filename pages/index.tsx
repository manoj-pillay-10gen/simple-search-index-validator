import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";
import files from "../data/files";

const Home = () => {
  const editorRef = useRef(null);
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
          defaultLanguage={file.language}
          defaultValue={file.value}
          theme="vs-dark"
          onMount={(editor) => (editorRef.current = editor)}
          onChange={handleEditorChange}
        />
        <button onClick={handleValidate}> Validate. </button>
      </section>
    </Layout>
  );

  function handleValidate() {
    // @ts-ignore
    const editorJsonString = editorRef.current.getValue();
    const editorJson = JSON.parse(editorJsonString);
    console.log(editorJson.mappings.dynamic);
    alert(JSON.stringify(editorJson));
  }

  function handleEditorChange(value: any, _: any) {
    console.log("current value is :", value);
  }
};

export default Home;
