export default function StatHighlight({ number, label, suffix }) {
  return (
    <div className="my-12 text-center">
      <div className="inline-block relative">
        <div className="font-serif text-7xl md:text-8xl lg:text-9xl text-[#0c4a3e] leading-none tracking-tighter font-black">
          {number}
          {suffix && <span className="text-4xl md:text-5xl ml-1">{suffix}</span>}
        </div>
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#0c4a3e]/10 rounded-full" />
      </div>
      {label && (
        <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#6b6357] max-w-xs mx-auto">
          {label}
        </div>
      )}
    </div>
  );
}
