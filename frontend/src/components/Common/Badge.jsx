import "./Badge.css";

const Badge = ({
  children,
  variant = "category",
}) => {
  return (
    <span
      className={`rx-badge rx-badge-${variant}`}
    >
      {children}
    </span>
  );
};

export default Badge;