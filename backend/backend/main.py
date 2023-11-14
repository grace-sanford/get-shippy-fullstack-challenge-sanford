#!/usr/bin/env python3
import logging

from fastapi import FastAPI, HTTPException
from backend import models, schemas
import crud
import pandas_datareader.data as web

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
        print("report_configs", report_configs)
        return report_configs or []
    except Exception as e:
        logger.error(e)


@app.post("/reports/{id}")
async def get_report_config(id: int, body: schemas.ReportCreate) -> schemas.ReportResponse:
    # TODO:
    try:
        print("before")
        report_config_by_id = crud.create_report_config_by_id(db=db_session, report_data=body, id=id)
        print("report_config_by_id", report_config_by_id)
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
    try:
        # using the pandas_datareader library to fetch data from the stooq 
        # financial data service for the Dow Jones Industrial Average (^DJI).
        f = web.DataReader('^DJI', 'stooq')
        f = f.reset_index()
        print("f", f)
        
        result = {}

        for date, group in f.groupby('Date'):
            date_str = str(date.date())  # Convert date to string
            result[date_str] = {}

        #Iterate over rows in the group
        for _, row in group.iterrows():
            ticker = '^DJI'
            value = row['Value']
            metric = row['Metric']

            result[date_str][ticker] = {'value': value, 'metric': metric}
        
        return result
    except Exception as e:
        logger.error(e)
