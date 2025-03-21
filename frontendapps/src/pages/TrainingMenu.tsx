import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";

// TODO: モーダルをComponentに切り出す。

// 型定義
interface TrainingMenuType {
  id: number;
  name: string;
  description: string;
}

/**
 * トレーニングメニュー管理ページ
 * @returns
 */
const TrainingMenu: React.FC = () => {
  const [menus, setMenus] = useState<TrainingMenuType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState<TrainingMenuType | null>(null);
  const [newMenu, setNewMenu] = useState({ name: "", description: "" });

  // ローカルストレージからデータを取得
  useEffect(() => {
    const storedMenus = localStorage.getItem("trainingMenus");
    if (storedMenus) {
      setMenus(JSON.parse(storedMenus));
    }
  }, []);

  // メニューを保存
  const saveMenus = (updatedMenus: TrainingMenuType[]) => {
    setMenus(updatedMenus);
    localStorage.setItem("trainingMenus", JSON.stringify(updatedMenus));
  };

  // メニューを追加または更新
  const handleSave = () => {
    if (editingMenu) {
      // 編集モード（更新）
      const updatedMenus = menus.map((menu) =>
        menu.id === editingMenu.id ? { ...editingMenu, ...newMenu } : menu
      );
      saveMenus(updatedMenus);
    } else {
      // 新規作成
      const newEntry = {
        id: Date.now(),
        name: newMenu.name,
        description: newMenu.description,
      };
      saveMenus([...menus, newEntry]);
    }
    setShowModal(false);
    setNewMenu({ name: "", description: "" });
    setEditingMenu(null);
  };

  // 編集ボタン
  const handleEdit = (menu: TrainingMenuType) => {
    setEditingMenu(menu);
    setNewMenu({ name: menu.name, description: menu.description });
    setShowModal(true);
  };

  // 削除ボタン
  const handleDelete = (id: number) => {
    const updatedMenus = menus.filter((menu) => menu.id !== id);
    saveMenus(updatedMenus);
  };

  return (
    <div className="container mt-4">
      <h2>トレーニングメニュー管理</h2>
      <Button onClick={() => setShowModal(true)}>メニューを追加</Button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>メニュー名</th>
            <th>説明</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td>{menu.name}</td>
              <td>{menu.description}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(menu)}>
                  編集
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(menu.id)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* モーダル（追加・編集用） */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingMenu ? "メニューを編集" : "メニューを追加"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>メニュー名</Form.Label>
              <Form.Control
                type="text"
                value={newMenu.name}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mt-2">
              <Form.Label>説明</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newMenu.description}
                onChange={(e) =>
                  setNewMenu({ ...newMenu, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            キャンセル
          </Button>
          <Button variant="primary" onClick={handleSave}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrainingMenu;
