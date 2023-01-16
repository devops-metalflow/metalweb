## 1.7.0(2023-01-04)
### ✨ Features
- **Metalweb** use `VitePress` to add online documentation
- update continuous build tasks to support online document deployment

## 1.6.0(2022-12-14)
### ✨ Features
- **Metalflow** add `VNC` access feature
- **Metalweb** support remote access to Ubuntu/Windows GUI via `VNC`

## 1.5.6(2022-11-21)
### ✨ Features
- **Metalsecure** support caching `SBOM` & `vulnerability`
- **Metalsecure** add fix `vulnerability` script

### ✨ Refactor
- **Metalflow** update the timer switch api request method
- **Metalsecure** optimized security features (based on `Grype` & `Syft`)

## 1.4.6(2022-10-28)
### ✨ Features
- add `metaltask` deployment script
- **Metalweb** add node leader
- **Metalflow** add `metalsecure` api for use by `metalapp`
- **Metalflow** add `metaltune` api for use by `metalapp`
- **Metalsecure** function realization and deployment
- **Metaltune** function realization and deployment
- **Metalapp** node display function
- update the persistent task toolchain

### ✨ Refactor
- refactor Docker continuous task script
- **Metaltune** `ServerRequest` & `ServerReply` structure adjustment
- **Metalsecure** support json report format
- **Metalflow** removed asynchronous operations connected to `metalsecure`

### 🐛 Bug Fixes
- fix the failure of parsing docker tag
- **Metalflow** fix request body exception problem
- **Metalsecure** fix some request exceptions

## 1.4.6(2022-09-06)
### 🐛 Bug Fixes
- fixed the occasional startup failure of `metalbeat.service` in the node restart scenario

## 1.4.0(2022-06-25)
### ✨ Features

- **Metalweb** add node collection function
- **Metalflow** add email notification when node status is abnormal
- **Metalweb** add remote timer switch
- deployment tasks add node inspection, comparison, and configuration
- **Metalmetrics** add `ethtool` configuration
- add `Metalbeat` deployment script
- add `wakeonlan` deployment script

### ⚡ Performance Improvements
- optimize continuous tasks
- **Metalweb** optimize web shell and file management
- **Metalflow** optimize server performance calculation method
- **Metalflow** optimize the `consul` watch feature
- **Metalweb** optimize server list display

### ✨ Refactor
- **Metalflow** embedded files are replaced with the `go embed` feature
- continuous open source task deletes `apidoc`, `env.*` and other internal configurations

### 🐛 Bug Fixes
- fix deployment script display error
- fix server performance score calculation display problem
- fix export node information error problem


## 1.3.0(2022-06-25)
### ✨ Features

- **Metalweb** add remote file editing and comparison functions(SFTP)
- **Metalweb** increase the responsible person, performance, and region of the server node
- **Metalweb** add node restart (single choice, multiple choice)
- **Metaltune** node Tuning

### ✨ Refactor
- **Metalflow** compartmentalization of UAC features (for compliance)
- **Metalweb** compartmentalization of UAC features (for compliance)
- continuous open source task deletes `apidoc`, `env.*` and other internal configurations


## 1.2.0(2022-04-29)
### ✨ Features

- **Metalweb** add `workers` management configuration
- **Metalweb** added the function of sending user scripts in batches to multiple server nodes
- **Metalweb** add user and role management (for compliance)
- **Metalflow** export of user behavior records (for compliance)
- open permissions and fully deploy server nodes

### ✨ Refactor
- `Mysql`moved to the firewall and changed to master-slave replication architecture
- **Metalbeat** remove `Metalmetrics` and `Metaltask` deployment hardcoding

### 🐛 Bug Fixes
- **Metalbeat** after the node restarts, the metalbeat self-starting service registration is normal

## 1.0.0(2021-12-25)
### ✨ Features

- deploy the official environment and release v1.0.0
