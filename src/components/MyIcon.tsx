import { useCallback, useEffect, useState } from "react";

type IMyIconProps = {
  iconPath: string;
  iconId: string;
};

const animations: Record<string, Array<{ transform: string }>> = {
  rotateXYZ: [
    { transform: "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)" },
    { transform: "rotateX(90deg) rotateY(90deg) rotateZ(90deg) scale(1.5)" },
    { transform: "rotateX(180deg) rotateY(180deg) rotateZ(180deg) scale(1)" },
    {
      transform: "rotateX(270deg) rotateY(270deg) rotateZ(270deg) scale(1.5)",
    },
    { transform: "rotateX(360deg) rotateY(360deg) rotateZ(360deg) scale(1)" },
  ],
  rotateXY: [
    { transform: "rotateX(0deg) rotateY(0deg) scale(1)" },
    { transform: "rotateX(90deg) rotateY(90deg) scale(1.5)" },
    { transform: "rotateX(180deg) rotateY(180deg) scale(1)" },
    { transform: "rotateX(270deg) rotateY(270deg) scale(1.5)" },
    { transform: "rotateX(360deg) rotateY(360deg) scale(1)" },
  ],
  rotateXZ: [
    { transform: "rotateX(0deg) rotate(0deg) scale(1)" },
    { transform: "rotateX(90deg) rotate(90deg) scale(1.5)" },
    { transform: "rotateX(180deg) rotate(180deg) scale(1)" },
    { transform: "rotateX(270deg) rotate(270deg) scale(1.5)" },
    { transform: "rotateX(360deg) rotate(360deg) scale(1)" },
  ],
  rotateYZ: [
    { transform: "rotateY(0deg) rotateZ(0deg) scale(1)" },
    { transform: "rotateY(90deg) rotateZ(90deg) scale(1.5)" },
    { transform: "rotateY(180deg) rotateZ(180deg) scale(1)" },
    { transform: "rotateY(270deg) rotateZ(270deg) scale(1.5)" },
    { transform: "rotateY(360deg) rotateZ(360deg) scale(1)" },
  ],
  rotateX: [
    { transform: "rotateX(0deg) scale(1)" },
    { transform: "rotateX(90deg) scale(1.5)" },
    { transform: "rotateX(180deg) scale(1)" },
    { transform: "rotateX(270deg) scale(1.5)" },
    { transform: "rotateX(360deg) scale(1)" },
  ],
  rotateY: [
    { transform: "rotateY(0deg) scale(1)" },
    { transform: "rotateY(90deg) scale(1.5)" },
    { transform: "rotateY(180deg) scale(1)" },
    { transform: "rotateY(270deg) scale(1.5)" },
    { transform: "rotateY(360deg) scale(1)" },
  ],
  rotateZ: [
    { transform: "rotateZ(0deg) scale(1)" },
    { transform: "rotateZ(90deg) scale(1.5)" },
    { transform: "rotateZ(180deg) scale(1)" },
    { transform: "rotateZ(270deg) scale(1.5)" },
    { transform: "rotateZ(360deg) scale(1)" },
  ],
};
const animationKeys = Object.keys(animations);

export const MyIcon = (props: IMyIconProps) => {
  const [rotationComplete, setRotationComplete] = useState(true);
  const [isNoLimit, setIsNoLimit] = useState(false);
  const [keyString, setKeyString] = useState("");

  const toggleRotation = async () => {
    if (rotationComplete || isNoLimit) {
      setRotationComplete(false);
      const icon = document.getElementById(props.iconId);
      if (!icon) {
        console.warn("icon not found");
        return;
      }
      const animationIndex = Math.floor(
        Math.random() * Array.from(animationKeys).length,
      );
      const animationKey = animationKeys[animationIndex];
      if (!animationKey) {
        console.warn("animationKey not found");
        return;
      }
      const animation = animations[animationKey];
      if (!animation) {
        console.warn("animation not found");
        return;
      }
      console.debug("animation: ", animationKey);
      await icon.animate(animation, {
        duration: 1500,
        composite: "accumulate",
      }).finished;
      setRotationComplete(true);
    }
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const NO_LIMIT_MODE_KEY = "mugen";
      let _keyString = keyString;

      if (keyString.length > NO_LIMIT_MODE_KEY.length - 1) {
        // keyString を NO_LIMIT_MODE_KEY の長さに合わせる
        _keyString = _keyString.slice(-(NO_LIMIT_MODE_KEY.length - 1));
      }
      _keyString = _keyString + event.key;
      console.debug("keyString", _keyString);
      setKeyString(_keyString);

      const icon = document.getElementById(props.iconId);
      if (!icon) {
        console.warn("icon not found");
        return;
      }
      if (window.getComputedStyle(icon, null).display === "none") {
        return;
      }

      switch (_keyString.toLocaleLowerCase()) {
        case NO_LIMIT_MODE_KEY:
          if (!isNoLimit) {
            console.log(
              "%c NO LIMIT MODE ",
              "color: red; background-color: black; border: 4px solid yellow; font-size: 90px",
            );
          } else {
            console.log(
              "%c LIMIT MODE ",
              "color: black; background-color: white; border: 4px solid lightblue; font-size: 90px",
            );
          }
          setIsNoLimit(!isNoLimit);
          break;
      }
    },
    [isNoLimit, keyString, props.iconId],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <img
      src={props.iconPath}
      style={{ width: "100%" }}
      alt="Avatar"
      loading="lazy"
      onMouseDown={toggleRotation}
    />
  );
};
