# app_name/views.py

import pandas as pd
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .serializers import StudentRiskSerializer
from .risk3 import calculate_slope, normalize_gts, calculate_risk_index

class ProcessCanvasData(APIView):
    def get(self, request, course_id):
        # Pull data from Canvas API
        url = f"{settings.CANVAS_API_URL}/courses/{course_id}/students/submissions"
        headers = {
            'Authorization': f'Bearer {settings.CANVAS_API_KEY}'
        }
        response = requests.get(url, headers=headers)
        data = response.json()

        # Process the data
        df = pd.DataFrame(data)
        for index, row in df.iterrows():
            assignments = row['assignments']
            scores = [assignment['score'] for assignment in assignments]
            x = list(range(len(scores)))
            slope = calculate_slope(x, scores)
            gts = normalize_gts(slope)
            rps = ...  # Calculate RPS from Canvas data
            cgs = ...  # Calculate CGS from Canvas data
            current_score = row['final_score']
            risk_index, risk_level = calculate_risk_index(rps, cgs, gts, current_score)
            df.at[index, 'Risk Index'] = risk_index
            df.at[index, 'Risk Level'] = risk_level

        # Serialize the processed data
        serializer = StudentRiskSerializer(df.to_dict(orient='records'), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
