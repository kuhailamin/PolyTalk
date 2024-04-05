import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { colors } from "../../constants";

function Reply({ users, name, text, original }) {
  return (
    <div
      className="message__recipient"
      style={{
        backgroundColor: "#f2f295",
      }}
    >
      <div className="reply">
        <h5>{name}</h5>
        <p>{original}</p>
      </div>
      <div>
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[[rehypeExternalLinks, { target: "_blank" }]]}
        >
          {text}
        </Markdown>
      </div>
    </div>
  );
}

export default Reply;
