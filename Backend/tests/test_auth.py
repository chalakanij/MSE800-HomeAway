from fastapi_pagination import response
from tests.test_conf import client

def test_user_registration(client):
    response = client.post("/employer_register", json={
        "email": "employer2@example.com",
        "password": "employer2",
        "title": "Mr",
        "first_name": "employer1",
        "last_name": "employer1",
        "phone_number": "0000000000",
        "company_name": "Company EMP1"
    })

    assert response.status_code == 200
    assert "id" in response.json()

def test_user_login(client):
    response = client.post("/login", data={"username": "employer2@example.com", "password": "employer2"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_invalid_login(client):
    response = client.post("/login", data={"username": "wronguser", "password": "wrongpass"})
    assert response.status_code == 401
