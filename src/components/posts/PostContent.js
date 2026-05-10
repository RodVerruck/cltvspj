import { MDXRemote } from 'next-mdx-remote';
import StatBand from '../mdx/StatBand';
import QuoteBand from '../mdx/QuoteBand';
import Callout from '../mdx/Callout';
import InfoCard from '../mdx/InfoCard';
import ButtonCTA from '../mdx/ButtonCTA';
import AffiliateCTA from '../AffiliateCTA';

const components = {
  StatBand,
  QuoteBand,
  Callout,
  InfoCard,
  ButtonCTA,
  AffiliateCTA,
};

export default function PostContent({ content }) {
  return (
    <div className="prose prose-lg md:prose-xl prose-stone max-w-none mx-auto text-ink font-sans" style={{ maxWidth: '768px' }}>
      <MDXRemote {...content} components={components} />
    </div>
  );
}