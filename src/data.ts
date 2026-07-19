import features from "../product/features.json";
import faq from "../product/faq.json";
import useCases from "../product/use-cases.json";

export const version = "1.0.1";

export const downloads = [
  {
    platform: "macOS",
    title: "macOS DMG",
    href: "https://updates.rushi.app/v1.0.1/如是我闻_1.0.1_aarch64.dmg",
    meta: "Apple Silicon · unsigned DMG · 约 1.5GB",
    note: "首次打开如遇系统提示，请在 Finder 中按住 Control 点击应用，再选择打开。",
  },
  {
    platform: "Windows",
    title: "Windows 离线安装包",
    href: "https://updates.rushi.app/v1.0.1/如是我闻_1.0.1_Windows_x64_离线安装包.zip",
    meta: "Windows 10/11 x64 · 完整解压后安装",
    note: "请完整解压 zip，再运行同级安装包。不要在压缩包预览里直接双击 exe。",
  },
];

export const productFeatures = features;
export const productFaq = faq;
export const productUseCases = useCases;

export const guideSteps = [
  {
    step: "01",
    title: "新建项目",
    body: "在 Welcome 中创建项目，导入本地音频，也可以补充讲述人、时间、地点和主题。",
  },
  {
    step: "02",
    title: "选择转写方式",
    body: "优先使用本机 ASR；需要厂商能力时，在设置里配置在线 STT Provider 后再转写。",
  },
  {
    step: "03",
    title: "听写校对",
    body: "在 Editor 中对照波形和语段文本，使用拆分、合并、冻结等操作修正文稿。",
  },
  {
    step: "04",
    title: "保存与导出",
    body: "保存语段到本地 SQLite，再导出 TXT、SRT 或 DOCX，形成可交付的讲稿或字幕。",
  },
];
