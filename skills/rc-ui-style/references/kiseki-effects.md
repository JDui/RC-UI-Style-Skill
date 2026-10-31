# Kiseki 效果目录与 RC 融合

将 [kiseki.blog](https://kiseki.blog/) 的环境层、表面、导航、卡片与内容动效提炼为可组合模式。先按任务选择少量效果，再用 RC 既有令牌实现；不把展示主页的全部效果一次性套进工具界面。

## 目录

- [证据等级与取证范围](#证据等级与取证范围)
- [现场构图与流程](#现场构图与流程)
- [环境与表面](#环境与表面)
- [导航与状态岛](#导航与状态岛)
- [卡片、轮播与滚动](#卡片轮播与滚动)
- [媒体、反馈与运行预算](#媒体反馈与运行预算)
- [RC 参数与组合决策](#rc-参数与组合决策)
- [未验证边界与独立实现](#未验证边界与独立实现)
- [固定版本来源](#固定版本来源)

## 证据等级与取证范围

取证日期：2026-10-31。公开上游为 [Myriad-You/Myriad](https://github.com/Myriad-You/Myriad)，核对 `preview` 分支的 commit [`5c1a352`](https://github.com/Myriad-You/Myriad/commit/5c1a352faf0739d8100b8f137554223dc72ccf12)。以下永久源码链接固定到该提交；不能据此断言站点部署的 revision 与它完全相同。

| 标记 | 含义 | 可以据此说明什么 |
|---|---|---|
| **O：现场观测** | 本轮浏览器实际页面、截图或交互 | 当时可见结构与已操作行为；单张截图不证明动画时长、性能或完整可访问性 |
| **S：源码证据** | 上述固定提交中的实现 | 上游具备的机制、参数与门控；可能属于可选配置，不自动等于源站已启用 |
| **R：RC 合成** | 为 RC 风格和任务密度提出的改编 | 建议范围与取舍；不声称是源站实测值，也不声称已在全部 RC 项目实现 |

主浏览器在桌面约 1363 × 936 CSS 像素观察首页、Library、控制面板、Blog 与 Apps：首页大图、向下增强的浅色遮罩、Bento 小组件、卡片轮换、悬浮状态岛及自动收纳侧导航；Library 混合纵横封面、玻璃标题条、类型徽标、上下文筛选导航、首次导览与加载状态。状态岛展开为控制面板，内有控制/通知 tabs、天气、音乐与外观等设置；Blog 为暖白窄栏阅读列表，保留侧导航而不沿用首页背景。Apps 复用大背景和标题条，以小型应用卡展示图标、标题与绿色运行点。源站页脚链接确认了 Myriad 来源。

现场控制面板显示动效档为“低性能”。因此只把成功观测的行为标为 O；动态模糊、水波、几何折射等高级效果仍属于 S。截图里的指针光效可能来自浏览器指针叠层，不能当作站点自定义光标证据。

以下目录覆盖主要可复用视觉与交互模式，不量化为“复刻百分比”。私人登录流程、所有设备宽度、所有性能档、全部上游可选效果均没有逐一现场测量。识别设计时保留 O / S / R 的边界。

## 现场构图与流程

| 编号 | 现场模式 | 证据 | 融合要求与适用范围 |
|---|---|---|---|
| K32 | 大图环境 + 下部内容区 + Bento 模块 | O；上游首页布局见 S20 | 用少量跨列/跨行模块表达信息优先级；小屏按任务顺序展开。工具页缩小环境层，正文与操作立即可用，不照搬巨幅留白。 |
| K33 | 纵横封面混排 + 玻璃标题条 + 类别徽标 | O；资料库机制见 S14 | 保留媒体原比例和原色，用稳定的标题承载层保证对比度；类别兼有文字/图标。不能通过滤暗所有照片来满足深色主题。 |
| K34 | 首次导览、就近提示与局部加载 | O；加载参考 S19 | 提示锚定当前控件且可关闭；不把说明气泡变成常驻遮挡。加载占位保留最终尺寸，已加载内容刷新时保留。 |
| K35 | 上下文导航随页面功能改变 | O：Library 类型筛选会写入 `?type=game`；S6 | 保留全站定位和返回路径，局部导航服务当前任务；筛选状态与 URL/历史同步，不只改变按钮颜色。 |
| K36 | 共享导航下的阅读密度切换 | O：`/blog/` 为暖白窄栏文章列表 | 保留导航与基本品牌线索，正文采用稳定背景、适宜行长和低动效。主页的 Bento、大图与高透表面不强加到阅读页。 |
| K37 | 应用入口与窗口级操作 | O：`/tapp` 的三个应用小卡；音乐窗口 `/tapp/run/com.myriad.music-player` 有返回、多窗口、全屏入口，下方为封面与播放控件 | 以图标、标题和文字/图标状态区分应用与内容卡；运行点须有可访问状态描述，不能只靠颜色。窗口操作与应用内部操作分层，保留返回/关闭路径；未触发真实播放。 |

## 环境与表面

表内“上游数值”仅作取证。实际采用时使用后面的 RC 范围、[视觉系统](visual-system.md)和[动效规则](motion.md)。

| 编号 | 效果与证据 | 上游机制 / 数值 | RC 适配与降级 |
|---|---|---|---|
| K01 | 分层全屏背景，O + S1 | 固定底图、壁纸、水波、渐变遮罩、网格分层；壁纸负 inset 4% 避免模糊或视差露边，兼容 vh/dvh/lvh | 为环境层分配独立容器；不参与布局、不截获指针。正文/工具区域提高底色遮盖，低性能时只保留静态底图或纯色。 |
| K02 | 底图预载与切换，S1 / S17 | 新图先加载；已有底图失败时保留旧图。首图 opacity 0.95s 渐入，换出 0.28s | 吸收“保留上次有效视觉、加载后再换”的生命周期；缩短工具页过渡，不让数据和按钮等底图加载。 |
| K03 | 氛围占位，S1 | 未取得底图时柔和径向色场呼吸 3.6s、光带移动 4.8s；加载后撤销 | 仅可选展示层；停止等待后撤掉循环。减少动效时静态占位，错误时给出可恢复状态，不靠无限呼吸遮掩失败。 |
| K04 | 阻尼壁纸视差，S2 | 默认 scale 1.02、最大偏移 8px；跟随/回位平滑因子 0.03/0.02，按帧间隔归一化；位置稳定后停 rAF | `showcase` 或媒体入口可选；只动装饰层。编辑画布、真实媒体审阅、精密操作区默认关闭；触摸/键盘不强求指针视差。 |
| K05 | 内容聚焦时抑制背景，S2 / S17 | 依据指针所在内容/空白区调整壁纸模糊；离开内容后延迟 180ms 恢复清晰，防止穿过卡片间隙时闪烁；配置默认关闭 | 优先改遮罩或底色，连续大面积 blur 需额外预算。只处理背景，不模糊文本；键盘聚焦得到稳定可读背景。 |
| K06 | 背景点击水波，S2 / S17 | Canvas 径向像素位移；最多 3 波、每波 2000ms、速度 400px/s、波长 80px、振幅 15px；配置默认关闭 | 高成本 `showcase` 可选项。限制分辨率和并发，只响应空白背景；无波/后台时停止绘制。低性能、减少动效与截图模式回退静态底图。 |
| K07 | 主题 / 表面 / 光晕分轴，S1 / S3 / S5 | 用户主题 light/dark/auto；表面 glass/solid/flat/outline/liquid；光晕 identity/primary/none | RC 保留自己的主题范围，用独立令牌描述材质与环境色；不以深浅主题切换丢失选中、输入或数据状态。 |
| K08 | 玻璃表面外观 O；光学参数 S1 | 当前源码默认表面 alpha 74%、blur 13.6px、saturate 180%；顶部微高光、底部细线、外阴影；暗色单独定标。现场低性能档不证明 blur 正在生效 | RC 以 1px 边线、低层级软影、清晰正文为先；blur 按既有系统，不抄整套参数。背景不可预测时增加不透明度。 |
| K09 | 液态玻璃外观，S1 | 中央/边缘不同透明度、少量主题染色和顶部 sheen；基础液态模式 blur 2.5px、saturate 200%；暗色为烟熏底 | 将高透材质限制在小型浮层/chrome；密集文本仍用稳定基底。颜色、边缘反光、阴影分层，不对整个元素设 opacity。 |
| K10 | 几何折射增强，S4 | 桌面、可见、支持引擎、非 reduced-motion、非 light/exlight 时逐元素挂透镜；bevel 16/18、thickness 10、dispersion 0；分批工作约 8ms 截断 | 仅高级可选参考，基础 CSS 必须独立可用。避免嵌套 backdrop-filter 采样不到外部背景；需单独做浏览器与 GPU 验证。 |
| K11 | 材质的真实性能降级，S1 / S12 | solid/flat 使用 filter:none；低性能关闭折射与凝胶形变，提高有效遮盖 | 降级仍呈现完整 UI；不是 blur:0 加透明空壳。关键边界、焦点、选中、错误文字不降级。 |
| K12 | 身份色柔光，S5 | 角部径向渐变光斑；身份色/主题色/关闭；单次 3s 淡入后停住，并非永久呼吸 | 用少量静态光晕表达模块关系；无需再加大面积 filter:blur。状态语义仍有图标/文字，业务停止不意味着装饰就是进度。 |
| K13 | 轻抬升与按压回落，S1 | 可交互液态表面 hover 上移 1px、scale 1.012；press .972；hover 媒体条件隔离 | 映射到 RC 120–180ms 反馈；普通工具可只增亮。信息卡、表格、真实媒体不整体抖动，焦点反馈独立存在。 |

## 导航与状态岛

| 编号 | 效果与证据 | 上游机制 / 数值 | RC 适配与降级 |
|---|---|---|---|
| K14 | 响应式导航岛与收纳，O + S6 | 桌面侧边纵向、移动底部横向；形态转换先退出再入场，避免整岛跨屏飞行；支持折叠和二级模式 | 保留显式可发现入口、键盘焦点与当前位置；小屏预留 safe-area 和内容底部空间。低动效直接切最终布局，不失去导航。 |
| K15 | 意图触发的流动边缘，S6 | 伪元素渐变配 mask 排空中心；8s 边缘流动常态暂停、hover 才运行；减少动效禁用 | 适合导航岛或单个重要入口，不能全页永久跑边。无 mask 支持时保留静态边线；键盘使用静态高亮。 |
| K16 | 当前项与就近提示，O + S6 | 激活底色 + 圆点；普通项 hover scale 1.08，激活项不再放大以免圆点裁切；tooltip 延迟约 120ms | 当前状态同时有语义属性与可见指示；图标有名称；tooltip 不承载唯一必需说明。放大幅度按实际控件空间收敛。 |
| K17 | 状态胶囊展开成面板，O + S7 | 现场展开含滑动选中底板的控制/通知 tabs、天气、音乐播放/进度/音量与外观设置。上游收起 160px × 3rem，展开约 400px；尺寸与内容错时编排，形变基准 700ms | 参考“同一容器连续变化”，RC 工具优先沿用 220–320ms 或既有胶囊例外。展开可打断，焦点/关闭不依赖动画完成事件。未验证真实音频播放成功。 |
| K18 | 岛内状态文字交接，S8 | 歌词切换短淡出；仅溢出时滚动；普通文字等待约 1.5s，歌词按剩余时间调整；清理定时器/帧 | 完整值始终可读取、复制；普通工具优先截断 + 展开，不把跑马灯当默认。减少动效改静态文本，状态变化不丢消息。 |
| K25 | 共享导航的跨页交接，S15 | View Transitions 保持导航岛、滑移选中底色、图标独立叠层；内容下沉 28px/scale .985 与新内容淡入，约 300–460ms | 共享 shell 优先不卸载；实现 URL、历史、滚动和焦点之后再加过渡。不支持/失败/减少动效时仍直接完成导航。 |

## 卡片、轮播与滚动

| 编号 | 效果与证据 | 上游机制 / 数值 | RC 适配与降级 |
|---|---|---|---|
| K19 | 整卡入场与少量错峰，S9 | 单个 transform+opacity 时间线；translateY(14px) scale(.9) 到 1，0.56s tween；错峰协调 | RC 用 4–8px、scale .97–.99、220–320ms 起步，少量 20–40ms 错峰并封顶；无 JS 本来可见，回看不重复播放。 |
| K20 | 统一微交互节拍，S10 | fast/base/slow 140/220/320ms；位移 2/6/12px、press .97、stagger 26ms；减少动效归零位移与缩放 | 沿用 [动效系统](motion.md) 的语义令牌，不另加一套互相覆盖的时长；上游值只是参考节奏。 |
| K21 | 可暂停的卡片自动轮换，O + S11 | hover、键盘聚焦、按住、手动翻页后暂停；手动后约 15s；独立永久暂停开关；恢复后重新计时 | 只用于展示卡/封面，不自动切走编辑数据。暂停入口必须可见且可操作；后台/屏外不轮换。 |
| K22 | 横滑、惯性与页码点，S11 | 横拖 36px 且横向主导才翻页；竖向 12px 优先交回页面；wheel 阈值 50px、180ms 空闲分段；方向键/页码 | 把手势阈值视为项目可调值；表单、内层滚动、交互控件排除。翻页不得吃掉下一次键盘激活或造成焦点丢失。 |
| K23 | 横向卡带吸附，S13 | 支持桌面拖拽、滚轮映射和 scroll-snap；拖动超过 6px 才区分点击；到两端放行给页面，抑制惯性重复翻页 | 优先原生滚动/吸附；只有确实消费当前滚动时才 preventDefault。不将卡带方案扩展成全页面滚动接管。 |
| K24 | 可缩放的媒体画布，S14 | 拖动、双指/滚轮缩放，方向键平移，+/- 缩放，0/Home 重置；中心卡片较大，边缘收小；可见区裁剪 | 仅媒体/空间探索界面可选；提供列表模式与显式缩放/复位入口。编辑、排序、精确尺寸判断时保持稳定比例。 |

## 媒体、反馈与运行预算

| 编号 | 效果与证据 | 上游机制 / 数值 | RC 适配与降级 |
|---|---|---|---|
| K26 | 封面周边柔和配色 O；取色与过渡机制 S16 | 现场音乐窗口呈现大封面与协调的柔和背景。上游封面色写入独立 --music-*，与壁纸 --color-* 分开；注册颜色属性约 .4s 插值，空结果保留上一有效色 | 限定为周边装饰，不改变照片/视频/导出预览颜色；对比色重新计算，语义状态色保持独立。 |
| K27 | 音乐封面与控制外观 O；播放动效 S16 | 现场有播放、进度、音量、歌词、播放列表入口，未触发播放。上游封面 scale .5 / rotate -15deg / opacity 0 后约 .6s 弹入；播放控制循环与文字反应 | 媒体播放器可采用更克制幅度；播放时动、暂停时静。装饰波形不能标为真实频谱，未验证歌词同步；播放仍需实际媒体状态。 |
| K28 | 歌词景深与边缘渐隐，S16 | 当前行更大、更亮、更清晰；邻行 blur .5/1/1.7px，28/48/70ms 错峰；上下 mask 渐隐 | 仅沉浸式歌词/内容模式可选；普通文本、表单标签和数据不模糊。提供完整静态歌词和手动阅读路径。 |
| K29 | 通知胶囊与队列重排，S18 | 顶部通知分层排列；进入 opacity/translate/scale，退出收起占位高度；约 .4s 进入、.32s 退出；类型染色。此处 toast 与现场已见的控制岛不是同一部件 | 与现有 RC toast 合并，非阻塞但可读取。重要错误/重试不因动画超时消失；减少动效即时展示/移除。 |
| K30 | 局部加载 O；骨架机制 S19 | 现场仅确认局部 loading，未取得骨架外观截图；上游骨架近似组件轮廓，局部与路由加载分离，减少动效取消闪动 | 匹配最终占位，图片尺寸提前保留；刷新优先保留旧内容；真加载、失败与空数据分别有反馈。 |
| K31 | 可见性与性能预算，S4 / S10 / S12 | standard/light/exlight、减少动效、page visibility、IntersectionObserver 门控；屏外/后台暂停、卸载清理 | 这是所有增强的共同契约。先裁氛围，再裁非必要运动，保留状态与输入反馈；避免永久 will-change 和闲置 rAF。 |

## RC 参数与组合决策

### 用统一范围替代盲目照抄

| 维度 | RC 默认起点（R） | 可保留的例外 |
|---|---|---|
| hover / press | 120–180ms；0–2px 轻抬升或轻增亮；scale .97–1 | 紧凑工具可完全不缩放；已有 AXIVER 胶囊遵循原项目 |
| 选中 / 内容切换 | 180–280ms，移动底板或单个内容层 | 展示入口的共享元素可适度延长，明确直接切换回退 |
| 面板进入 / 退出 | 220–320ms / 140–220ms；4–8px 位移；scale .97–.99 | 小型尺寸 morph 按项目既有例外，不套给大列表 |
| 首屏错峰 | 20–40ms 增量；总等待建议不超过 200ms | 长列表只对少量首屏项做；数据和操作不等待 |
| 背景视差 | 默认关；选用时从 2–6px 起步 | 短时展示可适度增加；真实媒体审阅与工作画布保持静止 |
| 光晕 | 默认静态，单组件一个主光场 | 不以光晕代替 focus/error/progress；过渡完成停止 |
| 玻璃 | 沿用当前项目 token；内容不透明度独立 | 复杂底图提高遮盖，低性能/不支持滤镜直接 solid/flat |

这些范围是 RC 的合成建议，不是源站测量，也不是必须覆盖所有旧项目的硬阈值。调整时以实际可读性、响应速度与界面密度为准。

### 按用途组合

| 用途 | 优先组合 | 默认收敛 |
|---|---|---|
| 高频工具 / 编辑器 / 桌面设置 | K07–K08、K11、K13、K16、K20、K29–K31 | 不启用水波、背景跟随、自动内容轮换、歌词景深；照片和工作画布原色 |
| 媒体图库 / 仪表盘 | 上述基础 + K12、K19、K23、K32–K33，按需 K14/K21/K24/K26 | 轮播可停、画布有列表，原图不滤色，密集区使用稳定底色 |
| 主页 / 作品入口 | 基础 + K01–K04、K14–K19、K32，按需 K05/K06/K10/K25 | 一屏一个主要环境系统；高成本效果逐项选，留关闭入口 |
| 真实播放器 | 基础 + K17–K18、K26–K28 | 音频与进度来自真实状态；暂停/后台时停装饰，歌词完整可访问 |

### 标清 RC 自定的扩展

局部光标聚光、卡片轻倾斜、圆形主题揭示可以作为 **R：RC 合成** 的可选配方，但本轮没有取得它们在源站部署中实际启用的证据。不要把这些写成“从 Kiseki 逐项复刻”。

- 聚光仅处理装饰伪元素，细指针按需运行；焦点使用稳定的可见边界。
- 倾斜只影响独立视觉内层，保持命中区和文字稳定；与 hover/拖拽分开合成 transform。
- 圆形主题揭示只呈现已提交的主题状态；失败/不支持/连续切换/减少动效时仍立即到达正确主题。
- 主题、材质、光晕、动效强度分别保存；性能档不会擅自修改用户业务数据或界面结构。

### 区分规范与现成实现

目录描述的是可复用设计机制。它不承诺 `assets/rc-effects.*` 已提供完整轮播、真实播放器、Canvas 水波、Hyalite 折射、可缩放资料库或跨文档导航引擎。先读 [实现配方与接口](effects-recipes.md)，再选 [CSS](../assets/rc-effects.css)、[脚本](../assets/rc-effects.js)和[示例](../assets/effects.html) 中实际提供的能力；其余按项目技术栈独立实现。

## 未验证边界与独立实现

- 动态模糊与水波在上游配置默认关闭；只有现场成功操作才能将它们从 S 升为 O。源码存在不能替代部署验证。
- 不宣称源站有全局自定义鼠标轨迹、点击烟花、樱花/雪粒子或全站 3D 卡片倾斜。普通拖动光标不属于这类效果。
- 上游 `docs/design/theme-system.md` 包含较早的噪声、色散环与模糊参数描述；本目录数值以固定提交的 CSS/TS 实现为准。不要把旧文档的 80% / 16px / 12px 当现行实测。
- 未测量所有浏览器、GPU、窄屏、辅助技术或真实帧率；源码有 reduced-motion 不等于整个部署已通过可访问性验收。
- 上游 2.5D 角色、账户、后端聚合与 AI 功能属于产品内容/子系统，不作为 RC 通用 UI 的强制依赖。
- 保留原站品牌、文本、人物、壁纸、字体、封面资产的出处边界。提炼交互机制并独立编写 RC 代码，不把原站整段实现或素材重新包装为自有资产。
- 上游根 LICENSE 声明宿主前端为 AGPL-3.0-only 并附加许可；Hyalite NOTICE 记载其原始第三方来源为 MIT、同时列有 Myriad 改动。需要复用具体源码时，另行核对该文件的许可和归属；本次融合采用原创规则与独立实现。

## 固定版本来源

每个 S 编号对应原作者的一手实现。跨版本更新时重新核对，避免将历史参数悄悄写成当前事实。

| 编号 | 文件与永久链接 | 对应范围 |
|---|---|---|
| S1 | [theme.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/styles/theme.css) | 背景、表面、主题 token、液态样式、按压与回退 |
| S2 | [useEvocativeWallpaper.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useEvocativeWallpaper.ts) | 视差、内容模糊、水波、生命周期 |
| S3 | [useThemePreference.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useThemePreference.ts)、[theme-system.md](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/docs/design/theme-system.md) | 用户主题与分轴概念；设计文档数值以 S1 复核 |
| S4 | [surfaceLenses.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/utils/liquidGlass/surfaceLenses.ts) | 逐元素透镜与性能门控 |
| S5 | [GlowBackground.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/shared/GlowBackground.css)、[GlowBackground.tsx](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/shared/GlowBackground.tsx) | 角部光晕与颜色模式 |
| S6 | [navigation-island.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/styles/navigation-island.css)、[NavigationIsland.tsx](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/NavigationIsland.tsx) | 导航岛、收纳、状态、提示 |
| S7 | [GlobalControlPanel.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/GlobalControlPanel.css) | 状态岛展开与分阶段编排 |
| S8 | [useIslandTextMotion.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/ControlPanel/useIslandTextMotion.ts) | 动态文本与歌词溢出处理 |
| S9 | [widgetEntranceMotion.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgetEntranceMotion.ts)、[useStaggerAnimation.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/animation/useStaggerAnimation.ts) | 整卡入场与错峰 |
| S10 | [motion-tokens.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/styles/motion-tokens.css) | 统一节拍与减少动效 |
| S11 | [useWidgetRotation.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/shared/useWidgetRotation.ts)、[WidgetPager.tsx](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/shared/WidgetPager.tsx) | 卡片轮换、暂停、手势、页码 |
| S12 | [performance.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/styles/performance.css)、[useAnimationLevel.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useAnimationLevel.ts) | 性能档与生命周期预算 |
| S13 | [useHorizontalStripScroll.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useHorizontalStripScroll.ts) | 横向条带滚动与吸附 |
| S14 | [useLibraryCanvasControls.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useLibraryCanvasControls.ts)、[libraryCanvas.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/utils/libraryCanvas.ts) | 媒体画布控制与可见区 |
| S15 | [site-transition.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/styles/site-transition.css) | 跨页共享导航过渡 |
| S16 | [useCoverColors.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/musicPlayer/useCoverColors.ts)、[MusicPlayerWidget.tsx](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/MusicPlayerWidget.tsx)、[LyricWaveScroll.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/shared/LyricWaveScroll.css) | 音乐配色、封面、歌词 |
| S17 | [useWallpaper.ts](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/hooks/useWallpaper.ts)、[AppLayout.tsx](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/layouts/AppLayout.tsx) | 壁纸预载、失败回退、配置默认值 |
| S18 | [Toast.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/Toast.css) | 通知胶囊与队列 |
| S19 | [WidgetSkeleton.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/widgets/shared/WidgetSkeleton.css)、[RouteLoader.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/components/RouteLoader.css) | 骨架与路由加载 |
| S20 | [Home.css](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/views/Home.css)、[README.md](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/README.md) | 首页布局与模块定位 |
| 许可 | [LICENSE](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/LICENSE)、[Hyalite NOTICE](https://github.com/Myriad-You/Myriad/blob/5c1a352faf0739d8100b8f137554223dc72ccf12/frontend/src/utils/liquidGlass/vendor/NOTICE) | 来源归属与复用边界 |
