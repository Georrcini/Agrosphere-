from rest_framework import serializers
from .models import Product
from .models import Order, OrderItem
from .models import Cart, CartItem
from .models import Review
class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                # Return full absolute URL, e.g. "http://localhost:8000/media/..."
                return request.build_absolute_uri(obj.image.url)
            else:
                # If request is missing, fallback to relative URL
                return obj.image.url
        # Return None if no image
        return None

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


# OrderItemSerializer
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    src = serializers.ImageField(source='product.image', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    class Meta:
        model = OrderItem
        fields = ['product_id','product_name', 'quantity', 'src', 'price']
    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity must be greater than 0.")
        return value
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    order_id = serializers.CharField(read_only=True)  # ✅ uses your actual custom order_id field
    date = serializers.DateTimeField(read_only=True)

    cancel_reason = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = ['order_id', 'user', 'total', 'payment_method', 'status', 'cancel_reason', 'date', 'items']
        read_only_fields = ['order_id', 'user', 'date']
    def create(self, validated_data):
        items_data = validated_data.pop('items')

        request = self.context.get('request')
        if request is None:
            raise serializers.ValidationError("Request context is missing in serializer.")

        user = request.user
        order = Order.objects.create(user=user, **validated_data)

        for item_data in items_data:
            product = item_data.pop('product')

            OrderItem.objects.create(
                order=order,
                product_name=product.name,
                quantity=item_data.get('quantity', 1),
                src=product.image.url if product.image else '',
                price=product.price
            )

        return order


# CartItemSerializer
class CartItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='product.id', read_only=True)  # override id
    product_name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    src = serializers.ImageField(source='product.image', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    description = serializers.CharField(source='product.description', read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'product_name', 'price', 'src', 'description', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items']
