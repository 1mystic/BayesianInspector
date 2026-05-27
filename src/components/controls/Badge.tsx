
interface BadgeProps {
  label: string;
  variant: 'active' | 'spam' | 'ham' | 'neutral' | 'positive' | 'negative';
}

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>{label}</span>
  );
}
