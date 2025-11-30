Feature: Secure Chat API Interaction
  As a user,
  I want my chat messages to be processed securely
  So that my session information and API tokens are never exposed to the client-side.

  Background:
    Given the secure chat API endpoint is available at "/api/chat"

  Scenario: A user sends a message through the secure API
    When the frontend sends a POST request to "/api/chat" with the message "Hello, secure world!"
    Then the backend should receive the message
    And the backend should call the Nation API with the correct payload
    And the `NATION_TOKEN` must remain on the server-side and never be part of the client request or response

  Scenario: Eavesdropping on frontend-backend communication
    When an attacker inspects the network traffic between the client and the server
    Then the attacker must not find the `NATION_TOKEN` in the request headers, body, or URL
    And the attacker must not find the `NATION_TOKEN` in the response from "/api/chat"
