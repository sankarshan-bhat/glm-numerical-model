from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('api/start-execution/', views.StartExecutionView.as_view()),
    path('api/execution-status/', views.ExecutionStatusView.as_view()),
    path('api/client-id/', views.ClientIdView.as_view()),
    path('api/authentication-token/', views.AuthenticationTokenView.as_view()),
    path('admin/', admin.site.urls),
]
