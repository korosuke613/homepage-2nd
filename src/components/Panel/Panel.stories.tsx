import type { Meta, StoryObj } from "@storybook/react";
import { Panel } from ".";
import type { GlobalArgs } from "../../../.storybook/preview";

const metaData: Meta = {
  title: "Panel",
  component: Panel,
};

export default metaData;

export const Text: StoryObj<typeof Panel & GlobalArgs> = {
  args: {
    header: "Header",
    children: "Children",
    Global_disableDecorator: true,
  },
};

export const Component: StoryObj<typeof Panel & GlobalArgs> = {
  args: {
    header: "Header",
    children: (
      <div
        style={{
          display: "flex",
          alignContent: "center",
          flexWrap: "wrap",
          flexDirection: "column",
        }}
      >
        <img src="/assets/images/my_icon_2.png" alt="icon" />
        <a
          href="https://korosuke613.dev"
          style={{
            textAlign: "center",
          }}
        >
          ホームページへ
        </a>
      </div>
    ),
    Global_disableDecorator: true,
  },
};
