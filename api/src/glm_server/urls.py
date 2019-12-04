from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('api/execute/', views.Execute.as_view()),
    path('api/save/', views.Save.as_view()),
    path('api/output/', views.Output.as_view()),
    path('api/specs/', views.Specs.as_view()),
    path('api/authentication-token/', views.AuthenticationToken.as_view()),
    path('admin/', admin.site.urls),
]
