from flask import Flask, Response, request
from flask_cors import CORS
import random
import json


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

@app.route('/', methods=["GET"])
def index():
  return Response('AIC Backend API is successfully working\n', 200)

@app.route('/run/competition/demo', methods=["POST"])
def run_comp_demo():
  try:
    req = json.loads(request.get_data().decode('utf-8'))
  except json.decoder.JSONDecodeError:
    return {'score': -5000}
  if 'body' in req:
    try:
      result = min(max(float(req['body']), -1000), 1000)
    except:
      result = -5000
  else:
    result = -5000
  return {'score': result}

if __name__ == "__main__":
  app.run('0.0.0.0', 4000, True)
