import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import styles from './AppDatePicker.module.css';

interface AppDatePickerProps {
  name?: string;
  /** "YYYY-MM-DD", or "YYYY-MM-DDTHH:mm" when `withTime` is set */
  value: string;
  onChange: (value: string) => void;
  /** Called once focus leaves the whole picker (input and calendar), not when moving inside it. */
  onBlur?: () => void;
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  /** Adds hour/minute selection. The value then has the form "YYYY-MM-DDTHH:mm". */
  withTime?: boolean;
  /** Step between minute options (only with `withTime`). */
  minuteStep?: number;
  /** Disables days after today. Default true, which suits a birth date. */
  disableFuture?: boolean;
}

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];

const WEEK_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

const LABELS = {
  dialog: 'Wybór daty',
  prevMonth: 'Poprzedni miesiąc',
  nextMonth: 'Następny miesiąc',
  month: 'Miesiąc',
  year: 'Rok',
  hour: 'Godzina',
  minute: 'Minuty',
  done: 'Gotowe'
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const pad = (n: number) => String(n).padStart(2, '0');

const toDateStr = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

const toValueStr = (dateStr: string, hour: number, minute: number, withTime: boolean) =>
  withTime ? `${dateStr}T${pad(hour)}:${pad(minute)}` : dateStr;

interface ParsedValue {
  year: number;
  month: number; // 0-11
  day: number;
  hour: number;
  minute: number;
}

// Parsed by hand: `new Date("YYYY-MM-DD")` is read as UTC and can shift the day.
const parseValue = (value: string): ParsedValue | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
    hour: match[4] ? Number(match[4]) : 0,
    minute: match[5] ? Number(match[5]) : 0
  };
};

export const AppDatePicker = ({
  name = 'birthDate',
  value,
  onChange,
  onBlur,
  placeholder = 'Select date',
  isRequired = false,
  className = '',
  withTime = false,
  minuteStep = 5,
  disableFuture = true
}: AppDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Local date, not toISOString(): the UTC date is off by a day around midnight.
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayStr = toDateStr(currentYear, currentMonth, now.getDate());

  const parsed = parseValue(value);
  const selectedDateStr = parsed ? toDateStr(parsed.year, parsed.month, parsed.day) : '';

  const [viewYear, setViewYear] = useState(parsed?.year ?? (disableFuture ? 2000 : currentYear));
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.month : disableFuture ? 0 : currentMonth);
  const [time, setTime] = useState({ hour: parsed?.hour ?? 0, minute: parsed?.minute ?? 0 });

  const syncFromValue = useCallback((v: string) => {
    const p = parseValue(v);
    if (!p) return;
    setViewYear(p.year);
    setViewMonth(p.month);
    setTime({ hour: p.hour, minute: p.minute });
  }, []);

  // Keep the calendar in step when the value is changed from outside (e.g. form reset).
  useEffect(() => {
    syncFromValue(value);
  }, [value, syncFromValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openPicker = () => {
    syncFromValue(value);
    setIsOpen(true);
  };

  // Focus goes back to the input first, so removing the focused element
  // from the DOM can't be mistaken for the picker losing focus.
  const closePicker = () => {
    inputRef.current?.focus();
    setIsOpen(false);
  };

  // Fires only when focus leaves the whole picker, not when it moves between its parts.
  const handleContainerBlur = (e: ReactFocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(e.relatedTarget as Node | null)) return;
    setIsOpen(false);
    onBlur?.();
  };

  const handleContainerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && isOpen) {
      e.stopPropagation();
      closePicker();
    }
  };

  const handleInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault(); // also stops Enter from submitting the surrounding form
      if (!isOpen) openPicker();
    }
  };

  // Clicking inside the calendar must not pull focus away from the picker.
  // Selects are excluded, otherwise they would not open.
  const handlePopoverMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLSelectElement || e.target instanceof HTMLOptionElement)) {
      e.preventDefault();
    }
  };

  const maxYear = Math.max(disableFuture ? currentYear : currentYear + 10, viewYear);
  const minYear = Math.min(currentYear - 109, viewYear);
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  const canGoPrev = viewYear > minYear || viewMonth > 0;
  const canGoNext = disableFuture
    ? viewYear < currentYear || viewMonth < currentMonth
    : viewYear < maxYear || viewMonth < 11;

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

  const handleYearChange = (year: number) => {
    setViewYear(year);
    if (disableFuture && year === currentYear && viewMonth > currentMonth) {
      setViewMonth(currentMonth);
    }
  };

  const handleSelectDay = (day: number) => {
    onChange(toValueStr(toDateStr(viewYear, viewMonth, day), time.hour, time.minute, withTime));
    // With time selection the calendar stays open so the time can be set too.
    if (!withTime) closePicker();
  };

  const handleTimeChange = (next: Partial<typeof time>) => {
    const updated = { ...time, ...next };
    setTime(updated);
    // Without a chosen day the time is only remembered and applied once a day is picked.
    if (parsed) {
      onChange(toValueStr(selectedDateStr, updated.hour, updated.minute, true));
    }
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const step = Math.max(1, Math.floor(minuteStep));
  const minuteOptions = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
  if (!minuteOptions.includes(time.minute)) {
    minuteOptions.push(time.minute);
    minuteOptions.sort((a, b) => a - b);
  }

  return (
    <div
      className={`${styles.container} ${className}`}
      ref={containerRef}
      onBlur={handleContainerBlur}
      onKeyDown={handleContainerKeyDown}
    >
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="text"
        readOnly
        autoComplete="off"
        value={withTime ? value.replace('T', ' ') : value}
        placeholder={placeholder}
        required={isRequired}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        onKeyDown={handleInputKeyDown}
        className={styles.inputField}
      />

      {isOpen && (
        <div
          className={styles.popover}
          role="dialog"
          aria-label={LABELS.dialog}
          tabIndex={-1}
          onMouseDown={handlePopoverMouseDown}
        >
          <div className={styles.header}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label={LABELS.prevMonth}
            >
              <ChevronLeft size={16} />
            </button>

            <div className={styles.headerSelects}>
              <select
                className={styles.select}
                value={viewMonth}
                aria-label={LABELS.month}
                onChange={(e) => setViewMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((mName, i) => (
                  <option
                    key={mName}
                    value={i}
                    disabled={disableFuture && viewYear === currentYear && i > currentMonth}
                  >
                    {mName}
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                value={viewYear}
                aria-label={LABELS.year}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={styles.navBtn}
              onClick={handleNextMonth}
              disabled={!canGoNext}
              aria-label={LABELS.nextMonth}
            >
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
              const dayStr = toDateStr(viewYear, viewMonth, day);
              const selected = dayStr === selectedDateStr;
              const isToday = dayStr === todayStr;
              const disabled = disableFuture && dayStr > todayStr;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={`${day} ${MONTH_NAMES[viewMonth].toLowerCase()} ${viewYear}`}
                  className={[
                    styles.dayBtn,
                    isToday ? styles.today : '',
                    selected ? styles.selected : ''
                  ].join(' ')}
                  onClick={() => handleSelectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {withTime && (
            <div className={styles.timeRow}>
              <div className={styles.timeGroup}>
                <Clock size={16} aria-hidden="true" />
                <select
                  className={`${styles.select} ${styles.timeSelect}`}
                  value={time.hour}
                  aria-label={LABELS.hour}
                  onChange={(e) => handleTimeChange({ hour: Number(e.target.value) })}
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{pad(h)}</option>
                  ))}
                </select>
                <span className={styles.timeSeparator}>:</span>
                <select
                  className={`${styles.select} ${styles.timeSelect}`}
                  value={time.minute}
                  aria-label={LABELS.minute}
                  onChange={(e) => handleTimeChange({ minute: Number(e.target.value) })}
                >
                  {minuteOptions.map((m) => (
                    <option key={m} value={m}>{pad(m)}</option>
                  ))}
                </select>
              </div>

              <button type="button" className={styles.doneBtn} onClick={closePicker}>
                {LABELS.done}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
