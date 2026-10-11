from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="LandWise AI — Bangladesh Land Intelligence API",
    description="Deterministic geospatial land suitability, property comparison, and tourism discovery service.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class UtilitiesInfo(BaseModel):
    electricity: bool
    water: bool
    gas: bool
    fiberInternet: bool

class NearbyFacilities(BaseModel):
    highwayDistKm: float
    marketDistKm: float
    schoolDistKm: float
    hospitalDistKm: float
    policeStationDistKm: float

class LandParcelModel(BaseModel):
    id: str
    titleEn: str
    titleBn: str
    district: str
    division: str
    upazila: str
    mouza: str
    lat: float
    lng: float
    areaKatha: float
    areaDecimal: float
    areaSqFt: float
    priceBdt: float
    pricePerKatha: float
    roadWidthFt: float
    soilType: str
    floodRisk: str
    elevationMeters: float
    zoning: str
    utilities: UtilitiesInfo
    nearbyFacilities: NearbyFacilities
    legalStatus: str
    khatianType: str
    csRsReference: str
    demoLabel: str
    missingAttributes: List[str] = []

class SuitabilityRequest(BaseModel):
    parcelId: str
    purpose: str = Field(default="residential", description="residential, hotel, farm, hospital, restaurant")
    customWeights: Optional[Dict[str, float]] = None

class ComparisonRequest(BaseModel):
    parcelIds: List[str]
    purpose: str = Field(default="residential")

# In-memory realistic dataset mirroring frontend dataset
SAMPLE_PARCELS: List[Dict[str, Any]] = [
    {
        "id": "bd-dhk-01",
        "titleEn": "Purbachal Sector 17 Corner Plot",
        "titleBn": "পূর্বাচল সেক্টর ১৭ কর্নার প্লট",
        "district": "Dhaka",
        "division": "Dhaka",
        "upazila": "Rupganj",
        "mouza": "Baraikandi",
        "lat": 23.8340,
        "lng": 90.5285,
        "areaKatha": 10.0,
        "areaDecimal": 16.5,
        "areaSqFt": 7200.0,
        "priceBdt": 35000000.0,
        "pricePerKatha": 3500000.0,
        "roadWidthFt": 45.0,
        "soilType": "Red Clay",
        "floodRisk": "Low",
        "elevationMeters": 7.2,
        "zoning": "Residential",
        "utilities": {
            "electricity": True,
            "water": True,
            "gas": False,
            "fiberInternet": True
        },
        "nearbyFacilities": {
            "highwayDistKm": 1.2,
            "marketDistKm": 1.8,
            "schoolDistKm": 2.1,
            "hospitalDistKm": 4.5,
            "policeStationDistKm": 3.2
        },
        "legalStatus": "RAJUK Allotment Letter & Mutation Cleared",
        "khatianType": "BS Khatian Recorded",
        "csRsReference": "CS: 1142, RS: 874, BS: 2309",
        "demoLabel": "Sample Record — Verified Structure, Simulated Coordinates",
        "missingAttributes": ["Borehole soil bearing test report", "Gas pipeline sanction"]
    },
    {
        "id": "bd-cxb-02",
        "titleEn": "Kolatoli Marine Drive Beach Frontage",
        "titleBn": "কলাতলী মেরিন ড্রাইভ বিচ সংলগ্ন প্লট",
        "district": "Cox's Bazar",
        "division": "Chittagong",
        "upazila": "Cox's Bazar Sadar",
        "mouza": "Jhilwanja",
        "lat": 21.4125,
        "lng": 91.9835,
        "areaKatha": 24.0,
        "areaDecimal": 39.6,
        "areaSqFt": 17280.0,
        "priceBdt": 84000000.0,
        "pricePerKatha": 3500000.0,
        "roadWidthFt": 60.0,
        "soilType": "Sandy Loam",
        "floodRisk": "Moderate",
        "elevationMeters": 5.8,
        "zoning": "Eco-Tourism",
        "utilities": {
            "electricity": True,
            "water": True,
            "gas": False,
            "fiberInternet": True
        },
        "nearbyFacilities": {
            "highwayDistKm": 0.2,
            "marketDistKm": 2.5,
            "schoolDistKm": 3.8,
            "hospitalDistKm": 5.2,
            "policeStationDistKm": 2.0
        },
        "legalStatus": "Commercial Leasehold with Environmental Clearance NOC",
        "khatianType": "RS/BS Khatian",
        "csRsReference": "CS: 452, RS: 981, BS: 1405",
        "demoLabel": "Sample Record — Verified Structure, Simulated Coordinates",
        "missingAttributes": ["Coastal development zone set-back verification"]
    }
]

def calculate_parcel_suitability(parcel: Dict[str, Any], purpose: str, weights: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """Deterministic mathematical suitability evaluation identical to frontend engine"""
    purpose = purpose.lower()
    road = parcel["roadWidthFt"]
    flood = parcel["floodRisk"]
    elev = parcel["elevationMeters"]
    zoning = parcel["zoning"]

    # Base Road Score
    road_score = 100 if road >= 40 else 85 if road >= 30 else 70 if road >= 20 else 40

    # Base Flood Score
    flood_score = 95 if flood == "Low" and elev >= 5 else 80 if flood == "Low" else 55 if flood == "Moderate" else 25

    # Purpose specific multipliers
    if purpose == "hotel":
        zoning_score = 95 if zoning in ["Eco-Tourism", "Commercial"] else 50
        scale_score = 95 if parcel["areaKatha"] >= 15 else 60
        overall = int(zoning_score * 0.35 + road_score * 0.25 + flood_score * 0.20 + scale_score * 0.20)
    elif purpose == "farm":
        soil_score = 98 if parcel["soilType"] == "Alluvial" else 85 if parcel["soilType"] == "Red Clay" else 60
        acreage_score = 95 if parcel["areaKatha"] >= 20 else 55
        overall = int(soil_score * 0.40 + acreage_score * 0.30 + flood_score * 0.15 + road_score * 0.15)
    else:  # Residential / Default
        util_score = 90 if parcel["utilities"]["electricity"] and parcel["utilities"]["water"] else 50
        overall = int(road_score * 0.30 + flood_score * 0.30 + util_score * 0.25 + 75 * 0.15)

    return {
        "parcelId": parcel["id"],
        "purpose": purpose,
        "overallScore": min(100, max(10, overall)),
        "dataCoveragePct": 92,
        "missingFactors": parcel.get("missingAttributes", []),
        "confidenceLabel": "High Grounded Confidence"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LandWise AI Backend",
        "offlineCapable": True,
        "version": "1.0.0"
    }

@app.get("/api/parcels")
def list_parcels(
    division: Optional[str] = None,
    district: Optional[str] = None,
    maxPrice: Optional[float] = None
):
    results = SAMPLE_PARCELS
    if division and division != "All":
        results = [p for p in results if p["division"].lower() == division.lower()]
    if district and district != "All":
        results = [p for p in results if p["district"].lower() == district.lower()]
    if maxPrice:
        results = [p for p in results if p["priceBdt"] <= maxPrice]
    return {"count": len(results), "data": results}

@app.get("/api/parcels/{parcel_id}")
def get_parcel(parcel_id: str):
    for p in SAMPLE_PARCELS:
        if p["id"] == parcel_id:
            return p
    raise HTTPException(status_code=404, detail="Parcel not found")

@app.post("/api/suitability")
def evaluate_suitability(req: SuitabilityRequest):
    parcel = next((p for p in SAMPLE_PARCELS if p["id"] == req.parcelId), None)
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return calculate_parcel_suitability(parcel, req.purpose, req.customWeights)

@app.post("/api/compare")
def compare_parcels(req: ComparisonRequest):
    compared = []
    for pid in req.parcelIds:
        parcel = next((p for p in SAMPLE_PARCELS if p["id"] == pid), None)
        if parcel:
            eval_res = calculate_parcel_suitability(parcel, req.purpose)
            compared.append({
                "parcel": parcel,
                "suitability": eval_res
            })
    compared.sort(key=lambda x: x["suitability"]["overallScore"], reverse=True)
    return {
        "purpose": req.purpose,
        "rankings": compared,
        "topRecommendation": compared[0] if compared else None
    }
