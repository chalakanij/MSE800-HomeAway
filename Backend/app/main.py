from fastapi import FastAPI
from app.api import routes
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [ "http://localhost:4200" ], # Angular app



@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(routes.user_routes.router)
app.include_router(routes.project_routes.router)
app.include_router(routes.checkinout_routes.router)
app.include_router(routes.dashboard_routes.router)

app.add_middleware( CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)

# Start the app using uvicorn
# uvicorn app.main:app --reload
