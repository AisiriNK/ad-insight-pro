from __future__ import annotations

import duckdb

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class DuckDBClient:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._conn: duckdb.DuckDBPyConnection | None = None

    def connect(self) -> duckdb.DuckDBPyConnection:
        if self._conn is None:
            self._conn = duckdb.connect(self.db_path)
            self._initialize_tables()
        return self._conn

    def _initialize_tables(self) -> None:
        conn = self._conn
        if conn is None:
            return

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS datasets (
                dataset_id VARCHAR PRIMARY KEY,
                file_path VARCHAR,
                rows_processed BIGINT,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS provider_metrics (
                dataset_id VARCHAR,
                data_provider VARCHAR,
                revenue DOUBLE,
                net_revenue DOUBLE,
                impressions BIGINT,
                cost DOUBLE,
                roi DOUBLE
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS segment_metrics (
                dataset_id VARCHAR,
                segment_name VARCHAR,
                revenue DOUBLE,
                net_revenue DOUBLE,
                impressions BIGINT,
                efficiency DOUBLE
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS platform_metrics (
                dataset_id VARCHAR,
                platform VARCHAR,
                revenue DOUBLE,
                platform_fee DOUBLE,
                efficiency DOUBLE
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS vertical_metrics (
                dataset_id VARCHAR,
                vertical VARCHAR,
                month VARCHAR,
                revenue DOUBLE,
                impressions BIGINT
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS advertiser_metrics (
                dataset_id VARCHAR,
                advertiser VARCHAR,
                revenue DOUBLE,
                net_revenue DOUBLE,
                impressions BIGINT
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS imbalance_metrics (
                dataset_id VARCHAR,
                month VARCHAR,
                total_imbalance DOUBLE,
                avg_imbalance DOUBLE
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS reporting_metrics (
                dataset_id VARCHAR,
                month VARCHAR,
                avg_report_delay_days DOUBLE
            )
            """
        )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analysis_cache (
                dataset_id VARCHAR PRIMARY KEY,
                response_json VARCHAR,
                created_at TIMESTAMP DEFAULT NOW()
            )
            """
        )


client = DuckDBClient(settings.duckdb_path)
