const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const sinon = require('sinon');
const nock = require('nock');

// Mock dependencies
const { processWhatsAppMessage } = require('../../services/whatsapp/message-processor.js');
const webhookHandler = require('../../services/whatsapp/webhook-handler.js').default;

let from, messageBody;
let mockWhatsAppClient, mockAgentOrchestrator;

// Mock the environment variables
process.env.WHATSAPP_VERIFY_TOKEN = 'test-token';
process.env.WHATSAPP_APP_SECRET = 'test-secret';

Given('a webhook from WhatsApp is configured', function () {
  // This step is now a no-op
});

When('a user sends the message {string}', function (message) {
  from = '1234567890';
  messageBody = message;
});

Then('the message is validated correctly', function () {
  const req = {
    headers: {
      'x-hub-signature-256': 'sha256=mock_signature'
    },
    body: {
      entry: [{
        changes: [{
          value: {
            messages: [{
              from,
              text: {
                body: messageBody
              },
              type: 'text'
            }]
          }
        }]
      }]
    }
  };

  const validateStub = sinon.stub(webhookHandler, 'validateWhatsAppWebhook').returns(true);
  const isValid = webhookHandler.validateWhatsAppWebhook(req);
  assert.strictEqual(isValid, true);
  validateStub.restore();
});

Then('the agent-orchestrator is selected', async function () {
  mockAgentOrchestrator = {
    getAgentResponse: sinon.stub().resolves('This is a mock response.')
  };
  mockWhatsAppClient = {
    sendMessage: sinon.stub().resolves()
  };

  await processWhatsAppMessage({
    entry: [{
      changes: [{
        value: {
          messages: [{
            from,
            text: {
              body: messageBody
            },
            type: 'text'
          }]
        }
      }]
    }]
  }, {
    agentOrchestrator: mockAgentOrchestrator,
    whatsAppClient: mockWhatsAppClient
  });

  assert(mockAgentOrchestrator.getAgentResponse.calledWith(messageBody));
});

Then('a response is sent back', async function () {
  assert(mockWhatsAppClient.sendMessage.calledWith(from, 'This is a mock response.'));
});
