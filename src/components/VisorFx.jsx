export default function VisorFx({ children, photo = false }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {photo && (
        <img
          src="/brand/visor-splash.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/50 to-void" />
      <div className="rain" />
      <div className="lightning" />
      <div className="visor-mask" />
      <div className="scanlines absolute inset-0" />
      {children}
    </div>
  );
}
