import type { Page } from "astro";

export interface ISlide {
  id: string;
  type: string;
  title: string;
  pubDate: string;
  url: string;
  ogpImageUrl: string;
}

export type SlideData = {
  id: string;
  type: string;
  ogpImageUrl: string;
  title: string;
  pubDate: string;
  url: string;
  category: string[];
};

export declare type SlidePage = Page<SlideData>;
