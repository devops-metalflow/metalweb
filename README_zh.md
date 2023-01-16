# metalweb

[![Build Status](https://github.com/devops-metalflow/metalweb/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/devops-metalflow/metalweb/actions?query=workflow%3Aci)
[![License](https://img.shields.io/github/license/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/blob/main/LICENSE)
[![Tag](https://img.shields.io/github/tag/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/tags)



> [English](README.md) | 中文



## 介绍

*metalweb* 作为 [metalflow](https://github.com/devops-metalflow) 前端，用于提供 web 访问服务。

Demo URL: [demo-metalflow.vercel.app](https://demo-metalflow.vercel.app/)

Demo User/Pass: admin/123456



## 前提

- Node.js >= 14.0
- Vue >= 3.0



## 运行

### Mock 模式

需在 [env.development](https://github.com/devops-metalflow/metalweb/blob/main/.env.development) 中设置 `VITE_USE_MOCK=true` 和 `VITE_GLOB_API_URL=/basic-api`。

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn && yarn run serve
```



## Deploy 模式

需在 [env.development](https://github.com/devops-metalflow/metalweb/blob/main/.env.development) 中设置 `VITE_USE_MOCK=false` 和 `VITE_GLOB_API_URL=http://localhost:8089/api/v1`。

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn && yarn run build-prod
```



## 容器

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn && yarn run build-prod
docker build --no-cache -f Dockerfile -t ghcr.io/devops-metalflow/metalweb:latest .
docker run ghcr.io/devops-metalflow/metalweb:latest
```



## 协议

本项目协议声明见 [here](LICENSE).



## 引用
