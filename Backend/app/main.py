from fastapi import FastAPI
from app.api import routes
from app.db import init_db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [ "http://localhost:4200" ], # Angular app

app.add_middleware( CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],)


@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(routes.user_routes.router)

# Start the app using uvicorn
# uvicorn app.main:app --reload
