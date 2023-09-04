from selenium import webdriver
import pytest
import time

class TestFront():
  
  @pytest.fixture()
  def setup(self):
    self.driver=webdriver.Chrome()
    self.driver.maximize_window()
    yield
    self.driver.close()
    
  def test_LoginTitle(self, setup):
    self.driver.get('http://localhost:3000/')
    time.sleep(1)
    assert self.driver.title=="Homepage"
  
  def test_login(self, setup):
    self.driver.get('http://localhost:3000/login')
    self.driver.find_element("id", "email").send_keys("test5@test.com")
    self.driver.find_element("id", "password").send_keys("123")
    self.driver.find_element("id", "button-login").click()
    time.sleep(1)
    assert self.driver.title=="User"