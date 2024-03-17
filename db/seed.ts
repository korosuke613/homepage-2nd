import { Playground, db } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(Playground).values([
    { number: 1, text: "Hope you like Astro DB!" },
    { number: 2, text: Math.random().toString(), date: new Date() },
    { number: 3, text: Math.random().toString(), json: { key: "value" } },
    { number: 4, text: Math.random().toString(), boolean: true },
    { number: 5, text: Math.random().toString() },
    { number: 6, text: Math.random().toString() },
    { number: 7, text: Math.random().toString() },
    { number: 8, text: Math.random().toString() },
    { number: 9, text: Math.random().toString() },
    { number: 10, text: Math.random().toString() },
  ]);
}
