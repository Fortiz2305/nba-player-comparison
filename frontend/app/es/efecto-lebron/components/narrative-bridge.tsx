import { type ReactNode } from "react";
import { AnimateOnScroll } from "./animate-on-scroll";

export function NarrativeBridge({ children }: { children: ReactNode }) {
  return (
    <AnimateOnScroll>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="max-w-3xl border-l-2 border-[#FDB927]/30 pl-4 text-base leading-relaxed text-zinc-400">
          {children}
        </p>
      </div>
    </AnimateOnScroll>
  );
}

export function Conclusion({ children }: { children: ReactNode }) {
  return (
    <section className="border-t border-zinc-800 py-16">
      <div className="mx-auto max-w-4xl px-4">
        <AnimateOnScroll>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Conclusión
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll delay={100}>
          <p className="mt-6 max-w-3xl border-l-4 border-[#FDB927] pl-5 text-lg font-medium leading-relaxed text-zinc-300">
            {children}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
