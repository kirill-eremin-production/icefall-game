// Утилиты форматирования для отображения чисел и времени в UI.
// Данный модуль не содержит игровой логики — только функции преобразования.

/**
 * Форматирование числа ресурсов:
 * - округляет до целого, если дробная часть близка к нулю (< 0.001);
 * - иначе возвращает число с одной десятичной.
 * Пример: 10 -> "10", 10.05 -> "10.1"
 */
export function format(n: number): string {
  return Math.abs(n) % 1 < 0.001 ? Math.round(n).toString() : n.toFixed(1);
}

/**
 * Преобразует количество секунд в строку формата MM:SS.
 * Отрицательные значения считаются как 0.
 */
export function formatTimeSecToMMSS(sec: number): string {
  const clamped = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(clamped / 60)).padStart(2, "0");
  const ss = String(clamped % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
