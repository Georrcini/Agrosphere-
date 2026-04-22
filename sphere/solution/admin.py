from django.contrib import admin

# Register your models here.
from .models import Product
from .models import Order, OrderItem
from .models import Cart,CartItem,Review
admin.site.register(Product)

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Review) 