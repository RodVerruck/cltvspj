import { MDXRemote } from 'next-mdx-remote/rsc';
import { StatBand, QuoteBand, Callout, AffiliateCTA } from '@/components/mdx';

const components = {
  StatBand,
  QuoteBand,
  Callout,
  AffiliateCTA,
};

export function MDXPost({ source }) {
  return (
    <article className="prose prose-lg max-w-none">
      <MDXRemote source={source} components={components} />
    </article>
  );
}