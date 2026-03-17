from __future__ import annotations

import json
from typing import Any

import duckdb
import pandas as pd

from app.db.duckdb_client import client
from app.utils.logger import get_logger

logger = get_logger(__name__)


def _conn() -> duckdb.DuckDBPyConnection:
    return client.connect()


def register_dataset(dataset_id: str, file_path: str, rows_processed: int) -> None:
    conn = _conn()
    conn.execute(
        "INSERT INTO datasets (dataset_id, file_path, rows_processed) VALUES (?, ?, ?)",
        [dataset_id, file_path, rows_processed],
    )


def insert_dataframe(table: str, df: pd.DataFrame) -> None:
    if df.empty:
        return
    conn = _conn()
    conn.register("df_view", df)
    conn.execute(f"INSERT INTO {table} SELECT * FROM df_view")
    conn.unregister("df_view")


def get_dataset_file(dataset_id: str) -> str | None:
    conn = _conn()
    result = conn.execute(
        "SELECT file_path FROM datasets WHERE dataset_id = ?", [dataset_id]
    ).fetchone()
    return result[0] if result else None


def get_cached_analysis(dataset_id: str) -> dict[str, Any] | None:
    conn = _conn()
    result = conn.execute(
        "SELECT response_json FROM analysis_cache WHERE dataset_id = ?",
        [dataset_id],
    ).fetchone()
    if not result:
        return None
    return json.loads(result[0])


def set_cached_analysis(dataset_id: str, response: dict[str, Any]) -> None:
    conn = _conn()
    conn.execute(
        "INSERT OR REPLACE INTO analysis_cache (dataset_id, response_json) VALUES (?, ?)",
        [dataset_id, json.dumps(response)],
    )


def query_table(table: str, dataset_id: str) -> list[dict[str, Any]]:
    conn = _conn()
    result = conn.execute(
        f"SELECT * FROM {table} WHERE dataset_id = ?",
        [dataset_id],
    ).fetchdf()
    return result.to_dict(orient="records")


def get_kpis(dataset_id: str) -> dict[str, Any] | None:
    conn = _conn()
    result = conn.execute(
        """
        SELECT
            SUM(revenue) AS total_revenue,
            SUM(net_revenue) AS total_net_revenue,
            SUM(impressions) AS total_impressions,
            COUNT(DISTINCT data_provider) AS total_data_providers
        FROM provider_metrics
        WHERE dataset_id = ?
        """,
        [dataset_id],
    ).fetchone()

    if not result:
        return None

    total_revenue, total_net_revenue, total_impressions, total_data_providers = result
    total_segments = conn.execute(
        "SELECT COUNT(DISTINCT segment_name) FROM segment_metrics WHERE dataset_id = ?",
        [dataset_id],
    ).fetchone()[0]

    avg_cpm = 0.0
    if total_impressions and total_impressions > 0:
        avg_cpm = float(total_revenue / (total_impressions / 1000))

    return {
        "total_revenue": float(total_revenue or 0),
        "total_net_revenue": float(total_net_revenue or 0),
        "total_impressions": int(total_impressions or 0),
        "total_data_providers": int(total_data_providers or 0),
        "total_segments": int(total_segments or 0),
        "avg_cpm": avg_cpm,
    }
