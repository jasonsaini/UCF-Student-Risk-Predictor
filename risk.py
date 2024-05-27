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

def get_normalized_score(prompt):
    score = float(input(prompt))
    return score

def main():
    print("Enter the recent performance score (RPS) and cumulative grade score (CGS):")
    rps = get_normalized_score("RPS (0-100): ")
    cgs = get_normalized_score("CGS (0-100): ")

    attendance_graded = input("Is attendance graded? (yes/no): ").strip().lower() == 'yes'
    if attendance_graded:
        as_score = get_normalized_score("AS (0-100): ")
    else:
        as_score = 0

    engagement_graded = input("Is participation graded? (yes/no): ").strip().lower() == 'yes'
    if engagement_graded:
        es = get_normalized_score("ES (0-100): ")
    else:
        es = 0

    num_assignments = int(input("Enter the number of assignments to track for GTS: "))
    assignment_scores = []
    for i in range(1, num_assignments + 1):
        score = float(input(f"Score for assignment {i}: "))
        assignment_scores.append(score)

    x = np.arange(1, num_assignments + 1)
    y = np.array(assignment_scores)
    slope = calculate_slope(x, y)
    gts = normalize_gts(slope)

    # Base weights
    weights = {
        'rps': 0.4,
        'cgs': 0.3,
        'gts': 0.2,
        'as': 0.1 if attendance_graded else 0,
        'es': 0.1 if engagement_graded else 0
    }

    # Adjust weights to sum to 1
    total_weight = sum(weights.values())
    adjusted_weights = {k: v / total_weight for k, v in weights.items()}

    risk_index = (adjusted_weights['rps'] * rps + 
                  adjusted_weights['cgs'] * cgs + 
                  adjusted_weights['gts'] * gts + 
                  adjusted_weights['as'] * as_score + 
                  adjusted_weights['es'] * es)

    print(f"Calculated Risk Index: {risk_index:.2f}")

    if risk_index > 70:
        risk_level = "Low Risk"
    elif 40 < risk_index <= 70:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    print(f"Risk Level: {risk_level} ({risk_index:.2f})")

if __name__ == "__main__":
    main()
