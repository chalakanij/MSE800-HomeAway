import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.dependencies import get_db
from app.db import init_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models import Base

# Configure test database
TEST_DATABASE_URL = "sqlite:///./test.db"

# Initialize the database engine and sessionmaker for the test database
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply the override to use the test database in app
app.dependency_overrides[get_db] = override_get_db

# Set up and tear down the test database for the session
@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

# Fixture for the test client
@pytest.fixture(scope="module")
@pytest.mark.usefixtures("setup_database")
def client():
    with TestClient(app) as c:
        yield c

# Create an authenticated client fixture
@pytest.fixture
def authenticated_client(client):
    # Register a test user (employer)
    client.post("/employer_register", json={
        "email": "testuser@example.com",
        "password": "testpass",
        "title": "Mr",
        "first_name": "First",
        "last_name": "Last",
        "phone_number": "0000000000",
        "company_name": "Test Company"
    })

    # Log in to retrieve the access token
    response = client.post("/login", data={
        "username": "testuser@example.com",
        "password": "testpass"
    })
    token = response.json().get("access_token")
    client.headers.update({"Authorization": f"Bearer {token}"})
    return client
