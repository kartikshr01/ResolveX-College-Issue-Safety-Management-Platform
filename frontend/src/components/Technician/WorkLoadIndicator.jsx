function WorkloadIndicator({
  currentWorkload,
  maxWorkload,
}) {
  const percentage =
    (currentWorkload / maxWorkload) * 100;

  return (
    <div className="technician-workload">
      <div className="workload-value">
        <span>{currentWorkload} / {maxWorkload}</span>
        <span>{percentage}%</span>
      </div>

      <div className="workload-progress">
        <div
          className="workload-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default WorkloadIndicator;