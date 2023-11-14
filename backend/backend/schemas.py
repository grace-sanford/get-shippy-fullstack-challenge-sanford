from pydantic import BaseModel
from datetime import datetime
from pydantic import ValidationError


class ReportBase(BaseModel):
    try:
        # TODO:
        id: int
        timestamp: datetime
    except ValidationError as e:
        pass
class ReportCreate(BaseModel):
    timestamp: datetime


class ReportData(BaseModel):
    # TODO:
    pass
