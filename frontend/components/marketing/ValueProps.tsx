import { Upload, Sparkles, Gift } from "lucide-react";

const PROPS = [
  {
    icon: Upload,
    title: "No code required",
    body: "Drop your CSV. We handle validation, modeling, and interpretation while you grab coffee.",
  },
  {
    icon: Sparkles,
    title: "Explains itself",
    body: "Every number comes with a plain-English why. No statistical jargon, no Rosetta Stone needed.",
  },
  {
    icon: Gift,
    title: "Free forever",
    body: "Built as a portfolio piece, open to everyone. No credit card, no account, no tricks.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-[1200px] px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
        {PROPS.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className="text-center md:text-left animate-fade-up"
            style={{ "--stagger-delay": `${i * 70}ms` } as React.CSSProperties}
          >
            <div
              className="inline-flex items-center justify-center size-12 rounded-full mb-5"
              style={{ background: "var(--surface-variant)" }}
            >
              <Icon size={22} className="text-primary" strokeWidth={1.5} />
            </div>
            <h3
              className="text-title-lg text-on-surface mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
