import { useEffect } from 'react';

type IMyIconProps = {
  iconPath: string;
  iconId: string;
};

const cssClassNames = [
  'rotate-animation-x',
  'rotate-animation-y',
  'rotate-animation-z',
  'rotate-animation-xy',
  'rotate-animation-xz',
  'rotate-animation-yz',
];

export const MyIcon = (props: IMyIconProps) => {
  useEffect(() => {
    const thisImg = document.getElementById(props.iconId);
    if (thisImg === null) return;

    // クリック時にランダムにアニメーションのクラスを付与する
    thisImg.addEventListener('click', () => {
      const randNum = Math.floor(Math.random() * cssClassNames.length);
      const cssClassName = cssClassNames[randNum] || 'rotate-animation-z';
      thisImg.classList.add(cssClassName);
    });

    // アニメーションが終わったらアニメーションのクラスを削除する
    const removeClass = () => {
      cssClassNames.forEach((cssClassName) => {
        // どのクラスが付与されているかわからないので全部削除する
        thisImg.classList.remove(cssClassName);
      });
    };
    thisImg.addEventListener('animationend', removeClass);
    thisImg.addEventListener('animationcancel', removeClass);
  });

  return (
    <img
      src={props.iconPath}
      style={{ width: '100%' }}
      alt="Avatar image"
      loading="lazy"
    />
  );
};
