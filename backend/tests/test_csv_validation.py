import pandas as pd
import pytest

from app.utils.validators import validate_schema
from app.utils.errors import ValidationError


def test_validate_schema_success():
    df = pd.DataFrame(
        {
            "id": [1],
            "segment_id": ["s1"],
            "data_provider": ["p1"],
            "platform": ["google"],
            "advertiser": ["adv"],
            "impressions": [100],
            "revenue": [1000],
            "net_revenue": [900],
            "usage_date": ["2025-01-01"],
            "usage_report": ["2025-01-02"],
            "vertical": ["health"],
            "segment_name": ["test"],
        }
    )

    result = validate_schema(df)
    assert result.missing_required == []


def test_validate_schema_missing():
    df = pd.DataFrame({"id": [1]})
    with pytest.raises(ValidationError):
        validate_schema(df)
