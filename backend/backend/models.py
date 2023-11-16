from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# SQLAlchemy models here
class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    date_start = Column(DateTime)
    date_end = Column(DateTime)
    metric = Column(String)
    name = Column(String)

    # Relationship with Ticker model
    tickers = relationship("Ticker", back_populates="report")

    def __repr__(self) -> str:
        return f"Report(id={self.id!r})"
    
    def as_dict(self):
        return {
            "id": self.id,
            "date_start": self.date_start,
            "date_end": self.date_end,
            "metric": self.metric,
            "name": self.name,
            "tickers": [ticker.as_dict() for ticker in self.tickers],
        }
class Ticker(Base):
    __tablename__ = "tickers"
    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String)
    metric = Column(String)

    # ForeignKey to relate Ticker with Report
    report_id = Column(Integer, ForeignKey('reports.id'))
    report = relationship("Report", back_populates="tickers")

    def __repr__(self) -> str:
        return f"Ticker(id={self.id!r}, ticker={self.ticker!r})"
    
    def as_dict(self):
        return {
            "id": self.id,
            "ticker": self.ticker,
            "metric": self.metric,
        }
    
def init_db(uri):
    engine = create_engine(uri)
    db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine),
    )
    Base.query = db_session.query_property()
    Base.metadata.create_all(bind=engine)
    return db_session
