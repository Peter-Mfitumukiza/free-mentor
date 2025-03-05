import graphene
import jwt
from graphene import ObjectType, String, Boolean, Mutation
from graphql import GraphQLError
from .models import User, MentorshipSession
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

class MentorshipSessionType(ObjectType):
    id = String()
    mentee = graphene.Field(UserType)
    mentor = graphene.Field(UserType)
    status = String()
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

class RequestMentorshipSession(Mutation):
    class Arguments:
        mentor_email = String(required=True)
        questions = String(required=False)

    success = Boolean()
    message = String()

    def mutate(self, info, mentor_email, questions = None):
        user = get_authenticated_user(info.context)

        if user.role != "USER":
            raise GraphQLError("Only users can request mentorship sessions")

        mentor = User.objects(email=mentor_email, role="MENTOR").first()
        if not mentor:
            return RequestMentorshipSession(success=False, message="Mentor not found")

        session = MentorshipSession(mentee=user, mentor=mentor, questions=questions)
        session.save()

        return RequestMentorshipSession(success=True, message="Mentorship session requested")
    
class RespondToMentorshipSession(Mutation):
    class Arguments:
        session_id = String(required=True)
        action = String(required=True)  # "accept" or "reject"

    success = Boolean()
    message = String()

    def mutate(self, info, session_id, action):
        mentor = get_authenticated_user(info.context)

        if mentor.role != "MENTOR":
            raise GraphQLError("Only mentors can respond to session requests")

        session = MentorshipSession.objects(id=session_id, mentor=mentor).first()
        if not session:
            return RespondToMentorshipSession(success=False, message="Session not found")

        if action not in ["accept", "reject"]:
            return RespondToMentorshipSession(success=False, message="Invalid action")

        session.status = "ACCEPTED" if action == "accept" else "REJECTED"
        session.save()

        return RespondToMentorshipSession(success=True, message=f"Session {action}ed successfully")


class Mutation(ObjectType):
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    change_user_role = ChangeUserRole.Field()
    request_mentorship_session = RequestMentorshipSession.Field()
    respond_to_mentorship_session = RespondToMentorshipSession.Field()



class Query(ObjectType):
    default = String(default_value="GraphQL API is working!")
    all_users = graphene.List(UserType, role=String())
    my_sessions = graphene.List(MentorshipSessionType)
    get_mentor_by_email = graphene.Field(UserType, email=String(required=True))
    get_authenticated_user = graphene.Field(UserType)

    def resolve_all_users(self, info, role=None):
        if role:
            return User.objects(role=role)
        return User.objects.all()
    
    def resolve_my_sessions(self, info):
        user = get_authenticated_user(info.context)
        if user.role == "MENTOR":
            sessions = MentorshipSession.objects(mentor=user)
        else:
            sessions = MentorshipSession.objects(mentee=user)

        return sessions
    
    def resolve_get_mentor_by_email(self, info, email):
        mentor = User.objects(email=email, role="MENTOR").first()
        if not mentor:
            raise GraphQLError("Mentor not found")
        return mentor
    
    def resolve_get_authenticated_user(self, info):
        user = get_authenticated_user(info.context)
        return user


schema = graphene.Schema(query=Query,mutation=Mutation)