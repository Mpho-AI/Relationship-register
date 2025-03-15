from fastapi_cache.decorator import cache
from app.core.config import settings
from deepface import DeepFace
import numpy as np
from typing import List, Dict
import cv2

class FacialRecognitionService:
    def __init__(self):
        self.similarity_threshold = settings.FACE_SIMILARITY_THRESHOLD
        self.model_name = settings.FACE_MODEL_NAME

    @cache(expire=3600)  # Cache results for 1 hour
    async def compare_faces(self, source_image: str, target_image: str) -> Dict:
        try:
            result = DeepFace.verify(
                img1_path=source_image,
                img2_path=target_image,
                model_name=self.model_name,
                distance_metric="cosine"
            )
            
            return {
                "match": result["verified"],
                "similarity": result["distance"],
                "threshold_reached": result["distance"] >= self.similarity_threshold
            }
        except Exception as e:
            return {
                "match": False,
                "error": str(e)
            }

    async def find_similar_faces(self, source_image: str, database_images: List[str]) -> List[Dict]:
        matches = []
        for db_image in database_images:
            result = await self.compare_faces(source_image, db_image)
            if result.get("threshold_reached"):
                matches.append({
                    "image_path": db_image,
                    "similarity": result["similarity"]
                })
        return matches 