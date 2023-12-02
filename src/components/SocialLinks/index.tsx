import { SocialLink } from "@/components/SocialLink";
import { SocialLinkData, type SocialTypes } from "@/utils/SocialLinkData";

type ISocialLinksProps = {
  type: SocialTypes;
  topOnly: boolean;
};

export const SocialLinks: React.FC<ISocialLinksProps> = ({
  type,
  topOnly = false,
}) => (
  <div className="flex flex-wrap gap-1">
    {SocialLinkData.filter((link) => {
      if (type === "All") return true;
      return link.type === type;
    })
      .filter((link) => {
        if (topOnly) return link.isTop;
        return true;
      })
      .map((link) => (
        <SocialLink key={link.name} {...link} />
      ))}
  </div>
);
