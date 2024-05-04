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

const Posts = defineTable({
  columns: {
    pagePath: column.text({ unique: true, primaryKey: true }),
    screenPageViews: column.number({ optional: false }),
  },
});

const Zenns = defineTable({
  columns: {
    pagePath: column.text({ unique: true, primaryKey: true }),
    screenPageViews: column.number({ optional: false }),
  },
});

const Blogs = defineTable({
  columns: {
    linkUrl: column.text({ unique: true, primaryKey: true }),
    click: column.number({ optional: false }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    Playground,
    Posts,
    Blogs,
    Zenns,
  },
});
