import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, canonical, ogType, ogImage, twitterHandle }) => {
  const siteName = "Intervyo";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const siteUrl = "https://intervyo.xyz";
  const defaultDescription = "Intervyo helps you practice interviews using AI-powered mock interviews, real-time feedback, and performance analysis.";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType || "website"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || `${siteUrl}/intervyologo.png`} />
      <meta property="og:url" content={`${siteUrl}${canonical || ""}`} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || `${siteUrl}/intervyologo.png`} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
    </Helmet>
  );
};

export default SEO;
