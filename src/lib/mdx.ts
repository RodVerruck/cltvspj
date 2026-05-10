import { compile } from 'remark';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { StatBand, QuoteBand, Callout, AffiliateCTA } from '../components/mdx';

const components = {
  StatBand,
  QuoteBand,
  Callout,
  AffiliateCTA,
};

export async function compileMDX(source) {
  const result = await compile(source, { outputFormat: 'function-body' });
  const code = String(result);
  
  const scope = { 
    jsx, 
    jsxs, 
    Fragment,
    ...components 
  };
  
  const fn = new Function('React', ...Object.keys(scope), `${code}; return Content;`);
  const Component = fn(React, ...Object.values(scope));
  
  return <Component />;
}