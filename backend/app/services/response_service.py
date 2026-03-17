from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.feature_store import get_kpis, query_table


def build_summary(dataset_id: str) -> dict[str, Any]:
    kpis = get_kpis(dataset_id) or {}

    provider_metrics = query_table("provider_metrics", dataset_id)
    segment_metrics = query_table("segment_metrics", dataset_id)
    vertical_metrics = query_table("vertical_metrics", dataset_id)
    platform_metrics = query_table("platform_metrics", dataset_id)

    vertical_df = pd.DataFrame(vertical_metrics)
    if not vertical_df.empty:
        vertical_agg = (
            vertical_df.groupby("vertical", dropna=False)["revenue"].sum().reset_index()
        )
        monthly_agg = (
            vertical_df.groupby("month", dropna=False)["revenue"].sum().reset_index()
        )
        revenue_by_vertical = vertical_agg.to_dict(orient="records")
        monthly_revenue = monthly_agg.to_dict(orient="records")
    else:
        revenue_by_vertical = []
        monthly_revenue = []

    charts = [
        {
            "id": "revenue_by_data_provider",
            "title": "Revenue Contribution by Data Provider",
            "type": "bar",
            "x_axis": "data_provider",
            "y_axis": "revenue",
            "data": provider_metrics,
        },
        {
            "id": "impressions_by_segment",
            "title": "Top Segments by Impressions",
            "type": "bar",
            "x_axis": "segment_name",
            "y_axis": "impressions",
            "data": segment_metrics,
        },
        {
            "id": "revenue_by_vertical",
            "title": "Revenue by Industry Vertical",
            "type": "pie",
            "data": revenue_by_vertical,
        },
        {
            "id": "monthly_revenue_trend",
            "title": "Monthly Revenue Trend",
            "type": "line",
            "x_axis": "month",
            "y_axis": "revenue",
            "data": monthly_revenue,
        },
        {
            "id": "platform_performance",
            "title": "Platform Revenue vs Platform Fee",
            "type": "scatter",
            "x_axis": "platform_fee",
            "y_axis": "revenue",
            "data": platform_metrics,
        },
    ]

    return {"summary": {"kpis": kpis, "charts": charts}}


def build_agent_payload(dataset_id: str) -> dict[str, Any]:
    return {
        "provider_metrics": query_table("provider_metrics", dataset_id),
        "segment_metrics": query_table("segment_metrics", dataset_id),
        "platform_metrics": query_table("platform_metrics", dataset_id),
        "vertical_metrics": query_table("vertical_metrics", dataset_id),
        "advertiser_metrics": query_table("advertiser_metrics", dataset_id),
        "imbalance_metrics": query_table("imbalance_metrics", dataset_id),
        "reporting_metrics": query_table("reporting_metrics", dataset_id),
    }


def aggregate_response(
    summary: dict[str, Any],
    insight_response: dict[str, Any] | None,
    anomaly_response: dict[str, Any] | None,
    rca_response: dict[str, Any] | None,
    simulation_response: dict[str, Any] | None,
) -> dict[str, Any]:
    return {
        **summary,
        "insights": insight_response.get("insights", []) if insight_response else [],
        "anomalies": anomaly_response.get("anomalies", [])
        if anomaly_response
        else [],
        "root_cause_analysis": rca_response.get("root_cause_analysis", [])
        if rca_response
        else [],
        "scenarios": simulation_response.get("scenarios", [])
        if simulation_response
        else [],
    }
