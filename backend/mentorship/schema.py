import graphene
from graphene import ObjectType, String, Boolean, Mutation
from .models import User

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
    
class Mutation(ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()

class Query(ObjectType):
    default = String(default_value="GraphQL API is working!")


schema = graphene.Schema(query=Query,mutation=Mutation)