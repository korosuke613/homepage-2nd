export const TweetButton = () => {
  return (
    <>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        className="twitter-share-button"
        data-hashtags="korosuke613dev"
        data-lang="en"
        data-dnt="true"
        data-show-count="false"
        data-size="large"
      >
        Tweet
      </a>
      <script
        async
        src="https://platform.twitter.com/widgets.js"
        // @ts-ignore
        charset="utf-8"
      />
    </>
  );
};
