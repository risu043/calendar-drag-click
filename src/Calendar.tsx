import React, { useState, useCallback, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import Modal from 'react-modal';
import './Calendar.css';

export default function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventColor, setEventColor] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // クリックした日付のデータ（モダール開く時に取得し、モダール閉じるときに破棄）
  const [selectedDate, setSelectedDate] = useState<EventInput | null>(null);

  // event作成----------------------------------------------------------------
  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventName(e.target.value);
  };

  const handleEventColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventColor(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate && eventName) {
      setEvents([
        ...events,
        {
          id: String(events.length + 1),
          title: eventName,
          color: eventColor,
          start: selectedDate.date,
          allDay: true,
        },
      ]);
      setEventName('');
      setEventColor('');
    }
    setModalIsOpen(false);
  };

  const handleDateClick = (arg: EventInput) => {
    setModalIsOpen(true);
    setSelectedDate(arg);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedDate(null);
  };

  // event削除----------------------------------------------------------------
  const handleEventClick = useCallback((clickInfo: EventInput) => {
    if (
      window.confirm(`このイベント「${clickInfo.event.title}」を削除しますか`)
    ) {
      clickInfo.event.remove();
    }
  }, []);

  // 作成したeventをドラッグできるようにする-------------------------------------
  const handleEventDrop = (info: EventInput) => {
    const updatedEvents = events.map((event) => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start,
          end: info.event.end,
          allDay: info.event.allDay,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    const draggable = new Draggable(elRef.current, {
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText,
          create: true,
        };
      },
    });

    return () => draggable.destroy();
  }, []);

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        editable={true}
        droppable={true}
      />

      <Modal isOpen={modalIsOpen} className="Modal" overlayClassName="Overlay">
        <div className="Modal-inner">
          <form onSubmit={handleFormSubmit}>
            <div className="input-area">
              <label htmlFor="eventName">イベント名：</label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={handleEventNameChange}
              />
            </div>
            <div className="input-area">
              <label htmlFor="color">カラー：</label>
              <input
                id="color"
                type="color"
                onChange={handleEventColorChange}
              />
            </div>
            <input
              className="submit-button"
              type="submit"
              value="eventを作成"
            />
          </form>
          <button className="close-button" onClick={handleCloseModal}>
            ×
          </button>
        </div>
      </Modal>
    </>
  );
}

function renderEventContent(eventInfo: EventInput) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}
