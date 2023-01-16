## 1.7.0(2023-01-04)
### ✨ Features
- **Metalweb** 使用`VitePress`添加在线文档
- 更新持续构建任务，支持在线文档部署

## 1.6.0(2022-12-14)
### ✨ Features
- **Metalflow** 新增`VNC`访问特性
- **Metalweb** 支持通过`VNC`远程访问 Ubuntu/Windows 图形界面

## 1.5.6(2022-11-21)
### ✨ Features
- **Metalsecure** 支持缓存 `SBOM` & `vulnerability`
- **Metalsecure** 添加修复`vulnerability`脚本

### ✨ Refactor
- **Metalflow** 更新定时开关机 api请求方式
- **Metalsecure** 优化安全特性(基于 `Grype` & `Syft`)

## 1.4.6(2022-10-28)
### ✨ Features
- 添加`metaltask`部署脚本
- **Metalweb** 添加节点负责人
- **Metalflow** 添加`metalsecure` api供`metalapp`使用
- **Metalflow** 添加`metaltune` api供`metalapp`使用
- **Metalsecure** 功能实现及部署
- **Metaltune** 功能实现及部署
- **Metalapp** 节点显示功能
- 更新持续任务工具链

### ✨ Refactor
- 重构Docker持续任务脚本
- **Metaltune** `ServerRequest` & `ServerReply`结构调整
- **Metalsecure** 支持json报告格式
- **Metalflow** 移除对接`metalsecure`的异步操作

### 🐛 Bug Fixes
- 修复解析docker tag失败问题
- **Metalflow** 修复请求体api异常问题
- **Metalsecure** 修复一些请求异常

## 1.4.6(2022-09-06)
### 🐛 Bug Fixes
- 修正节点重启场景下，metalbeat.service 偶发启动失败问题

## 1.4.0(2022-06-25)
### ✨ Features

- **Metalweb** 添加节点收藏功能
- **Metalflow** 添加节点状态异常时邮件通知
- **Metalweb** 添加远程定时开关机
- 部署任务添加节点检查、比较、配置
- **Metalmetrics** 增加`ethtool`配置
- 添加`Metalbeat`部署脚本
- 添加`wakeonlan`部署脚本

### ⚡ Performance Improvements
- **Metalflow** 优化服务器性能计算方式
- **Metalflow** 优化`consul`watch特性
- **Metalweb** 优化服务器列表展示
- 优化持续任务
- **Metalweb** 优化web shell和文件管理

### ✨ Refactor
- **Metalflow** 内嵌文件使用`go embed`特性替代
- 持续开源任务删除`apidoc`、`env.*`等内部配置


### 🐛 Bug Fixes
- 修复部署脚本显示错误
- 修复服务器性能分数计算显示
- 修复导出节点信息错误问题


## 1.3.0(2022-06-25)
### ✨ Features

- **Metalweb** 添加远程文件编辑、比较比较功能
- **Metalweb** 增加服务器节点责任人、性能、地域
- **Metalweb** 添加节点重启(单选、多选)
- **Metaltune** 节点调优

### ✨ Refactor
- **Metalflow** UAC特性组件化(满足合规)
- **Metalweb** UAC特性组件化(满足合规)
- 持续开源任务删除`apidoc`、`env.*`等内部配置


## 1.2.0(2022-04-29)
### ✨ Features

- **Metalweb** 添加`workers`管理配置
- **Metalweb** 增加多服务器节点批量下发用户脚本功能
- **Metalweb** 添加用户和角色管理(满足合规)
- **Metalflow** 用户行为记录导出(满足合规)
- 开通权限，全面部署三地服务器

### ✨ Refactor
- `Mysql`移至至防火墙内，并更改为主从复制架构
- **Metalbeat** 移除`Metalmetrics`和`Metaltask`部署硬编码

### 🐛 Bug Fixes
- **Metalbeat** 节点重启后，metalbeat自启动服务注册正常

## 1.0.0(2021-12-25)
### ✨ Features

- 部署正式环境，发布v1.0.0版本
