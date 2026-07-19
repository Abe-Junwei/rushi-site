import Link from "next/link";
import type { ReactNode } from "react";
import { downloads } from "./site-data";

const navItems = [
  ["功能", "/features"],
  ["使用说明", "/guide"],
  ["更新记录", "/changelog"],
  ["下载", "/download"],
] as const;

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="如是我闻首页">
        <img src="/rushi-lockup.png" alt="" className="brand-mark" />
        <span>如是我闻</span>
      </Link>
      <nav className="main-nav" aria-label="主导航">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>如是我闻 Rushi</strong>
        <span>本地中文课录音转写与校对桌面应用</span>
      </div>
      <div className="footer-links">
        <Link href="/download">下载</Link>
        <Link href="/guide">使用说明</Link>
        <a href="https://updates.rushi.app/latest.json">更新清单</a>
      </div>
      <p>Copyright © 沂南灵创技术服务中心。当前无 Linux 桌面包。</p>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function ProductPreview() {
  return (
    <div className="product-preview" aria-label="Rushi Editor 界面示意">
      <div className="preview-topbar">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span>Editor · waveform + segments</span>
      </div>
      <div className="preview-body">
        <aside className="preview-sidebar">
          <span className="side-title">Project Hub</span>
          <span className="side-item active">课录音 07-18</span>
          <span className="side-item">导出记录</span>
          <span className="side-item">环境</span>
        </aside>
        <section className="preview-stage">
          <div className="waveform">
            {Array.from({ length: 42 }).map((_, index) => (
              <span
                key={index}
                style={{ height: `${24 + ((index * 17) % 58)}%` }}
              />
            ))}
            <i />
          </div>
          <div className="segment-list">
            <article className="segment selected">
              <time>00:12.4 - 00:28.1</time>
              <p>本地转写结果在这里逐段校对，与波形时间保持对齐。</p>
            </article>
            <article className="segment">
              <time>00:28.1 - 00:41.0</time>
              <p>拆分、合并、冻结后保存，再导出 TXT / SRT / DOCX。</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}

export function DownloadCards() {
  return (
    <div className="download-grid">
      {downloads.map((item) => (
        <article key={item.platform} className="download-card">
          <span className="eyebrow">{item.platform}</span>
          <h3>{item.title}</h3>
          <p>{item.meta}</p>
          <a className="button primary" href={item.href}>
            下载 {item.platform}
          </a>
          <small>{item.note}</small>
        </article>
      ))}
    </div>
  );
}
