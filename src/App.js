import React, { useMemo, useState } from "react";
import "./App.css";

const STATUS = {
  todo: "계획",
  progress: "진행 중",
  done: "완료",
};

const STATUS_ORDER = ["todo", "progress", "done"];

const INITIAL_TASKS = [
  {
    id: 1,
    title: "주간 목표 정리",
    description: "이번 주 핵심 업무와 개인 일정을 우선순위별로 정리합니다.",
    status: "todo",
  },
  {
    id: 2,
    title: "프로젝트 발표 자료 보완",
    description: "핵심 메시지와 화면 흐름을 다듬고 마지막 예시를 추가합니다.",
    status: "progress",
  },
  {
    id: 3,
    title: "운동 루틴 등록",
    description: "월수금 저녁 운동 계획을 캘린더와 체크리스트에 반영했습니다.",
    status: "done",
  },
];

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesText =
        task.title.toLowerCase().includes(filterText.toLowerCase()) ||
        task.description.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : task.status === statusFilter;

      return matchesText && matchesStatus;
    });
  }, [tasks, filterText, statusFilter]);

  const groupedTasks = useMemo(() => {
    return STATUS_ORDER.reduce((acc, status) => {
      acc[status] = filteredTasks.filter((task) => task.status === status);
      return acc;
    }, {});
  }, [filteredTasks]);

  const stats = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      key: status,
      label: STATUS[status],
      count: tasks.filter((task) => task.status === status).length,
    }));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || "세부 계획 메모가 아직 없습니다.",
      status: "todo",
    };

    setTasks((current) => [newTask, ...current]);
    setTitle("");
    setDescription("");
  };

  const moveTask = (taskId, direction) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const currentIndex = STATUS_ORDER.indexOf(task.status);
        const nextIndex = currentIndex + direction;

        if (nextIndex < 0 || nextIndex >= STATUS_ORDER.length) {
          return task;
        }

        return {
          ...task,
          status: STATUS_ORDER[nextIndex],
        };
      })
    );
  };

  const removeTask = (taskId) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  const resetFilters = () => {
    setFilterText("");
    setStatusFilter("all");
  };

  return (
    <main className="app">
      <section className="hero">
        <span className="eyebrow">React Plan System</span>
        <h1>Plan Flow Board</h1>
        <p>
          해야 할 일과 개인 계획을 단계별로 관리하는 React 보드입니다. 새 계획을
          등록하고, 검색과 상태 필터를 활용해 진행 흐름을 한눈에 확인할 수
          있습니다.
        </p>
      </section>

      <section className="dashboard">
        <div className="panel composer">
          <h2>새 플랜 추가</h2>
          <p className="panel-note">
            새 플랜은 기본적으로 `계획` 상태로 생성됩니다. 제목과 메모를 입력한
            뒤 단계별로 이동해 보세요.
          </p>
          <form onSubmit={addTask}>
            <div className="input-row">
              <input
                type="text"
                placeholder="예: 포트폴리오 수정"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="플랜 제목"
              />
              <input
                type="text"
                placeholder="세부 메모"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-label="플랜 메모"
              />
              <button type="submit" className="primary-button">
                플랜 추가
              </button>
            </div>
          </form>
        </div>

        <aside className="panel search-panel">
          <div>
            <h2>플랜 필터</h2>
            <p className="panel-note">
              제목 또는 메모로 검색하고, 필요한 단계만 따로 확인할 수 있습니다.
            </p>
          </div>
          <input
            type="text"
            placeholder="검색어 입력"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            aria-label="검색어"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="상태 필터"
          >
            <option value="all">전체 상태</option>
            <option value="todo">계획</option>
            <option value="progress">진행 중</option>
            <option value="done">완료</option>
          </select>
          <button type="button" className="ghost-button" onClick={resetFilters}>
            필터 초기화
          </button>
          <div className="stats">
            {stats.map((item) => (
              <div key={item.key} className="stat-card">
                <strong>{item.count}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="board" aria-label="플랜 보드">
        {STATUS_ORDER.map((statusKey) => (
          <BoardColumn
            key={statusKey}
            statusKey={statusKey}
            tasks={groupedTasks[statusKey]}
            onMove={moveTask}
            onRemove={removeTask}
          />
        ))}
      </section>
    </main>
  );
}

function BoardColumn({ statusKey, tasks, onMove, onRemove }) {
  const colorMap = {
    todo: "var(--todo)",
    progress: "var(--progress)",
    done: "var(--done)",
  };

  return (
    <section className="panel column">
      <div className="column-header">
        <div className="column-title">
          <span
            className="dot"
            style={{ backgroundColor: colorMap[statusKey] }}
            aria-hidden="true"
          />
          <span>{STATUS[statusKey]}</span>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            현재 표시할 플랜이 없습니다.
            <br />
            필터를 조정하거나 새 플랜을 추가해 보세요.
          </div>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-meta">
                <span className="badge">{STATUS[task.status]}</span>
              </div>
              <div className="task-actions">
                {task.status !== "todo" && (
                  <button type="button" onClick={() => onMove(task.id, -1)}>
                    이전 단계
                  </button>
                )}
                {task.status !== "done" && (
                  <button type="button" onClick={() => onMove(task.id, 1)}>
                    다음 단계
                  </button>
                )}
                <button type="button" onClick={() => onRemove(task.id)}>
                  삭제
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default App;
