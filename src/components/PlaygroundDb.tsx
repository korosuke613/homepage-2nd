import { useState } from "react";

type Props = {
  dbs: Record<string, Array<unknown>>;
};

const PlaygroundDb = ({ dbs }: Props) => {
  const [dbName, setDbName] = useState<string>("playground");

  return (
    <>
      <label>
        <code>DB</code>:{" "}
        <select
          value={dbName}
          onChange={(e) => {
            setDbName(e.target.value);
          }}
          className="bg-black"
        >
          {Object.keys(dbs).map((key) => (
            <option value={key}>{key}</option>
          ))}
        </select>
      </label>
      <p>Total: {dbs[dbName]?.length}</p>
      <br />
      <br />
      <pre>
        <code>{JSON.stringify(dbs[dbName], null, 2)}</code>
      </pre>
    </>
  );
};

export { PlaygroundDb };
