import React, { useState, useEffect } from "react";
import { Table, Form } from "react-bootstrap";
import moment from "moment";

// 型定義
interface WorkoutRecord {
  id: number;
  date: string;
  menu: string;
  sets: { reps: number; weight: number }[];
}

/**
 * サマリーページ
 * @returns
 */
const Summary: React.FC = () => {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<WorkoutRecord[]>([]);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    // ローカルストレージからデータを取得（仮実装）
    const storedRecords = localStorage.getItem("workoutRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    }
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, period]);

  const filterRecords = () => {
    const now = moment();
    const filtered = records.filter((record) => {
      const recordDate = moment(record.date);
      switch (period) {
        case "year":
          return recordDate.isSame(now, "year");
        case "month":
          return recordDate.isSame(now, "month");
        case "week":
          return recordDate.isSame(now, "week");
        case "day":
          return recordDate.isSame(now, "day");
        default:
          return true;
      }
    });
    setFilteredRecords(filtered);
  };

  // メニューごとの集計
  const menuStats: { [key: string]: number } = {};
  filteredRecords.forEach((record) => {
    if (!menuStats[record.menu]) {
      menuStats[record.menu] = 0;
    }
    menuStats[record.menu] += record.sets.reduce(
      (sum, set) => sum + set.reps,
      0
    );
  });

  return (
    <div className="container mt-4">
      <h2>トレーニングサマリー</h2>

      {/* 期間選択 */}
      <Form.Select
        className="mb-3"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        <option value="year">今年</option>
        <option value="month">今月</option>
        <option value="week">今週</option>
        <option value="day">今日</option>
      </Form.Select>

      {/* 集計テーブル */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>メニュー</th>
            <th>総回数</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(menuStats).map(([menu, count]) => (
            <tr key={menu}>
              <td>{menu}</td>
              <td>{count} 回</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Summary;
