import { MDXRemote } from 'next-mdx-remote/rsc';
import StatBand from '../mdx/StatBand';
import QuoteBand from '../mdx/QuoteBand';
import Callout from '../mdx/Callout';
import AffiliateCTA from '../AffiliateCTA';

const mdxComponents = {
  StatBand,
  QuoteBand,
  Callout,
  AffiliateCTA,
};

export default function PostContent({ content }) {
  return (
    <div className="prose prose-lg max-w-[680px] mx-auto text-ink font-sans">
      <MDXRemote source={content} components={mdxComponents} />
    </div>
  );
}