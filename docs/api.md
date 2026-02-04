# Reno Web API 设计文档（V1）

本文档基于当前 Reno-Web 的页面流程（5 步）与前端实现方式，给后端开发可直接落地的 API 约定。

## 目标
- 前端直传视频到对象存储，仅提交可读 URL + 文本需求给 AI 服务
- AI 服务同步返回章节编排建议
- 前端基于返回信息完成页面 2/3/4/5 的渲染

---

## 1. 通用约定

**Base URL**
- `https://api.reno.ai/v1`

**鉴权**
- `Authorization: Bearer <token>`

**成功返回结构**
```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

**失败返回结构**
```json
{
  "code": 4001,
  "message": "Invalid video url",
  "data": null
}
```

---

## 2. 上传相关（对象存储直传）

> 前端直传对象存储（S3/OSS/R2 等），后端提供签名与登记。

### 2.1 申请上传（获取预签名 URL）
`POST /uploads/init`

**Request**
```json
{
  "files": [
    {
      "filename": "lesson-1.mp4",
      "contentType": "video/mp4",
      "size": 52428800
    }
  ]
}
```

**Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "uploads": [
      {
        "fileId": "file_001",
        "uploadUrl": "https://storage.xxx.com/...",
        "publicUrl": "https://cdn.xxx.com/lesson-1.mp4"
      }
    ],
    "expireAt": "2026-02-04T12:00:00Z"
  }
}
```

### 2.2 完成上传确认（可选）
`POST /uploads/complete`

**Request**
```json
{
  "fileId": "file_001",
  "checksum": "sha256:xxxx"
}
```

**Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "fileId": "file_001",
    "publicUrl": "https://cdn.xxx.com/lesson-1.mp4"
  }
}
```

---

## 3. AI 编排接口（同步）

### 3.1 创建编排任务
`POST /ai/compose`

**Request**
```json
{
  "prompt": "我希望把这些素材整理成一节 5 分钟的 AI 快剪课程，强调结论和行动建议。",
  "videos": [
    {
      "fileId": "file_001",
      "url": "https://cdn.xxx.com/lesson-1.mp4",
      "durationSec": 320,
      "width": 1080,
      "height": 1920
    },
    {
      "fileId": "file_002",
      "url": "https://cdn.xxx.com/lesson-2.mp4",
      "durationSec": 420,
      "width": 1080,
      "height": 1920
    }
  ],
  "output": {
    "language": "zh",
    "style": "clean",
    "targetDurationSec": 360
  }
}
```

**Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "taskId": "task_001",
    "status": "completed",
    "chapters": [
      {
        "id": "c1",
        "title": "开场引入：提出问题",
        "summary": "快速抛出核心疑问，建立学习动机与期待。",
        "startSec": 0,
        "endSec": 72,
        "start": "00:00",
        "end": "01:12",
        "sourceVideoId": "file_001"
      },
      {
        "id": "c2",
        "title": "方法拆解：三步框架",
        "summary": "拆解主方法，明确每一步的关键动作与结果。",
        "startSec": 72,
        "endSec": 188,
        "start": "01:12",
        "end": "03:08",
        "sourceVideoId": "file_001"
      }
    ],
    "preview": {
      "estimatedDurationSec": 360,
      "coverText": "AI 快剪课程"
    }
  }
}
```

---

## 4. 前端渲染映射（与页面逻辑一致）

- **页面 2（确认素材）**
  - 使用 `videos[].url` + `durationSec` 渲染预览
- **页面 3（章节建议）**
  - 使用 `chapters[]` 中的 `title / summary / start / end`
- **页面 4（章节预览）**
  - 前端根据 `startSec / endSec` 用 ffmpeg 或本地切片展示
  - 如需后端直接切片，可新增 `clipUrl`
- **页面 5（成片预览）**
  - 使用 `preview` 信息做 mock 播放器展示

---

## 5. 可选扩展（后续）

- `clipUrl`: 后端直接返回章节切片链接
- `confidence`: AI 对章节划分的置信度
- `keywords`: AI 总结关键词
- `subtitle`: 自动生成字幕段落

---

## 6. 错误码示例

- `4001`: Invalid video url
- `4002`: Video duration missing
- `5001`: LLM service unavailable

---

## 7. 同步接口建议

- 建议超时：`30s~60s`
- 若超时可降级为异步：返回 `status: processing`，前端轮询 `GET /ai/compose/{taskId}`

