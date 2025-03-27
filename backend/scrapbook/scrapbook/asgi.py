import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from channels.security.websocket import AllowedHostsOriginValidator

# Set Django settings module before any imports that might use it
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'scrapbook.settings')

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models
django_application = get_asgi_application()

# Import socket app after Django initialization
from chat.socket_server import socket_app

application = ProtocolTypeRouter({
    "http": django_application,
    "websocket": AllowedHostsOriginValidator(socket_app),
})