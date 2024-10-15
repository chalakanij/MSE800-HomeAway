from fastapi import FastAPI
from app.api.routes import user_routes
from fastapi_pagination import add_pagination

app = FastAPI()

app.include_router(user_routes.router)
add_pagination(app)
