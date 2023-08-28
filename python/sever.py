from sanic import Sanic
from sanic.response import json

app = Sanic("BAD_AI")


@app.route('/')
def index(request):
    return json({
        'server library': 'sanic',
        'ai library': 'tensorflow'
    })


app.run(host="0.0.0.0", port=8000, single_process=True)
