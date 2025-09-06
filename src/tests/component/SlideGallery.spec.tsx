import { expect, test } from "@playwright/experimental-ct-react";

import { SlideGallery } from "@/components/SlideGallery";
import type { SlideData } from "@/types/ISlide";
import type { Tags } from "@/utils/Tag";

test.use({ viewport: { width: 1200, height: 800 } });

const mockSlideData: SlideData[] = [
  {
    id: "slide-1",
    type: "docswell",
    title: "First Slide",
    pubDate: "2023-01-01T00:00:00.000Z",
    url: "https://docswell.com/s/user/slide-1",
    thumbnailUrl: "https://example.com/thumb1.jpg",
    category: ["Docswell"],
  },
  {
    id: "slide-2",
    type: "speakerdeck",
    title: "Second Slide",
    pubDate: "2023-01-02T00:00:00.000Z",
    url: "https://speakerdeck.com/user/slide-2",
    thumbnailUrl: "https://example.com/thumb2.jpg",
    category: ["SpeakerDeck"],
  },
  {
    id: "slide-3",
    type: "slideshare",
    title: "Third Slide",
    pubDate: "2023-01-03T00:00:00.000Z",
    url: "https://slideshare.net/user/slide-3",
    thumbnailUrl: "https://example.com/thumb3.jpg",
    category: ["SlideShare"],
  },
];

const mockTags: Tags = {
  Docswell: "blue",
  SpeakerDeck: "green",
  SlideShare: "orange",
};

test("should render all slides in gallery", async ({ mount }) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={mockTags} />,
  );

  // Check that all slide titles are visible
  await expect(component.getByText("First Slide")).toBeVisible();
  await expect(component.getByText("Second Slide")).toBeVisible();
  await expect(component.getByText("Third Slide")).toBeVisible();

  // Check grid layout exists
  await expect(component).toHaveClass(/grid/);
});

test("should render empty gallery when no slides provided", async ({
  mount,
}) => {
  const component = await mount(<SlideGallery postList={[]} tags={mockTags} />);

  await expect(component).toHaveClass(/grid/);

  // Grid should exist but have no slide cards
  const slideCards = component.locator(".relative.overflow-hidden.rounded-md");
  await expect(slideCards).toHaveCount(0);
});

test("should render correct number of slide cards", async ({ mount }) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={mockTags} />,
  );

  // Check that correct number of cards are rendered
  const slideCards = component.locator(".relative.overflow-hidden.rounded-md");
  await expect(slideCards).toHaveCount(3);
});

test("should handle single slide", async ({ mount }) => {
  const singleSlide = mockSlideData.slice(0, 1);

  const component = await mount(
    <SlideGallery postList={singleSlide} tags={mockTags} />,
  );

  await expect(component.getByText("First Slide")).toBeVisible();

  const slideCards = component.locator(".relative.overflow-hidden.rounded-md");
  await expect(slideCards).toHaveCount(1);
});

test("should render slide cards with proper spacing", async ({ mount }) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={mockTags} />,
  );

  await expect(component).toHaveClass(/gap-6/);
});

test("should handle empty tags object", async ({ mount }) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={{}} />,
  );

  // Component should render slides but without any tag styling
  await expect(component.getByText("First Slide")).toBeVisible();
  await expect(component.getByText("Second Slide")).toBeVisible();
  await expect(component.getByText("Third Slide")).toBeVisible();
});

test("should render slides with different types correctly", async ({
  mount,
}) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={mockTags} />,
  );

  // Check that different slide types are rendered - use more specific selectors
  await expect(
    component.locator(".capitalize").getByText("docswell"),
  ).toBeVisible();
  await expect(
    component.locator(".capitalize").getByText("speakerdeck"),
  ).toBeVisible();
  await expect(
    component.locator(".capitalize").getByText("slideshare"),
  ).toBeVisible();
});

test("should maintain responsive grid layout", async ({ mount }) => {
  const component = await mount(
    <SlideGallery postList={mockSlideData} tags={mockTags} />,
  );

  // Check responsive classes
  await expect(component).toHaveClass(/grid-cols-1/); // Mobile
  await expect(component).toHaveClass(/sm:grid-cols-2/); // Small screens
  await expect(component).toHaveClass(/md:grid-cols-3/); // Medium+ screens
});

test("should handle large number of slides", async ({ mount }) => {
  const largeSlideList: SlideData[] = Array.from(
    { length: 20 },
    (_, index) => ({
      id: `slide-${index}`,
      type: "docswell",
      title: `Slide ${index + 1}`,
      pubDate: `2023-01-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`,
      url: `https://docswell.com/s/user/slide-${index}`,
      thumbnailUrl: `https://example.com/thumb${index}.jpg`,
      category: ["Docswell"],
    }),
  );

  const component = await mount(
    <SlideGallery postList={largeSlideList} tags={mockTags} />,
  );

  // Check that all slides are rendered
  const slideCards = component.locator(".relative.overflow-hidden.rounded-md");
  await expect(slideCards).toHaveCount(20);

  // Check first and last slides - use title attribute to be more specific
  await expect(component.locator("[title='Slide 1']")).toBeVisible();
  await expect(component.locator("[title='Slide 20']")).toBeVisible();
});
