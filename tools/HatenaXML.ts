export type HatenaXML = {
  feed: {
    link: Array<{
      "@_rel": "first" | "next" | "alternate";
      "@_href": string;
    }>;
    entry: Array<{
      link: Array<{
        "@_rel": "edit" | "alternate";
        "@_type"?: string;
        "@_href": string;
      }>;
      title: string;
      updated: string;
      published: string;
      "app:edited": string;
      category?:
        | Array<{
            "@_term": string;
          }>
        | {
            "@_term": string;
          };
      "app:control": {
        "app:draft": "no" | "yes";
      };
    }>;
  };
};
