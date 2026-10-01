type ServiceCardProps = {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  tone?: 'green' | 'sand' | 'blue';
};

export function ServiceCard({ icon, title, description, tags, tone = 'green' }: ServiceCardProps) {
  return (
    <article className={`service-card tone-${tone}`}>
      <div className="service-card-icon" aria-hidden="true">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="service-tags">
        {tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  );
}
