import json
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView 
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token as DrfToken
from .models import Product, Cart, CartItem, Order
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from rest_framework.generics import UpdateAPIView
from django.core.mail import send_mail
from rest_framework.views import APIView
from .models import Review
from .serializers import ReviewSerializer

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = DrfToken.objects.get(key=response.data['token'])
        return Response({'token': token.key})


@api_view(['POST'])
@permission_classes([AllowAny])  # 💥 This line fixes the 401 error
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    User.objects.create_user(username=username, password=password)
    return Response({"message": "User registered successfully"}, status=201)


# --- PRODUCT VIEW ---

class ProductList(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        serializer.save(product_id=product_id, user=self.request.user)

# --- CART VIEWS ---

def get_user_cart(user):
    cart, created = Cart.objects.get_or_create(user=user)
    return cart

class CartItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_user_cart(self.request.user).items.all()

    def perform_create(self, serializer):
        serializer.save(cart=get_user_cart(self.request.user))

class CartItemUpdateView(UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]


class CartItemDeleteView(generics.DestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return get_user_cart(self.request.user).items.all()

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return get_user_cart(self.request.user)


# --- ORDER VIEWS ---

class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        cart = get_user_cart(self.request.user)
        if not cart.items.exists():
            raise ValueError("Cannot place order with empty cart")
        serializer.save()
        cart.items.all().delete()


@csrf_exempt
@require_http_methods(["POST"])
def add_to_cart(request):
    try:
        data = json.loads(request.body)
        # Process the data here, e.g., save to DB
        return JsonResponse({'message': 'Item added to cart successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
    

@csrf_exempt
def savemessage(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            name = data.get("name")
            email = data.get("email")
            phone = data.get("phone")
            address = data.get("address")
            message = data.get("message")

            subject = f"New Contact Form Submission from {name}"
            body = (
                f"Name: {name}\n"
                f"Email: {email}\n"
                f"Phone: {phone}\n"
                f"Address: {address}\n\n"
                f"Message:\n{message}"
            )

            send_mail(
                subject,
                body,
                'youremail@gmail.com',
                ['geor292429@gmail.com'],
                fail_silently=False,
            )

            return JsonResponse({"message": "Message sent successfully!"}, status=200)
        except Exception as e:
            print("=== ERROR IN CONTACT FORM ===")
            import traceback
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)    
    
@api_view(['GET'])
def search_products(request):
    query = request.GET.get("query", "").strip()
    if query:
        products = Product.objects.filter(name__icontains=query)
    else:
        products = Product.objects.none()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)