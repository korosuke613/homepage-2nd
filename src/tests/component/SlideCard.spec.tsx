import { expect, test } from "@playwright/experimental-ct-react";

import { SlideCard } from "@/components/SlideCard";
import type { SlideData } from "@/types/ISlide";
import type { Tags } from "@/utils/Tag";

test.use({ viewport: { width: 800, height: 600 } });

const mockSlideData: SlideData = {
  id: "test-slide-1",
  type: "docswell",
  title: "Test Slide Title",
  pubDate: "2023-01-01T00:00:00.000Z",
  url: "https://docswell.com/s/user/test-slide-1",
  thumbnailUrl: "https://example.com/thumbnail.jpg",
  category: ["Docswell", "Test"],
};

const mockTags: Tags = {
  Docswell: "blue",
  Test: "green",
  SpeakerDeck: "orange",
};

test("should render slide card with correct information", async ({ mount }) => {
  const component = await mount(
    <SlideCard elt={mockSlideData} tags={mockTags} />,
  );

  // Check title
  await expect(component.getByText("Test Slide Title")).toBeVisible();

  // Check date format
  await expect(component.getByText("Jan 1, 2023")).toBeVisible();

  // Check type (capitalize class should make it display correctly)
  await expect(
    component.locator(".capitalize").getByText("docswell"),
  ).toBeVisible();

  // Check thumbnail image
  const img = component.locator("img");
  await expect(img).toHaveAttribute("src", "https://example.com/thumbnail.jpg");
  await expect(img).toHaveAttribute("alt", "Test Slide Title");
});

test("should handle default thumbnail when thumbnailUrl is not provided", async ({
  mount,
}) => {
  const slideWithoutThumbnail: SlideData = {
    ...mockSlideData,
    thumbnailUrl: undefined,
  };

  const component = await mount(
    <SlideCard elt={slideWithoutThumbnail} tags={mockTags} />,
  );

  const img = component.locator("img");
  await expect(img).toHaveAttribute(
    "src",
    "/assets/images/default-slide-thumbnail.webp",
  );
});

test("should render tags correctly", async ({ mount }) => {
  const component = await mount(
    <SlideCard elt={mockSlideData} tags={mockTags} />,
  );

  // Check that relevant tags are displayed as tag components
  const tagComponents = component.locator(".contents_tag");
  await expect(tagComponents.getByText("Docswell")).toBeVisible();
  await expect(tagComponents.getByText("Test")).toBeVisible();
});

test("should have correct external link to slide URL", async ({ mount }) => {
  const component = await mount(
    <SlideCard elt={mockSlideData} tags={mockTags} />,
  );

  // Check the main slide links (image and title area) - not the tag links
  const slideImageLink = component.locator("img").locator("..");
  await expect(slideImageLink).toHaveAttribute("href", mockSlideData.url);
  await expect(slideImageLink).toHaveAttribute("target", "_blank");
  await expect(slideImageLink).toHaveAttribute("rel", "noopener noreferrer");
});

test("should handle SpeakerDeck slide type", async ({ mount }) => {
  const speakerDeckSlide: SlideData = {
    id: "speaker-1",
    type: "speakerdeck",
    title: "SpeakerDeck Presentation",
    pubDate: "2023-02-15T00:00:00.000Z",
    url: "https://speakerdeck.com/user/speaker-1",
    thumbnailUrl: "https://speakerdeck.com/thumb.jpg",
    category: ["SpeakerDeck"],
  };

  const component = await mount(
    <SlideCard elt={speakerDeckSlide} tags={mockTags} />,
  );

  await expect(component.getByText("SpeakerDeck Presentation")).toBeVisible();
  await expect(component.getByText("Feb 15, 2023")).toBeVisible();
  await expect(
    component.locator(".capitalize").getByText("speakerdeck"),
  ).toBeVisible();

  // Check SpeakerDeck tag in tag components
  const tagComponents = component.locator(".contents_tag");
  await expect(tagComponents.getByText("SpeakerDeck")).toBeVisible();
});

test("should handle SlideShare slide type", async ({ mount }) => {
  const slideShareSlide: SlideData = {
    id: "share-1",
    type: "slideshare",
    title: "SlideShare Presentation",
    pubDate: "2023-03-20T00:00:00.000Z",
    url: "https://slideshare.net/user/share-1",
    thumbnailUrl: "https://slideshare.net/thumb.jpg",
    category: ["SlideShare"],
  };

  const tagsWithSlideShare: Tags = {
    ...mockTags,
    SlideShare: "red",
  };

  const component = await mount(
    <SlideCard elt={slideShareSlide} tags={tagsWithSlideShare} />,
  );

  await expect(component.getByText("SlideShare Presentation")).toBeVisible();
  await expect(component.getByText("Mar 20, 2023")).toBeVisible();
  await expect(
    component.locator(".capitalize").getByText("slideshare"),
  ).toBeVisible();

  // Check SlideShare tag in tag components
  const tagComponents = component.locator(".contents_tag");
  await expect(tagComponents.getByText("SlideShare")).toBeVisible();
});

test("should handle long title with proper truncation", async ({ mount }) => {
  const longTitleSlide: SlideData = {
    ...mockSlideData,
    title:
      "This is a very long slide title that should be truncated when displayed in the slide card component",
  };

  const component = await mount(
    <SlideCard elt={longTitleSlide} tags={mockTags} />,
  );

  const titleElement = component.locator("p", {
    hasText: longTitleSlide.title,
  });
  await expect(titleElement).toBeVisible();
  await expect(titleElement).toHaveAttribute("title", longTitleSlide.title);
});

test("should handle empty category array", async ({ mount }) => {
  const noCategorySlide: SlideData = {
    ...mockSlideData,
    category: [],
  };

  const component = await mount(
    <SlideCard elt={noCategorySlide} tags={mockTags} />,
  );

  // Basic slide information should still be visible
  await expect(component.getByText("Test Slide Title")).toBeVisible();
  await expect(
    component.locator(".capitalize").getByText("docswell"),
  ).toBeVisible();

  // No tag components should be visible since category is empty
  const tagComponents = component.locator(".contents_tag");
  await expect(tagComponents.getByText("Docswell")).not.toBeVisible();
  await expect(tagComponents.getByText("Test")).not.toBeVisible();
});
