from django.urls import path
from .view import ProcessCanvasData

urlpatterns = [
    path('process-canvas-data/<int:course_id>/', ProcessCanvasData.as_view(), name='process_canvas_data'),
]
