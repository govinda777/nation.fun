# features/login.feature
Feature: User Authentication with Privy
  As a user,
  I want to log in using Privy,
  So that I can access my account and wallet.

  Scenario: Successful Login
    Given I am on the homepage
    And I am not authenticated
    When I click the "Login" button
    Then I should be able to complete the Privy login process
    And I should see my wallet address on the header
    And I should see a "Logout" button
