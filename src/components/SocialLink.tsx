type ISocialLinkProps = {
  url: string;
  alt: string;
  imgSrc: string;
};

export const SocialLink = (props: ISocialLinkProps) => (
  <a
    style={{ height: 'fit-content' }}
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src={props.imgSrc} alt={props.alt} />
  </a>
);
