#!/usr/bin/env python3
import logging

from fastapi import FastAPI, HTTPException
from backend import models, schemas
import crud
import pandas_datareader.data as web
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import pandas as pd
from datetime import datetime

# set logging to display all messages INFO and above
logger = logging.getLogger()
logger.setLevel(logging.INFO)

db_session = models.init_db("sqlite:///:memory:")

logger.info("Starting FastAPI server")
app = FastAPI(title="Rails Takehome", version="0.1.0")

# CORS (Cross-Origin Resource Sharing) settings
origins = ["http://localhost:3000"]  # Add frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/reports")
async def get_all_report_configs() -> list[schemas.ReportBase]:
    try:
        report_configs = crud.get_all_report_configs(db_session)
        return report_configs or []
    except Exception as e:
        logger.error(e)

@app.get("/reports/{id}")
async def get_report_by_id(id: int) -> schemas.ReportResponse:
    try:
        report_config = crud.get_report(db_session, id=id)
        return report_config
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/reports/{id}")
async def get_report_config(id: int, body: schemas.ReportCreate) -> schemas.ReportResponse:
    try:
        report_config_by_id = crud.create_report_config_by_id(db=db_session, report_data=body, id=id)
        return report_config_by_id
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.put("/reports/{id}")
async def put_report_config(id: int, body: schemas.ReportCreate) -> None:
    # TODO:
    try: 
        updated_report = crud.update_report_config_by_id(db=db_session, id=id, report_data=body)
        return updated_report
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.delete("/reports/{id}")
async def delete_report_config(id: int) -> None:
    # TODO:
    try: 
        crud.delete_report_config(db=db_session, id=id)
        return None
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/reports/{id}/data")
async def get_report_data(id: int) -> Dict[str, Dict[str, Dict[str, float]]]:
    try:
        # using the pandas_datareader library to fetch data from the stooq 
        # financial data service for the Dow Jones Industrial Average (^DJI).
        report_info: schemas.ReportInfo = await get_report_by_id(id)
        start_date = report_info.date_start
        end_date = report_info.date_end

        tickers = report_info.tickers

        result = {}
        for ticker in tickers:
            try:
                # Fetch data using pandas_datareader
                f = web.DataReader(ticker.ticker, 'stooq')
                f = f.reset_index()

                # Convert the 'Date' column to datetime
                f['Date'] = pd.to_datetime(f['Date'])

                # Filter data based on the date range
                filtered_data = f[(f['Date'] >= start_date) & (f['Date'] <= end_date)]

                # Iterate over the filtered data
                for _, row in filtered_data.iterrows():
                    date_str = str(row['Date'].date())
                    close = row['Close']  # You can choose the desired metric
                    open = row['Open']
                    high = row['High']
                    low = row['Low']
                    volume = row['Volume']

                    # Add data to the result dictionary
                    if date_str not in result:
                        result[date_str] = {}
                    result[date_str][ticker.ticker] = {'close': close, 'open': open, 'high': high, 'low': low, 'volume': volume}

            except Exception as e:
                logger.error(e)
                raise HTTPException(status_code=404, detail=f"Error fetching data for {ticker}: {e}")
        return result
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/calendar/{date}/{ticker}")
def read_calendar_data(date: str, ticker: str):

    try:
        # Convert the date string to a datetime object
        target_date = datetime.strptime(date, "%Y-%m-%d")

        # Fetch stock data for the specified ticker from Stooq
        stock_data = web.DataReader(ticker, 'stooq')

        # Filter data for the target date
        filtered_data = stock_data[stock_data.index == target_date]

        # If no data for the target date, raise an exception
        if filtered_data.empty:
            raise HTTPException(status_code=404, detail=f"Data not found for the specified date {date} and ticker {ticker}")

        # Extract open, close, high, low values
        if 'Open' not in filtered_data.columns or 'Close' not in filtered_data.columns \
                or 'High' not in filtered_data.columns or 'Low' not in filtered_data.columns:
            raise HTTPException(status_code=500, detail=f"Invalid columns in the DataFrame for the specified date {date} and ticker {ticker}")

        open_value = filtered_data['Open'].iloc[0]
        close_value = filtered_data['Close'].iloc[0]
        high_value = filtered_data['High'].iloc[0]
        low_value = filtered_data['Low'].iloc[0]

        result = {"date": date, "ticker": ticker, "open": open_value, "close": close_value, "high": high_value, "low": low_value}
        return result
    except HTTPException as e:
        # Re-raise HTTPException to maintain the existing behavior
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
