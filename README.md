# ICML 2026 论文导航 / ICML 2026 Paper Explorer

ICML 2026 录用论文(6341 篇)的可视化导航站,提供两种视图:

- 📂 **按分类(View A)** — 91 个研究方向(32 个种子 + 5 个 Pass B 新涌现 + 54 个长尾)
- 🏢 **按机构(View B)** — 2074 个机构(高校 / 公司 / 研究院 / ...)→ 点开 → 该机构论文按分类展开

每篇论文配有 5-8 句中文解读(`summary_zh`),由 LLM 子代理批量生成。

## 流水线

1. **Pass A — 自由分类 + 中文解读**:6341 次 LLM 调用,允许涌现新类
2. **Pass B — 合并 + 入册**:阈值 ≥8 篇 → 入册为新 canonical 类
3. **Pass C — 回溯重评**:对新类涉及的 4080 篇 paper 重新判类
4. **build_site_data** → `site/data/{papers,categories,orgs,meta}.json`

## 本地预览

```bash
cd site && python -m http.server 8000
# 打开 http://localhost:8000        (按分类视图)
# 打开 http://localhost:8000/orgs.html (按机构视图)
```

## 部署

GitHub Pages from `site/` 子目录。

## 数据规模

- 6341 篇论文
- 91 个主题分类
- 2074 个机构(924 高校 / 519 公司 / 178 研究院 / 27 政府 / 6 医院 / 3 独立 / 417 其他)
- 5805 regular + 536 spotlight

## License

MIT
