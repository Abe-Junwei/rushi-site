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

export const features = [
  {
    title: "本机转写",
    body: "内置 FunASR 本机模型，首启准备后可断网转写；在线 STT 作为可选 Provider 使用。",
  },
  {
    title: "波形校对",
    body: "Editor 将波形、播放头和语段列表放在同一工作区，支持拆分、合并、冻结与精修。",
  },
  {
    title: "项目管理",
    body: "Welcome 创建项目，Project Hub 管理文件与场次元信息，Editor 专注单条音频校对。",
  },
  {
    title: "交付导出",
    body: "导出 TXT、SRT、DOCX，场次元信息可进入文档，适合课录音整理与交付。",
  },
  {
    title: "可选 GPU",
    body: "Windows 用户有 NVIDIA 显卡时，可在应用环境页下载 CUDA 侧车；失败也可继续 CPU 转写。",
  },
  {
    title: "应用内更新",
    body: "macOS 与 Windows 安装版通过 updates.rushi.app 获取更新清单，确认后下载、验签并安装。",
  },
];

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

export const changelog = [
  {
    version: "v1.0.1",
    date: "2026-07-18",
    items: [
      "macOS DMG 构建完成，安装包内含 ASR 侧车与默认语音模型。",
      "Windows 发行资产进入离线安装包路线，首装推荐完整解压 zip 后运行安装包。",
      "更新链继续使用 updates.rushi.app，应用内更新通过 Tauri updater 验签。",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-07",
    items: [
      "桌面端主路径进入 v1：项目、转写、校对、保存与导出闭环。",
      "macOS 与 Windows 均以安装包方式小范围分发。",
    ],
  },
  {
    version: "v0.1.8+",
    date: "2026-06",
    items: [
      "随包默认权重与首启 seed 流程成型，离线本机转写路径更稳定。",
      "Editor 波形、语段选择与校对体验持续打磨。",
    ],
  },
];
