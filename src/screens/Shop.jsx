import { useStore } from '../state/store.jsx';
import { formatInt } from '../lib/format.js';

export default function Shop() {
  const { shop, boltz, buy } = useStore();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-void px-4 pb-4 pt-11">
      <h1 className="pr-10 font-display text-[2rem] font-extrabold italic uppercase leading-none tracking-wide text-bolt">
        Shop
      </h1>
      <p className="mt-2 text-sm text-bone/55">
        Spend Boltz. Balance <span className="font-semibold text-bolt">{formatInt(boltz)} BZ</span>.
      </p>

      <ul className="mt-5 space-y-2.5">
        {shop.map((item) => {
          const need = boltz < item.price;
          return (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-bolt/20 bg-[#0c100e] px-3.5 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="hud-label text-[8px] text-bone/45">{item.cat || 'GEAR'}</p>
                <p className="mt-0.5 font-display text-[15px] font-extrabold italic uppercase leading-tight text-bone">
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] text-bone/45">{item.note}</p>
              </div>
              <button
                type="button"
                disabled={need}
                onClick={() => buy(item.id)}
                className="shrink-0 rounded-full bg-bolt px-3.5 py-2 font-display text-[12px] font-extrabold italic text-void shadow-bolt disabled:opacity-35"
              >
                {need ? 'NEED BZ' : `${formatInt(item.price)} BZ`}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
