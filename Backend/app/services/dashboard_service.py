from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from app.db.models import Project, User, CheckInOut, UserProject, UserRole
from app.schemas.project import ProjectStatusCount

class DashboardService:
    def __init__(self, db:Session):
        self.db = db

    def get_employee_dashboard(self, user):
        projects = self.db.query(Project.status, func.count(Project.id).label("count")).filter(
            Project.id.in_(select(UserProject.project_id).filter(UserProject.employee_id == user.id))
        ).group_by(
            Project.status
        ).all()
        project_status_counts = [ProjectStatusCount(status=project.status, count=project.count) for project in projects]

        last_checkin = self.db.query(CheckInOut).filter(CheckInOut.user_id == user.id).order_by(desc(CheckInOut.id)).first()
        if last_checkin is None:
            last_checkin = None
        else:
            last_checkin = last_checkin.in_time
        # if out_time is available, then last_checkout is this record
        if last_checkin.out_time is not None:
            last_checkout = last_checkin.out_time
        else:
            # otherwise need to get the record with last out_time
            last_checkout = (self.db.query(CheckInOut).filter(CheckInOut.user_id == user.id).filter(CheckInOut.out_time != None).
                            order_by(desc(CheckInOut.id)).first())
            if last_checkout is None:
                last_checkout = None
            else:
                last_checkout = last_checkout.out_time
        return {"projects": project_status_counts, "last_checkin": last_checkin, "last_checkout": last_checkout}

    def get_employer_dashboard(self, user):
        employees = (self.db.query(User.active, func.count(User.id).label('count')).filter(User.parent_user_id == user.id).
                     group_by(User.active)).all()
        user_status_counts = [ProjectStatusCount(status=str(employees.active), count=employees.count) for employees in employees]

        projects = self.db.query(Project.status, func.count(Project.id).label("count")).filter(
            Project.user_id == user.id
        ).group_by(
            Project.status
        ).all()
        project_status_counts = [ProjectStatusCount(status=project.status, count=project.count) for project in projects]

        employee_projects = self.db.query(Project).filter(Project.user_id == user.id).all()
        project_hours = []
        for row in employee_projects:
            calculated_hours = 0 # to be implemented from CheckInOutService class by Medhaka
            project_hours.append({"project_id":row.id,"work_hours":row.work_hours, "calculated":calculated_hours})

        return {"employees":user_status_counts, "project_status": project_status_counts, "project_hours":project_hours}

    def get_admin_dashboard(self):
        employers = self.db.query(User.active, func.count(User.id).lable("count")).filter(
            User.role == UserRole.EMPLOYER
        ).group_by(User.active).all()
        employer_status_count = [ProjectStatusCount(status=str(employer.active), count=employer.count) for employer in employers]

        employees = self.db.query(User.active, func.count(User.id).label('count')).group_by(User.active).all()
        user_status_counts = [ProjectStatusCount(status=str(employees.active), count=employees.count) for employees in
                              employees]

        projects = self.db.query(Project.status, func.count(Project.id).label("count")).group_by(
            Project.status
        ).all()
        project_status_counts = [ProjectStatusCount(status=project.status, count=project.count) for project in projects]

        return {"employers": employer_status_count, "project_status": project_status_counts,
                "employees": user_status_counts}
