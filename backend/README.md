# AdAnalytics AI Backend

FastAPI backend for CSV ingestion, DuckDB analytics, and external AI agent integration.

## Setup

1. Create a virtual environment and install dependencies
2. Configure environment variables
3. Run the API server

## Environment Variables

- AGENT_API_TOKEN
- INSIGHT_AGENT_URL
- ANOMALY_AGENT_URL
- RCA_AGENT_URL
- SIMULATION_AGENT_URL
- DATA_DIR (optional, default ./data)
- DUCKDB_PATH (optional, default ./data/analytics.duckdb)

## Example .env

AGENT_API_TOKEN=your_token_here
INSIGHT_AGENT_URL=https://agents.example.com/insight
ANOMALY_AGENT_URL=https://agents.example.com/anomaly
RCA_AGENT_URL=https://agents.example.com/rca
SIMULATION_AGENT_URL=https://agents.example.com/simulation

## Run

uvicorn app.main:app --reload --port 8080

## API

POST /api/upload-csv
POST /api/analyze
GET /api/dashboard/{datasetId}

## JSON Formats

Summary Analytics JSON

{
  "summary": {
    "kpis": {
      "total_revenue": 1245300,
      "total_net_revenue": 842100,
      "total_impressions": 98500000,
      "total_data_providers": 14,
      "total_segments": 120,
      "avg_cpm": 3.42
    },
    "charts": [
      {
        "id": "revenue_by_data_provider",
        "title": "Revenue Contribution by Data Provider",
        "type": "bar",
        "x_axis": "data_provider",
        "y_axis": "revenue",
        "data": [
          {"data_provider": "ProviderA", "revenue": 240000},
          {"data_provider": "ProviderB", "revenue": 180000}
        ]
      }
    ]
  }
}

AI Insights JSON

{
  "insights": [
    {
      "id": "insight_1",
      "type": "opportunity",
      "title": "High Revenue Concentration in Few Data Providers",
      "description": "ProviderA and ProviderB together contribute 58% of total revenue.",
      "confidence": 0.92,
      "supporting_data": {
        "providers": ["ProviderA", "ProviderB"],
        "revenue_share_percent": 58
      },
      "recommendation": "Increase inventory acquisition from these providers to scale revenue."
    }
  ]
}

What-If Scenarios JSON

{
  "scenarios": [
    {
      "scenario_id": "scenario_1",
      "title": "Increase Usage of Top Data Providers",
      "assumption": "Increase impressions from top 2 providers by 20%",
      "impact": {
        "estimated_revenue_increase": 150000,
        "estimated_net_revenue_increase": 105000,
        "confidence": 0.83
      },
      "affected_entities": {
        "data_providers": ["ProviderA", "ProviderB"]
      }
    }
  ]
}
