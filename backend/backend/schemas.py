from pydantic import BaseModel
from datetime import datetime
from pydantic import ValidationError
from typing import List, Optional
from pydantic import validator

class Ticker(BaseModel):
    ticker: str
    metric: str

class ReportBase(BaseModel):
    id: int
    date_start: datetime
    date_end: datetime
    metric: str
    name: str
    tickers: List[Ticker]

    class Config:
        orm_mode = True
        from_orm = True

class TickerCreate(BaseModel):
    ticker: str
    metric: str

class ReportCreate(BaseModel):
    date_start: Optional[str] = None
    date_end: Optional[str] = None
    metric: str
    name: str
    tickers: List[TickerCreate]

    def validate_date_format(cls, value):
        if value is not None:
            try:
                # Attempt to parse the date string
                date_obj = datetime.strptime(value, "%Y-%m-%d")

                # If the input contains "T", assume it's a complete datetime string
                if "T" in value:
                    return value

                # If no time is provided, append "T00:00:00"
                return f"{date_obj.date()}T00:00:00"
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.")
        return value
    class Config:
        orm_mode = True

class ReportData(BaseModel):
    ticker: str
    date: datetime
    value: float
    metric: str

class ReportDataList(BaseModel):
    reports: List[ReportData]

class TickerResponse(BaseModel):
    id: int
    ticker: str
    metric: str

class ReportResponse(BaseModel):
    id: int
    date_start: datetime
    date_end: datetime
    metric: str
    name: str
    tickers: Optional[List[TickerResponse]]

    @classmethod
    def from_orm(cls, report):
        return cls(
            id=report.id,
            date_start=report.date_start.isoformat(), 
            date_end=report.date_end.isoformat(),  
            metric=report.metric,
            name=report.name,
            tickers=[
                TickerResponse(
                    id=ticker.id,
                    ticker=ticker.ticker,
                    metric=ticker.metric
                ) for ticker in report.tickers
            ] if report.tickers else None
        )