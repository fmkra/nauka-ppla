#!/usr/bin/env python3
import chardet
from bs4 import BeautifulSoup
import json


OUTPUT_FILE = "questions.json"
PATH = lambda license: f"ulc.pytania.html/{license}.html"
LICENSES = ["ppla", "pplh", "bpl", "spl"]


def detect_encoding(filepath):
    with open(filepath, "rb") as f:
        raw_data = f.read(200000)
    result = chardet.detect(raw_data)
    return result["encoding"] or "utf-8"


def parse_html_file(filepath, encoding=None):
    if not encoding:
        encoding = detect_encoding(filepath)
        print(f"[AUTO] Detected encoding: {encoding}")
    else:
        print(f"[USER] Enforced encoding: {encoding}")

    with open(filepath, "r", encoding=encoding, errors="replace") as f:
        soup = BeautifulSoup(f, "html.parser")

    raw_rows = []
    for table in soup.find_all("table"):
        for row in table.find_all("tr"):
            cols = [td.get_text(" ", strip=True) for td in row.find_all("td")]
            if len(cols) == 7:
                raw_rows.append(cols)

    # Merge rows where the first column is enpty
    merged_rows = []
    buffer = None
    for row in raw_rows:
        if row[0].strip() == "":
            if buffer:
                buffer[2] += " " + row[2]
                for i in range(3, 7):
                    buffer[i] += " " + row[i]
        else:
            if buffer:
                merged_rows.append(buffer)
            buffer = row
    if buffer:
        merged_rows.append(buffer)

    return merged_rows

def main():
    merged_questions = {}
    first_name = None
    for license in LICENSES:
        input_file = PATH(license)
        if first_name is None:
            first_name = input_file
        questions = parse_html_file(input_file)
        
        for question in questions[1:]:
            external_id = question[1].replace(" ", "").strip()
            content = (external_id, *[a.strip() for a in question[2:7]])
            merged_questions.setdefault(content, []).append(license)

    output = []
    for (external_id, question, *answers), licenses in sorted(merged_questions.items(), key=lambda q: q[0][0]):
        output.append({
            "external_id": external_id,
            "question": question,
            "answers": answers,
            "licenses": licenses,
        })
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
