import "./Dashboard.css";

const StatCard = ({ label, value, description, highlighted = false }) => {
  return (
    <div
      className={`stat-card ${
        highlighted ? "stat-card-highlighted" : ""
      }`}
    >
      <span className="stat-card-label">{label}</span>

      <strong className="stat-card-value">{value}</strong>

      <p>{description}</p>
    </div>
  );
};

export default StatCard;