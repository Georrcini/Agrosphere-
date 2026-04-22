from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import register_user
from .views import (
    ProductList,
    CartItemListCreateView,
    CartItemUpdateView,
    CartItemDeleteView,
    CartDetailView,
    OrderListCreateView,
    search_products,
    ProductReviewListCreateView,
    # cancel_order,
)
from .import views
urlpatterns = [
    path('contact/', views.savemessage,name= 'contact'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('register/', register_user, name='register-user'),
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:product_id>/reviews/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    path("cart/", CartDetailView.as_view(), name="cart-detail"),
    path("cart/items/", CartItemListCreateView.as_view(), name="cart-items"),
    path("cart/items/<int:pk>/update/", CartItemUpdateView.as_view(), name="cart-item-update"),
    path("cart/items/<int:pk>/", CartItemDeleteView.as_view(), name="cart-item-delete"),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('products/search/', search_products, name='search-products'),

    # path('orders/<str:order_id>/cancel/', cancel_order, name='cancel-order'),

]
