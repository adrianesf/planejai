import { Divider } from '@/components/shared/Divider';
import { GoalIcon, SquareArrowUpRight, Trash2 } from 'lucide-react';

interface CardProps {
  goalName: string;
  goalDate: string;
  goalAmount: string;
  goalDeadline: string;
  goalAmountMonthly: string;
  variant?: 'default' | 'primary';
  onClick?: () => void;
  onDelete?: () => void;
}

const variantClasses = {
  default: {
    card: 'bg-card',
    accent: 'text-primary',
    value: 'text-foreground',
    subtitle: 'text-muted-foreground',
  },
  primary: {
    card: 'bg-primary',
    accent: 'text-primary-foreground',
    value: 'text-primary-foreground',
    subtitle: 'text-primary-foreground/70',
  },
};

export function Card({
  goalName,
  goalDate,
  goalAmount,
  goalDeadline,
  goalAmountMonthly,
  variant = 'default',
  onClick,
  onDelete,
}: CardProps) {
  const styles = variantClasses[variant];

  return (
    <div
      className={['rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]', styles.card].join(
        ' ',
      )}
    >
      <div
        className={['flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6', styles.accent].join(
          ' ',
        )}
      >
        <div>
          <GoalIcon size={32} className={styles.accent} />
        </div>

        <div className="flex flex-col">
          <p className="text-foreground">{goalName}</p>
          <p className="text-muted-foreground">{goalDate}</p>
        </div>

        <div>
          <p className="text-muted-foreground">CUSTO DA META</p>
          <p className="text-foreground">R$ {goalAmount}</p>
        </div>

        <div>
          <p className="text-muted-foreground">PRAZO</p>
          <p className="text-foreground">{goalDeadline} meses</p>
        </div>

        <div>
          <p className="text-muted-foreground">ECONOMIA MENSAL</p>
          <p className="text-foreground">
            {!goalAmountMonthly ? 'Não definido' : `R$ ${goalAmountMonthly}`}
          </p>
        </div>

        <div>
          <Divider orientation="horizontal" className="mx-4 h-6" />
        </div>

        <div className="flex justify-between">
          <button
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4 rounded-md px-3 py-1 text-sm"
            onClick={onDelete}
          >
            <Trash2 size={32} className="text-red-600" />
          </button>

          <div>
            <Divider orientation="vertical" className="mx-4 h-6" />
          </div>

          <button
            className="bg-secondary-button text-foreground hover:bg-secondary-button/90 mt-4 rounded-md px-3 py-1 text-sm"
            onClick={onClick}
          >
            <div className="flex items-center  gap-2 p-1">
              <SquareArrowUpRight size={32} className="text-foreground" />
              Ver detalhes
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
