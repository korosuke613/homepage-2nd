import { expect, test } from "@playwright/experimental-ct-react";

import { ExternalLink } from "@/components/ExternalLink";

test.use({ viewport: { width: 500, height: 500 } });

test("should work", async ({ mount }) => {
  const component = await mount(
    <div className="text-gray-100">
      <ExternalLink title="homepage" url="https://korosuke613.dev" />
    </div>,
  );

  const a = component.locator("a");

  // open new tab
  await expect(a).toHaveAttribute("target", "_blank");
  await expect(a).toHaveAttribute("rel", "noopener noreferrer");

  // correct url
  await expect(a).toHaveAttribute("href", "https://korosuke613.dev");
});
