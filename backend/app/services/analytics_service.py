from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from app.utils.logger import get_logger
from app.utils.validators import normalize_dataframe, validate_schema

logger = get_logger(__name__)


NUMERIC_COLUMNS = [
    "impressions",
    "revenue_from_file_cpm",
    "revenue_column_in_file",
    "revenue",
    "cpm_provider",
    "cpm_from_file",
    "platform_fee",
    "revenue_share",
    "net_revenue",
    "imbalance",
]

DATE_COLUMNS = ["usage_date", "usage_report"]


@dataclass
class AnalyticsResult:
    provider_metrics: pd.DataFrame
    segment_metrics: pd.DataFrame
    platform_metrics: pd.DataFrame
    vertical_metrics: pd.DataFrame
    advertiser_metrics: pd.DataFrame
    imbalance_metrics: pd.DataFrame
    reporting_metrics: pd.DataFrame
    kpis: dict[str, float | int]


def _safe_divide(numerator: pd.Series, denominator: pd.Series) -> pd.Series:
    return numerator.divide(denominator.replace({0: pd.NA}))


def process_csv(file_path: str, dataset_id: str) -> AnalyticsResult:
    df = pd.read_csv(file_path)
    if df.empty:
        raise ValueError("CSV is empty")
    df = normalize_dataframe(df)
    validate_schema(df)

    for col in NUMERIC_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    for col in DATE_COLUMNS:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

    df["month"] = df["usage_date"].dt.to_period("M").astype(str)

    df["platform_fee"] = df.get("platform_fee", 0)
    df["revenue_share"] = df.get("revenue_share", 0)
    df["net_revenue"] = df.get("net_revenue", 0)

    df["cost"] = df["platform_fee"] + df["revenue_share"]

    provider_metrics = (
        df.groupby("data_provider", dropna=False)
        .agg(
            revenue=("revenue", "sum"),
            net_revenue=("net_revenue", "sum"),
            impressions=("impressions", "sum"),
            cost=("cost", "sum"),
        )
        .reset_index()
    )
    provider_metrics["roi"] = _safe_divide(
        provider_metrics["revenue"], provider_metrics["cost"]
    )

    segment_metrics = (
        df.groupby("segment_name", dropna=False)
        .agg(
            revenue=("revenue", "sum"),
            net_revenue=("net_revenue", "sum"),
            impressions=("impressions", "sum"),
        )
        .reset_index()
    )
    segment_metrics["efficiency"] = _safe_divide(
        segment_metrics["revenue"], segment_metrics["impressions"]
    )

    platform_metrics = (
        df.groupby("platform", dropna=False)
        .agg(
            revenue=("revenue", "sum"),
            platform_fee=("platform_fee", "sum"),
        )
        .reset_index()
    )
    platform_metrics["efficiency"] = _safe_divide(
        platform_metrics["revenue"], platform_metrics["platform_fee"]
    )

    advertiser_metrics = (
        df.groupby("advertiser", dropna=False)
        .agg(
            revenue=("revenue", "sum"),
            net_revenue=("net_revenue", "sum"),
            impressions=("impressions", "sum"),
        )
        .reset_index()
    )

    vertical_metrics = (
        df.groupby(["vertical", "month"], dropna=False)
        .agg(
            revenue=("revenue", "sum"),
            impressions=("impressions", "sum"),
        )
        .reset_index()
    )

    imbalance_metrics = (
        df.groupby("month", dropna=False)
        .agg(
            total_imbalance=("imbalance", "sum"),
            avg_imbalance=("imbalance", "mean"),
        )
        .reset_index()
    )

    report_delay_days = (
        (df["usage_report"] - df["usage_date"]).dt.days.fillna(0)
        if "usage_report" in df.columns and "usage_date" in df.columns
        else pd.Series([0] * len(df))
    )

    reporting_metrics = (
        df.assign(report_delay_days=report_delay_days)
        .groupby("month", dropna=False)
        .agg(avg_report_delay_days=("report_delay_days", "mean"))
        .reset_index()
    )

    total_revenue = float(df["revenue"].sum())
    total_net_revenue = float(df["net_revenue"].sum())
    total_impressions = int(df["impressions"].sum())
    total_data_providers = int(df["data_provider"].nunique())
    total_segments = int(df["segment_name"].nunique())

    avg_cpm = 0.0
    if total_impressions > 0:
        avg_cpm = float(total_revenue / (total_impressions / 1000))

    kpis = {
        "total_revenue": total_revenue,
        "total_net_revenue": total_net_revenue,
        "total_impressions": total_impressions,
        "total_data_providers": total_data_providers,
        "total_segments": total_segments,
        "avg_cpm": avg_cpm,
    }

    for df_metrics in [
        provider_metrics,
        segment_metrics,
        platform_metrics,
        vertical_metrics,
        advertiser_metrics,
        imbalance_metrics,
        reporting_metrics,
    ]:
        df_metrics.insert(0, "dataset_id", dataset_id)

    return AnalyticsResult(
        provider_metrics=provider_metrics,
        segment_metrics=segment_metrics,
        platform_metrics=platform_metrics,
        vertical_metrics=vertical_metrics,
        advertiser_metrics=advertiser_metrics,
        imbalance_metrics=imbalance_metrics,
        reporting_metrics=reporting_metrics,
        kpis=kpis,
    )
