import { expect, test } from '@playwright/experimental-ct-react';

import { EditGitHub } from '@/components/EditGitHub';

test.use({ viewport: { width: 500, height: 500 } });

test('collect url', async ({ mount }) => {
  const component = await mount(
    <EditGitHub id="template.md" collection="posts" />
  );

  await expect(component.locator('a')).toHaveAttribute(
    'href',
    'https://github.com/korosuke613/homepage-2nd/tree/main/src/content/posts/template.md'
  );
});
