import type { ComponentProps } from "react";

import { SlideGallery } from "./SlideGallery";

// テストから postList / tags を渡して描画する
export const WithProps = (props: ComponentProps<typeof SlideGallery>) => (
  <SlideGallery {...props} />
);
