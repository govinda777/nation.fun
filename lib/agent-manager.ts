// lib/agent-manager.ts
import { AgentEngine } from '@/src/lib/core/agent-engine';

/**
 * Gerencia os agentes em execução.
 * Em um ambiente serverless, este Map será reiniciado em cada invocação "fria".
 * Para produção, um armazenamento persistente como Redis ou um banco de dados é necessário.
 */
export const runningAgents = new Map<string, AgentEngine>();
