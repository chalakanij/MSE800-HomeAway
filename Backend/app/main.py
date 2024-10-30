from fastapi import FastAPI
from app.api import routes
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware
from app.config import APP_NAME
from contextlib import asynccontextmanager


app = FastAPI(
    title=APP_NAME,
    description="Project based time tracking for employees as SaaS",
    version="1.0.0",
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
    contact={
        "name": "Support Team",
        "email": "homeaway_support@yoobee-college.ac.nz",
        "url": "https://www.homeaway_solutions.com/support",
    },
    terms_of_service="https://www.homeaway_solutions.com/terms",
)
origins = [ "http://localhost:4200" ], # Angular app



@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app.router.lifespan_context = lifespan

app.include_router(routes.user_routes.router)
app.include_router(routes.project_routes.router)
app.include_router(routes.checkinout_routes.router)
app.include_router(routes.dashboard_routes.router)

app.add_middleware( CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

# Start the app using uvicorn
# uvicorn app.main:app --reload
