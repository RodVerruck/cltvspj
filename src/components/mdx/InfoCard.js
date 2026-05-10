export default function InfoCard({ title, type = 'default', children }) {
  const isHot = type === 'hot';
  return (
    <div className="my-8">
      <div className={`bg-[#e6efe9] border-l-4 border-[#0c4a3e] p-5 rounded-r ${isHot ? 'bg-[#fce8dc] border-l-[#c2410c]' : ''}`}>
        {title && <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#0c4a3e] font-medium block mb-2">{title}</span>}
        <div className={`font-serif text-lg italic text-[#0c4a3e] leading-relaxed ${isHot ? 'text-[#c2410c]' : ''}`}>{children}</div>
      </div>
    </div>
  );
}