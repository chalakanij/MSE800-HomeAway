# from __future__ import annotations
from fastapi import APIRouter, Depends, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import TYPE_CHECKING, Optional, Any, Type, TypeVar, Generic, ForwardRef, Annotated, Union, List
import app.database as Database
import app.dependencies as Dependency
import app.controllers as Controller
import app.schemas as Schema

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/access-token", auto_error=True)
auth_controller = Controller.AuthController()

@router.post("/auth/access-token", response_model=Schema.Token, status_code=status.HTTP_200_OK, dependencies=[])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(Database.connection.get_db)) -> Schema.Token:
    temp_access_token = auth_controller.login_for_access_token(form_data, db)
    return temp_access_token

'''
# @router.get("/auth/user", response_model=Union[Schema.SystemUser, None], status_code=status.HTTP_200_OK, dependencies=[Depends(Dependency.CurrentUserGetter(is_required=True))])
# def get_current_user(current_user: Union[Schema.SystemUser, None] = Depends(Dependency.CurrentUserGetter(is_required=True))) -> Union[Schema.SystemUser, None]:
#     return current_user
'''

@router.get("/auth/user", response_model=Union[Schema.SystemUser, None], status_code=status.HTTP_200_OK, dependencies=[])
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(Database.connection.get_db)) -> Union[Schema.SystemUser, None]:
    temp_current_user = auth_controller.get_current_user(token, db)
    return temp_current_user


__all__ = [
    'router'
]