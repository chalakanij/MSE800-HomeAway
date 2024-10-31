from tests.test_conf import client, authenticated_client

def test_create_project(authenticated_client):
    project_data = {"title": "New Project", "description": "Project description", "work_hours":100}
    response = authenticated_client.post("/projects", json=project_data)
    assert response.status_code == 200
    assert response.json()["title"] == "New Project"
    assert response.json()["id"] >= 1


def test_assign_user_to_project(authenticated_client):
    # Assuming project_id is obtained dynamically
    response = authenticated_client.post("/projects/users/1", json={"employee_id": [1,2]})
    assert response.status_code == 200
    assert len(response.json()) > 0
