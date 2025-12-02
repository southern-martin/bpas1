import dayjs from "dayjs";

export function CardActivityTimeline({ activities = [] }) {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>Activity Timeline</h2>

      {activities.length === 0 && <p>No activity yet.</p>}

      <div className="timeline">
        {activities.map((act, index) => (
          <div className="timeline-item" key={act.id}>
            <div className="timeline-marker">
              <div className="dot"></div>
              {index !== activities.length - 1 && <div className="line"></div>}
            </div>

            <div className="timeline-content">
              <div className="timeline-time">
                {dayjs(act.created_at).format("MMM D, YYYY — h:mm A")}
              </div>

              {act.status_after && (
                <div className="timeline-status">
                  <span className="status-pill">{act.status_after}</span>
                  <span>status updated</span>
                </div>
              )}

              {act.notes_added && (
                <div className="timeline-note">
                  <span className="note-icon">📝</span> {act.notes_added}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
