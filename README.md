# metalweb

[![Build Status](https://github.com/devops-metalflow/metalweb/workflows/ci/badge.svg?branch=main&event=push)](https://github.com/devops-metalflow/metalweb/actions?query=workflow%3Aci)
[![codecov](https://codecov.io/gh/devops-metalflow/metalweb/branch/main/graph/badge.svg?token=FS77A6KD37)](https://codecov.io/gh/devops-metalflow/metalweb)
[![License](https://img.shields.io/github/license/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/blob/main/LICENSE)
[![Tag](https://img.shields.io/github/tag/devops-metalflow/metalweb.svg)](https://github.com/devops-metalflow/metalweb/tags)



## Introduction

*metalweb* is the web of [metalflow](https://github.com/devops-metalflow) written in Vue.



## Prerequisites

- Vue >= 3.0



## Run

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn && yarn run build
yarn run dev
```



## Docker

```bash
git clone https://github.com/devops-metalflow/metalweb.git

cd metalweb
yarn && yarn run build
docker build --no-cache -f Dockerfile -t ghcr.io/devops-metalflow/metalweb:latest .
docker run ghcr.io/devops-metalflow/metalweb:latest
```



## License

Project License can be found [here](LICENSE).



## Reference
