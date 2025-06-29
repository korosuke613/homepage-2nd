import type { Meta, StoryObj } from "@storybook/react-vite";
import { MyIcon } from ".";

const metaData: Meta = {
  title: "MyIcon",
  component: MyIcon,
};

export default metaData;

export const Default: StoryObj<typeof MyIcon> = {
  render: ({ iconId, iconPath }) => {
    return (
      <div
        style={{
          width: "300px",
        }}
        id={iconId}
      >
        <MyIcon iconId={iconId} iconPath={iconPath} />
      </div>
    );
  },
  args: {
    iconPath: "/assets/images/my_icon_2.png",
    iconId: "my-icon",
  },
};
