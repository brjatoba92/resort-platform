import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './Calendar.module.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId?: string;
  allDay?: boolean;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

interface CalendarProps {
  events: CalendarEvent[];
  resources?: Array<{ id: string; title: string }>;
  onEventSelect?: (event: CalendarEvent) => void;
  onRangeChange?: (dates: Date[] | { start: Date; end: Date }) => void;
  onSelectSlot?: (slotInfo: SlotInfo) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  resources,
  onEventSelect,
  onRangeChange,
  onSelectSlot,
}) => {
  const eventStyleGetter = (event: CalendarEvent) => {
    let className = `${styles.event}`;

    switch (event.status) {
      case 'confirmed':
        className += ` ${styles.eventConfirmed}`;
        break;
      case 'pending':
        className += ` ${styles.eventPending}`;
        break;
      case 'cancelled':
        className += ` ${styles.eventCancelled}`;
        break;
    }

    return {
      className,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <BigCalendar
          localizer={localizer}
          events={events}
          resources={resources}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          defaultView={Views.MONTH}
          step={60}
          showMultiDayTimes
          selectable
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => onEventSelect?.(event as CalendarEvent)}
          onRangeChange={onRangeChange}
          onSelectSlot={onSelectSlot}
          messages={{
            today: 'Hoje',
            previous: 'Anterior',
            next: 'Próximo',
            month: 'Mês',
            week: 'Semana',
            day: 'Dia',
            agenda: 'Agenda',
            date: 'Data',
            time: 'Hora',
            event: 'Evento',
            allDay: 'Dia inteiro',
            noEventsInRange: 'Não há eventos neste período.',
          }}
        />
      </div>
    </div>
  );
};