from fastapi import FastAPI, Depends, HTTPException, status, security
from fastapi.middleware.cors import CORSMiddleware

tags_metadata = [
    {
        "name": "users",
        "description": "**Operations** with users.",
        "externalDocs": {
            "description": "external docs",
            "url": "https://fastapi.tiangolo.com/",
        },
    },
]

app = FastAPI(
    title="Project Management System",
    description="Employee work tracking system",
    summary="",
    version="1.0.0",
    terms_of_service="",
    contact={
        "name": "Home Away Team, Youbee College, 2024/July",
        "url": "",
        "email": "homeaway@yoobeecollege.ac.nz",
    },
    license_info={
        "name": "Apache 2.0",
        "identifier": "MIT",
    },
    openapi_tags=tags_metadata,
    swagger_ui_parameters = {
        "docExpansion": "none",
        # "defaultModelsExpandDepth": -1
    },

)

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
