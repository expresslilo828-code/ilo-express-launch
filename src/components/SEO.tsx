import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    structuredData?: object;
}

const SEO = ({
    title = "Lilo Express - DOT Compliance & Transportation Services",
    description = "Expert DOT compliance services including USDOT registration, MC numbers, business formation, IRP plates, IFTA permits, and transportation licensing. Fast, reliable service for trucking companies nationwide.",
    keywords = "DOT compliance, USDOT number, MC number, trucking permits, IRP plates, IFTA, transportation licensing, business formation, truck compliance, motor carrier authority",
    ogImage = "https://liloexpress.com/opengraph-image-p98pqg.png",
    ogType = "website",
    canonicalUrl = "https://liloexpress.com",
    structuredData
}: SEOProps) => {
    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Lilo Express" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
