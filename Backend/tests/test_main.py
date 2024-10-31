from tests.test_conf import client

def test_health_check(client):
    response = client.get("/")
    assert response.status_code == 404
    #assert response.json() == {"message": "Welcome to the API!"}
