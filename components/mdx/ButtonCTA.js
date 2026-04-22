import Link from 'next/link';

export default function ButtonCTA({ href = '/', text }) {
  return (
    <div className="my-8">
      <Link href={href} className="btn-money">
        {text}
        <span>→</span>
      </Link>
    </div>
  );
}