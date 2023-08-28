from flask import request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Organization, OrganizationUser
import re

# for not unique name error
from sqlalchemy.exc import IntegrityError  #  IntegrityError class for email check

def is_valid_email(email):
    # Define a regular expression pattern for valid email format
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

# Signup
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({"message": "Wrong request"}), 400
                    
        if not is_valid_email(data['email']):
            return jsonify({"message": "Wrong email format in request"}), 400
    
       
        hashed_password = generate_password_hash(data['password'], method='scrypt')
        new_user = User(email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User created!"}), 201
    
    except IntegrityError as e:
       # duplicate email
        return jsonify({"message": "Email already exists"}), 409
        
    except Exception as e:
        print("other =>",e)
        return jsonify({"message": "An error occurred"}), 500

# Signin
@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({"message": "Wrong request"}), 400
        
        if not is_valid_email(data['email']):
            return jsonify({"message": "Wrong email format in request"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({"message": "No user with this email"}), 401
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"message": "Wrong password!"}), 401
        
        access_token = create_access_token(identity=user.email)
        return jsonify({"access_token": access_token})
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"message": "An error occurred"}), 500

# All users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        user_list = [{'id': user.id, 'email': user.email} for user in users]
        return jsonify({"users": user_list}), 200
    
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500
    
# Clear User 
@app.route('/delete-user', methods=['POST'])
def deleteuser():
    try:
        data = request.get_json()
                
        if 'email' not in data or 'password' not in data or 'command' not in data:
            return jsonify({"message": "Wrong request"}), 400
        
        if data['command'] != 'deleteuser':
            return jsonify({"message": "Wrong command"}), 400
        
        # if not is_valid_email(data['email']):
        #     return jsonify({"message": "Wrong email format in request"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({"message": "No user with this email"}), 401
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"message": "Wrong password!"}), 401
        
        # delete user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"message": "User deleted!"}), 200
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"message": "An error occurred"}), 500

# Organizations management
# Signup
@app.route('/create-org', methods=['POST'])
def create_org():
    try:
        data = request.get_json()
        
        if 'name' not in data:
            return jsonify({"message": "Wrong request"}), 400
        
              
        if data['name'] in ["", " "] or len(data['name']) <= 1:
            return jsonify({"message": "Wrong Organization name"}), 400
    
        new_organization = Organization(name=data['name'])
        db.session.add(new_organization)
        db.session.commit()
        return jsonify({"message": "Organization created!"}), 201
    
    except IntegrityError as e:
       # duplicate email
        return jsonify({"message": "Organization already exists"}), 409
        
    except Exception as e:
        print("other =>",e)
        return jsonify({"message": "An error occurred"}), 500

# All Organizations
@app.route('/organizations', methods=['GET'])
def get_organizations():
    try:
        organizations = Organization.query.all()
        org_list = [{'id': org.id, 'name': org.name} for org in organizations]
        return jsonify({"organizations": org_list}), 200
    
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500

# add user to organization (and check if this user don't belong t0 this organization)
@app.route('/add-user-organization', methods=['POST'])
def add_user_organization():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'name' not in data:
            return jsonify({"message": "Missing email or organization name"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        organization = Organization.query.filter_by(name=data['name']).first()
        
        if not user or not organization:
            return jsonify({"message": "User or Organization not found"}), 404
        
        # check if there is combination of user_id and organization_id
        existing_entry = OrganizationUser.query.filter_by(organization_id=organization.id, user_id=user.id).first()
        if existing_entry:
            return jsonify({"message": "User is already associated with the Organization"}), 409
        
        print("user", user.id)
        print("organization", organization.id)
        organization_user = OrganizationUser(organization_id=organization.id, user_id=user.id)
        db.session.add(organization_user)
        db.session.commit()
        
        return jsonify({"message": "User added to Organization"}), 201
    
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500

# delete user from organization by email and organization name
@app.route('/delete-user-from-org', methods=['DELETE'])
def delete_user_from_org():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'name' not in data:
            return jsonify({"message": "Missing email or organization name"}), 400
        
        email = data['email']
        org_name = data['name']
        
        user = User.query.filter_by(email=email).first()
        organization = Organization.query.filter_by(name=org_name).first()
        
        if not user or not organization:
            return jsonify({"message": "User or Organization not found"}), 404
        
        existing_entry = OrganizationUser.query.filter_by(organization_id=organization.id, user_id=user.id).first()
        if not existing_entry:
            return jsonify({"message": "Information for user not found"}), 404
        
        db.session.delete(existing_entry)
        db.session.commit()
        
        return jsonify({"message": "User deleted from Organization"}), 200
    
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500

# 
@app.route('/get-users-by-org', methods=['GET'])
def get_emails_by_organization():
    try:
        org_name = request.args.get('org_name')
        
        if not org_name:
            return jsonify({"message": "Missing organization name"}), 400
        
        organization = Organization.query.filter_by(name=org_name).first()
        
        if not organization:
            return jsonify({"message": "Organization not found"}), 404
        
        users_in_org = User.query.join(OrganizationUser).filter(OrganizationUser.organization_id == organization.id).all()
        data = [{"id": user.id, "email": user.email} for user in users_in_org]
        print("data=>", data)
        return jsonify({"data": data}), 200
    
    except Exception as e:
        return jsonify({"message": "An error occurred"}), 500