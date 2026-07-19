import { PageShell } from "../components";
import { guideSteps } from "../site-data";

export default function GuidePage() {
  return (
    <PageShell>
      <section className="page-hero">
        <span className="eyebrow">使用说明</span>
        <h1>从一段录音开始</h1>
        <p>
          下面是最短主路径。更完整的排障、快捷键和更新说明可在应用内设置页查看。
        </p>
      </section>
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
    </PageShell>
  );
}
