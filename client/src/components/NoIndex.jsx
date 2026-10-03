import { Helmet } from 'react-helmet-async';

/** Keeps a private or internal screen out of search results. */
export default function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
