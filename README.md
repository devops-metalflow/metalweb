# metalweb

[![Build Status](https://github.com/devops-metalflow/metalweb/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/devops-metalflow/metalweb/actions?query=workflow%3Aci)
[![License](https://img.shields.io/github/license/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/blob/main/LICENSE)
[![Tag](https://img.shields.io/github/tag/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/tags)



> English | [中文](README_zh.md)



## Introduction

*metalweb* is the web of [metalflow](https://github.com/devops-metalflow) written in TypeScript.

If you want to give it a try, you can install it for free (see section below) or you can just use the online demo hosted on Vercel.

Demo hosted: [metalflow.fly.dev](https://metalflow.fly.dev)

Demo credentials: admin/123456



## Prerequisites

- Node.js >= 14.0
- Vue >= 3.0



## Run

### Mock mode

Set `VITE_USE_MOCK=true` and `VITE_GLOB_API_URL=/basic-api` in [.env.development](https://github.com/devops-metalflow/metalweb/blob/main/.env.development).

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn install
yarn run serve
```



### Deploy mode

Set `VITE_USE_MOCK=false` and `VITE_GLOB_API_URL=http://localhost:8089/api/v1` in [.env.development](https://github.com/devops-metalflow/metalweb/blob/main/.env.development).

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn install
yarn run build-prod
```



## License

Project License can be found [here](LICENSE).



## Reference
