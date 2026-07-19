import Link from "next/link";
import { DownloadCards, PageShell, ProductPreview } from "./components";
import { changelog, features, guideSteps, version } from "./site-data";

export default function Home() {
  return (
    <PageShell>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Rushi v{version}</span>
          <h1>如是我闻</h1>
          <p className="hero-line">本地中文课录音，转写与校对。</p>
          <p className="hero-support">
            波形对齐语段，本机完成转写；整理后导出 TXT、SRT、DOCX。
            面向讲课、访谈、学习笔记和字幕初稿，不把桌面工作流做成云端账号墙。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/download">
              获取应用
            </Link>
            <Link className="button secondary" href="/features">
              查看功能
            </Link>
          </div>
          <p className="note">发版于 updates.rushi.app · 当前无 Linux 桌面包</p>
        </div>
        <ProductPreview />
      </section>

      <section className="band intro-band">
        <p>
          录音与转写默认在你的电脑上完成。需要在线 STT 时，你也可以按 Provider
          单独配置凭证。
        </p>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Features</span>
          <h2>从导入到交付，一条本地工作流</h2>
        </div>
        <div className="feature-grid">
          {features.slice(0, 3).map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block muted">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>四步完成一份可校对的转写稿</h2>
        </div>
        <div className="steps">
          {guideSteps.map((item) => (
            <article key={item.step} className="step">
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Download</span>
            <h2>选择你的桌面平台</h2>
          </div>
          <Link href="/download">下载说明</Link>
        </div>
        <DownloadCards />
      </section>

      <section className="section-block changelog-preview">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Release notes</span>
            <h2>最近更新</h2>
          </div>
          <Link href="/changelog">完整记录</Link>
        </div>
        <article className="release-card">
          <div>
            <strong>{changelog[0].version}</strong>
            <span>{changelog[0].date}</span>
          </div>
          <ul>
            {changelog[0].items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </PageShell>
  );
}
