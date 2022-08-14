type IExternalLinkProps = {
  title: string;
  url: string;
};

export const ExternalLink = (props: IExternalLinkProps) => (
  <>
    <a
      className="text-cyan-400 hover:underline"
      href={props.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.title}
    </a>
  </>
);
