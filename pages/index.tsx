import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import Layout, { siteTitle } from "../components/layout";
import Head from "next/head";

const Home = () => {
  const editorRef = useRef(null);
  const defaultIndex = '{\n\t"mappings": {\n\t"dynamic": true\n\t}\n}';

  function handleEditorDidMount(editor: any, monaco: Monaco) {
    console.log("haha", editor, monaco);
    editorRef.current = editor;
  }

  function handleValidate() {
    // @ts-ignore
    const editorJsonString = editorRef.current.getValue();
    const editorJson = JSON.parse(editorJsonString);
    console.log(editorJson.mappings.dynamic);
    alert(JSON.stringify(editorJson));
  }

  function handleEditorChange(value: any, _) {
    console.log("current value is :", value);
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <Editor
          height="60vh"
          width="60vh"
          defaultLanguage="json"
          defaultValue={defaultIndex}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
        />
        <button onClick={handleValidate}> Validate. </button>
      </section>
    </Layout>
  );
};

export default Home;
