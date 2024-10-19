from fastapi import FastAPI
from app.api.routes import user_routes, project_routes, checkinout_routes
from fastapi_pagination import add_pagination

app = FastAPI()

app.include_router(user_routes.router)
app.include_router(project_routes.router)
app.include_router(checkinout_routes.router)
add_pagination(app)
