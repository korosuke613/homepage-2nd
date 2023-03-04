type IFooterCopyrightProps = {
  site_name: string;
};

const FooterCopyright = (props: IFooterCopyrightProps) => (
  <div className="border-t border-gray-600 pt-5">
    <div className="text-sm text-gray-200">
      © Copyright 2022 by{' '}
      <a
        className="text-cyan-400 hover:underline"
        href="https://github.com/korosuke613"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.site_name}
      </a>
      . Built with ♥ by{' '}
      <a
        className="text-cyan-400 hover:underline"
        href="https://astro.build/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Astro
      </a>{' '}
      and{' '}
      <a
        className="text-cyan-400 hover:underline"
        href="https://creativedesignsguru.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        CreativeDesignsGuru
      </a>
      . The source code for this site is{' '}
      <a
        className="text-cyan-400 hover:underline"
        href="https://github.com/korosuke613/homepage-2nd"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
    </div>
  </div>
);

export { FooterCopyright };
