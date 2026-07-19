import { PageShell } from "../components";
import { features } from "../site-data";

export default function FeaturesPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <span className="eyebrow">功能介绍</span>
        <h1>为中文课录音转写与校对而做</h1>
        <p>
          Rushi 把项目管理、本机转写、波形校对和交付导出放进同一个桌面应用。
        </p>
      </section>
      <section className="section-block">
        <div className="feature-grid wide">
          {features.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
