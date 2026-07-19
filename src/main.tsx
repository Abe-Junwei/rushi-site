import { StrictMode } from "react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { changelog, downloads, features, guideSteps, version } from "./content";

const routes = [
  ["功能", "/features"],
  ["使用说明", "/guide"],
  ["更新记录", "/changelog"],
  ["下载", "/download"],
] as const;

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0 });
}

function App() {
  const [path, setPath] = usePathname();

  function go(pathname: string) {
    navigate(pathname);
    setPath(pathname);
  }

  return (
    <>
      <Header onNavigate={go} />
      <main>
        {path === "/features" && <FeaturesPage />}
        {path === "/guide" && <GuidePage />}
        {path === "/changelog" && <ChangelogPage />}
        {path === "/download" && <DownloadPage />}
        {!["/features", "/guide", "/changelog", "/download"].includes(path) && (
          <HomePage onNavigate={go} />
        )}
      </main>
      <Footer onNavigate={go} />
    </>
  );
}

function usePathname() {
  const normalize = () => {
    const pathname = window.location.pathname.replace(/\/$/, "");
    return pathname || "/";
  };
  const [path, setPath] = useState(normalize);

  useEffect(() => {
    const onPop = () => setPath(normalize());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return [path, setPath] as const;
}

function Header({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <header className="site-header">
      <button className="brand-link" onClick={() => onNavigate("/")} type="button">
        <span>如是我闻</span>
      </button>
      <nav className="main-nav" aria-label="主导航">
        {routes.map(([label, href]) => (
          <button key={href} onClick={() => onNavigate(href)} type="button">
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>如是我闻 Rushi</strong>
        <span>本地中文课录音转写与校对桌面应用</span>
      </div>
      <div className="footer-links">
        <button onClick={() => onNavigate("/download")} type="button">
          下载
        </button>
        <button onClick={() => onNavigate("/guide")} type="button">
          使用说明
        </button>
        <a href="https://updates.rushi.app/latest.json">更新清单</a>
      </div>
      <p>Copyright © 沂南灵创技术服务中心。当前无 Linux 桌面包。</p>
    </footer>
  );
}

function HomePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <>
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
            <button className="button primary" onClick={() => onNavigate("/download")} type="button">
              获取应用
            </button>
            <button className="button secondary" onClick={() => onNavigate("/features")} type="button">
              查看功能
            </button>
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
        <FeatureGrid limit={3} />
      </section>

      <section className="section-block muted">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>四步完成一份可校对的转写稿</h2>
        </div>
        <Steps />
      </section>

      <section className="section-block">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Download</span>
            <h2>选择你的桌面平台</h2>
          </div>
          <button onClick={() => onNavigate("/download")} type="button">
            下载说明
          </button>
        </div>
        <DownloadCards />
      </section>

      <section className="section-block changelog-preview">
        <div className="section-heading split">
          <div>
            <span className="eyebrow">Release notes</span>
            <h2>最近更新</h2>
          </div>
          <button onClick={() => onNavigate("/changelog")} type="button">
            完整记录
          </button>
        </div>
        <ReleaseCard release={changelog[0]} />
      </section>
    </>
  );
}

function FeaturesPage() {
  return (
    <>
      <PageHero eyebrow="功能介绍" title="为中文课录音转写与校对而做">
        Rushi 把项目管理、本机转写、波形校对和交付导出放进同一个桌面应用。
      </PageHero>
      <section className="section-block">
        <FeatureGrid wide />
      </section>
    </>
  );
}

function GuidePage() {
  return (
    <>
      <PageHero eyebrow="使用说明" title="从一段录音开始">
        下面是最短主路径。更完整的排障、快捷键和更新说明可在应用内设置页查看。
      </PageHero>
      <section className="section-block muted">
        <div className="guide-list">
          {guideSteps.map((item) => (
            <article key={item.step} className="guide-row">
              <span>{item.step}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section-block">
        <div className="info-panel">
          <h2>首次安装提示</h2>
          <p>
            macOS 版本目前是 unsigned DMG，首次打开可能需要 Control+打开。
            Windows 推荐下载离线安装包 zip，完整解压后运行同级安装包。
          </p>
        </div>
      </section>
    </>
  );
}

function ChangelogPage() {
  return (
    <>
      <PageHero eyebrow="更新记录" title="发行进展与可下载版本">
        这里记录面向用户的主要变化。更底层的签收证据保留在项目文档中。
      </PageHero>
      <section className="section-block">
        <div className="release-list">
          {changelog.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>
      </section>
    </>
  );
}

function DownloadPage() {
  return (
    <>
      <PageHero eyebrow="下载" title="下载如是我闻桌面版">
        当前提供 macOS 与 Windows 桌面包。安装包和应用内更新清单均来自
        updates.rushi.app。
      </PageHero>
      <section className="section-block">
        <DownloadCards />
      </section>
      <section className="section-block muted">
        <div className="info-grid">
          <article>
            <h2>Windows GPU 组件</h2>
            <p>
              NVIDIA 用户可在应用环境页下载 CUDA 侧车。它不是首装主安装包，失败时仍可继续 CPU 转写。
            </p>
          </article>
          <article>
            <h2>应用内更新</h2>
            <p>
              安装版会读取官方更新清单，确认后下载、验签并安装。手动检查入口在设置的关于页。
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="page-hero">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}

function ProductPreview() {
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

function FeatureGrid({ limit, wide = false }: { limit?: number; wide?: boolean }) {
  const list = typeof limit === "number" ? features.slice(0, limit) : features;

  return (
    <div className={`feature-grid${wide ? " wide" : ""}`}>
      {list.map((feature) => (
        <article key={feature.title} className="feature-card">
          <h3>{feature.title}</h3>
          <p>{feature.body}</p>
        </article>
      ))}
    </div>
  );
}

function Steps() {
  return (
    <div className="steps">
      {guideSteps.map((item) => (
        <article key={item.step} className="step">
          <span>{item.step}</span>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

function DownloadCards() {
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

function ReleaseCard({ release }: { release: (typeof changelog)[number] }) {
  return (
    <article className="release-card">
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
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
