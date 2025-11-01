# features/whatsapp-integration.feature
Feature: WhatsApp Integration
  As a user,
  I want to send and receive messages via WhatsApp,
  So that I can interact with the NATION agent.

  Scenario: Receiving and processing a message
    Given a webhook from WhatsApp is configured
    When a user sends the message "Olá, preciso de ajuda"
    Then the message is validated correctly
    And the agent-orchestrator is selected
    And a response is sent back
