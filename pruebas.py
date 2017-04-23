import requests

data={"cols":10,"rows":10,"mines":5,"difficulty":"basic","time":"30","username":"juan"}
r = requests.post('http://127.0.0.1:8000/play_game/', data=data)
print r.status_code
print r.json()


