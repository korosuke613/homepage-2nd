import path from 'path';

import { AppConfig } from '@/utils/AppConfig';

type ISocialLinkProps = {
  url: string;
  alt: string;
  imgSrc: string;
  height: number;
  width: number;
};

export const SocialLink = (props: ISocialLinkProps) => (
  <a
    style={{ height: 'fit-content' }}
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src={path.join(AppConfig.base, props.imgSrc)}
      alt={props.alt}
      loading="lazy"
      height={props.height}
      width={props.width}
    />
  </a>
);
