import { useEffect } from 'react';

type IMyIconProps = {
  iconPath: string;
};

export const MyIcon = (props: IMyIconProps) => {
  useEffect(() => {
    ['my-icon-small', 'my-icon-large'].forEach((className) => {
      const thisImg = document.getElementById(className);
      if (thisImg === null) return;

      thisImg.addEventListener('mousedown', () => {
        thisImg.classList.add('rotate-animation');
      });
      thisImg.addEventListener('animationend', () => {
        thisImg.classList.remove('rotate-animation');
      });
      thisImg.addEventListener('animationcancel', () => {
        thisImg.classList.remove('rotate-animation');
      });
    });
  });

  return <img src={props.iconPath} alt="Avatar image" loading="lazy" />;
};
