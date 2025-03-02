import mongoengine as me
import datetime
import bcrypt
import jwt
from django.conf import settings

class User(me.Document):
    ROLES = ('USER', 'MENTOR', 'ADMIN')

    firstName = me.StringField(required=True)
    lastName = me.StringField(required=True)
    bio = me.StringField()
    address = me.StringField()
    occupation = me.StringField()
    expertise = me.StringField()
    email = me.EmailField(required=True, unique=True)
    password = me.StringField(required=True)
    role = me.StringField(choices=ROLES, default='USER')
    created_at = me.DateTimeField(default=datetime.datetime.now)

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    def check_password(self, password):
        return bcrypt.checkpw(password.encode(), self.password.encode())
    
    def generate_token(self):
        payload = {
            'id': str(self.id),
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'role': self.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    meta = { 'collection': 'users' }


class MentorshipSession(me.Document):
    STATUS_CHOICES = ("PENDING", "ACCEPTED", "REJECTED")

    mentor = me.ReferenceField(User, required=True)
    mentee = me.ReferenceField(User, required=True)
    status = me.StringField(choices=STATUS_CHOICES, default='PENDING')
    questions = me.StringField()   
    created_at = me.DateTimeField(default=datetime.datetime.now)

    meta = { 'collection': 'mentorship_sessions' }