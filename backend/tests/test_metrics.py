import pandas as pd

from app.services.analytics_service import process_csv


def test_process_csv(tmp_path):
    path = tmp_path / "data.csv"
    df = pd.DataFrame(
        {
            "id": [1, 2],
            "segment_id": ["s1", "s2"],
            "data_provider": ["p1", "p1"],
            "platform": ["google", "google"],
            "advertiser": ["adv1", "adv2"],
            "impressions": [100, 200],
            "revenue": [1000, 2000],
            "net_revenue": [800, 1600],
            "usage_date": ["2025-01-01", "2025-01-02"],
            "usage_report": ["2025-01-03", "2025-01-04"],
            "vertical": ["health", "health"],
            "segment_name": ["seg1", "seg2"],
            "platform_fee": [10, 20],
            "revenue_share": [5, 5],
            "imbalance": [0, 1],
        }
    )
    df.to_csv(path, index=False)

    result = process_csv(str(path), "dataset_test")
    assert result.kpis["total_revenue"] == 3000
    assert result.provider_metrics.shape[0] == 1
