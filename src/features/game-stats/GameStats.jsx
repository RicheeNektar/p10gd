import React, { Fragment } from 'react';
import { Alert, Card, CardGroup, Col, Row } from 'react-bootstrap';
import { DashSquare, InfoCircleFill, PlusSquare } from 'react-bootstrap-icons';
import CardHeader from 'react-bootstrap/esm/CardHeader';
import { useSelector } from 'react-redux';

const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];

const GameStats = () => {
  const selectedGameId = useSelector(state => state.gameStats.selectedGame);
  const game = useSelector(state => state.gameList.games[selectedGameId]);

  const players = game?.players?.slice();
  const history = game?.history?.slice();

  if (!players || !history) {
    return (
      <Alert variant="info" className="d-flex gap-2 align-items-center">
        <InfoCircleFill />
        <div>Select or create a game first.</div>
      </Alert>
    );
  }

  const renderProgressBars = progress => {
    const bars = [];

    for (let i = 0; i < progress; i++) {
      bars.push(
        <div
          key={i}
          className={`progress-bar bg-success`}
          style={{ width: '10%' }}>
          {i + 1}
        </div>
      );
    }

    if (progress < 10) {
      bars.push(
        <div
          key={progress}
          className={`progress-bar bg-warning text-dark`}
          style={{ width: '10%' }}>
          {progress + 1}
        </div>
      );
    }

    return bars;
  };

  const renderBadge = (index, props) =>
    index < 3 ? (
      <div
        className={`badge text-dark ${props?.className}`}
        style={{ background: colors[index] }}>
        #{index + 1}
      </div>
    ) : null;

  const renderGroup = (start, end) => (
    <CardGroup>{statGroups.slice(start, end)}</CardGroup>
  );

  const stats = players.map((name, id) => ({
    name,
    ...history.reduce(
      (acc, entry) => ({
        points: acc.points + entry[id].points,
        phase: acc.phase + entry[id].phase * 1,
        wins: acc.wins + (entry[id].points === 0) * 1,
      }),
      {
        points: 0,
        phase: 0,
        wins: 0,
      }
    ),
  }));

  const statGroups = stats
    .sort((p1, p2) => {
      const diff = p2.phase - p1.phase;
      if (diff !== 0) {
        return diff;
      }
      return p1.points - p2.points;
    })
    .map((stats, i) => (
      <Card key={stats.name}>
        <CardHeader>
          <h5>
            <span className="text-truncate">{stats.name}</span>
            {stats.phase >= 10 && renderBadge(i)}
          </h5>
        </CardHeader>
        <div className="card-body">
          <p>Points: {stats.points}</p>
          <p>
            {stats.phase < 10
              ? `Needs phase ${stats.phase + 1} from 10`
              : 'Completed all phases'}
          </p>
          <p>Progress:</p>
          <div className="progress">
            {renderProgressBars(Math.min(stats.phase, 10))}
          </div>
        </div>
      </Card>
    ));

  const rowClass = 'row-cols-3 row-cols-md-6 border-bottom border-2 border-dark p-2 m-1';

  return (
    <Fragment>
      <h4 className="m-3">Game stats:</h4>
      {renderGroup(0, 3)}
      {renderGroup(3, 6)}
      <h4 className="m-3">Game history:</h4>
      <div className="row">
        <Row className={rowClass}>
          {players.map(name => {
            const id = stats.findIndex(p => p.name === name);
            return (
              <Col className="d-flex align-items-center text-center p-1">
                <span className="text-truncate col-4">{name}</span>
                <span className="badge bg-primary p-1 flex-fill">
                  {stats[id].points}
                </span>
                {renderBadge(id)}
              </Col>
            );
          })}
        </Row>
        {history.map(entries => (
          <Row className={rowClass}>
            {entries.map((entry, id) => (
              <Col className="d-flex align-items-center gap-2">
                {entry.points > 0 ? <PlusSquare /> : <DashSquare />}
                <span
                  className={`flex-fill float-end badge bg-${
                    entry.points > 0 ? 'danger' : 'success'
                  }`}>
                  {entry.points.toLocaleString('en')}
                </span>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </Fragment>
  );
};

export default GameStats;
