import { BsTwitter } from "react-icons/bs";

type ITweetButtonProps = {
  text: string;
  url: string;
};

export const TweetButton = (props: ITweetButtonProps) => {
  const url = new URL("https://twitter.com/intent/tweet");
  const params = new URLSearchParams({
    hashtags: "korosuke613dev",
    text: props.text,
    url: props.url,
    related: "shitimi_613",
  });
  const href = `${url.href}?${params.toString()}`;

  return (
    <a
      style={{ height: "fit-content" }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        type="button"
        style={{ backgroundColor: "#00acee" }}
        className="rounded-lg px-2.5 py-0.5 text-sm"
      >
        <BsTwitter size="16px" className="inline-block pb-0.5" /> Tweet
      </button>
    </a>
  );
};
