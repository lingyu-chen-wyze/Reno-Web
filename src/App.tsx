import { useEffect, useMemo, useState } from "react";
import { chapters } from "./data/mockChapters";

const steps = [
  {
    id: 1,
    title: "上传素材",
    desc: "提交视频与需求"
  },
  {
    id: 2,
    title: "确认素材",
    desc: "核对视频与文本"
  },
  {
    id: 3,
    title: "章节建议",
    desc: "AI 分段方案"
  },
  {
    id: 4,
    title: "章节预览",
    desc: "片段快速审核"
  },
  {
    id: 5,
    title: "成片预览",
    desc: "最终效果确认"
  }
];

const promptPlaceholder =
  "例如：我希望把这些素材整理成一节 5 分钟的 AI 快剪课程，强调结论和行动建议。";

const mockFinalVideo = "/videos/final-demo.mp4";

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function App() {
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const filePreviews = useMemo(() => {
    return files.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file)
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      filePreviews.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [filePreviews]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setFiles((prev) => {
      const incoming = Array.from(fileList);
      return [...prev, ...incoming].slice(0, 6);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const goNext = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
      }, 1200);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const goPrev = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {step !== 1 && (
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Reno</p>
              <p className="mt-2 max-w-xl text-xs text-slate-500">
                上传素材与提示词，获得 AI 分析的章节编排建议，快速完成课程剪辑。
              </p>
            </div>
          </header>
        )}

        <div className={`grid gap-6 ${step === 1 ? "grid-cols-1" : "lg:grid-cols-[220px_1fr]"}`}>
          {step !== 1 && (
            <aside className="hidden lg:block">
              <nav className="glass rounded-3xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  流程
                </p>
                <ul className="mt-6 space-y-4">
                  {steps.map((item) => {
                    const active = step === item.id;
                    const done = step > item.id;
                    return (
                      <li
                        key={item.id}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : done
                            ? "border-slate-300 bg-slate-100 text-slate-700 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]"
                              : "border-slate-200 bg-white text-slate-500"
                        }`}
                      >
                        <p className="text-xs uppercase tracking-[0.2em] opacity-70">
                          Step {item.id}
                        </p>
                        <p className="mt-1 font-medium">{item.title}</p>
                        <p className="mt-1 text-xs opacity-70">{item.desc}</p>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          )}

          <main
            className={`relative min-h-[620px] rounded-[32px] p-6 sm:p-10 ${
              step === 1 ? "bg-transparent shadow-none" : "glass"
            } ${step === 1 ? "overflow-hidden" : ""}`}
          >
            {step !== 1 && (
              <div className="absolute right-6 top-6 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                {steps.find((item) => item.id === step)?.title}
              </div>
            )}

            {step === 1 && (
              <section className="flex min-h-[560px] flex-col items-center justify-center gap-10 px-4 text-center">
                <div className="absolute left-6 top-6 text-sm uppercase tracking-[0.4em] text-slate-400">
                  Reno
                </div>
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-200/40 blur-[120px]" />
                  <div className="absolute right-0 top-32 h-56 w-56 rounded-full bg-indigo-200/40 blur-[120px]" />
                  <div className="absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-slate-200/50 blur-[120px]" />
                </div>

                <div className="flex max-w-2xl flex-col items-center gap-4">
                  <h2 className="font-display text-4xl text-slate-900 sm:text-5xl">
                    Reno
                  </h2>
                  <p className="text-sm text-slate-500">
                    制作你的 AI 课程
                  </p>
                </div>

                <div className="w-full max-w-3xl rounded-full border border-slate-200 bg-white px-4 py-3 shadow-[0_28px_70px_rgba(15,23,42,0.12)]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3 px-3 text-left">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
                        <UploadIcon />
                      </span>
                      <input
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder={promptPlaceholder}
                        className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-[0_16px_32px_rgba(15,23,42,0.28)]">
                      添加文件
                      <input
                        className="hidden"
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(event) => handleFiles(event.target.files)}
                      />
                    </label>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
                    {filePreviews.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 text-left"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400">{file.size}</p>
                        </div>
                        <button
                          type="button"
                          className="text-xs text-slate-400 hover:text-slate-700"
                          onClick={() => removeFile(index)}
                        >
                          移除
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {step === 2 && (
              <section className="flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-100 bg-white p-6">
                  <h2 className="text-lg font-semibold text-slate-900">确认素材</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    再次检查你上传的视频与描述，确认后即可开始 AI 分析。
                  </p>
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {filePreviews.map((file) => (
                      <div
                        key={file.url}
                        className="overflow-hidden rounded-2xl border border-slate-100"
                      >
                        <video
                          controls
                          src={file.url}
                          className="h-44 w-full object-cover"
                        />
                        <div className="flex items-center justify-between px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">{file.size}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                            Ready
                          </span>
                        </div>
                      </div>
                    ))}
                    {filePreviews.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                        还没有素材，返回上一步上传。
                      </div>
                    )}
                  </div>
                  <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">需求描述</p>
                    <p className="mt-2">
                      {prompt.trim().length > 0
                        ? prompt
                        : "暂无描述，将根据默认模板生成课程。"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    AI 章节编排建议
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    下面是 AI 根据素材分析的章节拆分方案（只读）。
                  </p>
                </div>

                <div className="grid gap-4">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="rounded-3xl border border-slate-100 bg-white p-5"
                    >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                          Chapter
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">
                          {chapter.title}
                        </h3>
                      </div>
                    </div>
                      <p className="mt-4 text-sm text-slate-600">
                        {chapter.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">章节片段预览</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    点击播放查看每一段视频片段效果。
                  </p>
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                  {chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="overflow-hidden rounded-3xl border border-slate-100 bg-white"
                    >
                      <video
                        controls
                        src={chapter.clip}
                        className="h-52 w-full object-cover"
                      />
                      <div className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {chapter.title}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {chapter.start} - {chapter.end}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">
                          {chapter.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {step === 5 && (
              <section className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">成片预览</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    模拟竖屏播放器展示最终短视频课程效果。
                  </p>
                </div>

                <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
                  <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-6">
                    <h3 className="text-sm font-semibold text-slate-900">课程信息</h3>
                    <dl className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <dt>视频数量</dt>
                        <dd className="font-medium text-slate-800">{files.length || 4}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>章节数量</dt>
                        <dd className="font-medium text-slate-800">{chapters.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>建议时长</dt>
                        <dd className="font-medium text-slate-800">约 6 分钟</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>风格</dt>
                        <dd className="font-medium text-slate-800">高效精炼</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="relative mx-auto w-full max-w-[320px]">
                    <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />
                    <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-slate-900 p-3 shadow-2xl">
                      <div className="rounded-[28px] bg-black">
                        <video
                          controls
                          src={mockFinalVideo}
                          className="h-[520px] w-full rounded-[24px] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                {step !== 1 ? (
                  <button
                    type="button"
                    onClick={goPrev}
                    className="rounded-full border border-slate-200 px-5 py-2 text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700"
                  >
                    上一步
                  </button>
                ) : (
                  <span />
                )}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  {step} / {steps.length}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {step === 5 ? "完成" : "下一步"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
          <div className="glass rounded-3xl px-8 py-6 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
            <p className="mt-4 text-sm font-medium text-slate-800">AI 正在分析视频...</p>
            <p className="mt-1 text-xs text-slate-500">请稍候片刻</p>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 16V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
