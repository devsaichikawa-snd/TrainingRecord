import React, { useState } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Component
import WorkoutRecordModal from "./WorkoutRecord";

const localizer = momentLocalizer(moment);

// 型定義
interface WorkoutEvent extends Event {
  id: number;
  menu: string;
}

/**
 * カレンダー
 * @returns
 */
const WorkoutCalendar: React.FC = () => {
  const [events, setEvents] = useState<WorkoutEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    setSelectedDate(start.toISOString());
    setShowModal(true);
  };

  const handleSaveRecord = (record: WorkoutEvent) => {
    setEvents([
      ...events,
      { ...record, start: new Date(record.date), end: new Date(record.date) },
    ]);
  };

  const handleDeleteRecord = (id: number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />

      <WorkoutRecordModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSaveRecord}
      />

      {/* 記録一覧表示 */}
      <div className="mt-3">
        <h4>トレーニング記録</h4>
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              {moment(event.start).format("YYYY/MM/DD")} - {event.menu}
              <button
                className="btn btn-danger btn-sm ms-2"
                onClick={() => handleDeleteRecord(event.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkoutCalendar;
