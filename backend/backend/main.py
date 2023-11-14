#!/usr/bin/env python3
import logging

from fastapi import FastAPI, HTTPException
from backend import models, schemas
import crud

# set logging to display all messages INFO and above
logger = logging.getLogger()
logger.setLevel(logging.INFO)

db_session = models.init_db("sqlite:///:memory:")

logger.info("Starting FastAPI server")
app = FastAPI(title="Rails Takehome", version="0.1.0")


@app.get("/reports")
async def get_all_report_configs() -> list[schemas.ReportBase]:
    # TODO:
    try:
        report_configs = crud.get_all_report_configs(db_session)
        return report_configs or []
    except Exception as e:
        logger.error(e)


@app.post("/reports/{id}")
async def get_report_config(id: int) -> schemas.ReportBase:
    # TODO:
    try:
        report_config_by_id = crud.create_report_config_by_id(db=db_session, id=id)
        return report_config_by_id
    except Exception as e:
        logger.error(e)


@app.put("/reports/{id}")
async def put_report_config(id: int, body: schemas.ReportBase) -> None:
    # TODO:
    try: 
        updated_report = crud.update_report_config(db=db_session, id=id, report_data=body)
        return updated_report
    except Exception as e:
        logger.error(e)


@app.delete("/reports/{id}")
async def delete_report_config(id: int) -> None:
    # TODO:
    try: 
        crud.delete_report_config(db=db_session, id=id)
        return None
    except Exception as e:
        logger.error(e)


@app.get("/reports/{id}/data")
async def get_report_data(id: int) -> schemas.ReportData:
    # TODO: https://pandas-datareader.readthedocs.io/en/latest/remote_data.html#remote-data-stooq
    pass
