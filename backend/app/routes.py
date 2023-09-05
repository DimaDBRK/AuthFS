from flask import request, jsonify, make_response, Response, render_template
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Organization, OrganizationUser
import re
import subprocess
import shutil

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
            return jsonify({"msg": "Wrong request"}), 400
                    
        if not is_valid_email(data['email']):
            return jsonify({"msg": "Wrong email format in request"}), 400
    
       
        hashed_password = generate_password_hash(data['password'], method='scrypt')
        new_user = User(email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User created!"}), 201
    
    except IntegrityError as e:
       # duplicate email
        return jsonify({"msg": "Email already exists"}), 409
        
    except Exception as e:
        print("other =>",e)
        return jsonify({"msg": "An error occurred"}), 500

# Signin
@app.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.get_json()
        
        if 'email' not in data or 'password' not in data:
            return jsonify({"msg": "Wrong request"}), 400
        
        if not is_valid_email(data['email']):
            return jsonify({"msg": "Wrong email format in request"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({"msg": "No user with this email"}), 401
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"msg": "Wrong password!"}), 401
        # access_token
        access_token = create_access_token(identity=user.email)
        
        # Create a response object
        response = make_response(jsonify({"msg": "Logged in successfully", "access_token": access_token}))
        
        # Set the access token = access_token as a cookie 
        response.set_cookie("access_token", access_token, httponly=True, max_age=60)  # seconds Adjust the max_age as needed
        
        return response
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"msg": "An error occurred"}), 500

# All users
@app.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        user_list = [{'id': user.id, 'email': user.email} for user in users]
        return jsonify({"users": user_list}), 200
    
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500
    
# Clear User 
@app.route('/users/delete-user', methods=['POST'])
def deleteuser():
    try:
        data = request.get_json()
                
        if 'email' not in data or 'password' not in data or 'command' not in data:
            return jsonify({"msg": "Wrong request"}), 400
        
        print("command=>", data['command'])
        if data['command'] != 'deleteuser':
            return jsonify({"msg": "Wrong command"}), 400
        
        # if not is_valid_email(data['email']):
        #     return jsonify({"message": "Wrong email format in request"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({"msg": "No user with this email"}), 401
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({"msg": "Wrong password!"}), 401
        
        # delete user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({"msg": "User deleted!"}), 200
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"msg": "An error occurred"}), 500

# get user info (profile) by email
@app.route('/users/user/<string:email>', methods=['GET'])
def get_user_info_and_organizations(email):
    try:
        user = User.query.filter_by(email=email).first()

        if not user:
            return jsonify({"msg": "Email not found"}), 404

        organizations = Organization.query.join(OrganizationUser).filter(OrganizationUser.user_id == user.id).all()

        user_info = {
            "id": user.id,
            "email": user.email,
            "organizations": [org.name for org in organizations]
        }

        return jsonify(user_info), 200

    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500

# update email
@app.route('/users/user/update', methods=['PUT'])
def update_user_email():
    try:
        old_email = request.json.get('email')
        new_email = request.json.get('new_email')

        if not old_email or not new_email:
            return jsonify({"msg": "Email or new email not provided"}), 400
        # check email s format
        if not is_valid_email(old_email):
            return jsonify({"msg": "Wrong email format in request"}), 400
        if not is_valid_email(new_email):
            return jsonify({"msg": "Wrong new email format in request"}), 400
        
        user = User.query.filter_by(email=old_email).first()

        if not user:
            return jsonify({"msg": "Email not found"}), 404

        # Check if the new email already exists in the database
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user:
            return jsonify({"msg": "New email already exists in the database"}), 409

        user.email = new_email
        db.session.commit()

        return jsonify({"email": new_email}), 200

    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500

# Organizations management
# Create org
@app.route('/create-org', methods=['POST'])
def create_org():
    try:
        data = request.get_json()
        
        if 'name' not in data or 'author' not in data:
            return jsonify({"msg": "Wrong request"}), 400
        
              
        if data['name'] in ["", " "] or len(data['name']) <= 1:
            return jsonify({"msg": "Wrong Organization name"}), 400

        author_email = data['author']
        
        if not is_valid_email(author_email):
            return jsonify({"msg": "Wrong email format in request"}), 400
        
        # Find the user by their email
        user = User.query.filter_by(email=author_email).first()
        
        if not user:
            return jsonify({"msg": "User with this email not found"}), 404
        
        # Create the organization with the author (user) associated
             
        new_organization = Organization(name=data['name'], author_id=user.id )
        db.session.add(new_organization)
        db.session.commit()
        
         # get new list of org
        organizations = Organization.query.all()
        org_list = [org.name for org in organizations]
        return jsonify({"msg": "Organization created!", "organizations": org_list}), 201
    
    except IntegrityError as e:
       # duplicate email
        return jsonify({"msg": "Organization already exists"}), 409
        
    except Exception as e:
        print("other =>",e)
        return jsonify({"msg": "An error occurred"}), 500

# Delete Organization
@app.route('/delete-org', methods=['DELETE'])
def delete_organization_by_name():
  
    try:
        org_name = request.args.get('name')
        if not org_name:
            return jsonify({"msg": "Organization name not provided"}), 400

        organization = Organization.query.filter_by(name=org_name).first()

        if not organization:
            return jsonify({"msg": "Organization not found"}), 404

        db.session.delete(organization)
        db.session.commit()
        # get new list of org
        organizations = Organization.query.all()
        org_list = [org.name for org in organizations]
        
         # get updated list
        all_users = User.query.all()
        users_in_org = User.query.join(OrganizationUser).filter(OrganizationUser.organization_id == organization.id).all()
        
        data = [{"id": user.id, "email": user.email, "status": user in users_in_org} for user in all_users]
        
        return jsonify({
            "msg": "Organization deleted successfully", 
            "organizations": org_list,
            "data": data}), 200

    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500
    
# All Organizations
@app.route('/organizations', methods=['GET'])
def get_organizations():
    try:
        organizations = Organization.query.all()
        org_list = [org.name for org in organizations]
        return jsonify({"organizations": org_list}), 200
    
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500

# Only organization created by user = author
@app.route('/get-org-by-author', methods=['POST'])
@jwt_required()  # requires a valid JWT token
def get_organizations_by_author():
    try:
        data = request.get_json()
        
        if 'email' not in data:
            return jsonify({"msg": "Missing email in request"}), 400

        user_email = data['email']
        
        if not is_valid_email(user_email):
            return jsonify({"msg": "Wrong email format in request"}), 400
        
        user = User.query.filter_by(email=user_email).first()
        
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # update access_token
        access_token = create_access_token(identity=user.email)
        
                       
        # Query organizations where the user is the author
        organizations = Organization.query.filter_by(author_id=user.id).all()
        
        org_list = [org.name for org in organizations]
        
        # Create a response object
        response = make_response(jsonify({"msg": f"Organizations where {user_email} is the author", "organizations": org_list, "access_token": access_token}))
        
        # Set the access token = access_token as a cookie 
        response.set_cookie("access_token", access_token, httponly=True, max_age=60)  # seconds Adjust the max_age as needed
        
        return response
        
           
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500


# add user to organization (and check if this user don't belong t0 this organization)
@app.route('/add-users-to-org', methods=['POST'])
def add_user_organization():
    try:
        data = request.get_json()
        
        if 'emails' not in data or 'name' not in data:
            return jsonify({"msg": "Missing email(s) or organization name"}), 400
        
        emails = data['emails']
        org_name = data['name']
        organization = Organization.query.filter_by(name=org_name).first()
        if not organization:
            return jsonify({"msg": "Organization not found"}), 404
        
        added_emails = []
        not_found_emails = []
        already_added_emails = []
        
        for email in emails:
            user = User.query.filter_by(email=email).first()

            if user:
                existing_entry = OrganizationUser.query.filter_by(organization_id=organization.id, user_id=user.id).first()

                if not existing_entry:
                    new_entry = OrganizationUser(organization_id=organization.id, user_id=user.id)
                    db.session.add(new_entry)
                    added_emails.append(email)
                else:
                    already_added_emails.append(email)
            else:
                not_found_emails.append(email)
        
        db.session.commit()
        
        # get updated list
        all_users = User.query.all()
        users_in_org = User.query.join(OrganizationUser).filter(OrganizationUser.organization_id == organization.id).all()
        
        data = [{"id": user.id, "email": user.email, "status": user in users_in_org} for user in all_users]
        
        return jsonify({
            "msg": f'{len(added_emails)} user(s) added, {len(not_found_emails)} not found, {len(already_added_emails)} emails already exist, ',
            "already_added_emails": already_added_emails,
            "added_emails": added_emails,
            "not_found_emails": not_found_emails,
            "data": data
        }), 200
    
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500

# delete user from organization by email and organization name
@app.route('/delete-user-from-org', methods=['POST'])
def delete_user_from_org():
    try:
        data = request.get_json()
        
        if 'emails' not in data or 'name' not in data:
            return jsonify({"msg": "Missing email(s) or organization name"}), 400
        
        emails = data['emails']
        org_name = data['name']
        organization = Organization.query.filter_by(name=org_name).first()
        
        if not organization:
            return jsonify({"msg": "Organization not found"}), 404
        
        deleted_emails = []
        not_found_emails = []
        
        for email in emails:
            user = User.query.filter_by(email=email).first()

            if user:
                existing_entry = OrganizationUser.query.filter_by(organization_id=organization.id, user_id=user.id).first()

                if existing_entry:
                    db.session.delete(existing_entry)
                    deleted_emails.append(email)
                else:
                    not_found_emails.append(email)
            else:
                not_found_emails.append(email)
        
        db.session.commit()
        
        # get updated list
        all_users = User.query.all()
        users_in_org = User.query.join(OrganizationUser).filter(OrganizationUser.organization_id == organization.id).all()
        
        data = [{"id": user.id, "email": user.email, "status": user in users_in_org} for user in all_users]
        
        return jsonify({
            "msg": f'{len(deleted_emails)} user(s) deleted, {len(not_found_emails)} not found', 
            "deleted_emails": deleted_emails,
            "not_found_emails": not_found_emails,
            "data": data
        }), 200
    
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500

# get users = emails for org
@app.route('/get-users-by-org', methods=['GET'])
def get_emails_by_organization():
    try:
        org_name = request.args.get('org_name')
        
        if not org_name:
            return jsonify({"msg": "Missing organization name"}), 400
        
        organization = Organization.query.filter_by(name=org_name).first()
        
        if not organization:
            return jsonify({"msg": "Organization not found"}), 404
        
        all_users = User.query.all()
        users_in_org = User.query.join(OrganizationUser).filter(OrganizationUser.organization_id == organization.id).all()
        
        data = [{"id": user.id, "email": user.email, "status": user in users_in_org} for user in all_users]
        print("data=>", data)
        return jsonify({"data": data}), 200
    
    except Exception as e:
        return jsonify({"msg": "An error occurred"}), 500
    
# Verify - protected route to check token
@app.route('/verify', methods=['GET'])
@jwt_required()  # requires a valid JWT token
def protected_route():
    print("verify")
    try:
        token_user_email = get_jwt_identity()  # Get user email from the token

        # check user email in database
        user = User.query.filter_by(email=token_user_email).first()

        if not user:
            return jsonify({"msg": "User not found"}), 404

        # update access_token
        access_token = create_access_token(identity=user.email)
        
        # Create a response object
        response = make_response(jsonify({"msg": "Check token is Ok", "access_token": access_token}))
        
        # Set the access token = access_token as a cookie 
        response.set_cookie("access_token", access_token, httponly=True, max_age=60)  # seconds Adjust the max_age as needed
        
        return response
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"msg": "An error occurred"}), 500
        
    
    # Test - to check if server works
@app.route('/test', methods=['GET'])
def test():
    try:
        # Create a response object
        response = make_response(jsonify({"msg": "Test Ok"}))
        return response
    
    except Exception as e:
        print("errors=>", e)
        return jsonify({"msg": "An error occurred"}), 500

# start tests
@app.route('/run-tests', methods=['POST'])
def run_tests():
    tests_dict = {"api": "test_api.py", "front": "test_front.py"}
    try:
        data = request.get_json()
                
        if 'command' not in data:
            return jsonify({"msg": "Wrong request"}), 400
        
        print("command=>", data['command'])
        if data['command'] not in ['api','front']:
            return jsonify({"msg": "Wrong command"}), 400
        
        # Run Pytest with the specified test file and generate an HTML report
        subprocess.run(['pytest', f'./tests/{tests_dict[data["command"]]}', '--html=./app/templates/report.html'])

        # modify link to css in html report file
        with open('./app/templates/report.html', 'r') as file:
            html_content = file.read()

        # Define the pattern to search for
        pattern = r'<link [^>]*href="[^"]*"[^>]*>'

        # Define the replacement <link> tag
        replacement_link = '<link href="{{ url_for(\'static\', filename=\'styles/style.css\') }}" rel="stylesheet" type="text/css"/>'

        # Use regular expressions to search and replace
        html_content = re.sub(pattern, replacement_link, html_content)

        # Write the modified HTML content back to the file
        with open('./app/templates/report.html', 'w') as file:
            file.write(html_content)
        
        # move css file
        # Define the source and destination paths
        source_path = './app/templates/assets/style.css'
        destination_path = './app/static/styles/style.css'

        try:
            # Move the file from the source folder to the destination folder
            shutil.move(source_path, destination_path)
            print(f"File moved")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            
        return jsonify({"msg": "Report OK"}), 200

    except Exception as e:
        print("errors=>", e)
        return jsonify({"msg": "An error occurred"}), 500
    

@app.route('/report')
def serve_report():
    return render_template('report.html')