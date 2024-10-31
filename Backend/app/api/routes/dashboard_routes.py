from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.services.dashboard_service import DashboardService
from fastapi import Depends
from app.db.models import User,UserRole
from app.api.dependencies import get_db
from app.api.dependencies import get_current_user
from app.api.dependencies import role_required

from app.schemas.dashboard import EmployeeDashboard, EmployerDashboard, AdminDashboard

router = APIRouter()


@router.get("/employee_dashboard", dependencies=[Depends(role_required([UserRole.EMPLOYEE]))],
            response_model=EmployeeDashboard, description="Require: EMPLOYEE")
def get_employee_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return dashboard_service.get_employee_dashboard(current_user)

@router.get("/employer_dashboard", dependencies=[Depends(role_required([UserRole.EMPLOYER]))],
            response_model=EmployerDashboard, description="Require: EMPLOYER")
def get_employee_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return dashboard_service.get_employer_dashboard(current_user)

@router.get("/admin_dashboard", dependencies=[Depends(role_required([UserRole.ADMIN]))],
            response_model=AdminDashboard, description="Require: ADMIN")
def get_employee_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    dashboard_service = DashboardService(db)
    return dashboard_service.get_admin_dashboard(current_user)