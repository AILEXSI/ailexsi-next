export default function StudioContent() {
  return (
    <div
      className="
        space-y-6 text-lg leading-relaxed
        p-6 rounded-xl
        bg-black/60
        backdrop-blur-sm
        border border-white/10
      "
      style={{
        backgroundImage: 'url(/images/content/studio/studiocontent.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-black/50 p-4 rounded-md">
        <p>CONTENT still in Orbit — Studio awakening soon ;)</p>
      </div>
    </div>
  );
}
