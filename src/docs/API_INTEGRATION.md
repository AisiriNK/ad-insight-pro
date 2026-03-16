# AdAnalytics AI — API Integration Guide

## Overview
This frontend is designed to connect to a Spring Boot backend via REST APIs. Currently, mock data is used.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` |
| `VITE_USE_MOCK` | Use mock data (`true`/`false`) | `true` |

Create a `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=false
```

## API Endpoints

### 1. Upload CSV
**POST** `/api/upload-csv`

Request: `multipart/form-data` with `file` field.

Response:
```json
{
  "datasetId": "dataset_12345",
  "rowsProcessed": 25000,
  "status": "uploaded"
}
```

### 2. Run AI Analysis
**POST** `/api/analyze`

Request:
```json
{ "datasetId": "dataset_12345" }
```

Response:
```json
{
  "summary": { "kpis": {...}, "charts": [...] },
  "insights": [...],
  "scenarios": [...]
}
```

### 3. Get Dashboard Data
**GET** `/api/dashboard/{datasetId}`

Response: Same as `/api/analyze`.

## JSON Schema

See `src/types/api.ts` for full TypeScript interfaces.

### KPIs
- `total_revenue`, `total_net_revenue`, `total_impressions` (number)
- `total_data_providers`, `total_segments` (number)
- `avg_cpm` (number)

### Charts
Each chart has: `id`, `title`, `type` (bar|pie|scatter), optional `x_axis`/`y_axis`, and `data` array.

### Insights
Each insight: `type` (revenue_optimization|audience_insight|saturation|market_trend|operational_issue|reporting_issue), `title`, `description`, `confidence`.

### Scenarios
Each scenario: `scenario`, `assumption`, optional `expected_revenue_increase`/`expected_net_revenue_increase`, `confidence`.

## Switching from Mock to Real API

1. Set `VITE_USE_MOCK=false` in `.env`
2. Set `VITE_API_BASE_URL` to your Spring Boot backend URL
3. Ensure CORS is configured on the backend
4. The frontend uses Axios with 30s timeout and JSON content type

## Spring Boot CORS Configuration Example
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}
```

## Mock Data Files
- `src/mock/summary.json` — KPIs and chart configurations
- `src/mock/insights.json` — AI-generated insights
- `src/mock/scenarios.json` — What-if scenarios
