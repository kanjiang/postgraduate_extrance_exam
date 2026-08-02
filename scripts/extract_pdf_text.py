from __future__ import annotations

import hashlib
import json
from pathlib import Path

import fitz


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "考研材料"
OUT = ROOT / "content" / "questions" / "raw"
MANIFEST = OUT / "manifest.json"


def safe_output_name(rel_path: str) -> str:
    digest = hashlib.md5(rel_path.encode("utf-8")).hexdigest()[:10]
    safe = rel_path.replace("/", "__").replace(" ", "_")
    return f"{digest}_{safe}.txt"


def extract_pdf_text(pdf_path: Path) -> str:
    parts: list[str] = []
    with fitz.open(pdf_path) as document:
        for index, page in enumerate(document):
            parts.append(f"\n\n--- page {index + 1} ---\n")
            parts.append(page.get_text("text"))
    return "".join(parts)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest: list[dict[str, str]] = []

    for pdf in sorted(SRC.rglob("*.pdf")):
        rel = pdf.relative_to(SRC).as_posix()
        output_name = safe_output_name(rel)
        output_path = OUT / output_name
        output_path.write_text(extract_pdf_text(pdf), encoding="utf-8")
        manifest.append({"pdf": rel, "raw": output_name})
        print(f"wrote {output_name}")

    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"manifest {MANIFEST.relative_to(ROOT).as_posix()}")


if __name__ == "__main__":
    main()
