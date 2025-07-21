import type { GlobalArgs } from ".storybook/preview";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { NewerOlderPagination } from ".";

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

// 省略表示のテストケース
export const ManyPagesMiddle: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [],
      start: 1,
      end: 10,
      total: 120,
      size: 10,
      currentPage: 6,
      lastPage: 12,
      url: {
        current: "/blog/6",
        prev: "/blog/5",
        next: "/blog/7",
        first: undefined,
        last: undefined,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 省略記号の確認
    expect(canvas.getAllByText("...")).toHaveLength(2);

    // 表示されるべきページ番号の確認
    expect(canvas.getByText("1")).toBeInTheDocument();
    expect(canvas.getByText("3")).toBeInTheDocument();
    expect(canvas.getByText("4")).toBeInTheDocument();
    expect(canvas.getByText("5")).toBeInTheDocument();
    expect(canvas.getByText("6")).toBeInTheDocument();
    expect(canvas.getByText("7")).toBeInTheDocument();
    expect(canvas.getByText("8")).toBeInTheDocument();
    expect(canvas.getByText("9")).toBeInTheDocument();
    expect(canvas.getByText("12")).toBeInTheDocument();

    // 省略される番号が表示されないことの確認
    expect(canvas.queryByText("2")).not.toBeInTheDocument();
    expect(canvas.queryByText("10")).not.toBeInTheDocument();
  },
};

export const ManyPagesStart: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [],
      start: 1,
      end: 10,
      total: 120,
      size: 10,
      currentPage: 2,
      lastPage: 12,
      url: {
        current: "/blog/2",
        prev: "/blog",
        next: "/blog/3",
        first: undefined,
        last: undefined,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 前半のページでは右側のみ省略記号が表示される
    expect(canvas.getAllByText("...")).toHaveLength(1);

    // 表示されるべきページ番号の確認
    expect(canvas.getByText("1")).toBeInTheDocument();
    expect(canvas.getByText("2")).toBeInTheDocument();
    expect(canvas.getByText("3")).toBeInTheDocument();
    expect(canvas.getByText("4")).toBeInTheDocument();
    expect(canvas.getByText("5")).toBeInTheDocument();
    expect(canvas.getByText("12")).toBeInTheDocument();

    // 省略される番号が表示されないことの確認
    expect(canvas.queryByText("6")).not.toBeInTheDocument();
    expect(canvas.queryByText("10")).not.toBeInTheDocument();
  },
};

export const ManyPagesEnd: StoryObj<typeof NewerOlderPagination> = {
  args: {
    page: {
      data: [],
      start: 1,
      end: 10,
      total: 120,
      size: 10,
      currentPage: 11,
      lastPage: 12,
      url: {
        current: "/blog/11",
        prev: "/blog/10",
        next: "/blog/12",
        first: undefined,
        last: undefined,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 後半のページでは左側のみ省略記号が表示される
    expect(canvas.getAllByText("...")).toHaveLength(1);

    // 表示されるべきページ番号の確認
    expect(canvas.getByText("1")).toBeInTheDocument();
    expect(canvas.getByText("8")).toBeInTheDocument();
    expect(canvas.getByText("9")).toBeInTheDocument();
    expect(canvas.getByText("10")).toBeInTheDocument();
    expect(canvas.getByText("11")).toBeInTheDocument();
    expect(canvas.getByText("12")).toBeInTheDocument();

    // 省略される番号が表示されないことの確認
    expect(canvas.queryByText("5")).not.toBeInTheDocument();
    expect(canvas.queryByText("7")).not.toBeInTheDocument();
  },
};
