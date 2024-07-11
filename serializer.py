from rest_framework import serializers

class StudentRiskSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    final_score = serializers.FloatField()
    assignments = serializers.ListField(
        child=serializers.DictField()
    )
    risk_index = serializers.FloatField()
    risk_level = serializers.CharField(max_length=10)
