from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load module {name} from {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


extract_pdf_text = load_module(
    "extract_pdf_text",
    ROOT / "scripts" / "extract_pdf_text.py",
)
parse_questions_heuristic = load_module(
    "parse_questions_heuristic",
    ROOT / "scripts" / "parse_questions_heuristic.py",
)
build_question_seed = load_module(
    "build_question_seed",
    ROOT / "scripts" / "build_question_seed.py",
)


def test_safe_output_name_normalizes_pdf_path() -> None:
    name = extract_pdf_text.safe_output_name("逻辑/基础必修2-假言命题.pdf")
    assert name.endswith("_逻辑__基础必修2-假言命题.pdf.txt")
    assert len(name.split("_", 1)[0]) == 10


def test_parse_question_block_extracts_discrete_options() -> None:
    parsed = parse_questions_heuristic.parse_question_block(
        source_file="逻辑/基础必修2-假言命题.pdf",
        chapter_id="22222222-2222-2222-2222-222222222202",
        sort_order=1,
        source_page=3,
        block_lines=[
            "1. 如果今天下雨，那么地面会湿。以下哪项为真？",
            "A. 今天下雨",
            "B. 地面会湿",
            "C. 如果地面会湿，那么今天下雨",
            "D. 今天不下雨",
            "答案：B",
            "解析：由题干可知下雨推出地面湿。",
        ],
    )

    assert parsed is not None
    assert parsed["qtype"] == "mcq"
    assert parsed["answer"] == "B"
    assert parsed["needs_review"] is False
    assert parsed["source_page"] == 3
    assert [option["key"] for option in parsed["options"]] == ["A", "B", "C", "D"]


def test_parse_question_block_extracts_inline_options() -> None:
    parsed = parse_questions_heuristic.parse_question_block(
        source_file="数学/第1章 算术1  合订版.pdf",
        chapter_id="22222222-2222-2222-2222-222222222211",
        sort_order=2,
        source_page=7,
        block_lines=[
            "2、已知 2+3=5，则下列正确的是 A. 2 是偶数 B. 3 是偶数 C. 5 是偶数 D. 5 是质数",
            "【答案】D",
        ],
    )

    assert parsed is not None
    assert parsed["qtype"] == "mcq"
    assert parsed["answer"] == "D"
    assert parsed["needs_review"] is False
    assert parsed["stem"].startswith("已知 2+3=5")


def test_parse_question_block_supports_e_option() -> None:
    parsed = parse_questions_heuristic.parse_question_block(
        source_file="数学/第1章 算术1  合订版.pdf",
        chapter_id="22222222-2222-2222-2222-222222222211",
        sort_order=4,
        source_page=4,
        block_lines=[
            "例1：下列选项中正确的是(     )。",
            "A. 1",
            "B. 2",
            "C. 3",
            "D. 4",
            "E. 5",
            "答案：E",
        ],
    )

    assert parsed is not None
    assert [option["key"] for option in parsed["options"]] == ["A", "B", "C", "D", "E"]
    assert parsed["answer"] == "E"
    assert parsed["needs_review"] is False


def test_parse_question_block_stops_before_next_example_marker() -> None:
    parsed = parse_questions_heuristic.parse_question_block(
        source_file="数学/第1章 算术1  合订版.pdf",
        chapter_id="22222222-2222-2222-2222-222222222211",
        sort_order=5,
        source_page=4,
        block_lines=[
            "例1：一个正数的两个平方根分别为2a-1 和a-2，则这个正数为(     )。",
            "A. 1",
            "B. 4",
            "C. 9",
            "D. 16",
            "E. 25",
            "题型2：考查有理数和无理数的运算",
            "例2：设a与b之和的倒数的2027次方等于1，则a+b=(     )。",
        ],
    )

    assert parsed is not None
    assert parsed["stem"].startswith("一个正数的两个平方根")
    assert parsed["options"][-1]["text"] == "25"


def test_parse_question_block_marks_short_answer_for_review_when_missing_answer() -> None:
    parsed = parse_questions_heuristic.parse_question_block(
        source_file="英语写作/导学.pdf",
        chapter_id="22222222-2222-2222-2222-222222222225",
        sort_order=3,
        source_page=2,
        block_lines=[
            "3. 请用英语写一封建议信。",
            "要求包含问候语、建议内容和结尾。",
        ],
    )

    assert parsed is not None
    assert parsed["qtype"] == "short"
    assert parsed["answer"] == ""
    assert parsed["needs_review"] is True
    assert parsed["explanation"] == ""


def test_split_metadata_ignores_practice_answer_header_without_choice() -> None:
    content, answer, explanation = parse_questions_heuristic.split_metadata(
        [
            "【练习答案】",
            "1. 题目内容",
            "A. 甲",
            "B. 乙",
        ]
    )

    assert answer == ""
    assert content[0] == "【练习答案】"


def test_sql_text_escapes_single_quotes() -> None:
    assert build_question_seed.sql_text("Tom's choice") == "'Tom''s choice'"
