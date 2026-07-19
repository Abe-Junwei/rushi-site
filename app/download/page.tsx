import { DownloadCards, PageShell } from "../components";

export default function DownloadPage() {
  return (
    <PageShell>
      <section className="page-hero">
        <span className="eyebrow">下载</span>
        <h1>下载如是我闻桌面版</h1>
        <p>
          当前提供 macOS 与 Windows 桌面包。安装包和应用内更新清单均来自
          updates.rushi.app。
        </p>
      </section>
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
    </PageShell>
  );
}
