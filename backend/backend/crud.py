from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from backend.models import Report
from backend.schemas import ReportResponse
from typing import List, Optional
from backend import models
from datetime import datetime

def get_all_report_configs(db: Session) -> List[Report]:
    all_reports = db.query(Report).all()
    print("all_reports", all_reports)
    return db.query(Report).all()

def create_report_config_by_id(db: Session, id: int, report_data: Report) -> Optional[ReportResponse]:
    # Check if a report with the given ID already exists
    existing_report = db.query(Report).filter(Report.id == id).first()
    if existing_report:
        # If the report already exists, return it without creating a new one
        return ReportResponse.from_orm(existing_report)
    
    date_start = datetime.fromisoformat(report_data.date_start)
    date_end = datetime.fromisoformat(report_data.date_end)

    print("date_start", date_start)
    print("date_end", date_end)

    print("Type of date_start:", type(date_start))
    print("Type of date_end:", type(date_end))


    db_report = models.Report(
        id=id,
        date_start=date_start,
        date_end=date_end,
        metric=report_data.metric,
        name=report_data.name,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    # Create associated Tickers
    for ticker_data in report_data.tickers:
        db_ticker = models.Ticker(
            ticker=ticker_data.ticker,
            metric=ticker_data.metric,
            report_id=id,
        )
        print("db_ticker", db_ticker)
        db.add(db_ticker)

    db.commit()
    print("db_report", db_report)
    created_report = ReportResponse.from_orm(db_report)
    print("Created report:", created_report)
    return created_report

def update_report_config(db: Session, id: int, report_data: Report) -> Report:
    # TODO: Implement the logic to update the report with the provided data
    # Retrieve the existing report from the database
    existing_report = db.query(Report).filter(Report.id == id).first()
    if existing_report:
        # Update the report attributes with the new data
        for field, value in report_data.dict().items():
            setattr(existing_report, field, value)
        
        # Commit the changes to the database
        db.commit()
        db.refresh(existing_report)
        
        return existing_report
    else:
        raise ValueError(f"Report with id {id} not found")

def delete_report_config(db: Session, id: int) -> None:
    # TODO: Implement the logic to delete the report with the provided id
    report_to_delete = db.query(Report).filter(Report.id == id).first()
    if report_to_delete:
        db.delete(report_to_delete)
        db.commit()
    else:
        raise ValueError(f"Report with id {id} not found")