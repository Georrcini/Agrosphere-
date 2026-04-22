from django.db import models
from django.contrib.auth.models import User
import random
import string
from django.utils.timezone import now
# Create your models here
CATEGORY_CHOICES = [
    ('PLANTS', 'Plants'),
    ('SEEDS', 'Seeds'),
    ('FERTILIZERS', 'Fertilizers'),
    ('PESTICIDES', 'Pesticides'),
]

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    rating = models.FloatField()
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()  # from 1 to 5, for example
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=100, unique=True, blank=True)  # allow blank
    total = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="Ordered")
    cancel_reason = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.order_id}"

    def generate_order_id(self):
        timestamp = now().strftime('%Y%m%d%H%M%S')
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return f"{timestamp}{random_str}"

    def save(self, *args, **kwargs):
        if not self.order_id:
            order_id_candidate = self.generate_order_id()
            # Check for uniqueness, regenerate if duplicate found
            while Order.objects.filter(order_id=order_id_candidate).exists():
                order_id_candidate = self.generate_order_id()
            self.order_id = order_id_candidate
        super().save(*args, **kwargs)
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product_name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    src = models.URLField(blank=True, null=True)  # image URL
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.product_name
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
