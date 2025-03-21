import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// TODO: モーダルなので、ComponentのModal配下に移す

// 型定義
interface WorkoutRecordProps {
  show: boolean;
  onHide: () => void;
  onSave: (record: WorkoutRecord) => void;
}

interface WorkoutRecord {
  id: number;
  date: string;
  menu: string;
  sets: { reps: number; weight: number }[];
}

/**
 * トレーニング記録モーダル
 * @param
 * @returns
 */
const WorkoutRecordModal: React.FC<WorkoutRecordProps> = ({
  show,
  onHide,
  onSave,
}) => {
  const [menus, setMenus] = useState<string[]>([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [sets, setSets] = useState([{ reps: 0, weight: 0 }]);

  useEffect(() => {
    // トレーニングメニューをローカルストレージから取得
    const storedMenus = localStorage.getItem("trainingMenus");
    if (storedMenus) {
      setMenus(JSON.parse(storedMenus).map((menu: any) => menu.name));
    }
  }, []);

  const handleSave = () => {
    onSave({
      id: Date.now(),
      date: new Date().toISOString(),
      menu: selectedMenu,
      sets,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>トレーニング記録</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>トレーニングメニュー</Form.Label>
            <Form.Select
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
            >
              <option value="">選択してください</option>
              {menus.map((menu, index) => (
                <option key={index} value={menu}>
                  {menu}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>セット（回数・重量）</Form.Label>
            {sets.map((set, index) => (
              <div key={index} className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="回数"
                  value={set.reps}
                  onChange={(e) => {
                    const newSets = [...sets];
                    newSets[index].reps = Number(e.target.value);
                    setSets(newSets);
                  }}
                />
                <Form.Control
                  type="number"
                  placeholder="重量(kg)"
                  value={set.weight}
                  onChange={(e) => {
                    const newSets = [...sets];
                    newSets[index].weight = Number(e.target.value);
                    setSets(newSets);
                  }}
                />
              </div>
            ))}
            <Button
              className="mt-2"
              size="sm"
              onClick={() => setSets([...sets, { reps: 0, weight: 0 }])}
            >
              + セット追加
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          キャンセル
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!selectedMenu}>
          保存
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkoutRecordModal;
