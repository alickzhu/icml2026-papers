# ICML 2026 论文导航 / ICML 2026 Paper Explorer

ICML 2026 录用论文(6341 篇)的可视化导航站,提供两种视图:

- 📂 **按分类(View A)** — 35 个主题方向(参考 ICLR 风格,左侧 sidebar 支持二级 subcat 展开)
- 🏢 **按机构(View B)** — 2074 个机构(高校 / 公司 / 研究院 / ...)→ 点开 → 该机构论文按分类展开;支持「仅一作 / 通讯(尾作)」过滤

每篇论文配有 5-8 句中文解读(`summary_zh`),由 LLM 子代理批量生成。分类标签已**全部中文化**。

## 流水线

1. **Pass A — 自由分类 + 中文解读**:6341 次 LLM 调用,允许涌现新类
2. **Pass B — 合并 + 入册**:阈值 ≥12 篇 → 入册为新 canonical 类;小众 / 离群类自动并入语义最近的现有类
3. **Pass C — 回溯重评**:对新类涉及的 paper 重新判类
4. **build_site_data** → `site/data/{papers,categories,orgs,meta}.json`

最终分类体系:35 个主题,Optimization 503 / AI for Science 402 / AI Safety 359 / LLM Agents 332 / LLM Inference 319 / Diffusion 283 / LLM Reasoning 259 / ...

## 本地预览

```bash
cd site && python -m http.server 8000
# 打开 http://localhost:8000        (按分类视图)
# 打开 http://localhost:8000/orgs.html (按机构视图)
```

## 部署

GitHub Pages,from `main` 分支根目录。

## 特性

- **按分类视图**:左侧 sidebar 支持 ▸ / ▾ 展开二级 subcat,顶部全局搜索 / oral / spotlight / 收藏筛选,分页 30 条 / 页
- **按机构视图**:左侧按机构 type 过滤,每个机构页内按 category 分组并折叠
- **「仅一作 / 通讯」按钮**:只保留该机构作为论文第一作者或通讯(尾作)的论文(粗略反映「主导工作」)
- **收藏**:基于 localStorage,跨刷新保留
- **暗色主题**:`#0f172a` 底色,`#3b82f6` 主色

## 数据规模

- 6341 篇论文
- 35 个主题分类(中文标签)
- 2074 个机构(924 高校 / 519 公司 / 178 研究院 / 27 政府 / 6 医院 / 3 独立 / 417 其他)
- 5805 regular + 536 spotlight

## License

MIT
