from __future__ import annotations

import json
import re
import shutil
import uuid
from collections import defaultdict
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
QUESTIONS_ROOT = ROOT / "content" / "questions"
RAW_DIR = QUESTIONS_ROOT / "raw"
BANK_DIR = QUESTIONS_ROOT / "bank"
MAP_PATH = QUESTIONS_ROOT / "pdf_chapter_map.json"
MANIFEST_PATH = RAW_DIR / "manifest.json"
QUESTION_NAMESPACE = uuid.UUID("9f8b8104-36be-4f7f-b701-418d6f77ac35")

QUESTION_START_RE = re.compile(
    r"^(?:第\s*(\d{1,3})\s*题|[（(]?\s*(\d{1,3})\s*[)）\.、．])\s*(.+)$"
)
EXAMPLE_START_RE = re.compile(r"^(?:例\s*(\d+)\s*[:：]|【练习\s*(\d+)】)\s*(.+)$")
OPTION_LINE_RE = re.compile(r"^([A-EＡ-Ｅ])[\.\、．:：]\s*(.+)$")
INLINE_OPTION_RE = re.compile(
    r"(?:^|\s)([A-EＡ-Ｅ])[\.\、．:：]\s*(.*?)(?=(?:\s+[A-EＡ-Ｅ][\.\、．:：])|$)"
)
ANSWER_RE = re.compile(
    r"^(?:【答案】|参考答案|正确答案|答案|答)\s*[:：]?\s*([A-EＡ-Ｅ])(?:\b|$)"
)
ANSWER_TEXT_RE = re.compile(r"^(?:【答案】|参考答案|正确答案|答案|答)\s*[:：]?\s*(.+)$")
EXPLANATION_RE = re.compile(r"^(?:解析|答案解析|详解|【解析】)\s*[:：】]?\s*(.*)$")
PAGE_RE = re.compile(r"^--- page (\d+) ---$")
EMBEDDED_START_RE = re.compile(r"(?:例\s*\d+\s*[:：]|【练习\s*\d+】)")

CHAPTER_META = {
    "22222222-2222-2222-2222-222222222201": {"subject": "logic", "title": "联言与选言"},
    "22222222-2222-2222-2222-222222222202": {"subject": "logic", "title": "假言命题"},
    "22222222-2222-2222-2222-222222222203": {"subject": "logic", "title": "简单命题与概念"},
    "22222222-2222-2222-2222-222222222204": {"subject": "logic", "title": "综合推理"},
    "22222222-2222-2222-2222-222222222205": {"subject": "logic", "title": "削弱"},
    "22222222-2222-2222-2222-222222222206": {"subject": "logic", "title": "支持、假设与其他"},
    "22222222-2222-2222-2222-222222222211": {"subject": "math", "title": "算术"},
    "22222222-2222-2222-2222-222222222212": {"subject": "math", "title": "代数式"},
    "22222222-2222-2222-2222-222222222213": {"subject": "math", "title": "集合与函数"},
    "22222222-2222-2222-2222-222222222214": {"subject": "math", "title": "方程与不等式"},
    "22222222-2222-2222-2222-222222222215": {"subject": "math", "title": "数列"},
    "22222222-2222-2222-2222-222222222216": {"subject": "math", "title": "应用题"},
    "22222222-2222-2222-2222-222222222217": {"subject": "math", "title": "平面几何"},
    "22222222-2222-2222-2222-222222222218": {"subject": "math", "title": "解析几何"},
    "22222222-2222-2222-2222-222222222219": {"subject": "math", "title": "立体几何"},
    "22222222-2222-2222-2222-22222222221a": {"subject": "math", "title": "排列组合"},
    "22222222-2222-2222-2222-22222222221b": {"subject": "math", "title": "概率"},
    "22222222-2222-2222-2222-22222222221c": {"subject": "math", "title": "数据描述"},
    "22222222-2222-2222-2222-222222222221": {"subject": "english2", "title": "语法与长难句"},
    "22222222-2222-2222-2222-222222222222": {"subject": "english2", "title": "阅读理解"},
    "22222222-2222-2222-2222-222222222223": {"subject": "english2", "title": "完形填空"},
    "22222222-2222-2222-2222-222222222224": {"subject": "english2", "title": "英译汉"},
    "22222222-2222-2222-2222-222222222225": {"subject": "english2", "title": "写作"},
    "22222222-2222-2222-2222-222222222226": {"subject": "english2", "title": "词汇积累"},
}


def normalize_space(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def normalize_lookup_key(value: str) -> str:
    return normalize_space(value.replace("\\", "/"))


def normalize_choice_key(value: str) -> str:
    return value.translate(str.maketrans("ＡＢＣＤＥ", "ABCDE")).upper()


def stable_question_id(source_file: str, sort_order: int) -> str:
    return str(uuid.uuid5(QUESTION_NAMESPACE, f"{source_file}#{sort_order}"))


def load_pdf_map() -> dict[str, str]:
    entries = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    mapping: dict[str, str] = {}
    for entry in entries:
        mapping[normalize_lookup_key(entry["pdf"])] = entry["chapter_id"]
    return mapping


def split_metadata(block_lines: list[str]) -> tuple[list[str], str, str]:
    content: list[str] = []
    explanation_parts: list[str] = []
    answer = ""
    in_explanation = False

    for raw_line in block_lines:
        line = normalize_space(raw_line)
        if not line:
            continue

        explanation_match = EXPLANATION_RE.match(line)
        if explanation_match:
            in_explanation = True
            tail = normalize_space(explanation_match.group(1))
            if tail:
                explanation_parts.append(tail)
            continue

        if in_explanation:
            explanation_parts.append(line)
            continue

        answer_match = ANSWER_RE.match(line)
        if answer_match:
            answer = normalize_choice_key(answer_match.group(1))
            continue

        answer_text_match = ANSWER_TEXT_RE.match(line)
        if answer_text_match:
            text_answer = normalize_space(answer_text_match.group(1))
            if text_answer:
                answer = text_answer
            continue

        content.append(line)

    return content, answer, "\n".join(explanation_parts).strip()


def strip_question_number(text: str) -> str:
    match = QUESTION_START_RE.match(text)
    if match:
        return normalize_space(match.group(3))
    example_match = EXAMPLE_START_RE.match(text)
    if example_match:
        return normalize_space(example_match.group(3))
    return text


def is_question_start(text: str) -> bool:
    return QUESTION_START_RE.match(text) is not None or EXAMPLE_START_RE.match(text) is not None


def should_stop_option_capture(text: str) -> bool:
    if is_question_start(text):
        return True
    return bool(
        re.match(
            r"^(?:模块|题型\d+|考点\d+|真题|总结|你的坚持|[一二三四五六七八九十]+、|\d+\s*$)",
            text,
        )
    )


def split_embedded_starts(text: str) -> list[str]:
    positions = [match.start() for match in EMBEDDED_START_RE.finditer(text) if match.start() > 0]
    if not positions:
        return [text]

    parts: list[str] = []
    start = 0
    for position in positions:
        segment = text[start:position].strip()
        if segment:
            parts.append(segment)
        start = position
    tail = text[start:].strip()
    if tail:
        parts.append(tail)
    return parts or [text]


def parse_discrete_options(lines: list[str]) -> tuple[str, list[dict[str, str]]]:
    stem_lines: list[str] = []
    options: list[dict[str, str]] = []
    current_option: dict[str, str] | None = None
    saw_option = False

    for index, line in enumerate(lines):
        candidate = strip_question_number(line) if index == 0 else line
        option_match = OPTION_LINE_RE.match(candidate)
        if option_match:
            saw_option = True
            if current_option is not None:
                options.append(current_option)
            current_option = {
                "key": normalize_choice_key(option_match.group(1)),
                "text": normalize_space(option_match.group(2)),
            }
            continue

        if saw_option and current_option is not None:
            if should_stop_option_capture(candidate):
                break
            current_option["text"] = normalize_space(f"{current_option['text']} {candidate}")
        else:
            stem_lines.append(candidate)

    if current_option is not None:
        options.append(current_option)

    return normalize_space("\n".join(stem_lines).replace("\n", " ")), options


def parse_inline_options(lines: list[str]) -> tuple[str, list[dict[str, str]]]:
    joined = normalize_space(" ".join(lines))
    joined = strip_question_number(joined)
    matches = list(INLINE_OPTION_RE.finditer(joined))
    if len(matches) < 2:
        return joined, []

    stem = normalize_space(joined[: matches[0].start()].strip())
    options = [
        {
            "key": normalize_choice_key(match.group(1)),
            "text": normalize_space(match.group(2)),
        }
        for match in matches
    ]
    return stem, options


def parse_question_block(
    *,
    source_file: str,
    chapter_id: str,
    sort_order: int,
    source_page: int | None,
    block_lines: list[str],
) -> dict[str, Any] | None:
    content_lines, answer, explanation = split_metadata(block_lines)
    if not content_lines:
        return None

    stem, options = parse_discrete_options(content_lines)
    if len(options) < 2:
        stem, options = parse_inline_options(content_lines)

    if len(options) >= 2:
        qtype = "mcq"
        normalized_answer = normalize_choice_key(answer) if re.fullmatch(r"[A-EＡ-Ｅ]", answer) else ""
        needs_review = (
            len(options) < 4
            or normalized_answer == ""
            or len({item["key"] for item in options}) != len(options)
            or stem == ""
        )
        return {
            "id": stable_question_id(source_file, sort_order),
            "chapter_id": chapter_id,
            "qtype": qtype,
            "stem": stem,
            "options": options,
            "answer": normalized_answer,
            "explanation": explanation,
            "source_file": source_file,
            "source_page": source_page,
            "needs_review": needs_review,
            "sort_order": sort_order,
        }

    if answer == "":
        return None

    return {
        "id": stable_question_id(source_file, sort_order),
        "chapter_id": chapter_id,
        "qtype": "short",
        "stem": stem,
        "options": None,
        "answer": answer,
        "explanation": explanation,
        "source_file": source_file,
        "source_page": source_page,
        "needs_review": True,
        "sort_order": sort_order,
    }


def extract_blocks(text: str) -> list[tuple[int | None, list[str]]]:
    blocks: list[tuple[int | None, list[str]]] = []
    current_page: int | None = None
    current_start_page: int | None = None
    current_lines: list[str] = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        page_match = PAGE_RE.match(line)
        if page_match:
            current_page = int(page_match.group(1))
            continue

        if not line:
            if current_lines:
                current_lines.append("")
            continue

        for fragment in split_embedded_starts(line):
            normalized = normalize_space(fragment)
            if is_question_start(normalized):
                if current_lines:
                    blocks.append((current_start_page, current_lines))
                current_lines = [normalized]
                current_start_page = current_page
                continue

            if current_lines:
                current_lines.append(normalized)

    if current_lines:
        blocks.append((current_start_page, current_lines))

    return blocks


def write_bank(groups: dict[str, list[dict[str, Any]]]) -> None:
    if BANK_DIR.exists():
        shutil.rmtree(BANK_DIR)
    BANK_DIR.mkdir(parents=True, exist_ok=True)

    for chapter_id, questions in sorted(groups.items()):
        chapter = CHAPTER_META[chapter_id]
        subject_dir = BANK_DIR / chapter["subject"]
        subject_dir.mkdir(parents=True, exist_ok=True)
        output_path = subject_dir / f"{chapter_id}.json"
        output_path.write_text(
            json.dumps(questions, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )


def main() -> None:
    pdf_map = load_pdf_map()
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)

    processed_pdfs = 0
    total_questions = 0

    for entry in manifest:
        pdf_rel = entry["pdf"]
        raw_name = entry["raw"]
        chapter_id = pdf_map.get(normalize_lookup_key(pdf_rel))
        if chapter_id is None:
            raise KeyError(f"No chapter mapping for {pdf_rel}")

        raw_path = RAW_DIR / raw_name
        text = raw_path.read_text(encoding="utf-8")
        processed_pdfs += 1

        local_questions: list[dict[str, Any]] = []
        for _, (page, block_lines) in enumerate(extract_blocks(text), start=1):
            question = parse_question_block(
                source_file=pdf_rel,
                chapter_id=chapter_id,
                sort_order=len(local_questions) + 1,
                source_page=page,
                block_lines=block_lines,
            )
            if question is not None:
                local_questions.append(question)

        for question in local_questions:
            total_questions += 1
            grouped[chapter_id].append(
                {
                    **question,
                    "sort_order": len(grouped[chapter_id]) + 1,
                }
            )

        print(f"{pdf_rel}: {len(local_questions)} questions")

    write_bank(grouped)
    print(f"processed_pdfs={processed_pdfs}")
    print(f"total_questions={total_questions}")


if __name__ == "__main__":
    main()
