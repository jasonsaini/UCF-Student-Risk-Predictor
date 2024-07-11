# app_name/risk2.py

import numpy as np

def calculate_slope(x, y):
    n = len(x)
    sum_x = np.sum(x)
    sum_y = np.sum(y)
    sum_xy = np.sum(x * y)
    sum_x_squared = np.sum(x ** 2)
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x_squared - sum_x ** 2)
    return slope

def normalize_gts(slope, min_slope=-10, max_slope=10):
    return ((slope - min_slope) / (max_slope - min_slope)) * 100

def calculate_risk_index(rps, cgs, gts, current_score):
    if current_score <= 69:
        return 38, "High Risk"
    
    weights = {
        'rps': 0.3,
        'cgs': 0.55,
        'gts': 0.15
    }

    risk_index = (weights['rps'] * rps + 
                  weights['cgs'] * cgs + 
                  weights['gts'] * gts)

    if risk_index > 70:
        risk_level = "Low Risk"
    elif 40 < risk_index <= 70:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    return risk_index, risk_level
