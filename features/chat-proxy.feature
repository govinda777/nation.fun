Feature: Secure Chat Proxy
  As a user,
  I want to interact with the chatbot through a secure proxy,
  So that the API key is not exposed on the frontend.

  Scenario: The frontend sends a message to the chat proxy
    Given the NARION API is mocked to return a successful response
    When the frontend sends a POST request to "/api/chat" with the message "Hello, world!"
    Then the response status should be 200
    And the response should contain the assistant's message
    And the NARION API should have been called with the correct authorization header
