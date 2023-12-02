import type { ISocialLink } from "@/utils/SocialLinkData";

export const SocialLink = (props: ISocialLink) => (
  <a
    // style={{ height: "fit-content", width: "fit-content" }}
    style={{
      display: "block",
      height: "fit-content",
      width: "fit-content",
    }}
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src={props.imgSrc}
      alt={`${props.name} icon`}
      loading="lazy"
      height={props.height}
      width={props.width}
      style={{
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0,
      }}
    />
  </a>
);
