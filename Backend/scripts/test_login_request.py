import os
import sys
import requests

url = 'http://127.0.0.1:8000/onboarding/login'
payload = {"email": "xyz1@gmail.com", "password": "xyz1@pass"}

r = requests.post(url, json=payload)
print(r.status_code)
print(r.headers.get('content-type'))
print(r.text)
