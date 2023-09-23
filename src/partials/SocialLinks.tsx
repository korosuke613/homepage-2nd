import { SocialLink } from "@/components/SocialLink";
import { SocialLinkData } from "@/utils/SocialLinkData";

export const SocialLinks = () => (
  <>
    {SocialLinkData.filter((link) => link.isTop).map((link) => (
      <SocialLink key={link.name} {...link} />
    ))}
  </>
);
