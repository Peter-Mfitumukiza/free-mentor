import os
import sys
import django

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'free_mentors.settings')
django.setup()

from mentorship.models import User

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

def create_admin():
    if User.objects(email=ADMIN_EMAIL).first():
        print("Admin user already exists.")
        return

    admin = User(
        firstName="Admin",
        lastName="User",
        email=ADMIN_EMAIL,
        role="ADMIN"
    )
    admin.set_password(ADMIN_PASSWORD)
    admin.save()
    print(f"Admin user created: {ADMIN_EMAIL}")

if __name__ == "__main__":
    create_admin()
