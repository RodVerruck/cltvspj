import { MDXRemote } from 'next-mdx-remote';
import StatBand from '../mdx/StatBand';
import QuoteBand from '../mdx/QuoteBand';
import Callout from '../mdx/Callout';
import InfoCard from '../mdx/InfoCard';
import ButtonCTA from '../mdx/ButtonCTA';
import AffiliateCTA from '../AffiliateCTA';

// Novos componentes para padronização
import TLDRCard from './TLDRCard';
import FatorRCard from './FatorRCard';
import ComparativaTable from './ComparativaTable';
import ProfissaoCard from './ProfissaoCard';
import ErroCard from './ErroCard';
import FAQ from './FAQ';
import AnexoTable from './AnexoTable';
import InfoCallout from './InfoCallout';
import ProfissaoExemplo from './ProfissaoExemplo';
import StatHighlight from './StatHighlight';
import SimplesAnexoEscolherContent from './SimplesAnexoEscolherContent';
import SimplesAnexoContent from './SimplesAnexoContent';

const components = {
  StatBand,
  QuoteBand,
  Callout,
  InfoCard,
  ButtonCTA,
  AffiliateCTA,
  TLDRCard,
  FatorRCard,
  ComparativaTable,
  ProfissaoCard,
  ErroCard,
  FAQ,
  AnexoTable,
  InfoCallout,
  ProfissaoExemplo,
  StatHighlight,
  SimplesAnexoEscolherContent,
  SimplesAnexoContent,
};

export default function PostContent({ content }) {
  return (
    <div className="prose prose-lg md:prose-xl prose-stone max-w-none mx-auto text-ink font-sans" style={{ maxWidth: '896px' }}>
      <MDXRemote {...content} components={components} />
    </div>
  );
}