import type { Playground } from "astro:db";
import { useState } from "react";

type Props = {
  playground: Array<typeof Playground.$inferSelect>;
};

const PlaygroundDb = (props: Props) => {
  const [filterText, setFilterText] = useState<string>("");

  const playground = props.playground.filter((p) => {
    if (filterText !== "") {
      return p.text?.includes(filterText);
    }
    return true;
  });

  return (
    <>
      <label>
        <code>text</code>:{" "}
        <input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="bg-black"
        />
      </label>
      <p>Total: {playground.length}</p>
      <br />
      <br />
      <pre>
        <code>{JSON.stringify(playground, null, 2)}</code>
      </pre>
    </>
  );
};

export { PlaygroundDb };
