import { PageShell } from "../components";
import { changelog } from "../site-data";

export default function ChangelogPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <span className="eyebrow">更新记录</span>
        <h1>发行进展与可下载版本</h1>
        <p>这里记录面向用户的主要变化。更底层的签收证据保留在项目文档中。</p>
      </section>
      <section className="section-block">
        <div className="release-list">
          {changelog.map((release) => (
            <article key={release.version} className="release-card">
              <div>
                <strong>{release.version}</strong>
                <span>{release.date}</span>
              </div>
              <ul>
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
