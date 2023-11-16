from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from backend.models import Report
from backend.schemas import ReportResponse, ReportCreate
from typing import List, Optional
from backend import models
from datetime import datetime

def get_all_report_configs(db: Session) -> List[Report]:
    all_reports = db.query(Report).all()
    return db.query(Report).all()

def get_report(db: Session, id: int) -> ReportResponse:
    existing_report = db.query(Report).filter(Report.id == id).first()
    if (existing_report):
        return ReportResponse.from_orm(existing_report)
    else:
        raise ValueError(f"Report with id {id} not found")


def create_report_config_by_id(db: Session, id: int, report_data: Report) -> Optional[ReportResponse]:
    # Check if a report with the given ID already exists
    existing_report = db.query(Report).filter(Report.id == id).first()
    if existing_report:
        # If the report already exists, return it without creating a new one
        return ReportResponse.from_orm(existing_report)
    
    date_start = datetime.fromisoformat(report_data.date_start)
    date_end = datetime.fromisoformat(report_data.date_end)

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
        db.add(db_ticker)

    db.commit()
    created_report = ReportResponse.from_orm(db_report)
    return created_report

def update_report_config_by_id(db: Session, id: int, report_data: ReportCreate) -> ReportResponse:
    # Retrieve the existing report from the database
    existing_report = db.query(models.Report).filter(models.Report.id == id).first()

    if existing_report:
        # Update the report attributes with the new data
        for field, value in dict(report_data).items():
            # Convert string representations to datetime objects if the field is a date field
            if field in ["date_start", "date_end"] and value is not None:
                setattr(existing_report, field, datetime.fromisoformat(value))

            elif field == "tickers":
                # Handle the 'tickers' field separately
                existing_tickers = {ticker.ticker: ticker for ticker in existing_report.tickers}
                for ticker_data in value:
                    db_ticker = existing_tickers.get(ticker_data.ticker)

                    if db_ticker:
                        # Update existing ticker
                        db_ticker.metric = ticker_data.metric
                    else:
                        # Create new ticker
                        db_ticker = models.Ticker(
                            ticker=ticker_data.ticker,
                            metric=ticker_data.metric,
                            report_id=id,
                        )
                        existing_report.tickers.append(db_ticker)
                        db.add(db_ticker)
            else:
                setattr(existing_report, field, value)

        # Commit the changes to the database
        db.commit()
        db.refresh(existing_report)
        updated_report = ReportResponse.from_orm(existing_report)

        return updated_report
    else:
        raise ValueError(f"Report with id {id} not found")

def delete_report_config(db: Session, id: int) -> None:
    report_to_delete = db.query(Report).filter(Report.id == id).first()
    if report_to_delete:
        db.delete(report_to_delete)
        db.commit()
    else:
        raise ValueError(f"Report with id {id} not found")