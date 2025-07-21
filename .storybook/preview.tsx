import "@/styles/global.css";
import type { Preview } from "@storybook/react-vite";

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

    docs: {
      codePanel: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  tags: ["autodocs"],
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
