import { Card } from '@/components/features/SimulationHistory/Card';
import type { SimulationRecord } from '@/data/simulation';
import { useSimulationStorage } from '@/hooks/useSimulationStorage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SimulationHistoryPage() {
  const { getAllFormData, deleteFormData } = useSimulationStorage();
  const navigate = useNavigate();

  const [data, setData] = useState<SimulationRecord[] | null>(getAllFormData());

  console.log({ data });

  if (!data || data.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10 text-center sm:py-14">
        <p className="text-muted-foreground mt-4">
          Você ainda não tem simulações salvas. Faça uma nova simulação para ver o resultado aqui.
        </p>
      </div>
    );
  }

  const handleClick = (id: string) => {
    void navigate(`/resultado/${id}`);
  };

  const handleDelete = (id: string) => {
    const userChoice = confirm('Deseja realmente excluir esta simulação?');
    if (userChoice === true) {
      const result = deleteFormData(id);
      setData(result);
    }
  };

  return (
    <div className="mx-auto px-4 py-10 sm:py-14">
      <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
        Histórico de Simulações
      </h1>
      <h2 className="text-foreground sm:text-1xl mt-1 text-sm">
        Acompanhe o histórico de seus planos financeiros.
      </h2>

      {data.map(record => (
        <div key={record.id} className="m-4">
          <Card
            goalName={record.goalName}
            goalDate={
              record.createdAt
                ? new Date(record.createdAt).toLocaleDateString()
                : 'Data desconhecida'
            }
            goalAmount={record.goalAmount}
            goalDeadline={record.goalDeadline}
            goalAmountMonthly={record.goalAmountMonthly}
            onClick={handleClick.bind(null, record.id)}
            onDelete={handleDelete.bind(null, record.id)}
          />
        </div>
      ))}
    </div>
  );
}
