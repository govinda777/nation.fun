import Link from 'next/link';

export default function AgentRow({ agent }) {
  return (
    <tr>
      <td>{agent.name}</td>
      <td>{agent.description}</td>
      <td>{agent.skills.join(', ')}</td>
      <td>
        <Link href={`/chat?prompt=${encodeURIComponent(agent.prompt)}`} passHref>
          <button className="btn-primary">Falar com o Agente</button>
        </Link>
      </td>
    </tr>
  );
}
