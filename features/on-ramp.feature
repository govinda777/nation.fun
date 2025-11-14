# features/on-ramp.feature
Feature: On-Ramp Integration
  As a user,
  I want to see the On-Ramp widget,
  So that I can add funds to my wallet.

  Scenario: Widget is visible for authenticated users
    Given I am authenticated and on the homepage
    Then the On-Ramp widget should be visible
