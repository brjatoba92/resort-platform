import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useReservations } from '../../../hooks/useReservations';
import { ReservationEvent } from '../../../types/reservation';
import styles from './ReservationCalendar.module.css';

const localizer = momentLocalizer(moment);

export function ReservationCalendar() {
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const { reservations, isLoading } = useReservations();

  const events = reservations.map((reservation): ReservationEvent => ({
    id: reservation.id,
    title: `Room ${reservation.roomId} - ${reservation.guestName}`,
    start: new Date(reservation.checkInDate),
    end: new Date(reservation.checkOutDate),
    resourceId: reservation.roomId,
    reservation: reservation,
  }));

  const handleEventSelect = useCallback((event: ReservationEvent) => {
    navigate(`/reservations/${event.id}`);
  }, [navigate]);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    const { start, end, resourceId } = slotInfo;
    navigate('/reservations/new', {
      state: {
        startDate: start,
        endDate: end,
        roomId: resourceId ? String(resourceId) : undefined,
      },
    });
  }, [navigate]);

  const handleRangeChange = useCallback((range: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(range)) {
      setDate(range[0]);
    } else {
      setDate(range.start);
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Reservation Calendar</h1>
        <div className={styles.actions}>
          <button
            className={styles.todayButton}
            onClick={() => setDate(new Date())}
          >
            Today
          </button>
          <button
            className={styles.newButton}
            onClick={() => navigate('/reservations/new')}
          >
            New Reservation
          </button>
        </div>
      </div>
      <div className={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view as any}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={setDate}
          style={{ height: 'calc(100vh - 200px)' }}
          selectable
          onSelectEvent={handleEventSelect}
          onRangeChange={handleRangeChange}
          onSelectSlot={handleSelectSlot}
          tooltipAccessor={(event) => event.title}
          eventPropGetter={(event) => ({
            className: styles[event.reservation.status],
          })}
          dayPropGetter={(date) => ({
            className: moment(date).isSame(new Date(), 'day')
              ? styles.today
              : undefined,
          })}
          components={{
            event: (props) => (
              <div className={styles.event}>
                <div className={styles.eventTime}>
                  {moment(props.event.start).format('HH:mm')}
                </div>
                <div className={styles.eventTitle}>{props.event.title}</div>
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
}