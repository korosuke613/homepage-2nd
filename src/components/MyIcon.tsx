import { useEffect, useRef, useState } from 'react';

import myIcon from '@/assets/images/my_icon_2.png';

const cssNames = [
  'rotate-animation-x',
  'rotate-animation-y',
  'rotate-animation-z',
  'rotate-animation-xy',
  'rotate-animation-xz',
  'rotate-animation-yz',
];

const makeEffect = (
  id: string,
  setMode: React.Dispatch<React.SetStateAction<string>>,
  modeRef: React.MutableRefObject<string>
) => {
  return () => {
    const thisImg = document.getElementById(id);
    if (thisImg === null) return () => {};

    const mousedown = () => {
      const randNum = Math.floor(Math.random() * cssNames.length);
      const cssName = cssNames[randNum] || 'rotate-animation-z';
      setMode(cssName);
      thisImg.classList.add(modeRef.current);
    };
    thisImg.addEventListener('mousedown', mousedown);

    const end = () => {
      cssNames.forEach((cssName) => {
        thisImg.classList.remove(cssName);
      });
    };
    thisImg.addEventListener('animationend', end);
    thisImg.addEventListener('animationcancel', end);

    return () => {
      thisImg.removeEventListener('mousedown', mousedown);
      thisImg.removeEventListener('animationend', end);
      thisImg.removeEventListener('animationcancel', end);
    };
  };
};

export const MyIcon = () => {
  const [largeMode, setLargeMode] = useState('rotate-animation-z');
  const largeModeRef = useRef<string>(null!);
  largeModeRef.current = largeMode;

  const [smallMode, setSmallMode] = useState('rotate-animation-z');
  const smallModeRef = useRef<string>(null!);
  smallModeRef.current = smallMode;

  useEffect(makeEffect('my-icon-large', setLargeMode, largeModeRef));
  useEffect(makeEffect('my-icon-small', setSmallMode, smallModeRef));

  return (
    <img
      src={myIcon.src}
      style={{ width: '100%' }}
      alt="Avatar image"
      loading="lazy"
    />
  );
};
