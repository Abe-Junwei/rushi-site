import features from "../product/features.json";
import faq from "../product/faq.json";
import useCases from "../product/use-cases.json";

export const version = "1.0.0";

export const updateManifestUrl = "https://updates.rushi.app/latest.json";

export type DownloadAsset = {
  id: string;
  platform: string;
  title: string;
  href: string;
  checksum: string;
  meta: string;
  note: string;
  actionLabel: string;
  recommended?: boolean;
};

/** Homepage / primary download panels */
export const downloads: DownloadAsset[] = [
  {
    id: "windows-offline",
    platform: "Windows",
    title: "离线安装包",
    recommended: true,
    href: "https://updates.rushi.app/v1.0.0/如是我闻_1.0.0_Windows_x64_离线安装包.zip",
    checksum: "https://updates.rushi.app/v1.0.0/如是我闻_1.0.0_Windows_x64_离线安装包.zip.sha256",
    meta: "Windows 10/11 x64 · 推荐主分发",
    note: "请完整解压 zip，再运行同级「如是我闻_1.0.0_Windows_x64_安装包.exe」。不要在压缩包预览窗口里直接双击。",
    actionLabel: "下载离线安装包",
  },
  {
    id: "macos-dmg",
    platform: "macOS",
    title: "Apple Silicon DMG",
    href: "https://updates.rushi.app/v1.0.0/rushi-desktop_1.0.0_aarch64.dmg",
    checksum: "https://updates.rushi.app/v1.0.0/rushi-desktop_1.0.0_aarch64.dmg.sha256",
    meta: "Apple Silicon · unsigned DMG",
    note: "首次打开如遇系统提示，请在 Finder 中按住 Control 点击应用，再选择打开。",
    actionLabel: "下载 DMG",
  },
];

/** Optional / secondary assets shown on the download page */
export const windowsInstaller: DownloadAsset = {
  id: "windows-installer",
  platform: "Windows",
  title: "安装包 / OTA",
  href: "https://updates.rushi.app/v1.0.0/如是我闻_1.0.0_Windows_x64_安装包.exe",
  checksum: "https://updates.rushi.app/v1.0.0/如是我闻_1.0.0_Windows_x64_安装包.exe.sha256",
  meta: "也可单独下载 · 应用内更新同用此包",
  note: "首装仍推荐离线 zip。此 exe 适合已有环境、或仅需安装包 / OTA 资产时单独下载。",
  actionLabel: "下载安装包 EXE",
};

export const cudaSidecar = {
  id: "windows-cuda",
  title: "Windows CUDA 侧车",
  href: "https://updates.rushi.app/v1.0.0/如是我闻_1.0.0_Windows_x64_CUDA侧车.zip",
  note: "面向 NVIDIA 显卡用户，可在应用环境页下载或稍后从 CDN 获取。不是首装必需项；侧车尚未就绪时仍可用 CPU 转写。",
  pending: true,
};

export const productFeatures = features;
export const productFaq = faq;
export const productUseCases = useCases;

export const guideSteps = [
  {
    step: "01",
    title: "新建项目",
    body: "在欢迎页创建项目并导入本地音频；需要时在项目信息里补充讲述人、时间、地点和主题。",
  },
  {
    step: "02",
    title: "选择转写方式",
    body: "优先使用本机 ASR；需要厂商能力时，在设置里配置在线 STT Provider 后再转写。",
  },
  {
    step: "03",
    title: "听写校对",
    body: "在编辑器中对照波形和语段文本，使用拆分、合并、冻结等操作修正文稿。",
  },
  {
    step: "04",
    title: "保存与导出",
    body: "保存语段到本地 SQLite，再导出 TXT、SRT 或 DOCX，形成可交付的讲稿或字幕。",
  },
];
