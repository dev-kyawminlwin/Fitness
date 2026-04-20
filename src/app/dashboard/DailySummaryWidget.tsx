export default function DailySummaryWidget() {
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Today's Summary</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Calories</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>0 / 2000</div>
        </div>

        <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Water (L)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>0.0 / 3.0</div>
        </div>

        <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Steps</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>0 / 10k</div>
        </div>

        <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Sleep (Hrs)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>--</div>
        </div>
      </div>
    </div>
  );
}
