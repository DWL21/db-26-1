import { CATEGORIES } from './categories';

interface Props {
  selected: string[];
  onChange: (cats: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function CategoryPage({ selected, onChange, onBack, onNext }: Props) {
  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(c => c !== value)
        : [...selected, value]
    );
  };

  const toggleAll = () => {
    onChange(selected.length === CATEGORIES.length ? [] : CATEGORIES.map(c => c.value));
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>← 뒤로</button>
        <div className="step-indicator">
          <span className="step active">1</span>
          <span className="step-line" />
          <span className="step">2</span>
        </div>
      </div>

      <div className="glass-panel">
        <h2 className="page-title">어떤 공지를 받고 싶으신가요?</h2>
        <p className="page-subtitle">관심 카테고리를 선택하세요. 나중에 변경할 수 있습니다.</p>

        <div className="cat-toolbar">
          <span className="cat-count">
            {selected.length > 0 ? `${selected.length}개 선택됨` : '카테고리를 선택하세요'}
          </span>
          <button type="button" className="btn-link" onClick={toggleAll}>
            {selected.length === CATEGORIES.length ? '모두 해제' : '모두 선택'}
          </button>
        </div>

        <div className="cat-grid">
          {CATEGORIES.map(cat => {
            const isSelected = selected.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                className={`cat-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggle(cat.value)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{cat.label}</span>
                <span className="cat-desc">{cat.description}</span>
                {isSelected && <span className="cat-check">✓</span>}
              </button>
            );
          })}
        </div>

        <button
          className="btn-primary"
          disabled={selected.length === 0}
          onClick={onNext}
        >
          다음: 이메일 입력
          <span style={{ marginLeft: '0.4rem' }}>→</span>
        </button>
      </div>
    </div>
  );
}
