# features/nation-pass-purchase.feature
Feature: Nation Pass NFT Purchase
  As a logged-in user,
  I want to purchase a Nation Pass NFT,
  So that I can get access to exclusive features.

  Scenario: Successful Purchase
    Given I am authenticated and on the homepage
    When I click the "Buy Nation Pass" button
    Then the transaction should be successful
    And my Nation Pass balance should be 1
