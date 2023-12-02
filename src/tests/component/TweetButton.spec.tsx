import { expect, test } from "@playwright/experimental-ct-react";

import { TweetButton } from "@/components/TweetButton";

test.use({ viewport: { width: 500, height: 500 } });

test("should work", async ({ mount }) => {
  const component = await mount(
    <div className="text-gray-100">
      <TweetButton text="this_is_text" url="https://korosuke613.dev/hoge" />
    </div>,
  );

  const a = component.locator("a");

  // open new tab
  await expect(a).toHaveAttribute("target", "_blank");
  await expect(a).toHaveAttribute("rel", "noopener noreferrer");

  // correct url
  await expect(a).toHaveAttribute(
    "href",
    "https://twitter.com/intent/tweet?hashtags=korosuke613dev&text=this_is_text&url=https%3A%2F%2Fkorosuke613.dev%2Fhoge&related=shitimi_613",
  );
});
