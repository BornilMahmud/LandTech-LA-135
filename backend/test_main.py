from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["offlineCapable"] is True

def test_list_parcels():
    response = client.get("/api/parcels")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] >= 2
    assert len(data["data"]) >= 2

def test_evaluate_suitability():
    response = client.post("/api/suitability", json={
        "parcelId": "bd-dhk-01",
        "purpose": "residential"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["overallScore"] >= 70
    assert data["purpose"] == "residential"

def test_compare_parcels():
    response = client.post("/api/compare", json={
        "parcelIds": ["bd-dhk-01", "bd-cxb-02"],
        "purpose": "hotel"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["purpose"] == "hotel"
    assert len(data["rankings"]) == 2
    # In hotel purpose, Cox's Bazar marine plot should rank higher than Purbachal
    assert data["topRecommendation"]["parcel"]["id"] == "bd-cxb-02"
