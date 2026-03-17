from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import pandas as pd

from app.utils.errors import ValidationError


REQUIRED_COLUMNS = {
    "id",
    "segment_id",
    "data_provider",
    "platform",
    "advertiser",
    "impressions",
    "revenue",
    "net_revenue",
    "usage_date",
    "usage_report",
    "vertical",
    "segment_name",
}

OPTIONAL_COLUMNS = {
    "publisher",
    "cpm_source",
    "revenue_from_file_cpm",
    "revenue_column_in_file",
    "cpm_provider",
    "cpm_from_file",
    "platform_fee",
    "revenue_share",
    "imbalance",
    "data_use",
    "tap_revenue",
    "taxonomy",
}


@dataclass
class SchemaValidationResult:
    normalized_columns: list[str]
    missing_required: list[str]
    extra_columns: list[str]


def normalize_column(name: str) -> str:
    normalized = (
        name.strip()
        .lower()
        .replace(" ", "_")
        .replace("-", "_")
        .replace("/", "_")
    )
    return normalized


def normalize_columns(columns: Iterable[str]) -> list[str]:
    return [normalize_column(col) for col in columns]


def validate_schema(df: pd.DataFrame) -> SchemaValidationResult:
    normalized = normalize_columns(df.columns)
    missing_required = sorted(REQUIRED_COLUMNS - set(normalized))
    extra_columns = sorted(
        set(normalized) - REQUIRED_COLUMNS - OPTIONAL_COLUMNS
    )

    if missing_required:
        raise ValidationError(
            f"Missing required columns: {', '.join(missing_required)}"
        )

    return SchemaValidationResult(
        normalized_columns=normalized,
        missing_required=missing_required,
        extra_columns=extra_columns,
    )


def normalize_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = normalize_columns(df.columns)
    return df
