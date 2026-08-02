from pathlib import Path

root = Path(r"c:/My workspace/12_personal/考研")
md = (root / "content" / "考研逻辑形象化知识点汇总.md").read_text(encoding="utf-8")
escaped = md.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
out = "export const LOGIC_VISUAL_SUMMARY = `" + escaped + "`;\n"
(root / "content" / "logic-visual-summary.ts").write_text(out, encoding="utf-8")
print("ok", len(out))
