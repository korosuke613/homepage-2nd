import type { ReactNode } from "react";

type IPanelProps = {
  header: string;
  children: ReactNode;
};

export const Panel = (props: IPanelProps) => {
  return (
    <div
      style={{
        marginBottom: "20px",
        border: "1px solid transparent",
        borderRadius: "4px",
        boxShadow: "0 1px 1px rgb(0 0 0 / 5%)",
      }}
      className="border-purple-900 bg-blue-800"
    >
      <div
        style={{
          padding: "10px 15px",
          borderBottom: "1px solid transparent",
          borderTopLeftRadius: "3px",
          borderTopRightRadius: "3px",
        }}
        className="border-purple-900 bg-indigo-900 font-bold"
      >
        <span>{props.header}</span>
      </div>

      <div
        style={{
          padding: "15px",
        }}
      >
        <span>{props.children}</span>
      </div>
    </div>
  );
};
