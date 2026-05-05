const { useMemo, useState } = React;

const STATUS = {
  todo: "Todo",
  progress: "In Progress",
  done: "Done",
};

const STATUS_ORDER = ["todo", "progress", "done"];

const INITIAL_TASKS = [
  {
    id: 1,
    title: "와이어프레임 정리",
    description: "칸반 보드 화면 구성과 필요한 상태를 먼저 정리합니다.",
    status: "todo",
  },
  {
    id: 2,
    title: "리액트 상태 연결",
    description: "배열 데이터를 기반으로 카드 렌더링과 이동 로직을 구성합니다.",
    status: "progress",
  },
  {
    id: 3,
    title: "README 초안 작성",
    description: "프로젝트 개요와 핵심 기능 설명 문구를 정리합니다.",
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
      description: description.trim() || "설명이 아직 없습니다.",
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
        <span className="eyebrow">React Single Page Project</span>
        <h1>Flow Board</h1>
        <p>
          배열 형태의 데이터를 상태로 관리하고, 필터링과 단계 이동 로직을
          활용해 `Todo / In Progress / Done` 구조의 칸반 보드를 구현한 React
          실습 프로젝트입니다.
        </p>
      </section>

      <section className="dashboard">
        <div className="panel composer">
          <h2>새 작업 추가</h2>
          <p className="panel-note">
            새 카드는 기본적으로 `Todo`에 생성됩니다. 제목과 설명을 입력한 뒤
            단계별로 이동시켜 보세요.
          </p>
          <form onSubmit={addTask}>
            <div className="input-row">
              <input
                type="text"
                placeholder="예: API 연결 마무리"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                aria-label="작업 제목"
              />
              <input
                type="text"
                placeholder="간단한 설명"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                aria-label="작업 설명"
              />
              <button type="submit" className="primary-button">
                작업 추가
              </button>
            </div>
          </form>
        </div>

        <aside className="panel search-panel">
          <div>
            <h2>필터</h2>
            <p className="panel-note">
              제목 또는 설명으로 검색하고, 원하는 상태만 따로 확인할 수
              있습니다.
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
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
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

      <section className="board" aria-label="칸반 보드">
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
          ></span>
          <span>{STATUS[statusKey]}</span>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            현재 표시할 작업이 없습니다.
            <br />
            필터를 조정하거나 새 작업을 추가해 보세요.
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
