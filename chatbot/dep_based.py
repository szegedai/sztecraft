import spacy
from flask import Flask, jsonify
import warnings
from quantulum3 import parser
import json

app = Flask(__name__)

warnings.filterwarnings("ignore")

nlp = spacy.load('en_core_web_trf')

with open('d.json') as f:
    data = json.load(f)

# GLOBAL VARIABLES

state = "default"
doc = nlp("hi")

gen_response = {
    "root": "",
    "det": "",
    "attr": "",
    "obj": ""
}

response = {
    "message": "",
    "command_type": "",
    "item": "",
    "quantity": "",
    "structure": "",
    "location": ""
}

# Logs unknown or not specific parameters of the response
unknown_params = {
    "message": "",
    "command_type": "",
    "item": "",
    "quantity": "",
    "structure": "",
    "location": ""
}


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


# MAIN METHODS

@app.route('/')
def index():
    return 'Hello!'


# This is the beginning of the program
@app.route('/<id>/<query>')
def preproc(id, query):
    print(query)
    global doc
    doc = nlp(query)

    if state == "default":
        reset_response()
        reset_gen_response()

        proc()
        return gen2spec()

    else:
        return ask_proc()


# Process the query if the program is in the "default" state. This method generates a generic response, based on
# dependency patterns. This response has to be further processed (in gen2spec).
# (e.g: If the question is "How many stone do you want?", then we are looking for a number in the response)
def proc():
    global doc
    reset_gen_response()

    for sent in doc.sents:

        # PATTERN 4
        if len(list(sent.root.children)) == 1 and list(sent.root.children)[0].dep_ == "advmod":
            gen_response["root"] = sent.root.lemma_
            gen_response["obj"] = list(sent.root.children)[0].lemma_
        else:
            for child in sent.root.children:
                # PATTERN 1
                if child.dep_ == "dobj":
                    gen_response["root"] = sent.root.lemma_
                    gen_response["obj"] = child.lemma_

                    for child2 in child.children:
                        if child2.dep_ == "det" or child2.dep_ == "nummod":
                            gen_response["det"] = child2.lemma_
                        if child2.dep_ == "amod" or child2.dep_ == "compound":
                            gen_response["attr"] = child2.lemma_

                # PATTERN 3
                if child.dep_ == "prep":
                    for child2 in child.children:
                        if child2.dep_ == "pobj":
                            gen_response["root"] = sent.root.lemma_
                            gen_response["obj"] = child2.lemma_

                            for child3 in child2.children:
                                if child3.dep_ == "amod" or child3.dep_ == "compound":
                                    gen_response["attr"] = child3.lemma_

                if child.dep_ == "xcomp":
                    gen_response["root"] = sent.root.lemma_

                # PATTERN 2
                if child.dep_ == "nsubj":
                    gen_response["obj"] = child.lemma_

                    for child2 in child.children:
                        if child2.dep_ == "det" or child2.dep_ == "nummod":
                            gen_response["det"] = child2.lemma_
                        if child2.dep_ == "amod" or child2.dep_ == "compound":
                            gen_response["attr"] = child2.lemma_

    return


def gen2spec():
    global state

    search_comm_dict = {l: k for k, v in data["commands_dict"][0].items() for l in v}
    search_item_dict = {l: k for k, v in data["items_dict"][0].items() for l in v}
    search_quant_dict = {l: k for k, v in data["quant_dict"][0].items() for l in v}

    # GET command
    if search_comm_dict[gen_response["root"]] == "get":
        response["command_type"] = search_comm_dict[gen_response["root"]]

        # Get name of the item from gen_response (e.g: if attr = "oak" and obj = "log" -> item="oak log";
        # if attr = "" and obj = "cobblestone" -> item = "cobblestone")
        if gen_response["attr"]:
            response["item"] = gen_response["attr"] + "_" + gen_response["obj"]
        else:
            response["item"] = gen_response["obj"]

        if gen_response["det"]:
            response["quantity"] = gen_response["det"]

        # Decide if given item is specific or not
        # (e.g: specific = cobblestone, oak log, etc, non-specific (generic) = wood, wool, etc)
        if search_item_dict[response["item"]] == "gen_item":
            state = "ask"
            unknown_params["item"] = "??"

        # Decide if given quantity is specific or not
        # (e.g: specific = 5, 10, 64, etc, non-specific (generic) = some, few, many, etc)
        if response["quantity"] == "" or search_quant_dict[response["quantity"]] == "gen_quant":
            state = "ask"
            unknown_params["quantity"] = "??"



        # BUILD command
    if search_comm_dict[gen_response["root"]] == "build":
        response["command_type"] = search_comm_dict[gen_response["root"]]
        response["structure"] = gen_response["obj"]

    # MOVE command
    if search_comm_dict[gen_response["root"]] == "move":
        response["command_type"] = search_comm_dict[gen_response["root"]]
        response["location"] = gen_response["obj"]

    # If the state is unchanged (default), then just return the filled out response json
    if state == "ask":
        return ask()
    else:
        return jsonify([response])


# Process the incoming answer to questions
# (e.g: If the question is "How many stone do you want?", then we are looking for a number in the response)
def ask_proc():
    global doc, state

    for sent in doc.sents:
        if state == "item":
            #működjön több compoundra is, parsolja őket össze, működjön 1 szavasra is

            if len(list(sent.root.children)) == 1 and list(sent.root.children)[0].dep_ == "compound":
                response["item"] = list(sent.root.children)[0].lemma_ + "_" + sent.root.lemma_
                unknown_params["item"] = ""
                return ask()


        if state == "quantity":
            for word in sent:
                if word.pos_ == "NUM":
                    response["quantity"] = word.text
                    unknown_params["quantity"] = ""
                    return ask()
    return ask()


# Generating the questions based on the missing parameters
def ask():
    global state
    no_more_unknown = True
    for key in unknown_params:
        if unknown_params[key] == "??":
            no_more_unknown = False
            if key == "item":  # question if the item generic
                unknown_params["command_type"] = "ask"
                unknown_params["message"] = "What kind of " + response["item"] + " do you want?"
                state = "item"
                return jsonify([unknown_params])
            if key == "quantity":  # question if the generic or missing
                unknown_params["command_type"] = "ask"
                unknown_params["message"] = "How many " + response["item"] + " do you want?"
                state = "quantity"
                return jsonify([unknown_params])
    if no_more_unknown:
        state = "default"
        return jsonify([response])


@app.route('/status/<status>')
def feedback(status):
    if int(status) == 200:
        response["message"] = "Job done"
    else:
        response["message"] = "Mission failed, we'll get 'em next time"
    return jsonify([response])

