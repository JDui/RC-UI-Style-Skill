# 增强效果的接入配方

本页描述本包的原创 RC 实现；网站观测与上游源码证据见 [Kiseki 效果目录](kiseki-effects.md)。本包将参考站的可迁移机制改写成较小、可关闭的增强，不提供 Myriad 源码、人物形象、字体、音乐或第三方业务集成。

## 目录

1. [选择与加载](#选择与加载)
2. [完整最小示例](#完整最小示例)
3. [DOM 与运行时接口](#dom-与运行时接口)
4. [动效与生命周期](#动效与生命周期)
5. [扩展到项目的配方](#扩展到项目的配方)
6. [接入验证](#接入验证)

## 选择与加载

先判断任务，再从效果目录选择所需机制。只需要轻玻璃和短反馈时，保留 `rc-ui.css` 即可。需要本页增强时，依次加载 `rc-ui.css`、`rc-effects.css`、`rc-effects.js`，在目标容器上同时使用 `.rc-ui.rc-effects`；不要对不相关页面进行全局初始化。

| 根属性 | 可用值 | 行为 |
|---|---|---|
| `data-effect-profile` | `restrained / expressive / showcase` | 工具、内容、展示三档；JS 未指定时按 restrained，接入时应明确填写 |
| `data-surface` | `glass / solid / outline / flat` | 只改变 `.rc-surface` 与 `.rc-island` 的材质；默认玻璃，和主题独立 |
| `data-theme` | `light / dark` | 复用原 RC token；由宿主决定初始主题与是否持久化 |
| `data-performance` | `normal / low` | low 改实色，停止指针倾斜、水波与自动轮播 |
| `data-motion` | `system / reduced` | reduced 是手动关闭运动的入口；system 仍尊重系统减少动效 |
| `data-atmosphere` | `on / off` | showcase 的氛围漂移需明确设为 on；不与任务 busy 状态绑定 |

可单独在 `.rc-surface` 上选择 `data-surface` 材质。实际叠底与对比度仍须按目标项目检查，示例参数不是所有图片背景都适用的保证。

## 完整最小示例

将下列 HTML 放在本包 `assets/` 内，与三个资产文件相邻即可运行。示例保留无 JS 时的正文与全部轮播项；示例没有网络请求、文件操作或真实播放器。

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>RC 增强接入示例</title>
  <link rel="stylesheet" href="rc-ui.css">
  <link rel="stylesheet" href="rc-effects.css">
  <style>
    body { margin: 0; }
    #example { min-height: 100vh; padding: 24px; }
    .example-content { max-width: 920px; margin: auto; }
    .example-content h1 { font-size: 24px; margin: 0; }
    .example-content h2 { font-size: 18px; }
  </style>
</head>
<body>
<main id="example" class="rc-ui rc-effects rc-scene"
      data-effect-profile="expressive" data-theme="light"
      data-surface="glass" data-performance="normal"
      data-motion="system" data-atmosphere="off">
  <div class="rc-atmosphere" aria-hidden="true"></div>
  <div class="example-content rc-stack">
    <header class="rc-row">
      <h1>资源概览</h1>
      <button class="rc-button" type="button" data-rc-theme-toggle
              aria-pressed="false" disabled>深色模式</button>
    </header>
    <div class="rc-filters" role="group" aria-label="资源类型" data-rc-selection>
      <span class="rc-selection" aria-hidden="true"></span>
      <button class="rc-filter" type="button" data-rc-option="all" aria-pressed="true" disabled>全部</button>
      <button class="rc-filter" type="button" data-rc-option="photo" aria-pressed="false" disabled>照片</button>
      <button class="rc-filter" type="button" data-rc-option="video" aria-pressed="false" disabled>视频</button>
    </div>
    <section class="rc-stack" aria-label="示例资源">
      <div data-example-kind="photo" data-rc-reveal>
        <article class="rc-surface rc-stack" data-rc-spotlight data-rc-tilt>
          <h2>照片参考</h2>
          <p>展示用元信息；真实照片保持原色，不叠加主题滤镜。</p>
          <button class="rc-button" type="button" data-rc-ripple
                  id="example-action" disabled>展示本地反馈</button>
          <p id="example-message" role="status">尚未操作</p>
        </article>
      </div>
      <article class="rc-surface" data-example-kind="video" data-rc-reveal>
        <h2>视频参考</h2>
        <p>按内容用途选择缩略图比例。</p>
      </article>
    </section>
    <section class="rc-surface rc-stack" role="region"
             aria-roledescription="轮播" aria-label="设计原则"
             data-rc-carousel data-rc-interval="5000">
      <div class="rc-carousel-content">
        <article data-rc-slide role="group" aria-label="第 1 项，共 2 项">
          <h2>内容优先</h2><p>让文字与业务状态立即可用。</p>
        </article>
        <article data-rc-slide role="group" aria-label="第 2 项，共 2 项">
          <h2>可选增强</h2><p>减少动效时仍保留同样的信息。</p>
        </article>
      </div>
      <div class="rc-carousel-controls">
        <button class="rc-button" type="button" data-rc-prev disabled>上一项</button>
        <button class="rc-button" type="button" data-rc-next disabled>下一项</button>
        <button class="rc-button" type="button" data-rc-toggle disabled>
          <span data-rc-toggle-label>播放自动切换</span>
        </button>
        <span data-rc-status role="status" aria-live="polite"></span>
      </div>
    </section>
    <noscript><p>脚本未运行，以上轮播内容按顺序完整显示。</p></noscript>
  </div>
</main>
<script src="rc-effects.js"></script>
<script>
(() => {
  if (!window.RCEffects) return;
  const root = document.getElementById('example');
  for (const button of root.querySelectorAll('button[disabled]')) button.disabled = false;
  let effects = RCEffects.init(root);
  root.addEventListener('rc:select', event => {
    const value = event.detail.value;
    for (const card of root.querySelectorAll('[data-example-kind]')) {
      card.hidden = value !== 'all' && card.dataset.exampleKind !== value;
    }
  });
  document.getElementById('example-action').addEventListener('click', () => {
    document.getElementById('example-message').textContent = '本地反馈已显示';
  });
  // In a framework, call effects.destroy() from the component unmount hook.
  // After replacing enhanced child nodes, call effects.refresh().
  window.addEventListener('pagehide', () => effects.destroy());
  window.addEventListener('pageshow', event => {
    if (event.persisted) effects = RCEffects.init(root);
  });
})();
</script>
</body>
</html>
```

上例用 `pageshow.persisted` 处理 BFCache 返回后的重新初始化。SPA 挂载/卸载应交给框架生命周期；不要把页面被缓存当成永远不会恢复。

## DOM 与运行时接口

### 初始化

`window.RCEffects.init(root)` 返回 `refresh()`、`destroy()`、`setTheme(theme)`。root 必须同时具有 `.rc-ui.rc-effects`，不提供隐式全局扫描。相同 root 再次 init 会先销毁旧实例；多个互不嵌套的 root 可独立初始化，事件、轮播和选中态互不共享。禁止嵌套 `.rc-effects`：祖先材质与降级 CSS 会影响后代，init/refresh 检测到嵌套时抛出 TypeError，避免制造虚假的隔离保证。

- `refresh()`：新增、删除或替换增强节点后重新绑定，保留本实例已揭示元素与尚在 DOM 中的轮播当前索引，自动轮播回到暂停。普通根属性、尺寸与系统偏好变化不需 refresh。
- `destroy()`：释放事件、rAF、计时器、observer 和临时水波；恢复增强添加的 inline 样式、隐藏属性、ARIA 与根暂停标记。用户选择的主题、筛选业务结果不回滚；销毁后原始轮播内容重新完整可读。
- `setTheme('light' | 'dark')`：同步更改本 root 主题与按钮 ARIA，派发冒泡 `rc:themechange`，其 `detail.theme` 为新主题。没有异步排队，快速操作以最后一次为准；不自动写 localStorage。

业务事件监听由宿主自己释放。runtime 的 `destroy()` 不移除宿主自行注册的 `rc:select`、`rc:themechange` 或表单处理器。

### 属性与节点

| 机制 | 需要的节点 | 运行时写入 / 约束 |
|---|---|---|
| 聚光 | 表面上 `data-rc-spotlight` | `--rc-pointer-x/y` 为 px；活动态 `data-rc-pointer-active="true"`；仅精细指针、允许运动、非 restrained |
| 倾斜 | 表面上 `data-rc-tilt` | `--rc-tilt-x/y` 为 deg；expressive 上限 ±1.5°，showcase ±3°；离开、滚动、失焦与降级归零 |
| 点击水波 | 原生按钮上 `data-rc-ripple` | 临时 `.rc-ripple-wave` 使用 `--rc-ripple-x/y/size`；键盘激活从中心出发，重复操作不堆积波纹 |
| 入场 | 包装元素 `data-rc-reveal` | runtime 加 `data-reveal-ready`，进入视口后加 `.is-revealed`，动画结束/取消时移除 ready 标记；错峰 24ms、总延迟上限 160ms；键盘焦点会立即揭示 |
| 选中底板 | `data-rc-selection` 的直接子项 `.rc-selection`、`button[data-rc-option]` | 按钮用 `aria-pressed`；底板按实际 offset/width/height 定位；父容器必须 position:relative |
| 轮播 | `data-rc-carousel` 内 `data-rc-slide`，以及 prev/next/toggle/status 四类属性 | 初始全部正文无 hidden；初始化成功后隐藏非活动项；动态更新后 refresh；控制按钮使用原生 button |
| 主题 | `button[data-rc-theme-toggle]` | 固定可访问名称“深色模式”与 `aria-pressed`；`data-rc-theme-label` 可覆盖固定名称 |

不要将 `data-rc-reveal` 与 tilt/lift 放在同一个 transform 节点：把入场放外层包装，把指针效果放内层表面。`.rc-lift` 与倾斜也二选一。边缘高光、聚光伪元素不得盖住文字、命中区域或焦点框。

底板组是过滤按钮组，不是完整 Tabs。runtime 不提供方向键切换、tabpanel 关联和 roving tabindex；需要真正 Tabs 时，应接入项目已有无障碍 Tabs 组件，只借用底板材质与测量规则。`rc:select` 是冒泡事件，`detail` 包含 `{ value, button, group }`，仅通知选择；实际过滤、路由、保存由宿主处理。

### 轮播的真实状态

没有自动启动。用户点击播放后，默认每 5000ms 切换一次；`data-rc-interval` 可调整但小于 3000ms 或无效值会回退到 5000ms。

- 上一项/下一项、键盘焦点进入轮播时停止自动切换，需重新点播放。
- 鼠标停留、屏幕外、祖先被隐藏与页面隐藏时临时暂停；原先明确启动过的轮播在离开/返回可见区后才继续。支持 IntersectionObserver 时须先收到可见确认，才调度第一轮自动切换。
- 减少动效、低性能或 restrained 下停止自动切换，播放按钮不可用，手动上一项/下一项仍可用。
- 播放按钮显示下一动作“播放自动切换 / 停止自动切换”，不混用动态名称和 `aria-pressed`。需要自定义文案时用 `data-rc-play-label`、`data-rc-pause-label`。按钮有图标时把文字放入 `data-rc-toggle-label`。
- `data-rc-status` 只显示当前序号与临时暂停状态，不伪造加载进度。自动切换时 `aria-live=off`，手动操作时恢复 polite；避免持续打断读屏。
- runtime 不改变作者原先禁用的控制按钮；少于两项时禁用翻页与播放。内容容器预留高度，避免不同文案让整个页面不断跳动。

## 动效与生命周期

指针使用事件触发的单次 rAF，不启动永久动画循环；每次处理按当前元素边界计算位置，滚动时清除旧指针状态。页面不可见时根标记 `data-rc-suspended="true"`，用于暂停 CSS 氛围；移除组件时必须 destroy，不能靠 CSS 隐藏代替释放。

系统 `prefers-reduced-motion` 与精细指针媒体查询支持运行时变化。根的 theme、motion、performance、profile 属性变化由 MutationObserver 处理。入场在动画完成/取消时清除 ready 标记；键盘焦点、减少动效或隐藏页直接完成并清除标记，重新开启不会回放历史入场。

CSS 的降级与 JS 的停止循环需要同时保留。仅取消 CSS transform，不能停止还在调度的计时器；仅暂停 JS，也不能停止无限 CSS 氛围动画。

## 扩展到项目的配方

下表将“本包已提供的增强”与“接入实际产品后才实现的机制”分开。复杂效果应复用已有路由、媒体与动画栈，不因 skill 增加大型依赖。

| 目标机制 | 采用方式 | 本包边界 |
|---|---|---|
| 玻璃、实色、描边、平面 | 映射表面 token，保持文字对比与材质层级，独立选择主题 | CSS 已提供；不是光学折射模拟 |
| Bento、导航岛、细边缘 | 组合 `.rc-bento`、span 与 `.rc-island.rc-nav-island`，密度按内容调整 | CSS 已提供；固定到屏幕边缘的位置与安全区由宿主负责 |
| 背景氛围 | 独立 `.rc-atmosphere[aria-hidden]`，静态为基底；showcase 才显式允许漂移 | CSS 已提供渐变氛围；不下载站点壁纸，不滤色真实媒体 |
| 聚光、倾斜、点击反馈 | 按上表 opt-in，每目标一种主要反馈，触摸保留普通按钮反馈 | CSS/JS 已提供；不是系统光标替换 |
| 导航上下文变换 | 保留稳定导航容器，以真实路由状态替换动作项；提交 DOM 后 refresh 底板，焦点回到对应动作 | runtime 只测量与发送选择事件，不实现路由或业务菜单 |
| 跨页共享元素 | 在已有路由生命周期内把稳定 ID 映射到 View Transition 名称；同页只允许一个活动同名元素，失败和不支持时直接导航 | 仅配方；不提供跨文档 View Transition、历史记录或滚动恢复 |
| 可展开卡片与详情 | 原生 details 或项目 popover/dialog；保持键盘入口、Escape 和关闭后焦点回退，动画不阻塞关闭 | CSS 示例覆盖 details 短入场；无自制模态系统 |
| 封面到播放器联动 | 从真实媒体 selected/paused/playing/ended 状态更新封面、按钮和进度；失败提供重试，禁止默认出声 | 仅配方；不包含音频播放、服务 API、歌词或封面采样 |
| 歌词/长文字波动 | 用真实 timeupdate/cue 时间选中活动行，手动滚动不被强行拉回；暂停时停止跟随，减少动效直接定位 | 仅配方；不把普通文本截断或伪装为生成过程 |
| 报告/动态卡片演出 | 每屏展示可独立理解的内容，支持跳过、暂停、前后页；隐藏页停止定时器，事实数据先于编排 | runtime 只提供可控轮播，不生成报告、不声称后台任务进度 |
| 水面、真实液态折射、粒子 | 在独立装饰画布内渲染，控制像素比/分辨率/活动面积，丢失上下文立即切静态表面 | 仅配方；本包点击水波不等于 WebGL 水面或 SVG 位移折射 |
| 自动亮暗主题 | 宿主读取已保存选择；无手动选择时才跟随 prefers-color-scheme，在首屏绘制前设置 token | runtime 只接受显式 light/dark，避免擅自覆盖宿主偏好与存储策略 |

## 接入验证

先用 [效果示例](../assets/effects.html) 理解视觉与开关，再按 [验收清单](acceptance.md) 检查接入后的目标产品：

1. 禁用 JS 或资源加载失败时，正文和所有轮播项仍可读，不存在永久 `opacity:0`。
2. 同一 root 连续 init、refresh、destroy；多个互不嵌套 root 分别操作，嵌套初始化被拒绝；销毁后没有临时水波、仍调度的定时器或监听器。
3. 快速点击主题、筛选与轮播控制，最终选择正确；Resize、字体加载与长标签后底板仍对齐。
4. 运行中切换系统减少动效、手动减少动效、低性能与强度档，运动停止而内容保持完整。
5. 键盘 Tab/Enter/Space 的焦点与结果可见；光标离开、滚动与触摸时没有停留在错误位置的聚光或倾斜。
6. 轮播不自行启动；关注区内暂停，页面隐藏停止调度，手动操作不被定时器抢回。

记录实际执行的检查及环境。语法检查不能证明视觉、生命周期或无障碍已通过；未运行的项目明确标为未验证。
