from tests.test_conf import client, authenticated_client

def test_get_user_details(authenticated_client):
    response = authenticated_client.get("/profile")
    assert response.status_code == 200
    assert "email" in response.json()

def test_update_user_details(authenticated_client):
    response = authenticated_client.put("/profile", json={"title":"Mr.", "first_name":"First Name", "last_name":"updated", "phone_number": "1111111111"})
    assert response.status_code == 200
    assert response.json()["phone_number"] == "1111111111"
