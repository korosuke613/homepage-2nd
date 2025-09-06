import type { Page } from "astro";

export interface ISlide {
  id: string;
  type: string;
  title: string;
  pubDate: string;
  url: string;
  thumbnailUrl?: string;
}

export type SlideData = {
  id: string;
  type: string;
  title: string;
  pubDate: string;
  url: string;
  thumbnailUrl?: string;
  category: string[];
};

export declare type SlidePage = Page<SlideData>;

export interface DocswellJson {
  lastUpdated: string;
  slides: {
    [key: string]: {
      title: string;
      pubDate: string;
      url: string;
      thumbnailUrl?: string;
    };
  };
}

export interface SpeakerDeckJson {
  lastUpdated: string;
  slides: {
    [key: string]: {
      title: string;
      pubDate: string;
      url: string;
      thumbnailUrl?: string;
    };
  };
}

export interface SlideShareJson {
  lastUpdated: string;
  slides: {
    [key: string]: {
      title: string;
      pubDate: string;
      url: string;
      thumbnailUrl?: string;
    };
  };
}
