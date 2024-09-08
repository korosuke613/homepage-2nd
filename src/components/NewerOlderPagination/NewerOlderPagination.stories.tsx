import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { within } from "@storybook/testing-library";
import { NewerOlderPagination } from ".";
import type { GlobalArgs } from ".storybook/preview";

const metaData: Meta<typeof NewerOlderPagination> & GlobalArgs = {
  title: "NewerOlderPagination",
  component: NewerOlderPagination,
  args: {
    Global_disableDecorator: true,
  },
};

export default metaData;

export const Default: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [], // Add an empty array for the 'data' property
      start: 1, // Add a default value for the 'start' property
      end: 5, // Add a default value for the 'end' property
      total: 5, // Add a default value for the 'total' property
      size: 5, // Add a default value for the 'size' property
      currentPage: 3,
      lastPage: 5,
      url: {
        current: "/blog/3",
        prev: "/blog/2",
        next: "/blog/4",
        first: undefined,
        last: undefined,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const links = canvas.getAllByRole("link");

    const prev = links[0];
    const next = links[links.length - 1];

    expect(prev).toHaveAttribute("href", "/blog/2");
    expect(next).toHaveAttribute("href", "/blog/4");

    expect(canvas.getByText("1")).toHaveAttribute("href", "/blog");
    expect(canvas.getByText("2")).toHaveAttribute("href", "/blog/2");
    expect(canvas.getByText("4")).toHaveAttribute("href", "/blog/4");
    expect(canvas.getByText("5")).toHaveAttribute("href", "/blog/5");
  },
};

export const FirstPage: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [], // Add an empty array for the 'data' property
      start: 1, // Add a default value for the 'start' property
      end: 0, // Add a default value for the 'end' property
      total: 0, // Add a default value for the 'total' property
      size: 0, // Add a default value for the 'size' property
      currentPage: 1,
      lastPage: 5,
      url: {
        current: "/blog/",
        prev: undefined,
        next: "/blog/2",
        first: undefined,
        last: "/blog/5",
      },
    },
  },

  play: async ({ canvasElement }) => {
    // 最初のページなので「←」のリンクがないことを確認
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole("link");
    expect(links[0]).not.toHaveTextContent("←");
  },
};

export const LastPage: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [], // Add an empty array for the 'data' property
      start: 1, // Add a default value for the 'start' property
      end: 0, // Add a default value for the 'end' property
      total: 0, // Add a default value for the 'total' property
      size: 0, // Add a default value for the 'size' property
      currentPage: 5,
      lastPage: 5,
      url: {
        current: "/blog/5",
        prev: "/blog/2",
        next: undefined,
        first: undefined,
        last: undefined,
      },
    },
  },

  play: async ({ canvasElement }) => {
    // 最後のページなので「→」のリンクがないことを確認
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole("link");
    expect(links[links.length - 1]).not.toHaveTextContent("→");
  },
};

export const SinglePage: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [], // Add an empty array for the 'data' property
      start: 1, // Add a default value for the 'start' property
      end: 1, // Add a default value for the 'end' property
      total: 1, // Add a default value for the 'total' property
      size: 1, // Add a default value for the 'size' property
      currentPage: 1,
      lastPage: 1,
      url: {
        current: "/blog",
        prev: undefined,
        next: undefined,
        first: undefined,
        last: undefined,
      },
    },
  },

  play: async ({ canvasElement }) => {
    // ページが1ページしかないのでリンクがないことを確認
    const canvas = within(canvasElement);
    const links = canvas.queryByRole("link");
    expect(links).not.toBeInTheDocument();
  },
};
