# IMPORTS
import spacy
import json
from flask import Flask, jsonify
import logging

nlp = spacy.load('en_core_web_trf')
app = Flask(__name__)
logging.basicConfig(filename='logs.log', encoding='utf-8', level=logging.INFO)


# GLOBAL VARIABLES

doc = nlp("hello")

state = "default"

gen_response = {
    "root": "",
    "det": "",
    "attr": "",
    "obj": ""
}

gen_response_list = []

response = {
    "message": "",
    "command_type": "",
    "item": "",
    "quantity": "",
    "structure": "",
    "location": ""
}

response_list = []

problems = []


# HELPER METHODS

def reset_gen_response():
    gen_response["root"] = ""
    gen_response["det"] = ""
    gen_response["attr"] = ""
    gen_response["obj"] = ""


def reset_response():
    response["message"] = ""
    response["command_type"] = ""
    response["item"] = ""
    response["quantity"] = ""
    response["structure"] = ""
    response["location"] = ""


def dep_search(word, dep):
    # Note, that the returned type is a list spacy tokens!
    results = [w for w in word.children if w.dep_ in dep]
    if results:
        return results
    else:
        return [""]


def item2id(item_name):
    try:
        f = open('blocks.json')
        blocks_data = json.load(f)
        f.close()
    except Exception as e:
        logging.error("item2id: " + str(e))
        return ""

    for i, block in enumerate(blocks_data):
        if block["displayName"].lower() == item_name:
            print(i, block["displayName"])
            return str(block["id"])

    return ""


# MAIN METHODS

@app.route('/')
def helloworld():
    logging.info("Hello World")
    return "Hello World!"


@app.route('/<query>')
def start(query):
    logging.info('start: query:' + str(query) + ", problems = " + str(problems))

    global gen_response_list
    global doc, response_list
    doc = nlp(query)

    reset_gen_response()
    gen_response_list = []

    if not problems:  # if the problems list is empty, then run the normal pipeline
        response_list = []
        preproc()
        if problems:
            return question_generator()
        else:
            return jsonify(response_list)
    else:
        return ask_proc()


def preproc():
    subsents = []

    # GET ALL THE KEYWORDS WITHIN THE SAME SENTENCE AND ADD THEM TO THE ROOTS LIST

    for sent in doc.sents:

        subsents.append(sent.root)

        # for t in [x for x in sent if x.dep_ == "conj"]:
        #     subsents.append(t)

        root = sent.root
        while True:
            temp = [r for r in root.children if r.dep_ == "conj"]
            if temp:
                subsents.append(temp[0])
                root = temp[0]
            else:
                break

    logging.info('preproc: subsents: ' + str(subsents))
    print(subsents)
    proc(subsents)


def proc(subsents):
    for root in subsents:

        # PATTERN 1
        for child in root.children:
            if child.dep_ == "dobj":
                gen_response["root"] = root.lemma_
                gen_response["obj"] = child.lemma_
                gen_response["det"] = dep_search(child, ["det", "nummod"])[0]
                gen_response["attr"] = dep_search(child, ["compound", "amod"])[0]
                gen_response_list.append(gen_response.copy())
                logging.info('proc: PATTERN1: ' + str(gen_response_list))
    print(gen_response_list)
    gen2spec()


def gen2spec():
    global response, state, response_list

    commands_dict = {
        "get": ["get", "bring", "fetch", "grab", "obtain", "give", "want"],
        "build": ["build", "construct", "erect", "assemble"],
        "destroy": ["destroy", "deconstruct"],
        "move": ["move", "go"],
        "dance": ["dance", "jam"],
        "craft": ["craft", "make", "create"],
        "heard": ["heard"]
    }

    gen_items = ["wood", "oak", "plank", "wool"]
    gen_quants = ["some", "few", "lot", "much", "many"]

    search_comm_dict = {l: k for k, v in commands_dict.items() for l in v}

    for gen_resp in gen_response_list:
        if search_comm_dict[gen_resp["root"]] == "get":
            print(gen_resp)

            response["command_type"] = "get"

            # Check if the item is in the Minecraft database, if not, check, if it is a generic item, if not, the item
            # can't be recognized
            try:
                f = open('blocks.json')
                blocks_data = json.load(f)
                f.close()
                response["item"] = str([x for x in blocks_data if x["name"] == gen_resp["obj"]][0]['id'])
            except:
                if gen_resp["obj"] in gen_items:
                    response["item"] = "??"
                    problems.append(gen_resp["obj"])

            # Check if quantity is a number, if not, then it's probably a generic quantity
            if gen_resp["det"].pos_ == "NUM":
                response["quantity"] = gen_resp["det"].text
            if gen_resp["det"].pos_ == "DET":
                response["quantity"] = "??"
                problems.append(gen_resp["det"].text)

        response_list.append(response.copy())
        reset_response()

        logging.info('gen2spec: response_list: ' + str(response_list))
        print(response_list)


def question_generator():
    global state, problems

    # Generate question with problem[0], then remove problem[0]

    question = {
        "message": "",
        "command_type": "QUESTION",
        "item": "",
        "quantity": "",
        "structure": "",
        "location": ""
    }

    counter = 0

    for resp in response_list:
        if resp["item"] == "??":
            question["message"] = "What do you mean by " + problems[0] + "?"
            state = counter
            break

        if resp["quantity"] == "??":
            question["message"] = "How much is " + problems[0] + "?"
            state = counter
            break
        counter += 1

    logging.info('question_generator: question: ' + str(question))
    return question
    # return question


def ask_proc():
    global state, problems
    print(response_list)
    blocks_list = []

    if response_list[int(state)]["item"] == "??":
        try:
            f = open('blocks.json')
            blocks_data = json.load(f)
            f.close()
            for item in blocks_data:
                blocks_list.append(item['name'])
        except Exception as e:
            print(str(e))
            logging.error(str(e))

        for sent in doc.sents:
            for word in sent:

                if word.text in blocks_list:
                    response_list[int(state)]["item"] = item2id(word.text)  # ! ITEM NAME SHOULD BE CONVERTED TO ID!!!
                    problems.pop(0)

        if not problems:  # if there are still problems, generate a new question
            logging.info('ask_proc: response_list: ' + str(response_list))
            return response_list
        else:
            logging.info('ask_proc: question_generator() called. problems: ' + str(problems))
            return question_generator()

    if response_list[int(state)]["quantity"] == "??":
        for sent in doc.sents:
            for word in sent:
                if word.pos_ in "NUM":
                    response_list[int(state)]["quantity"] = word.text
                    problems.pop(0)

        if not problems:  # if there are still problems, generate a new question
            logging.info('ask_proc: response_list: ' + str(response_list))
            return response_list
        else:
            logging.info('ask_proc: question_generator() called. problems: ' + str(problems))
            return question_generator()
