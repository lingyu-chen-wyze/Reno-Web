export type Chapter = {
  id: string;
  title: string;
  start: string;
  end: string;
  summary: string;
  clip: string;
};

export const chapters: Chapter[] = [
  {
    id: "c1",
    title: "开场引入：提出问题",
    start: "00:00",
    end: "01:12",
    summary: "快速抛出核心疑问，建立学习动机与期待。",
    clip: "/videos/sample-1.mp4"
  },
  {
    id: "c2",
    title: "方法拆解：三步框架",
    start: "01:12",
    end: "03:08",
    summary: "拆解主方法，明确每一步的关键动作与结果。",
    clip: "/videos/sample-2.mp4"
  },
  {
    id: "c3",
    title: "案例演示：真实场景",
    start: "03:08",
    end: "05:02",
    summary: "通过真实案例强化理解，展示前后对比。",
    clip: "/videos/sample-3.mp4"
  },
  {
    id: "c4",
    title: "总结引导：下一步",
    start: "05:02",
    end: "05:45",
    summary: "总结知识点，并提示用户的下一步行动。",
    clip: "/videos/sample-4.mp4"
  }
];
