import "@/styles/global.css";
import type { Preview } from "@storybook/react";

type __GlobalArgs = {
  // アルファベット順で最後に表示されるように頭に Global をつけている
  Global_disableDecorator?: boolean;
};

export type GlobalArgs = {
  args: __GlobalArgs;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: "requiredFirst",
    },
  },
  args: {
    Global_disableDecorator: false,
  } as __GlobalArgs,
  decorators: [
    (Story) => {
      const props = Story().props as __GlobalArgs;
      if (props.Global_disableDecorator) {
        return <Story />;
      }
      return (
        <div
          style={{
            height: "fit-content",
            width: "fit-content",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
