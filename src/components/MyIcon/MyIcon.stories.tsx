import type { Meta, StoryObj } from "@storybook/react";
import { expect, fireEvent, spyOn, userEvent, within } from "@storybook/test";
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

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole("img", { name: "Avatar" });

    await step("Click the icon to rotate it", async () => {
      await userEvent.click(icon);
    });

    await step("Change mugen mode", async () => {
      await userEvent.type(icon, "mugen");
      await userEvent.click(icon);
      await userEvent.click(icon);
      await userEvent.click(icon);
      await userEvent.type(icon, "mugen");
    });
  },
};
