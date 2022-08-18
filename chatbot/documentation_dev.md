# Documentation (of the code)

## Brief overview
When a _query_ is received, the `start()` method checks the `problems_list`. If the list is empty, the `preproc()` method is called. If there are multiple commands (intents) in one sentence, this method roughly separates them into subsentences, so each subsentence contains the words of one command (intent) only. The `proc()` method looks for dependency patterns in each subsentence, and will create a generic response (`gen_response`) for each recognized pattern, and string them into a list (`gen_response_list`). The `gen2spec()` method converts each `gen_response` of the `gen_response_list` into a specific `response`, that the Minecraft bot can understand.

If the `gen2spec()` function detects something unknown (e.g. instead of "oak log", the user requests "wood", or instead of "5" the user says "some", etc.) the unknown key of the `response` dictionary will be assigned "??" as a value, the unknown value will be appended to the `problems` list, and the `question_generator()` returns a question about the unknown value. 

Next time the `start()` function is called, the `problems_list` won't be empty, so the _query_ will be processed by the `ask_proc()` method. The `ask_proc()` method looks for certain words, or patterns, based on the unknown value, and if a pattern is matched, the "??" in the problematic `response`'s unknown value will be filled, and the first element of the `problems_list` will be removed. If the list becomes empty, the `response_list` is returned with all the completed responses, else, the `question_generator()` is called.

## Methods

### Main methods

#### start()
Receives the incoming _query_, and checks the `problems_list`. If the list is empty, the `preproc()` method is called, then the `problems_list` is checked again, to see if there were any unknown parameters in the _query_. If the list is still empty, the normal response(s) (`response_list`) will be returned, else, the `question_generator()` method will return a question about the unknown parameter in the _query_.

If the `problems_list` isn't empty in the beginning, the received _query_ will be processed by the `ask_proc()` method.

#### preproc()
Separates each sentence into subsentences if the _query_ contains multiple sentences, or if the root of a sentence has conjunctions. This broadly equates to separating multiple commands in one _query_.

This reduces the number of necessary patterns, because now each pattern only has to check a part of the original sentence.

Starting from the root of each sentence, if a child is in conjunction with the root, it is added to the `subsents` list. Then this child's children are checked and, and so on, until a child with no conjunctions is found. (The type of items in the `subsents` list is `spacy token`, meaning, that they not only contain text, but dependencies, POS tags, and their children.)

It's important to note, that right now this method assumes, that each word has only one conjunction.

Example: "Get me some wood, and build a house" -> [get, build]

Problems:
* If "then" is used instead of "and". (Get some wood, then come here)
* Sometimes "and then" doesn't work.

#### proc()
Generates a `gen_response` (_generic response_) for each subsentence based on dependency patterns, then strings them into a list (`gen_response_list`). All patterns have a description below.

#### gen2spec()
Converts the _generic responses_ to a specific response (later referred to as _response_) from the `gen_response_list`, and adds them to the `response_list`.
The _root_ of each _generic response_ is checked, and replaced by one of the categories in the `dict.json` file. This string will be the _response_'s "command_type". (e.g. "get", "bring" and "fetch" will be replaced by "get") After the "command_type" is determined, the correct parameters of the `response` can be filled. (e.g. if the command_type is "get", the "item" and "quantity" fields will be filled.) If in a response, an item or quantity can't be matched to values that the Minecraft Bot can understand, they will be replaced by "??" in the response, and appended to the `problems_list`.

#### question_generator()
Checks all the responses in the `response_list`, and if a value is "??", it will return a question, using the first item of the `problems_list`, and set the `state` variable, which stores the position of the problematic `response` in the `response_list`.

#### ask_proc()
This method processes the incoming _query_, if the previous response of the chatbot was a question. Based on the type of unknown value (item, quantity, etc.), this method will try to match a pattern to the incoming _query_ (e.g. if a quantity is in question, the pattern will look for numbers)

### Helper methods

#### reset_gen_response()
Sets all the values of `gen_response` to empty.

#### reset_gen_response()
Sets all the values of `response` to empty.

#### dep_search()
Receives a `word` (spacy token) and a `dep` (string) and returns all the children of the given word, which match the given dependency, in a list of spacy tokens.

## Patterns

#### Guidelines for creating new patterns

* Subsents!

#### Pattern 1
Finds the most basic intents (Build a big house; Get some stone; Bring 5 oak logs; etc.). 

