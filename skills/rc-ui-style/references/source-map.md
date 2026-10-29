# 来源、权重与项目例外

提炼日期：2026-10-29。用户确认了`assets/style-confirmation.png`的整体方向，并要求整理成skill。图中像素、示例数据、颜色块和文字不作为精确规格。下列是提炼时固定版本的证据；后续接入具体项目须复查其当前最终样式。

## VideoRecBack-Docker

版本 `7e2f07ef6510cb5a0b3b1f0df2b668a2bc7184f0`。

- [最终玻璃](https://github.com/JDui/VideoRecBack-Docker/blob/7e2f07ef6510cb5a0b3b1f0df2b668a2bc7184f0/app/static/liquid-glass.css)、[交互覆盖](https://github.com/JDui/VideoRecBack-Docker/blob/7e2f07ef6510cb5a0b3b1f0df2b668a2bc7184f0/app/static/archive-ui.css)、[动效覆盖](https://github.com/JDui/VideoRecBack-Docker/blob/7e2f07ef6510cb5a0b3b1f0df2b668a2bc7184f0/app/static/motion.css)。注意基础样式之后的覆盖关系，不取旧绿色主题为最终风格。
- 浅底`#f0f1f4`，正文`#1d1d1f`，强调`#007aff`；白表面约44%→hover60%，24px blur。
- 输入12px，卡片12/18px，面板20–26px；顶部动作/主导航可胶囊。
- 时长160/280/380ms，常用淡入Y6px+scale.98，选中底板约220ms，按下scale.985。
- 证据权重：成品实现。并未据此确认深色主题；本skill深色方向来自其他项目。

## RC-WebGallery

版本 `dfb56683322ae0320a9aeb214b3c134fb3caa800`。

- [圆角tokens](https://github.com/JDui/RC-WebGallery/blob/dfb56683322ae0320a9aeb214b3c134fb3caa800/docker_app/app/static/ui-tokens.css)、[组件玻璃](https://github.com/JDui/RC-WebGallery/blob/dfb56683322ae0320a9aeb214b3c134fb3caa800/docker_app/app/static/liquid-glass.css)、[动态主题](https://github.com/JDui/RC-WebGallery/blob/dfb56683322ae0320a9aeb214b3c134fb3caa800/docker_app/app/theme.py)。
- 内嵌8px、控件10px、卡片12px、面板18px、组13px；普通操作为圆角矩形。
- 玻璃64–86%渐变、24px blur；hover上移2px，press回落并scale.975。
- 150/240/360ms，常用`.16,1,.3,1`。系统减少动效和低性能降级有对应处理。
- CSS原始蓝色会经主题接口变换；默认hue337、saturation.5、value1为低饱和玫瑰方向，实际部署保存值未知。不能据旧BiliGallery截图或基准CSS断言最终配色。

## wechat-selkies

分别看Windows客户端和容器默认分支，不混淆：

- AXIVER-Client `4a53968c2604c4c034e9da8cad9827d04f9bf5f8`：[shell.css](https://github.com/JDui/wechat-selkies/blob/4a53968c2604c4c034e9da8cad9827d04f9bf5f8/axiver-client/ui/shell.css)、[shell.js](https://github.com/JDui/wechat-selkies/blob/4a53968c2604c4c034e9da8cad9827d04f9bf5f8/axiver-client/ui/shell.js)。
- 最终面板17px、卡片12px、输入/按钮9px，tab选中块8px；状态26px高/13px圆角。淡青`#a5f3fc`与灰蓝玻璃。面板blur12px，胶囊7.2px。
- 控件160–180ms；Tab底板320ms；面板入场300ms（Y-7px/scale.97），离场160ms；Tab内容240ms/Y7px。
- 胶囊400ms展开，72%处超目标宽3px再归位；320ms收起，离开0.5s后收起。这是允许克制弹性的具体依据，不应概括成“全局禁止回弹”。
- 默认AXiVer `9266690ffd505a7611d6683a17439e644d847448`：[Dock实现](https://github.com/JDui/wechat-selkies/blob/9266690ffd505a7611d6683a17439e644d847448/root/usr/share/selkies/selkies-dashboard/src/selkies-dock-download.js)，34px容器、26px图标按钮、6px blur。拖入目标时才出现扫光。
- 已查看的测试截图背景大字属于夹具，不是设计元素。按钮按下可仅亮度增强，不据此强制全局缩放。

## chatgpt-model-meter

版本 `5af72b53a82bacd5878bd8a2eb6be839e21107e4`。

- [主控件](https://github.com/JDui/chatgpt-model-meter/blob/5af72b53a82bacd5878bd8a2eb6be839e21107e4/widget.js)、[状态标记](https://github.com/JDui/chatgpt-model-meter/blob/5af72b53a82bacd5878bd8a2eb6be839e21107e4/model-ui.js)。
- 紧凑236px卡片，主卡12px、控件7–8px、徽标5px；13px字体、等宽数字、右对齐数值。
- 浅色`#fafafa`/深色`#232323`约92%不透明，12px blur；青绿或灰紫进度，非霓虹高饱和主题。
- 位置120ms、尺寸140ms、箭头160ms、进度220ms；拖动取消过渡。
- 渐进披露保留关键额度，透明命中桥防误收起；没有把所有按钮做发光/弹簧的依据。

## Geargrade-Docker

版本 `fa1f71c70264a8c5c8e6fccd434ba03cada48ca7`。

- [index.css](https://github.com/JDui/Geargrade-Docker/blob/fa1f71c70264a8c5c8e6fccd434ba03cada48ca7/frontend/src/index.css)、[AppShell](https://github.com/JDui/Geargrade-Docker/blob/fa1f71c70264a8c5c8e6fccd434ba03cada48ca7/frontend/src/components/layout/AppShell.tsx)、[已查看截图](https://github.com/JDui/Geargrade-Docker/blob/fa1f71c70264a8c5c8e6fccd434ba03cada48ca7/docs/screenshots/dashboard-home.png)。
- 深底`#0B1018`、面板`#111926`、强调`#5CC8FF`；亮底`#F4F7FB`与`#007ACC`。弱网格、低噪声、约90%不透明卡片。
- 控件12px、常规面板16px，大仪表盘面板约28.8px/hero32px。不能用其大标题/大圆角覆盖小型悬浮工具。
- hover220ms，照片入场260ms/Y8px；页面520ms/Y18px；大卡720ms/Y22px；抽屉360ms/32px，退出220ms。常用`.22,1,.36,1`。
- 未发现统一press缩放；“低强度按压反馈”是合成规范，不能标为此仓已有行为。

## Core-AgentLink

版本 `941f0c989050ab73dacd8b4e97d4c72564beec22`。

- [教学示例样式](https://github.com/JDui/Core-AgentLink/blob/941f0c989050ab73dacd8b4e97d4c72564beec22/examples/local_agentlink/web/style.css)、[交互说明](https://github.com/JDui/Core-AgentLink/blob/941f0c989050ab73dacd8b4e97d4c72564beec22/docs/04-ui-and-takeover.md)。
- 深slate/teal；按钮6px、面板12px、状态pill20px。属于教学示例，视觉权重低于成品项目。
- 工作中4s teal↔lavender边框呼吸，隐藏暂停、终态停止；减少动效关闭。
- 已生成prompt的渐进呈现并不是真实推理流，复制/编辑立即显全。
- 彩虹窗口边框、低透明代码词背景、完成按钮短呼吸属于可增加设计意图，**不作为已实现的全局风格**。

## 合成与确认的边界

六项目共同支持轻玻璃、细边框、分级圆角、紧凑对齐、低饱和环境色与克制反馈。强调色、实际blur、圆角大小、动效节奏及是否采用深色存在差异。确认图和本包保留共同语言，具体接入按用途选择；不可声称用户逐项批准了每个CSS数值或所有项目例外。
