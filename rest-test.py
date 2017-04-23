import requests

data={"cols":10,"rows":10,"mines":5,"difficulty":"basic","time":"30","username":"juan"}

data={'username':'admin','password':'rootrooat'}
#r = requests.post('http://127.0.0.1:8000/api/v1play_game/', data=data)
r = requests.post('http://127.0.0.1:8000/api-token-auth/', data=data)
print r.status_code
#['__attrs__', '__bool__', '__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__getstate__', '__hash__', '__init__', '__iter__', '__module__', '__new__', '__nonzero__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__setstate__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_content', '_content_consumed', 'apparent_encoding', 'close', 'connection', 'content', 'cookies', 'elapsed', 'encoding', 'headers', 'history', 'is_permanent_redirect', 'is_redirect', 'iter_content', 'iter_lines', 'json', 'links', 'ok', 'raise_for_status', 'raw', 'reason', 'request', 'status_code', 'text', 'url']

print r.content


