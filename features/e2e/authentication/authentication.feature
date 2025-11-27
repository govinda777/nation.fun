# features/e2e/authentication/authentication.feature
Feature: User Authentication
  As a user,
  I want to be able to log in and log out,
  So that I can access my account securely.

  Scenario: Successful Login
    Given I am on the login page
    When I click the "Login" button
    Then I should be redirected to the dashboard page
    And I should see a "Welcome" message
