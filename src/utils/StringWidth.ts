/* @ts-ignore */
import eastAsianWidth from 'eastasianwidth';
import emojiRegex from 'emoji-regex';
import stripAnsi from 'strip-ansi';

type StringInfo = {
  width: number;
  chars: {
    char: string;
    width: number;
  }[];
};

export default function getStringInfo(originStr: string): StringInfo {
  const stringInfo: StringInfo = {
    width: 0,
    chars: [],
  };

  if (typeof originStr !== 'string' || originStr.length === 0) {
    return stringInfo;
  }

  let str = originStr;
  str = stripAnsi(str);

  if (str.length === 0) {
    return stringInfo;
  }

  str = str.replace(emojiRegex(), '  ');

  const multiByteWidth = 2;
  const singleByteWidth = 1;
  const ambiguousCharacterWidth = 1;

  Array.from(str).forEach((character) => {
    const codePoint = character.codePointAt(0);
    if (!codePoint) {
      return;
    }

    // Ignore control characters
    if (codePoint <= 0x1f || (codePoint >= 0x7f && codePoint <= 0x9f)) {
      return;
    }

    // Ignore combining characters
    if (codePoint >= 0x300 && codePoint <= 0x36f) {
      return;
    }

    const code = eastAsianWidth.eastAsianWidth(character);
    switch (code) {
      case 'F':
      case 'W':
        stringInfo.width += multiByteWidth;
        stringInfo.chars.push({ char: character, width: multiByteWidth });
        break;
      case 'A':
        stringInfo.width += ambiguousCharacterWidth;
        stringInfo.chars.push({
          char: character,
          width: ambiguousCharacterWidth,
        });
        break;
      default:
        stringInfo.width += singleByteWidth;
        stringInfo.chars.push({ char: character, width: singleByteWidth });
    }
  });

  return stringInfo;
}

export const transformTitleForContentCard = (title: string) => {
  // 以下の文章量がタイトルの限界。幅125
  // 'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。またそのなかでいっしょになっ'
  const MAX_WIDTH = 125;
  const REPLACE_STRING = '...';

  const titleInfo = getStringInfo(title);

  let compressTitle = '';
  let compressTitleWidth = 0;
  if (titleInfo.width >= MAX_WIDTH) {
    for (let i = 0; i < title.length; i += 1) {
      if (compressTitleWidth >= MAX_WIDTH - REPLACE_STRING.length) {
        break;
      }

      const c = titleInfo.chars[i];
      if (!c) {
        break;
      }
      compressTitle += c.char;
      compressTitleWidth += c.width;
    }

    compressTitle += REPLACE_STRING;
    return compressTitle;
  }

  return title;
};
