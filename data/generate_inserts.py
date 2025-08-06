import json
import uuid
import re
import os


QUESTIONS_FILE = "questions.json"
LICENSES_FILE = "licenses.json"
EXPLANATIONS_DIR = "explanations"
OUTPUT_FILE = "inserts.sql"

LICENSE_FIRST_ID = 1
CATEGORY_FIRST_ID = 1

LICENSE_TABLE = "nauka-ppla_license"
CATEGORY_TABLE = "nauka-ppla_category"
QUESTION_TABLE = "nauka-ppla_question"
QUESTION_INSTANCE_TABLE = "nauka-ppla_question_instance"
EXPLANATION_TABLE = "nauka-ppla_explanation"


def main():
  questions = None
  with open(QUESTIONS_FILE, "r") as f:
    questions = json.load(f)

  data = None
  with open(LICENSES_FILE, "r") as f:
    data = json.load(f)

  explanationInserts = ""
  explanationIds = {}
  
  if os.path.exists(EXPLANATIONS_DIR):
    for filename in os.listdir(EXPLANATIONS_DIR):
      if filename.endswith('.md'):
        filepath = os.path.join(EXPLANATIONS_DIR, filename)
        with open(filepath, "r", encoding="utf-8") as f:
          lines = f.readlines()
          if len(lines) >= 2:
            # First line contains semicolon-separated IDs
            ids_line = lines[0].strip()
            external_ids = [id.strip() for id in ids_line.split(';') if id.strip()]
            
            # Rest of the file is the content
            content = ''.join(lines[1:]).strip()
            
            explanation_id = str(uuid.uuid4())
            explanationInserts += f"INSERT INTO \"{EXPLANATION_TABLE}\" (id, explanation) VALUES ('{explanation_id}', '{content}');\n"
            
            for external_id in external_ids:
              explanationIds[external_id] = explanation_id

  with open(OUTPUT_FILE, "w") as f:
    f.write("-- LICENSES\n\n")

    licenses = []
    for i, license in enumerate(data["licenses"]):
      licenseId = LICENSE_FIRST_ID + i
      licenses.append((licenseId, license["url"]))
      
      f.write(f"INSERT INTO \"{LICENSE_TABLE}\" (id, name, url, description, icon) VALUES ({licenseId}, '{license['name']}', '{license['url']}', '{license['description']}', '{license['icon']}');\n")

    f.write("\n\n-- CATEGORIES\n\n")

    i = 0
    categoryIds = {}
    for category in data["categories"]:
      for licenseId, licenseUrl in licenses:
        categoryId = CATEGORY_FIRST_ID + i
        i += 1

        examTime = category["examTime"][licenseUrl]
        examQuestions = category["examQuestions"][licenseUrl]
        categoryIds[(category["url"], licenseUrl)] = categoryId
        topics = '{' + ', '.join([f'"{topic}"' for topic in category["topics"]]) + '}'

        f.write(f"INSERT INTO \"{CATEGORY_TABLE}\" (id, name, url, color, description, \"licenseId\", \"examTime\", \"examQuestionCount\", icon, topics) VALUES ({categoryId}, '{category['name']}', '{category['url']}', '{category['color']}', '{category['description']}', {licenseId}, {examTime}, {examQuestions}, '{category['icon']}', '{topics}' );\n")
    
    f.write('\n\n-- EXPLANATIONS\n\n' + explanationInserts)

    f.write("\n\n-- QUESTIONS\n\n")

    questionInstances = ""
    for question in questions:
      questionId = str(uuid.uuid4())
      explanationId = explanationIds.get(question["external_id"])
      if explanationId is None:
        explanationId = "NULL"
      else:
        explanationId = f"'{explanationId}'"
        print(explanationId)
      f.write(f"INSERT INTO \"{QUESTION_TABLE}\" (id, \"externalId\", question, \"answerCorrect\", \"answerIncorrect1\", \"answerIncorrect2\", \"answerIncorrect3\", \"explanationId\") VALUES ('{questionId}', '{question['external_id']}', '{question['question']}', '{question['answers'][0]}', '{question['answers'][1]}', '{question['answers'][2]}', '{question['answers'][3]}', {explanationId});\n")

      categoryUrl = None
      for category in data["categories"]:
        category_regex = re.compile(category["externalIds"])
        if category_regex.match(question["external_id"]):
          categoryUrl = category["url"]
          break

      if categoryUrl is None:
        raise Exception(f"Question {question['external_id']} not found in any category")

      for licenseUrl in question["licenses"]:
        id = str(uuid.uuid4())
        categoryId = categoryIds[(categoryUrl, licenseUrl)]
        questionInstances += f"INSERT INTO \"{QUESTION_INSTANCE_TABLE}\" (id, \"categoryId\", \"questionId\") VALUES ('{id}', {categoryId}, '{questionId}');\n"

    f.write('\n\n-- QUESTION INSTANCES\n\n' + questionInstances)


if __name__ == "__main__":
  main()
