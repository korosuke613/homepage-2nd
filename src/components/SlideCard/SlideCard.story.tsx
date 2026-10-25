import type { ComponentProps } from "react";

import { SlideCard } from ".";

// テストから elt / tags を渡して描画する
export const WithProps = (props: ComponentProps<typeof SlideCard>) => (
  <SlideCard {...props} />
);
