import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, url }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
