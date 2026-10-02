import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './AppDatePicker.module.css';

interface AppDatePickerProps {
  name?: string;
  value: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const WEEK_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export const AppDatePicker = ({
  name = 'birthDate',
  value,
  onChange,
  placeholder = 'Select date',
  isRequired = false,
  className = '',
}: AppDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value) : new Date(2000, 0, 1);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    onChange(`${viewYear}-${formattedMonth}-${formattedDay}`);
    setIsOpen(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isSelected = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return value === `${viewYear}-${formattedMonth}-${formattedDay}`;
  };

  const isFuture = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${viewYear}-${formattedMonth}-${formattedDay}` > todayStr;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 110 }, (_, i) => currentYear - i);

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <input
        id={name}
        name={name}
        type="text"
        readOnly
        tabIndex={-1}
        value={value}
        placeholder={placeholder}
        required={isRequired}
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.inputField}
      />

      {isOpen && (
        <div className={styles.popover}>
          <div className={styles.header}>
            <button type="button" className={styles.navBtn} onClick={handlePrevMonth}>
              <ChevronLeft size={16} />
            </button>

            <div className={styles.headerSelects}>
              <select
                className={styles.select}
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((mName, i) => (
                  <option key={mName} value={i}>{mName}</option>
                ))}
              </select>

              <select
                className={styles.select}
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button type="button" className={styles.navBtn} onClick={handleNextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.weekdays}>
            {WEEK_DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptyCell} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const selected = isSelected(day);
              const disabled = isFuture(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  className={`${styles.dayBtn} ${selected ? styles.selected : ''}`}
                  onClick={() => handleSelectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};