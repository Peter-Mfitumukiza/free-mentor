import graphene
import jwt
from graphene import ObjectType, String, Boolean, Mutation
from graphql import GraphQLError
from .models import User
from django.conf import settings

def get_authenticated_user(context):
    auth_header = context.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise GraphQLError("Authentication required")

    token = auth_header.split("Bearer ")[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user = User.objects(id=payload["id"]).first()
        if not user:
            raise GraphQLError("Invalid token")
        return user
    except jwt.ExpiredSignatureError:
        raise GraphQLError("Token has expired")
    except jwt.DecodeError:
        raise GraphQLError("Invalid token")


class UserType(ObjectType):
    firstName = String()
    lastName = String()
    bio = String()
    address = String()
    occupation = String()
    expertise = String()
    email = String()
    role = String()
    created_at = String()

class RegisterUser(Mutation):
    class Arguments:
        firstName = String(required=True)
        lastName = String(required=True)
        email = String(required=True)
        password = String(required=True)
        bio = String(required=False)
        address = String(required=False)
        occupation = String(required=False)
        expertise = String(required=False)

    success = Boolean()
    message = String()

    def mutate(self, info, firstName, lastName, email, password, bio=None, address=None, occupation=None, expertise=None):

        if User.objects(email=email).first():
            return RegisterUser(success=False, message="Email already exists")

        user = User(
            firstName=firstName, 
            lastName=lastName, 
            email=email, 
            bio=bio, 
            address=address, 
            occupation=occupation, 
            expertise=expertise
        )

        user.set_password(password)
        user.save()
        return RegisterUser(success=True, message='User registered successfully')

class LoginUser(Mutation):
    class Arguments:
        email = String(required=True)
        password = String(required=True)

    token = String()
    success = Boolean()
    message = String()

    def mutate(self, info, email, password):
        user = User.objects(email=email).first()

        if not user or not user.check_password(password):
            return LoginUser(success=False, message="Invalid credentials")

        token = user.generate_token()
        return LoginUser(success=True, message="Login successful", token=token)
    
class ChangeUserRole(Mutation):
    class Arguments: 
        user_email = String(required=True)
        new_role = String(required=True)

    success = Boolean()
    message = String()

    def mutate(self, info, user_email, new_role):
        user = get_authenticated_user(info.context)

        if user.role != "ADMIN":
            return ChangeUserRole(success=False, message="Unauthorized")

        user_to_update = User.objects(email=user_email).first()
        if not user_to_update:
            return ChangeUserRole(success=False, message="User not found")

        if new_role not in User.ROLES:
            return ChangeUserRole(success=False, message="Invalid role")

        user_to_update.update(role=new_role)
        return ChangeUserRole(success=True, message="Role updated successfully")

    
class Mutation(ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    change_user_role = ChangeUserRole.Field()

class Query(ObjectType):
    default = String(default_value="GraphQL API is working!")
    all_users = graphene.List(UserType, role=String())

    def resolve_all_users(self, info, role=None):
        if role:
            return User.objects(role=role)
        return User.objects.all()


schema = graphene.Schema(query=Query,mutation=Mutation)