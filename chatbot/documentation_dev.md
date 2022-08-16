# Documentation (of the code)

## Brief overview

When a _query_ is received, the `start()` method checks the `state` of the program. If the program is in the _default_ state, the `preproc()` method is called. If there are multiple commands (intents) in one sentence, this method roughly separates them into subsentences, so each subsentence contains the words of one command (intent) only. The `proc()` method looks for dependency patterns in each subsentence, and will create a generic response (`gen_response`) for each recognized pattern, and string them into a list (`gen_response_list`). The `gen2spec()` method converts each `gen_response` of the `gen_response_list` into a specific `response`, that the Minecraft bot can understand.

## Methods

### Main methods

#### start()

Receives the incoming _query_, and checks the `state` of the program. The `state` of the program is _default_ if the last _query_ was successfully processed and done by the Minecraft bot.

#### preproc()

Separates each sentence into subsentences if the _query_ contains multiple sentences, or if the root of a sentence has conjunctions. This broadly equates to separating multiple commands in one _query_.

This reduces the number of necessary patterns, because now each pattern only has to check a part of the original sentence.

Starting from the root of each sentence, if a child is in conjunction with the root, it is added to the `subsents` list. Then this child's children are checked and, and so on, until a child with no conjunctions is found. (The type of items in the `subsents` list is `spacy token`, this means, that these they not only contain text, but dependencies, POS tags, and their children.)

It's important to note, that right now this method assumes, that each word has only one conjunction.

Example: "Get me some wood, and build a house" -> [get, build]

Problems:
* If "then" is used instead of "and". (Get some wood, then come here)
* Sometimes "and then" doesn't work.

#### proc()

Generates a `gen_response` (_generic response_) for each subsentence based on dependency patterns, then strings them into a list (`gen_response_list`). All patterns have a description below.


### Helper methods


## Patterns

#### Guidelines for creating new patterns

* Subsents!

#### Pattern 1

Finds the most basic intents (Build a big house; Get some stone; Bring 5 oak logs; etc.). 

