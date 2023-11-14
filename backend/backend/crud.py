from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from backend.models import Report
from typing import List, Optional

def get_all_report_configs(db: Session) -> List[Report]:
    all_reports = db.query(Report).all()
    print("all_reports", all_reports)
    return db.query(Report).all()

def create_report_config_by_id(db: Session, id: id) -> Optional[Report]:
    # Check if a report with the given ID already exists
    existing_report = db.query(Report).filter(Report.id == id).first()
    if existing_report:
        # If the report already exists, return it without creating a new one
        return existing_report

    # Convert ReportCreate Pydantic model to Report SQLAlchemy model
    db_report = Report(id=id, timestamp=func.now())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    print("report", db_report)
    return db_report

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