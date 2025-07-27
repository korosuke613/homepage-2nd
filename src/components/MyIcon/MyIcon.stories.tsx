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

export const ChaseMode: StoryObj<typeof MyIcon> = {
  render: ({ iconId, iconPath }) => {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "14px",
            zIndex: 10000,
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Chase Mode テスト</h3>
          <div>
            1. 「<strong>oikake</strong>」と入力 → FOLLOW MODE
          </div>
          <div>
            2. 再度「<strong>oikake</strong>」と入力 → AVOID MODE
          </div>
          <div>
            3. 再度「<strong>oikake</strong>」と入力 → CHASE MODE OFF
          </div>
          <div style={{ marginTop: "10px" }}>
            <small>※ アイコンがマウスカーソルを追跡・回避します</small>
          </div>
        </div>
        <MyIcon iconId={iconId} iconPath={iconPath} />
      </div>
    );
  },
  args: {
    iconPath: "/assets/images/my_icon_2.png",
    iconId: "my-icon-chase",
  },
  parameters: {
    layout: "fullscreen",
  },
};
