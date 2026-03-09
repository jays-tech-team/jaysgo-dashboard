import { HelmetProvider, Helmet } from "react-helmet-async";
const defaultMetaTitle = import.meta.env.DEFAULT_META_TITLE;

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title || defaultMetaTitle}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
