# README

## Installation

```bash
pip install -r requirements.txt
```
or
```bash
pip install -U spacy
python -m spacy download en_core_web_trf
pip install flask
```

## Usage

```bash
export FLASK_APP=dep_based.py
export FLASK_ENV=development
flask run # to run only on this machine
flask run --host=0.0.0.0 # to run on localhost
```
To test the chatbot in a browser: `<url>/<id>/<query>`.

Example: `http://127.0.0.1:5000/123/bring me some wood`.

##Usage on Windows:
```bash
$env:FLASK_APP="PATH"
#for example: 
$env:FLASK_APP="C:\Users\vanko\PycharmProjects\chatbot_ver2\chatbot\dep_based.py" 

flask run # to run only on this machine
flask run --host=0.0.0.0 # to run on localhost
```

