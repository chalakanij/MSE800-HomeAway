from datetime import datetime, timezone
import re

from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.db.models import User, Project, ProjectStatus, UserProject, CheckInOut, CheckInOutStatus
from app.schemas.checkinout import CheckinUpdateRequest
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from starlette.status import HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST


class CheckInOutService:
    def __init__(self, db: Session):
        self.db = db

    def create_checkin(self , user, checkin_request):
        user_input = checkin_request.dict()
        user_input['status'] = CheckInOutStatus.CHECKIN
        if checkin_request.out_time is not None:
            self._validate_checkout(checkin_request.in_time, checkin_request.out_time)
            user_input["status"] = CheckInOutStatus.CHECKOUT
        user_input['user_id'] = user.id
        db_checkinout = CheckInOut(**user_input)
        self.db.add(db_checkinout)
        self.db.commit()
        self.db.refresh(db_checkinout)
        return db_checkinout

    def _validate_checkout(self, in_time:datetime, out_time:datetime):
        if in_time.tzinfo is None:
            in_time = in_time.replace(tzinfo=timezone.utc)
        if out_time.tzinfo is None:
            out_time = out_time.replace(tzinfo=timezone.utc)

        if in_time > out_time:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail=f"check out date must be after {out_time}")

    def get_current_checkin(self, user):
        checkinout = self.db.query(CheckInOut).filter(CheckInOut.user_id == user.id).order_by(desc(CheckInOut.id)).first()
        if checkinout is not None:
            if checkinout.status == CheckInOutStatus.CHECKIN:
                return checkinout

    def create_checkout(self , user, checkout_request):
        current_chekinout = self.get_current_checkin(user)
        if current_chekinout is None:
            raise HTTPException(status_code=404, detail="No checkin found!")
        self._validate_checkout(current_chekinout.in_time, checkout_request.out_time)
        current_chekinout.out_time = checkout_request.out_time
        current_chekinout.description = checkout_request.description
        current_chekinout.status = CheckInOutStatus.CHECKOUT
        self.db.commit()
        self.db.refresh(current_chekinout)
        return current_chekinout

    def get_checkinout(self, current_user, params, user_id:int = None, project_id:int = None):
        checkinouts = select(CheckInOut).filter(CheckInOut.user_id == current_user.id)
        if project_id is not None:
            checkinouts = checkinouts.filter(CheckInOut.project_id == project_id)
        if user_id is not None:
            checkinouts = checkinouts.filter(CheckInOut.user_id == user_id)
        return paginate(self.db, checkinouts, params)

    def update_checkin(self, user, checkin_request: CheckinUpdateRequest):
        checkin = self.db.query(CheckInOut).filter(CheckInOut.id == checkin_request.id).first()
        if checkin is not None:
            if checkin_request.in_time is not None:
                checkin.in_time = checkin_request.in_time
            if checkin_request.out_time is not None:
                checkin.out_time = checkin_request.out_time
            if checkin_request.description is not None:
                checkin.description = checkin_request.description
            if checkin_request.project_id is not None:
                checkin.project_id = checkin_request.project_id
            self._validate_checkout(checkin.in_time, checkin.out_time)
            self.db.commit()
            self.db.refresh(checkin)
            return checkin
        else:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="No chckin record found!")

    # calculate working hours based on criteria
    def calculate_hours(self, employee_id:int| None=None, project_id: int| None=None,
                        from_date:datetime | None=None, to_date:datetime | None=None):
        query = select(CheckInOut)
        if employee_id is not None:
            query = query.filter(CheckInOut.user_id == employee_id)
        if project_id is not None:
            query = query.filter(CheckInOut.project_id == project_id)
        if from_date is not None:
            query = query.filter(CheckInOut.in_time >= from_date)
        if to_date is not None:
            query = query.filter(CheckInOut.out_time <= to_date)
        result = self.db.execute(query).scalars().all()
        total_seconds = 0
        for row in result:
            if row.out_time is not None:
                time_difference = row.out_time - row.in_time
                total_seconds += time_difference.total_seconds()
        return total_seconds/60/60