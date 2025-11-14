# features/nato-swap.feature
Feature: NATO Token Swap
  As a logged-in user,
  I want to swap ETH for NATO tokens,
  So that I can use them in the Nation.fun ecosystem.

  Scenario: Successful Swap
    Given I am authenticated and on the homepage with a funded wallet
    And the Uniswap V2 environment is set up
    When I swap 0.1 ETH for NATO tokens
    Then the transaction should be successful
    And my NATO token balance should be greater than 0
