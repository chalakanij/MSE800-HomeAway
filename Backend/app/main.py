from fastapi import FastAPI
from app.api import routes
from app.db import init_db

app = FastAPI()

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(routes.user_routes.router)

# Start the app using uvicorn
# uvicorn app.main:app --reload
