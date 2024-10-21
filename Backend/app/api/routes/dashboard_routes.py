from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi_pagination import Params, add_pagination
from fastapi_pagination.iterables import LimitOffsetPage
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.services.dashboard_service import DashboardService
from app.db import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.models import User
from fastapi_pagination import Page
from app.api.dependencies import get_db
from app.api.routes.user_routes import get_current_user


router = APIRouter()


@router.get("/employee_dashboard")
def get_employee_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return dashboard_service.get_employee_dashboard(current_user)

@router.get("/employer_dashboard")
def get_employee_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return dashboard_service.get_employer_dashboard(current_user)

