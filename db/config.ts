import { column, defineDb, defineTable } from "astro:db";

const Playground = defineTable({
  columns: {
    number: column.number({ unique: true }),
    text: column.text({ optional: true }),
    date: column.date({ optional: true }),
    json: column.json({ optional: true }),
    boolean: column.boolean({ optional: true }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Playground,
  },
});
