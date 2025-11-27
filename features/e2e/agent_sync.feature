Feature: Agent Synchronization Script

  As a developer, I want to use a CLI script to synchronize local agent definitions
  with the remote Nation platform, ensuring that my changes in code are reflected
  in the deployed environment.

  Scenario: Creating a new agent
    Given a local agent definition file "new-agent.ts" with an empty address
    When I run the agent synchronization script
    Then the agent definition file "new-agent.ts" should be updated with a new address

  Scenario: Updating an existing agent
    Given a local agent definition file "existing-agent.ts" with a known address and a remote version that is out of sync
    When I run the agent synchronization script
    Then the script output should indicate that an update was performed

  Scenario: Syncing an agent with no changes
    Given a local agent definition file "synced-agent.ts" with a known address and a remote version that is in sync
    When I run the agent synchronization script
    Then the script output should indicate that the agent is already in sync
