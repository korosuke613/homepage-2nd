import type { Meta, StoryObj } from "@storybook/react";

import { ThemeToggle } from "./index";

const meta: Meta<typeof ThemeToggle> = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InDarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};
