from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

urlpatterns = [
    path("", lambda request: JsonResponse({"status": "ok"})),
    path("admin/", admin.site.urls),
    path("api/", include("apps.user_auth_app.api.urls")),
    path("api/", include("apps.quiz_management_app.api.urls")),
]