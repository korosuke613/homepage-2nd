// Playwright の mount fixture から呼ばれる story gallery。
// ref: https://playwright.dev/docs/test-components
import type { ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";

const stories = import.meta.glob("../../src/**/*.story.tsx");

// src/components/SlideCard/SlideCard.story.tsx -> components/SlideCard/SlideCard
const id = (file: string) =>
  file.replace(/^(\.\.\/)+src\//, "").replace(/\.story\.\w+$/, "");

async function resolveStory(storyId: string) {
  const sep = storyId.lastIndexOf("/");
  const path = storyId.slice(0, sep);
  const name = storyId.slice(sep + 1);
  const file = Object.keys(stories).find(
    (f) => id(f) === path || id(f).endsWith(`/${path}`),
  );
  if (file === undefined) return undefined;
  const mod = (await stories[file]?.()) as Record<string, ComponentType>;
  return mod[name];
}

const rootEl = document.getElementById("root") as HTMLElement;
let root: Root | undefined;

type MountParams = { story: string; props?: Record<string, unknown> };

const w = window as unknown as {
  mount: (params: MountParams) => Promise<void>;
  unmount: () => Promise<void>;
};

w.mount = async ({ story, props }) => {
  const Story = await resolveStory(story);
  if (Story === undefined) throw new Error(`Unknown story: ${story}`);
  // update() で state を保てるよう root を使い回す
  root ??= createRoot(rootEl);
  // render のエラーで Promise を reject させるため flushSync する
  flushSync(() => root?.render(<Story {...props} />));
};

w.unmount = async () => {
  root?.unmount();
  root = undefined;
};
