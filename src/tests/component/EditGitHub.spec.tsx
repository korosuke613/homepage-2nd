import { expect, test } from "@playwright/experimental-ct-react";

import { EditGitHub } from "@/components/EditGitHub";

test.use({ viewport: { width: 500, height: 500 } });

test("should work", async ({ mount }) => {
  const component = await mount(
    <div className="text-gray-100">
      <EditGitHub fileId="template.md" collection="posts" />
    </div>,
  );

  const a = component.locator("a");

  // open new tab
  await expect(a).toHaveAttribute("target", "_blank");
  await expect(a).toHaveAttribute("rel", "noopener noreferrer");

  // correct url
  await expect(a).toHaveAttribute(
    "href",
    "https://github.com/korosuke613/homepage-2nd/tree/main/src/content/posts/template.md",
  );
});
