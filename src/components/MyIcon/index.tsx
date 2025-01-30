import { useCallback, useEffect, useRef, useState } from "react";

type IMyIconProps = {
  iconPath: string;
  iconId: string;
};

type Position = {
  x: number;
  y: number;
  dx: number;
  dy: number;
};

const INITIAL_MOVE_SPEED = 5;

// ビビッドな色のリスト
const VIVID_COLORS = [
  undefined,
  "#FF4500", // オレンジレッド
  "#7B68EE", // ミディアムスレートブルー
  "#32CD32", // ライムグリーン
  "#00FF00", // ライム
  "#4169E1", // ロイヤルブルー
  "#00FFFF", // シアン
  "#FF00FF", // マゼンタ
  "#FFD700", // ゴールド
  "#8A2BE2", // ブルーバイオレット
  "#FF69B4", // ホットピンク
  "#FF1493", // ディープピンク
  "#FF6347", // トマト
] as const;

type VividColor = (typeof VIVID_COLORS)[number];

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

export const MyIcon: React.FC<IMyIconProps> = ({ iconId, iconPath }) => {
  const [rotationComplete, setRotationComplete] = useState(true);
  const [isNoLimit, setIsNoLimit] = useState(false);
  const [isInfinite, setIsInfinity] = useState(false);
  const [keyString, setKeyString] = useState("");
  const [intervalTime, setIntervalTime] = useState(800);
  const [isMoving, setIsMoving] = useState(false);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
    dx: INITIAL_MOVE_SPEED,
    dy: INITIAL_MOVE_SPEED,
  });
  const [iconColor, setIconColor] = useState<VividColor>(VIVID_COLORS[0]);
  const iconRef = useRef<HTMLImageElement>(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [moveSpeed, setMoveSpeed] = useState(INITIAL_MOVE_SPEED);

  const changeColor = useCallback(() => {
    const currentIndex = VIVID_COLORS.indexOf(iconColor);
    const nextIndex = (currentIndex + 1) % VIVID_COLORS.length;
    setIconColor(VIVID_COLORS[nextIndex]);
  }, [iconColor]);

  useEffect(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setInitialSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const toggleRotation = useCallback(async () => {
    if (rotationComplete || isNoLimit) {
      setRotationComplete(false);
      const icon = document.getElementById(iconId);
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
      await icon.animate(animation, {
        duration: 1500,
        composite: "accumulate",
      }).finished;
      setRotationComplete(true);
    }
  }, [rotationComplete, isNoLimit, iconId]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const NO_LIMIT_MODE_KEY = "mugen";
      const INFINITY_MODE_KEY = "eien";
      const CLOCK_UP = "clockup";
      const CLOCK_UP_SHORT = "cu";
      const MOVE_MODE_KEY = "kakku";
      const MAX_KEY_STRING_LENGTH = 10;
      let _keyString = keyString;

      if (keyString.length > MAX_KEY_STRING_LENGTH - 1) {
        // keyString を MAX_KEY_STRING_LENGTH の長さに合わせる
        _keyString = _keyString.slice(-(MAX_KEY_STRING_LENGTH - 1));
      }
      _keyString = _keyString + event.key;

      const icon = document.getElementById(iconId);
      if (!icon) {
        console.warn("icon not found");
        return;
      }
      if (window.getComputedStyle(icon, null).display === "none") {
        return;
      }

      // keyString の中にモード切替のキーワードが含まれているか
      const getMode = () => {
        const lowerKeyString = _keyString.toLocaleLowerCase();
        if (lowerKeyString.includes(NO_LIMIT_MODE_KEY)) {
          return NO_LIMIT_MODE_KEY;
        }
        if (lowerKeyString.includes(INFINITY_MODE_KEY)) {
          return INFINITY_MODE_KEY;
        }
        if (
          lowerKeyString.includes(CLOCK_UP) ||
          lowerKeyString.includes(CLOCK_UP_SHORT)
        ) {
          return CLOCK_UP;
        }
        if (lowerKeyString.includes(MOVE_MODE_KEY)) {
          return MOVE_MODE_KEY;
        }
        return "";
      };

      switch (getMode()) {
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
          setKeyString("");
          break;
        case INFINITY_MODE_KEY:
          if (!isInfinite) {
            console.log(
              "%c INFINITE MODE ",
              "color: blue; background-color: black; border: 4px solid yellow; font-size: 90px",
            );
          } else {
            console.log(
              "%c FINITE MODE ",
              "color: black; background-color: white; border: 4px solid lightblue; font-size: 90px",
            );
          }
          setIsInfinity(!isInfinite);
          setKeyString("");
          break;
        case CLOCK_UP: {
          console.log("CLOCK UP");
          console.log({ isNoLimit, isInfinite, isMoving });

          const newIntervalTime = Math.round(Math.max(intervalTime * 0.8, 100));
          const newMoveSpeed = moveSpeed * 1.2;
          setIntervalTime(newIntervalTime);
          setMoveSpeed(newMoveSpeed);
          setPosition((prev) => ({
            ...prev,
            dx: prev.dx > 0 ? newMoveSpeed : -newMoveSpeed,
            dy: prev.dy > 0 ? newMoveSpeed : -newMoveSpeed,
          }));
          console.log(
            `%c CLOCK UP: ${newIntervalTime}ms, Speed: ${newMoveSpeed.toFixed(1)} `,
            "color: green; background-color: black; border: 4px solid yellow; font-size: 90px",
          );
          setKeyString("");
          break;
        }
        case MOVE_MODE_KEY: {
          if (!isMoving && iconRef.current) {
            const rect = iconRef.current.getBoundingClientRect();
            setPosition((prev) => ({
              ...prev,
              x: rect.left,
              y: rect.top,
              dx: moveSpeed,
              dy: moveSpeed,
            }));
          }
          setIsMoving(!isMoving);
          if (!isMoving) {
            console.log(
              "%c DVD MODE ",
              "color: purple; background-color: black; border: 4px solid yellow; font-size: 90px",
            );
          } else {
            setMoveSpeed(INITIAL_MOVE_SPEED);
            console.log(
              "%c NO DVD MODE ",
              "color: black; background-color: white; border: 4px solid lightblue; font-size: 90px",
            );
          }
          setKeyString("");
          break;
        }
        default:
          setKeyString(_keyString);
          break;
      }
    },
    [
      isNoLimit,
      isInfinite,
      intervalTime,
      keyString,
      iconId,
      isMoving,
      moveSpeed,
    ],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    // isInfinite モードの場合、アイコンを自動で回転させる
    let interval: NodeJS.Timeout;
    if (isInfinite && (rotationComplete || isNoLimit)) {
      interval = setInterval(
        async () => {
          await toggleRotation();
        },
        isNoLimit ? intervalTime : 500,
      );
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isNoLimit, isInfinite, toggleRotation, rotationComplete, intervalTime]);

  useEffect(() => {
    const handleResize = () => {
      if (!iconRef.current) return;
      const icon = iconRef.current.getBoundingClientRect();

      setPosition((prev) => {
        const newX = Math.min(prev.x, window.innerWidth - icon.width);
        const newY = Math.min(prev.y, window.innerHeight - icon.height);
        return { ...prev, x: newX, y: newY };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMoving) return;

    const moveIcon = () => {
      if (!iconRef.current) return;
      const icon = iconRef.current.getBoundingClientRect();

      setPosition((prev) => {
        let newX = prev.x + prev.dx;
        let newY = prev.y + prev.dy;
        let newDx = prev.dx;
        let newDy = prev.dy;
        let hasCollision = false;

        const maxX = window.innerWidth;
        const maxY = window.innerHeight;
        const minX = 0;
        const minY = 0;

        // 壁との衝突判定
        if (newX + icon.width > maxX || newX < minX) {
          newDx = -newDx;
          newX = newX + icon.width > maxX ? maxX - icon.width : minX;
          hasCollision = true;
        }

        if (newY + icon.height > maxY || newY < minY) {
          newDy = -newDy;
          newY = newY + icon.height > maxY ? maxY - icon.height : minY;
          hasCollision = true;
        }

        if (hasCollision) {
          changeColor();
        }

        return { x: newX, y: newY, dx: newDx, dy: newDy };
      });
    };

    // 60fps で動かす
    const interval = setInterval(moveIcon, 1000 / 60);
    return () => clearInterval(interval);
  }, [isMoving, changeColor]);

  return (
    <div style={{ position: "relative" }}>
      <img
        ref={iconRef}
        id={iconId}
        src={iconPath}
        style={{
          position: isMoving ? "fixed" : "relative",
          left: isMoving ? `${position.x}px` : undefined,
          top: isMoving ? `${position.y}px` : undefined,
          height: isMoving ? `${initialSize.height}px` : undefined,
          width: isMoving ? `${initialSize.width}px` : "100%",
          transition: "transform 0.3s",
          zIndex: 9999,
          filter:
            isMoving &&
            VIVID_COLORS[VIVID_COLORS.indexOf(iconColor)] !== undefined
              ? `hue-rotate(${VIVID_COLORS.indexOf(iconColor) * 30}deg) saturate(400%) brightness(1.2)`
              : "none",
        }}
        alt="Avatar"
        loading="lazy"
        onMouseDown={toggleRotation}
      />
    </div>
  );
};
