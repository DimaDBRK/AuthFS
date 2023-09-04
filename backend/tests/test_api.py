import requests
import pytest


# Users
# test if server on
class Api_Test:
  pass

  ENDPOINT = "http://127.0.0.1:5000"
  user_email = "auto.test@user.com"
  non_existing_email = "non@email.com"
  password = "12345"
  wrong_password = "123456"
  wrong_email = "auto.test@com"
  organization = "auto"
  token = ""
 
  @classmethod
  def set_cls_token(cls, new_token):
      cls.token = new_token
      return cls.token
    
class Test_API_Base(Api_Test):
  # @pytest.fixture(autouse=True, scope='class')
  # def state(self):
  #       return {}
      
  def test_can_call_endpoint(self):
    response = requests.get(self.ENDPOINT + '/test')
    assert response.status_code == 200

  # create user
  def test_create_user_with_normal_email(self):
    payload = {
      "email" : self.user_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signup', json=payload)
    assert response.status_code in [200, 201] 
    # get all users list and check if new user with email exist
    response_all_users = requests.get(self.ENDPOINT + '/users')
    users_list = response_all_users.json()['users']
    # print("res=>", response_all_users.json()['users'])
    assert any(user['email'] == self.user_email for user in users_list)
    
  
  # create user with the same email -> error
  def test_create_user_with_existing_email(self):
    payload = {
      "email" : self.user_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signup', json=payload)
    assert response.status_code in [409] 
    msg = response.json()["msg"]
    print(msg)
    
  # create user with wrong e-mail format -> error
  def test_create_user_with_wrong_email_format(self):
    payload = {
      "email" : self.wrong_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signup', json=payload)
    assert response.status_code in [400] 
    msg = response.json()["msg"]
    print(msg)


  # login with wrong email format
  def test_login_with_wrong_email_format(self):
    payload = {
      "email" : self.wrong_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signin', json=payload)
    assert response.status_code in [400] 
    msg = response.json()["msg"]
    print("MSG=>", msg)

  # login with non existing email 
  def test_login_with_non_existing_email(self):
    payload = {
      "email" : self.non_existing_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signin', json=payload)
    assert response.status_code in [401] 
    msg = response.json()["msg"]
    print("MSG=>", msg)


  # login with wrong password 
  def test_login_with_wrong_password(self):
    payload = {
      "email" : self.user_email,
      "password" : self.wrong_password
    }
    response = requests.post(self.ENDPOINT + '/signin', json=payload)
    assert response.status_code in [401] 
    msg = response.json()["msg"]
    print("MSG=>", msg)

  # login and get access token
  def test_login_with_normal_email(self):
    payload = {
      "email" : self.user_email,
      "password" : self.password
    }
    response = requests.post(self.ENDPOINT + '/signin', json=payload)
    assert response.status_code in [200, 201] 
    msg = response.json()["msg"]
    
    new_token = response.json()["access_token"]
    self.set_cls_token(new_token)
    
    print("MSG=>", msg)
    print("token=>", new_token)


  # Token - verification
  def test_correct_token_verification(self):
    headers = {"Content-Type": "application/json", "Authorization": f'Bearer {self.token}'}
    print(headers)
    response = requests.get(self.ENDPOINT + '/verify',  headers=headers)
    assert response.status_code in [200] 
    msg = response.json
    print("MSG=>", msg)

  # Token - verification
  def test_incorrect_token_verification(self):
    headers = {"Content-Type": "application/json", "Authorization": f'Bearer {self.token}testsymbols'}
    print(headers)
    response = requests.get(self.ENDPOINT + '/verify',  headers=headers)
    assert response.status_code in [422] 
    msg = response.json
    print("MSG=>", msg)
    
    # Token - verification
  def test_without_token_verification(self):
    headers = {"Content-Type": "application/json", "Authorization": ""}
    print(headers)
    response = requests.get(self.ENDPOINT + '/verify',  headers=headers)
    assert response.status_code in [401] 
    msg = response.json
    print("MSG=>", msg)

  # delete user with correct email and wrong password
  def test_delete_with_correct_email_and_wrong_password(self):
    payload = {
      "email" : self.user_email,
      "password" : self.wrong_password,
      "command":"deleteuser"
    }
    response = requests.post(self.ENDPOINT + '/users/delete-user', json=payload)
    assert response.status_code in [401] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
    # get all users list and check if new user with email exist
    response_all_users = requests.get(self.ENDPOINT + '/users')
    users_list = response_all_users.json()['users']
    # print("res=>", response_all_users.json()['users'])
    assert any(user['email'] == self.user_email for user in users_list)
    
  # delete user with wrong email and correct password
  def test_delete_with_wrong_email_and_correct_password(self):
    payload = {
      "email" : self.wrong_email,
      "password" : self.password,
      "command":"deleteuser"
    }
    response = requests.post(self.ENDPOINT + '/users/delete-user', json=payload)
    assert response.status_code in [401] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
    # get all users list and check if new user with email exist
    response_all_users = requests.get(self.ENDPOINT + '/users')
    users_list = response_all_users.json()['users']
    # print("res=>", response_all_users.json()['users'])
    assert any(user['email'] == self.user_email for user in users_list)

    
    
  # delete user with email, correct password and wrong command
  def test_delete_correct_email_and_correct_password_and_wrong_command(self):
    payload = {
      "email" : self.wrong_email,
      "password" : self.password,
      "command": "other"
    }
    response = requests.post(self.ENDPOINT + '/users/delete-user', json=payload)
    assert response.status_code in [400] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
  # get all users list and check if new user with email exist
    response_all_users = requests.get(self.ENDPOINT + '/users')
    users_list = response_all_users.json()['users']
    # print("res=>", response_all_users.json()['users'])
    assert any(user['email'] == self.user_email for user in users_list)

    # get all users
  def test_get_all_users(self):
    response = requests.get(self.ENDPOINT + '/users')
    assert response.status_code == 200
    print (response.json()['users'])



  # Organizations
  # create Organization
  def test_create_new_organization(self):
    payload = {
      "name" : self.organization,
      "author" : self.user_email
    }
    response = requests.post(self.ENDPOINT + '/create-org', json=payload)
    assert response.status_code in [200, 201] 
    # get all org list and check if new org  exist
    response_all_org = requests.get(self.ENDPOINT + '/organizations')
    org_list = response_all_org.json()['organizations']
    # print("res=>", response_all_users.json()['users'])
    assert self.organization in org_list
    
  
  # create org with the same name -> error
  def test_create_the_same_organization(self):
    payload = {
      "name" : self.organization,
      "author" : self.user_email
    }
    response = requests.post(self.ENDPOINT + '/create-org', json=payload)
    assert response.status_code in [409] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
  # get all org list and check if new org  exist
    response_all_org = requests.get(self.ENDPOINT + '/organizations')
    org_list = response_all_org.json()['organizations']
    # print("res=>", response_all_users.json()['users'])
    assert self.organization in org_list


  # delete organization
  def test_delete_organization(self):
    
    response = requests.delete(self.ENDPOINT + '/delete-org' + f'?name={self.organization}')
    assert response.status_code in [200] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
  # get all org list and check if new org  exist
    org_list = response.json()['organizations']
    # print("res=>", response_all_users.json()['users'])
    assert self.organization not in org_list
    
  # last test - delete user

  # delete existing user with correct password
  def test_delete_correct_email_and_correct_password_and_correct_command(self):
    payload = {
      "email" : self.user_email,
      "password" : self.password,
      "command":"deleteuser"
    }
    response = requests.post(self.ENDPOINT + '/users/delete-user', json=payload)
    assert response.status_code in [200] 
    msg = response.json()["msg"]
    print("MSG=>", msg)
    # check if user deleted
    # get all users list and check if new user with email exist
    response_all_users = requests.get(self.ENDPOINT + '/users')
    users_list = response_all_users.json()['users']
    # print("res=>", response_all_users.json()['users'])
    assert not any(user['email'] == self.user_email for user in users_list)
    
  