import { MDXProvider } from '@mdx-js/react';
import { StatBand, QuoteBand, Callout, AffiliateCTA } from '../components/mdx';

const components = {
  StatBand,
  QuoteBand,
  Callout,
  AffiliateCTA,
};

export default function MDXContent({ children }) {
  return (
    <MDXProvider components={components}>
      {children}
    </MDXProvider>
  );
}