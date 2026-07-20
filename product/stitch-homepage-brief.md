# Stitch 需求稿：如是我闻 Rushi 官网首页重设计

> 用途：丢进 [Google Stitch](https://stitch.withgoogle.com) 做首页视觉探索。  
> 站点：`https://rushi.app` · 技术栈：Astro 静态站 · 语言：中文为主

---

## 0. 一句话目标

为桌面转写校对应用「如是我闻 / Rushi」设计一版**品牌感强、首屏干净、偏产品演示**的官网首页。访问者 5 秒内理解：本地中文课录音 → 转写 → 波形校对 → 导出交付；主行动是下载桌面端。

---

## 1. 产品与用户

| 项 | 内容 |
|---|---|
| 产品 | 如是我闻 Rushi：本地中文长音频转写与校对桌面应用 |
| 平台 | macOS（Apple Silicon）、Windows x64；无 Linux |
| 核心能力 | 本机 FunASR 转写、波形对齐校对、项目/术语/导出（TXT/SRT/DOCX） |
| 差异点 | 默认本地、可断网；非云端账号墙；面向课录音 / 访谈 / 字幕初稿 |
| 主用户 | 整理中文课录音、访谈稿、学习笔记、字幕初稿的个人或小团队 |
| 主转化 | 点击「获取应用 / 下载」进入下载页 |

---

## 2. DESIGN.md（请先锁定主题，再画屏）

把下面整段作为 Stitch 的主题 / DESIGN 约束粘贴：

```text
Product marketing website for "如是我闻 Rushi", a local Chinese desktop transcription app.

Platform: Desktop web marketing page, 1440px wide desktop frame first, then 390px mobile.

Brand name must dominate the first viewport: Chinese "如是我闻" is the hero brand signal.
English "Rushi" may appear as a smaller companion, never louder than the Chinese brand.

Visual direction:
- Calm, scholarly, practical — like a serious writing tool for lecture notes, not a playful SaaS toy.
- Light mode only.
- Atmosphere via soft paper-like gradients, warm saffron accents, and subtle texture — NOT flat pure white only, NOT dark mode.
- Real product visual anchor: Editor UI with waveform + transcript segments (edge-to-edge hero media), not abstract blobs.

Color system:
- Background: warm off-white / paper white (#FAF8F4 to #FFFFFF)
- Surface soft: #F4F1EC
- Text primary: #2F2B26
- Text muted: #6B6560
- Accent saffron: #C58A43
- Accent deep: #85530F
- Divider: #E4DFD7
- Avoid: purple/indigo gradients, neon glow, glassmorphism glow, pure black UI chrome

Typography:
- Display / brand: Noto Serif SC or Songti-like Chinese serif
- Body / UI: a distinctive humanist sans (NOT Inter, NOT Roboto, NOT Arial, NOT system-ui default look)
- Clear hierarchy: Brand > one headline > one support line > CTA

Layout rules (hard):
- First viewport = ONE composition, not a dashboard.
- Hero budget only: brand, one headline, one short support sentence, one CTA group, one dominant full-bleed product visual.
- NO cards in the hero. NO floating badges, promo chips, stat strips, or overlay stickers on the hero image.
- Below-the-fold sections: one job per section; prefer editorial layout over card grids.
- Cards only if they wrap a real interaction (e.g. download platform choice). Otherwise use spacing, type, and imagery.
- Full-bleed hero media by default: product screenshot / Editor mockup as edge-to-edge visual plane, not a small inset rounded card collage.

Motion intent (for annotation only): soft fade/rise of hero copy; gentle playhead pulse on waveform; CTA hover — no noisy parallax.
```

---

## 3. 信息架构（建议页面结构）

首页只做「理解 + 信任 + 下载」，细节链到 `/features`、`/docs/getting-started`、`/download`。

### 3.1 Header（全站）

- 左：品牌「如是我闻」（可附小字 Rushi）
- 右导航：功能 · 使用说明 · 更新记录 · 下载
- 简洁、sticky、浅底；不要做成应用顶栏

### 3.2 Hero（第一屏，最重要）

**必须出现（且仅这些核心元素）：**

1. 品牌名：**如是我闻**（最大视觉信号）
2. 一行标题：本地中文课录音，转写与校对。
3. 一句支撑：波形对齐语段，本机完成转写；整理后导出 TXT、SRT、DOCX。
4. CTA 组：主按钮「获取应用」· 次按钮「查看功能」
5. 主导视觉：Editor 全宽/全bleed 示意（波形 + 语段列表），表现「听写校对」现场感

**刻意不要放进第一屏：**

- 功能卡片网格、数据统计、排期、地址、本周动态
- 悬浮徽章、促销贴纸、功能 chip 堆叠
- 左右两栏「小预览卡片」式产品图（避免 inset media card）

可选极小脚注（次要）：发版于 updates.rushi.app · 支持 macOS / Windows

### 3.3 信任条 / 原则带（短）

一句话原则，不要卡片：

> 录音与转写默认在你的电脑上完成。需要在线 STT 时，再按 Provider 单独配置凭证。

### 3.4 能力叙事（非卡片墙）

标题建议：从导入到交付，一条本地工作流  

用 **3 段纵向叙事** 或 **左文右图交替**，不要 3 张同等卡片：

| 顺序 | 能力 | 文案要点 |
|---|---|---|
| 1 | 本机转写 | FunASR 本机模型；首启准备后可断网；在线 STT 可选 |
| 2 | 波形校对 | 波形、播放头、语段同一工作区；拆分 / 合并 / 冻结 |
| 3 | 交付导出 | TXT / SRT / DOCX；场次元信息可进文档 |

每段：短标题 + 1–2 句说明 + 可选小幅界面局部（非卡片框）

### 3.5 场景（轻量）

标题建议：适合这些整理场景  

三种场景用**文字列表或窄列排版**，避免重卡片：

1. 中文课录音整理 — 长录音 → 可校对语段 → 讲稿/笔记  
2. 字幕初稿 — 保留时间轴，导出 SRT  
3. 访谈校对 — 波形与语段来回定位，快速改错  

### 3.6 四步流程

标题建议：四步完成一份可校对的转写稿  

编号步骤（01–04），横向桌面 / 纵向移动；步骤本身不是卡片：

1. 新建项目 — Welcome 创建，导入本地音频，可补场次元信息  
2. 选择转写方式 — 优先本机 ASR；需要时再配在线 STT  
3. 听写校对 — Editor 对照波形与语段，拆分/合并/冻结  
4. 保存与导出 — 本地 SQLite；导出 TXT / SRT / DOCX  

### 3.7 下载收束

标题建议：选择你的桌面平台  

这里**允许**两个平台下载交互块（唯一建议用「卡片/面板」的区域）：

- macOS DMG — Apple Silicon  
- Windows 离线安装包 — Win10/11 x64  

链到 `/download`；注明当前无 Linux。

### 3.8 Footer

品牌一行 + 下载 / 使用说明 / 更新清单链接 + Copyright（沂南灵创技术服务中心）

---

## 4. 文案定稿（可直接进设计）

### Hero

- 品牌：如是我闻  
- 副品牌：Rushi  
- 标题：本地中文课录音，转写与校对。  
- 支撑：波形对齐语段，本机完成转写；整理后导出 TXT、SRT、DOCX。面向讲课、访谈、学习笔记和字幕初稿，不把桌面工作流做成云端账号墙。  
- 主 CTA：获取应用  
- 次 CTA：查看功能  
- 脚注：发版于 updates.rushi.app · 当前无 Linux 桌面包  

### 原则带

录音与转写默认在你的电脑上完成。需要在线 STT 时，你也可以按 Provider 单独配置凭证。

### 能力三段

1. 本机转写 — 内置 FunASR 本机模型，首启准备后可断网转写；在线 STT 作为可选 Provider。  
2. 波形校对 — Editor 将波形、播放头和语段列表放在同一工作区，支持拆分、合并、冻结与精修。  
3. 交付导出 — 导出 TXT、SRT、DOCX，场次元信息可进入文档，适合课录音整理与交付。  

---

## 5. Stitch 首轮 Prompt（复制即用）

```text
Design a desktop marketing homepage (1440px) for "如是我闻 Rushi", a local Chinese lecture-audio transcription and waveform-review desktop app.

Goal: help visitors understand in 5 seconds that audio stays local, they can transcribe offline, review with waveform, and export TXT/SRT/DOCX. Primary CTA is download.

Vibe: calm, scholarly, practical; warm paper light theme; saffron accent #C58A43; deep accent #85530F; text #2F2B26; muted #6B6560. Chinese serif for brand/display, distinctive humanist sans for body. No purple, no neon glow, no dark mode, no Inter/Roboto look.

Hard layout rules:
- First viewport is ONE composition, not a dashboard.
- Brand "如是我闻" must be the strongest text signal in the hero (larger than the headline).
- Hero only contains: brand, one headline, one short support sentence, CTA group (Get app + View features), and one dominant full-bleed Editor product visual (waveform + transcript segments).
- No cards in the hero. No floating badges/chips/stat strips on the hero media.
- Hero media should feel edge-to-edge / full-bleed, not a small inset rounded screenshot card.

Below the fold:
1) A single-line trust band about local-first transcription.
2) Three editorial feature blocks (local ASR / waveform review / export) — not a equal card grid.
3) Three use-case lines: lecture notes, subtitle draft, interview review.
4) Four numbered workflow steps.
5) Download section with macOS and Windows choices (this section may use simple panels).
6) Minimal footer.

Language: Chinese UI copy. Include English "Rushi" only as a small companion to the Chinese brand.
```

---

## 6. 迭代 Prompt 清单（一次改一件）

按顺序用，不要合并：

1. **锁定首屏构图**  
   `Keep the same theme. Make the hero a single full-bleed composition: left/top brand+copy+CTAs, background or right plane is a large Editor waveform UI that reaches the viewport edges. Remove any inset media card chrome.`

2. **加强品牌层级**  
   `Make "如是我闻" larger and more dominant than the headline. Headline should support the brand, not overpower it.`

3. **去掉卡片感**  
   `In the features and use-case sections, remove card borders/shadows/rounded boxes. Use typography, spacing, and optional thin rules only.`

4. **产品视觉更真实**  
   `Replace abstract shapes with a realistic desktop Editor mock: top waveform with playhead, bottom timestamped Chinese transcript segments, one segment selected.`

5. **移动端 390**  
   `Create a 390px mobile version of this homepage. Stack hero copy above a full-width product visual. Keep foldable-friendly spacing; CTAs full width.`

6. **下载区收束**  
   `Refine only the download section: two clear platform choices for macOS and Windows, quiet secondary note that Linux is unavailable.`

7. **动效标注（可选）**  
   `Add subtle motion notes: hero copy fades up, waveform playhead gently pulses, primary button has a simple hover state. No parallax.`

---

## 7. 验收标准（对照 Stitch 出图）

- [ ] 去掉导航后，第一屏仍能看出是「如是我闻」而不是通用 AI/SaaS 站  
- [ ] 第一屏元素不超过：品牌、标题、支撑句、CTA、主导产品视觉  
- [ ] Hero 无卡片、无悬浮徽章、无数据条  
- [ ] 产品图是波形+语段 Editor，而不是抽象渐变主视觉  
- [ ] 下半页不是三列同质卡片墙；能力/场景偏编辑式排版  
- [ ] 主色是藏红花/纸感暖白，不是紫靛或黑金赛博  
- [ ] 桌面 + 移动两套画板齐全  
- [ ] 主 CTA 指向下载意图清晰  

---

## 8. 与现状的差异（给设计对照）

当前线上首页问题（需被新设计取代）：

- Hero 为左文右「小窗预览」，产品图偏 inset 卡片，品牌层级可再加强  
- Features / Use cases 使用三列卡片网格，营销感重、产品气质弱  
- 信息完整但第一屏略挤，原则带与后续板块节奏偏「模板站」  

重设计要保留的内容资产：本地优先叙事、三能力、三场景、四步流程、双平台下载。

---

## 9. 交付物期望

从 Stitch 导出 / 截图保留：

1. Desktop 1440 首页完整长页  
2. Mobile 390 首页完整长页  
3. （可选）Hero 单独近景  
4. （可选）Editor 产品视觉单独组件，便于回填 Astro  

确认方向后，再落到本仓库 `src/pages/index.astro` + `src/styles/site.css` 实现。
